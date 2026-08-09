import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function LVM() {
  return (
    <PageContainer
      title="LVM — Logical Volume Manager"
      subtitle="PV, VG, LV — gerencie discos com flexibilidade total: redimensionar, snapshots, striping."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Conhecimento de partições (<code>fdisk</code>, <code>mkfs</code>) e
        montagem (<code>mount</code>, <code>fstab</code>). LVM é avançado —
        não use em produção sem testar antes.
      </AlertBox>

      <p>
        Partições tradicionais são rígidas: depois de criadas, redimensionar é
        arriscado e requer desmontar. O LVM resolve isso com uma camada de
        abstração: volumes lógicos que você expande, reduz e move sem desligar
        o sistema. O Alpine suporta LVM — só precisa instalar o pacote.
      </p>

      <h2>1. Conceitos: PV, VG, LV</h2>
      <CodeBlock
        title="As três camadas do LVM"
        code={`DISCO(s) FÍSICO(s)         CAMADA LVM              SISTEMA DE ARQUIVOS
─────────────────────    ──────────────────      ──────────────────
/dev/sdb (20 GB)   ─┐
                    ├── PV (Physical Volume) ─┐
/dev/sdc (30 GB)   ─┘   /dev/sdb, /dev/sdc   │
                                              ├── VG (Volume Group)
                                              │   vg_dados = 50 GB
                                              │
                                              ├── LV (Logical Volume)
                                              │   lv_home = 30 GB  → ext4 → /home
                                              │   lv_backup = 20 GB → ext4 → /backup
                                              └── ...sobra espaço para crescer depois

PV = disco/partição marcada para uso do LVM
VG = pool de armazenamento (junta vários PVs)
LV = volume lógico (equivalente a uma partição flexível)`}
      />

      <h2>2. Instalação e setup inicial</h2>
      <CodeBlock
        title="Instalando LVM no Alpine"
        code={`# 1. Instalar o pacote LVM
apk add lvm2

# 2. Carregar o módulo do kernel (geralmente já carregado)
modprobe dm-mod

# 3. Habilitar o serviço para ativar volumes no boot
rc-update add lvm boot
# O script /etc/init.d/lvm ativa todos os VGs durante o boot.`}
      />

      <h2>3. Criando PV, VG e LV — passo a passo</h2>
      <Terminal
        title="Do disco bruto ao volume lógico formatado"
        lines={[
          { type: "comment", text: "# Passo 1: Criar Physical Volumes" },
          { type: "cmd", text: "pvcreate /dev/sdb /dev/sdc" },
          { type: "out", text: "Physical volume \"/dev/sdb\" successfully created." },
          { type: "out", text: "Physical volume \"/dev/sdc\" successfully created." },
          { type: "cmd", text: "pvdisplay" },
          { type: "out", text: "--- Physical volume ---" },
          { type: "out", text: "PV Name   /dev/sdb" },
          { type: "out", text: "PV Size   20.00 GiB" },
          { type: "out", text: "" },
          { type: "comment", text: "# Passo 2: Criar Volume Group" },
          { type: "cmd", text: "vgcreate vg_dados /dev/sdb /dev/sdc" },
          { type: "out", text: "Volume group \"vg_dados\" successfully created" },
          { type: "cmd", text: "vgdisplay vg_dados" },
          { type: "out", text: "VG Size   50.00 GiB" },
          { type: "out", text: "Free PE   12799 (50.00 GiB)" },
          { type: "out", text: "" },
          { type: "comment", text: "# Passo 3: Criar Logical Volumes" },
          { type: "cmd", text: "lvcreate -L 30G -n lv_home vg_dados" },
          { type: "out", text: "Logical volume \"lv_home\" created." },
          { type: "cmd", text: "lvcreate -L 20G -n lv_backup vg_dados" },
          { type: "out", text: "Logical volume \"lv_backup\" created." },
          { type: "cmd", text: "lvdisplay" },
          { type: "out", text: "--- Logical volume ---" },
          { type: "out", text: "LV Path   /dev/vg_dados/lv_home" },
          { type: "out", text: "LV Size   30.00 GiB" },
        ]}
      />

      <h2>4. Formatando, montando e fstab</h2>
      <CodeBlock
        title="Do LV ao uso diário"
        code={`# Formatar os LVs
mkfs.ext4 /dev/vg_dados/lv_home
mkfs.ext4 /dev/vg_dados/lv_backup

# Copiar dados do /home antigo (se for migrar)
mount /dev/vg_dados/lv_home /mnt
cp -a /home/* /mnt/
umount /mnt

# Montar definitivamente
mount /dev/vg_dados/lv_home /home
mount /dev/vg_dados/lv_backup /backup

# Adicionar ao fstab (use lsblk -f para ver UUIDs)
echo "UUID=$(blkid -s UUID -o value /dev/vg_dados/lv_home) /home  ext4 defaults,noatime 0 2" >> /etc/fstab
echo "UUID=$(blkid -s UUID -o value /dev/vg_dados/lv_backup) /backup ext4 defaults,noatime 0 2" >> /etc/fstab`}
      />

      <h2>5. Redimensionando — a mágica do LVM</h2>
      <p>
        Esta é a razão de usar LVM. Expandir um volume lógico são dois comandos,
        sem desmontar (para ext4/XFS):
      </p>
      <CodeBlock
        title="Expandindo um LV (online, sem desmontar)"
        code={`# 1. Adicionar 10 GB ao lv_home
lvextend -L +10G /dev/vg_dados/lv_home
# OU: lvextend -L 40G (tamanho absoluto)

# 2. Expandir o filesystem para usar o novo espaço
#    Para ext4:
resize2fs /dev/vg_dados/lv_home

#    Para XFS:
xfs_growfs /home

# 3. Conferir
df -h /home
# Size: 40G (era 30G)`}
      />

      <p>
        Reduzir é mais delicado e requer desmontar (ext4). XFS{" "}
        <strong>não pode ser reduzido</strong>:
      </p>
      <CodeBlock
        title="Reduzindo um LV (requer desmontar para ext4)"
        code={`# 1. Desmontar
umount /home

# 2. Verificar filesystem (obrigatório antes de reduzir)
e2fsck -f /dev/vg_dados/lv_home

# 3. Reduzir o filesystem primeiro
resize2fs /dev/vg_dados/lv_home 20G

# 4. Reduzir o LV
lvreduce -L 20G /dev/vg_dados/lv_home

# 5. Remontar
mount /home`}
      />

      <h2>6. Snapshots: backup instantâneo</h2>
      <p>
        Snapshots congelam um volume no tempo. Útil para backups consistentes
        ou testes arriscados:
      </p>
      <CodeBlock
        title="Criando e usando snapshots"
        code={`# 1. Criar snapshot de 5 GB (espaço para mudanças durante a vida do snap)
lvcreate -L 5G -s -n lv_home_snap /dev/vg_dados/lv_home

# 2. Montar o snapshot (read-only para backup)
mount -o ro /dev/vg_dados/lv_home_snap /mnt/snap

# 3. Fazer o backup a partir do snapshot
tar -czf /backup/home-snapshot.tar.gz -C /mnt/snap .

# 4. Remover o snapshot depois de usar
umount /mnt/snap
lvremove /dev/vg_dados/lv_home_snap`}
      />

      <h2>7. Adicionando discos novos ao VG</h2>
      <CodeBlock
        title="Expandindo o pool de armazenamento"
        code={`# 1. Preparar o novo disco
pvcreate /dev/sdd

# 2. Adicionar ao Volume Group existente
vgextend vg_dados /dev/sdd

# 3. Conferir o espaço livre novo
vgdisplay vg_dados | grep Free
# Free  PE / Size   5119 / 20.00 GiB  ← novo espaço disponível!

# 4. Expandir um LV existente ou criar um novo com o espaço extra
lvextend -L +20G /dev/vg_dados/lv_home
resize2fs /dev/vg_dados/lv_home`}
      />

      <h2>8. Removendo discos do VG</h2>
      <CodeBlock
        title="Migrando dados para fora de um disco"
        code={`# 1. Mover todos os dados do /dev/sdb para outros PVs do VG
pvmove /dev/sdb

# 2. Remover o PV do VG
vgreduce vg_dados /dev/sdb

# 3. Remover a marcação LVM do disco
pvremove /dev/sdb

# Agora /dev/sdb está livre para outro uso.`}
      />

      <h2>9. Diagnóstico e monitoramento</h2>
      <CodeBlock
        title="Comandos de inspeção LVM"
        code={`pvdisplay          # detalhes de todos os Physical Volumes
vgdisplay          # detalhes de todos os Volume Groups
lvdisplay          # detalhes de todos os Logical Volumes
pvscan             # scan rápido de PVs
vgscan             # scan rápido de VGs
lvscan             # scan rápido de LVs

# Mapeamento de dispositivos
lsblk              # mostra a hierarquia completa
dmsetup ls         # device mapper (camada baixo nível)
dmsetup info       # info detalhada

# Espaço usado
lvs -o lv_name,lv_size,data_percent  # % usado em cada LV`}
      />

      <AlertBox type="warning" title="LVM no Alpine: nota sobre o boot">
        O <code>/boot</code> <strong>não pode</strong> estar em LVM com a
        configuração padrão do Alpine (o bootloader não lê LVM sem suporte extra).
        Mantenha o <code>/boot</code> numa partição tradicional ext4, e use LVM
        para <code>/</code>, <code>/home</code>, <code>/var</code> e dados.
      </AlertBox>

      <AlertBox type="success" title="Resumo: o ciclo de vida LVM">
        <ol>
          <li><code>pvcreate</code> → disco vira Physical Volume</li>
          <li><code>vgcreate</code> → PVs formam um Volume Group (pool)</li>
          <li><code>lvcreate</code> → fatia do VG vira Logical Volume</li>
          <li><code>mkfs</code> + <code>mount</code> → usa como partição normal</li>
          <li><code>lvextend</code> + <code>resize2fs</code> → cresce online</li>
          <li><code>lvcreate -s</code> → snapshot para backup</li>
          <li><code>pvmove</code> + <code>vgreduce</code> → remove disco</li>
        </ol>
        LVM é o padrão em servidores por um motivo: flexibilidade total sem
        downtime. No Alpine, funciona exatamente como em qualquer distro.
      </AlertBox>
    </PageContainer>
  );
}