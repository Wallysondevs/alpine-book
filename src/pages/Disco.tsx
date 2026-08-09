import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Disco() {
  return (
    <PageContainer
      title="Discos e Partições"
      subtitle="lsblk, df, du, fdisk, mkfs, mount — gerencie discos e sistemas de arquivos no Alpine."
      difficulty="iniciante"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Acesso root (ou doas). Mexer com partições requer privilégios
        administrativos. <strong>Backup antes de particionar.</strong>
      </AlertBox>

      <p>
        Seja para adicionar um disco novo, formatar um USB ou apenas entender
        o espaço que você tem, este capítulo cobre todas as ferramentas de disco
        no Alpine — da inspeção à formatação.
      </p>

      <h2>1. lsblk: lista de discos e partições</h2>
      <Terminal
        title="Visualizando discos"
        lines={[
          { type: "cmd", text: "lsblk" },
          { type: "out", text: "NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS" },
          { type: "out", text: "sda      8:0    0   20G  0 disk" },
          { type: "out", text: "├─sda1   8:1    0  100M  0 part /boot" },
          { type: "out", text: "├─sda2   8:2    0    2G  0 part [SWAP]" },
          { type: "out", text: "└─sda3   8:3    0 17.9G  0 part /" },
          { type: "out", text: "sdb      8:16   0   40G  0 disk" },
          { type: "comment", text: "# sdb é um disco novo, sem partições nem mount" },
        ]}
      />

      <CodeBlock
        title="lsblk com mais detalhes"
        code={`lsblk -f        # mostra filesystem, UUID, label
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,UUID  # colunas específicas`}
      />

      <h2>2. df e du: quanto espaço?</h2>
      <Terminal
        title="Espaço em disco"
        lines={[
          { type: "cmd", text: "df -h" },
          { type: "out", text: "Filesystem  Size  Used Avail Use% Mounted on" },
          { type: "out", text: "/dev/sda3    18G  2.1G   15G  13% /" },
          { type: "out", text: "tmpfs       1.9G  156K  1.9G   1% /tmp" },
          { type: "cmd", text: "du -sh /home/wallyson/*" },
          { type: "out", text: "12M   /home/wallyson/Documents" },
          { type: "out", text: "1.5G  /home/wallyson/Downloads" },
          { type: "out", text: "340M  /home/wallyson/repos" },
        ]}
      />

      <CodeBlock
        title="df e du — flags essenciais"
        code={`df -h          # legível (human-readable)
df -i          # inodes (não espaço)
du -sh *       # tamanho total de cada item
du -h --max-depth=1 /var  # um nível de profundidade
du -sh /var/cache/apk     # quanto o cache do apk está ocupando?

# Encontrar os maiores arquivos/diretórios:
du -ah / | sort -rh | head -20`}
      />

      <h2>3. fdisk: particionando discos</h2>
      <p>
        O <code>fdisk</code> e amigos <strong>não vêm instalados</strong> no
        Alpine mínimo. Instale conforme a necessidade:
      </p>
      <CodeBlock
        title="Ferramentas de particionamento"
        code={`apk add util-linux    # traz fdisk, sfdisk, cfdisk, lsblk -f
apk add gptfdisk       # gdisk (GPT), sgdisk (scriptável)
apk add parted         # GNU Parted (alternativa)

# fdisk — modo interativo (MBR e GPT)
fdisk /dev/sdb
# Comandos dentro do fdisk:
#   m = ajuda
#   p = mostrar tabela de partições
#   n = nova partição
#   d = deletar partição
#   t = tipo de partição
#   w = escrever e sair
#   q = sair sem salvar

# cfdisk — interface semi-gráfica (mais amigável)
cfdisk /dev/sdb`}
      />

      <h2>4. mkfs: criando sistemas de arquivos</h2>
      <CodeBlock
        title="Formatando partições"
        code={`# ext4 — o padrão confiável
apk add e2fsprogs
mkfs.ext4 /dev/sdb1

# ext4 com label
mkfs.ext4 -L "Dados" /dev/sdb1

# XFS — para arquivos grandes (servidores)
apk add xfsprogs
mkfs.xfs /dev/sdb1

# Btrfs — snapshots, compressão, subvolumes
apk add btrfs-progs
mkfs.btrfs /dev/sdb1

# FAT32 / exFAT — compatibilidade com Windows/Mac
apk add dosfstools exfatprogs
mkfs.fat -F32 /dev/sdb1
mkfs.exfat /dev/sdb1`}
      />

      <h2>5. mount e umount</h2>
      <Terminal
        title="Montando e desmontando"
        lines={[
          { type: "cmd", text: "mkdir -p /mnt/dados" },
          { type: "cmd", text: "mount /dev/sdb1 /mnt/dados" },
          { type: "cmd", text: "df -h /mnt/dados" },
          { type: "out", text: "Filesystem  Size  Used Avail Use% Mounted on" },
          { type: "out", text: "/dev/sdb1    40G   24K   38G   1% /mnt/dados" },
          { type: "cmd", text: "umount /mnt/dados" },
          { type: "comment", text: "# Sempre desmonte antes de remover o disco!" },
        ]}
      />

      <CodeBlock
        title="mount — opções comuns"
        code={`mount /dev/sdb1 /mnt/dados                    # montagem simples
mount -o ro /dev/sdb1 /mnt/dados                 # read-only
mount -o noatime /dev/sdb1 /mnt/dados            # não atualiza timestamps (performance)
mount -t ext4 /dev/sdb1 /mnt/dados               # especifica filesystem
mount -o remount,rw /                            # remontar / como leitura+escrita

# Ver tudo que está montado
mount
mount | grep "^/dev"`}
      />

      <h2>6. blkid: UUIDs e labels</h2>
      <p>
        Nomes como <code>/dev/sda1</code> podem mudar entre boots. UUIDs são
        permanentes:
      </p>
      <Terminal
        title="Descobrindo UUIDs"
        lines={[
          { type: "cmd", text: "blkid" },
          { type: "out", text: "/dev/sda3: UUID=\"abc123...\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\"" },
          { type: "out", text: "/dev/sdb1: UUID=\"def456...\" LABEL=\"Dados\" TYPE=\"ext4\"" },
          { type: "cmd", text: "blkid -s UUID -o value /dev/sdb1" },
          { type: "out", text: "def456-7890-abcd-ef01-234567890abc" },
        ]}
      />

      <h2>7. Swap: memória virtual em disco</h2>
      <CodeBlock
        title="Criando e ativando swap"
        code={`# Criar partição swap
mkswap /dev/sda2
swapon /dev/sda2

# Ou swap em arquivo (mais flexível)
dd if=/dev/zero of=/swapfile bs=1M count=2048  # 2 GB
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Ver swap ativo
swapon --show
free -h | grep Swap

# Desativar swap
swapoff /swapfile`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>lsblk</code> — liste discos e partições</li>
          <li><code>df -h</code> / <code>du -sh</code> — espaço ocupado</li>
          <li><code>fdisk</code> / <code>cfdisk</code> — particione (<code>apk add util-linux</code>)</li>
          <li><code>mkfs.ext4</code> / <code>mkfs.xfs</code> — formate</li>
          <li><code>mount</code> / <code>umount</code> — monte e desmonte</li>
          <li><code>blkid</code> — UUIDs para montagem persistente</li>
          <li>Swap com <code>mkswap</code> + <code>swapon</code></li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}