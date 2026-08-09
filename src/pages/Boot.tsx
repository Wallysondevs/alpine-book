import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Boot() {
  return (
    <PageContainer
      title="Boot &amp; Bootloader"
      subtitle="Da energia ao login: kernel, initramfs, bootloader e parâmetros de kernel no Alpine."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        OpenRC compreendido (capítulo anterior). Acesso root. Mexer com
        bootloader pode deixar o sistema inbootável — tenha um live USB à mão.
      </AlertBox>

      <p>
        O boot do Alpine é minimalista: kernel Linux carrega um initramfs feito
        pelo <code>mkinitfs</code>, que monta o sistema real e passa o controle
        ao OpenRC. Sem systemd-boot, sem Plymouth, sem splash screen. Apenas o
        essencial — e totalmente configurável.
      </p>

      <h2>1. A sequência de boot do Alpine</h2>
      <CodeBlock
        title="Do power-on ao login"
        code={`1. FIRMWARE (BIOS/UEFI)
   └→ POST, detecta hardware, escolhe dispositivo de boot

2. BOOTLOADER (GRUB, syslinux, ou EFI stub)
   └→ Carrega kernel + initramfs na memória

3. KERNEL (vmlinuz-lts ou vmlinuz-edge)
   └→ Inicializa hardware, monta /proc, /sys, /dev

4. INITRAMFS (/boot/initramfs-lts)
   └→ mkinitfs gerou: módulos, busybox, scripts init
   └→ Monta o sistema de arquivos real em /sysroot
   └→ switch_root: troca para o sistema real

5. OPENRC (PID 1)
   └→ /sbin/init → OpenRC
   └→ sysinit → boot → default runlevels

6. LOGIN
   └→ getty nos ttys (ou gerenciador de display)`}
      />

      <h2>2. mkinitfs: criando o initramfs</h2>
      <p>
        O <code>mkinitfs</code> gera um initramfs sob medida para seu sistema.
        Ele inclui apenas os módulos e ferramentas necessários — nada de
        initramfs genérico de 80 MB como em outras distros:
      </p>
      <CodeBlock
        title="Configuração e rebuild do initramfs"
        code={`# Arquivo de configuração
cat /etc/mkinitfs/mkinitfs.conf
# features="ata base ide scsi usb virtio ext4 lvm cryptsetup"
# (lista de features que o initramfs deve incluir)

# Reconstruir o initramfs (após mudar config ou kernel)
mkinitfs -c /etc/mkinitfs/mkinitfs.conf -b / $(cat /etc/mkinitfs/kernel-version)

# Ou simplesmente atualizar tudo:
update-kernel /boot/vmlinuz-lts

# Ver a versão atual do kernel que gerou o initramfs
cat /etc/mkinitfs/kernel-version`}
      />

      <h2>3. Features do initramfs</h2>
      <CodeBlock
        title="Features disponíveis e quando usar cada uma"
        code={`# Features comuns (adas via mkinitfs.conf):
ata         # discos IDE/SATA
base        # essencial: busybox, init, mount
btrfs       # suporte a Btrfs
cryptsetup  # criptografia de disco (LUKS)
ext4        # sistema de arquivos ext4
ide         # discos IDE legados
keymap      # mapa de teclado no initramfs (para senha LUKS)
kms         # kernel mode setting (resolução nativa cedo)
lvm         # Logical Volume Manager
mdadm       # RAID por software
netboot     # boot pela rede (PXE)
nvme        # SSDs NVMe
scsi        # discos SCSI/SAS
usb         # dispositivos USB
virtio      # discos/rede virtio (KVM, Proxmox)
xfs         # sistema de arquivos XFS

# EXEMPLO: servidor com NVMe + LVM:
features="base nvme ext4 lvm"

# EXEMPLO: desktop com disco criptografado:
features="base ata nvme ext4 cryptsetup keymap kms"`}
      />

      <h2>4. Bootloaders no Alpine</h2>
      <CodeBlock
        title="Opções de bootloader"
        code={`# GRUB (BIOS + UEFI) — o mais comum
apk add grub grub-efi efibootmgr
# BIOS:
grub-install /dev/sda
# UEFI:
grub-install --target=x86_64-efi --efi-directory=/boot
grub-mkconfig -o /boot/grub/grub.cfg

# Syslinux/Extlinux — alternativa leve (BIOS)
apk add syslinux
extlinux --install /boot
# Atualizar config: /boot/extlinux.conf

# EFI Stub — sem bootloader (kernel carrega direto da UEFI)
efibootmgr --create --disk /dev/sda --part 1 \
  --label "Alpine" --loader /vmlinuz-lts \
  --unicode "root=UUID=xxx modules=ext4 quiet"`}
      />

      <h2>5. Parâmetros de kernel</h2>
      <p>
        Parâmetros passados ao kernel na linha de comando do bootloader:
      </p>
      <CodeBlock
        title="Parâmetros essenciais no Alpine"
        code={`# No GRUB: edite /etc/default/grub (GRUB_CMDLINE_LINUX)
# No Syslinux: /boot/extlinux.conf

root=UUID=abc123...        # partição raiz (obrigatório)
rootfstype=ext4            # tipo do filesystem raiz
modules=ext4,lvm           # módulos extras para o initramfs
quiet                      # menos mensagens no boot
nomodeset                  # desativa KMS (se der tela preta)
single                     # modo single-user (manutenção)
init=/bin/sh               # bypass do init (shell de emergência)

# Exemplo completo:
GRUB_CMDLINE_LINUX="root=UUID=abc123 rootfstype=ext4 modules=ext4 quiet"`}
      />

      <h2>6. Kernel: lts vs edge vs virt</h2>
      <CodeBlock
        title="Sabores de kernel no Alpine"
        code={`apk add linux-lts      # Long Term Support (recomendado)
apk add linux-edge      # bleeding-edge (drivers novos, risco)
apk add linux-virt      # otimizado para VMs (menos módulos)

# Ver qual kernel está rodando
uname -r
# 6.12.0-1-lts

# Listar kernels instalados
ls /boot/vmlinuz-*

# Atualizar após instalar kernel novo
update-kernel /boot/vmlinuz-lts`}
      />

      <h2>7. Salvando o sistema: console de emergência</h2>
      <p>
        Se o Alpine não bootar, você pode acessar um shell de emergência:
      </p>
      <CodeBlock
        title="Acessando o sistema quebrado"
        code={`# MÉTODO 1: Adicionar init=/bin/sh nos parâmetros do kernel
# No menu do GRUB, aperte 'e', adicione no final da linha:
# linux ... quiet init=/bin/sh
# Ctrl+X para bootar. Você cai num shell root sem senha.

# MÉTODO 2: Live USB Alpine
# Boot pela ISO Alpine, monte o sistema e faça chroot:
mount /dev/sda3 /mnt
mount /dev/sda1 /mnt/boot   # se /boot for separado
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
chroot /mnt /bin/ash
# Agora você está dentro do sistema instalado.

# MÉTODO 3: Kernel panic? Veja o que aconteceu:
# Na tela de kernel panic, tire uma foto das últimas 20 linhas.
# Erros comuns:
# - "Unable to mount root fs" → initramfs sem o driver do disco
# - "UUID not found" → fstab ou cmdline com UUID errado
# - "No init found" → initramfs corrompido, rode mkinitfs`}
      />

      <AlertBox type="warning" title="update-kernel após mudar features do mkinitfs">
        Sempre que você editar <code>/etc/mkinitfs/mkinitfs.conf</code> ou
        instalar um kernel novo, rode <code>update-kernel</code>. Sem isso, o
        initramfs antigo pode não ter os módulos para montar o disco — e o
        sistema não boota.
      </AlertBox>

      <h2>8. Configuração de console</h2>
      <CodeBlock
        title="Configurando terminais virtuais (gettys)"
        code={`# O Alpine usa getty do BusyBox por padrão
# Arquivo de configuração:
cat /etc/inittab
# tty1::respawn:/sbin/getty 38400 tty1
# tty2::respawn:/sbin/getty 38400 tty2
# ...

# Adicionar/remover terminais:
# Edite /etc/inittab, adicione ou comente linhas.

# Para console serial:
# ttyS0::respawn:/sbin/getty -L 115200 ttyS0 vt100`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>Boot: firmware → bootloader → kernel → initramfs → OpenRC → login</li>
          <li><code>mkinitfs</code> gera initramfs enxuto; <code>update-kernel</code> reconstrói tudo</li>
          <li>Features: adicione ao <code>mkinitfs.conf</code> conforme seu hardware</li>
          <li>Kernel: <code>linux-lts</code> para servidores, <code>linux-edge</code> para desktop</li>
          <li>Bootloader: GRUB (UEFI/BIOS) ou Syslinux (BIOS leve)</li>
          <li>Emergência: <code>init=/bin/sh</code> no kernel ou live USB + chroot</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}