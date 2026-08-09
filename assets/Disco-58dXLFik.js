import{j as e,T as t}from"./index-YFyZeUD9.js";import{P as o,A as d,C as s}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(o,{title:"Discos e Partições",subtitle:"lsblk, df, du, fdisk, mkfs, mount — gerencie discos e sistemas de arquivos no Alpine.",difficulty:"iniciante",timeToRead:"18 min",children:[e.jsxs(d,{type:"info",title:"Pré-requisitos",children:["Acesso root (ou doas). Mexer com partições requer privilégios administrativos. ",e.jsx("strong",{children:"Backup antes de particionar."})]}),e.jsx("p",{children:"Seja para adicionar um disco novo, formatar um USB ou apenas entender o espaço que você tem, este capítulo cobre todas as ferramentas de disco no Alpine — da inspeção à formatação."}),e.jsx("h2",{children:"1. lsblk: lista de discos e partições"}),e.jsx(t,{title:"Visualizando discos",lines:[{type:"cmd",text:"lsblk"},{type:"out",text:"NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS"},{type:"out",text:"sda      8:0    0   20G  0 disk"},{type:"out",text:"├─sda1   8:1    0  100M  0 part /boot"},{type:"out",text:"├─sda2   8:2    0    2G  0 part [SWAP]"},{type:"out",text:"└─sda3   8:3    0 17.9G  0 part /"},{type:"out",text:"sdb      8:16   0   40G  0 disk"},{type:"comment",text:"# sdb é um disco novo, sem partições nem mount"}]}),e.jsx(s,{title:"lsblk com mais detalhes",code:`lsblk -f        # mostra filesystem, UUID, label
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,UUID  # colunas específicas`}),e.jsx("h2",{children:"2. df e du: quanto espaço?"}),e.jsx(t,{title:"Espaço em disco",lines:[{type:"cmd",text:"df -h"},{type:"out",text:"Filesystem  Size  Used Avail Use% Mounted on"},{type:"out",text:"/dev/sda3    18G  2.1G   15G  13% /"},{type:"out",text:"tmpfs       1.9G  156K  1.9G   1% /tmp"},{type:"cmd",text:"du -sh /home/wallyson/*"},{type:"out",text:"12M   /home/wallyson/Documents"},{type:"out",text:"1.5G  /home/wallyson/Downloads"},{type:"out",text:"340M  /home/wallyson/repos"}]}),e.jsx(s,{title:"df e du — flags essenciais",code:`df -h          # legível (human-readable)
df -i          # inodes (não espaço)
du -sh *       # tamanho total de cada item
du -h --max-depth=1 /var  # um nível de profundidade
du -sh /var/cache/apk     # quanto o cache do apk está ocupando?

# Encontrar os maiores arquivos/diretórios:
du -ah / | sort -rh | head -20`}),e.jsx("h2",{children:"3. fdisk: particionando discos"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"fdisk"})," e amigos ",e.jsx("strong",{children:"não vêm instalados"})," no Alpine mínimo. Instale conforme a necessidade:"]}),e.jsx(s,{title:"Ferramentas de particionamento",code:`apk add util-linux    # traz fdisk, sfdisk, cfdisk, lsblk -f
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
cfdisk /dev/sdb`}),e.jsx("h2",{children:"4. mkfs: criando sistemas de arquivos"}),e.jsx(s,{title:"Formatando partições",code:`# ext4 — o padrão confiável
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
mkfs.exfat /dev/sdb1`}),e.jsx("h2",{children:"5. mount e umount"}),e.jsx(t,{title:"Montando e desmontando",lines:[{type:"cmd",text:"mkdir -p /mnt/dados"},{type:"cmd",text:"mount /dev/sdb1 /mnt/dados"},{type:"cmd",text:"df -h /mnt/dados"},{type:"out",text:"Filesystem  Size  Used Avail Use% Mounted on"},{type:"out",text:"/dev/sdb1    40G   24K   38G   1% /mnt/dados"},{type:"cmd",text:"umount /mnt/dados"},{type:"comment",text:"# Sempre desmonte antes de remover o disco!"}]}),e.jsx(s,{title:"mount — opções comuns",code:`mount /dev/sdb1 /mnt/dados                    # montagem simples
mount -o ro /dev/sdb1 /mnt/dados                 # read-only
mount -o noatime /dev/sdb1 /mnt/dados            # não atualiza timestamps (performance)
mount -t ext4 /dev/sdb1 /mnt/dados               # especifica filesystem
mount -o remount,rw /                            # remontar / como leitura+escrita

# Ver tudo que está montado
mount
mount | grep "^/dev"`}),e.jsx("h2",{children:"6. blkid: UUIDs e labels"}),e.jsxs("p",{children:["Nomes como ",e.jsx("code",{children:"/dev/sda1"})," podem mudar entre boots. UUIDs são permanentes:"]}),e.jsx(t,{title:"Descobrindo UUIDs",lines:[{type:"cmd",text:"blkid"},{type:"out",text:'/dev/sda3: UUID="abc123..." BLOCK_SIZE="4096" TYPE="ext4"'},{type:"out",text:'/dev/sdb1: UUID="def456..." LABEL="Dados" TYPE="ext4"'},{type:"cmd",text:"blkid -s UUID -o value /dev/sdb1"},{type:"out",text:"def456-7890-abcd-ef01-234567890abc"}]}),e.jsx("h2",{children:"7. Swap: memória virtual em disco"}),e.jsx(s,{title:"Criando e ativando swap",code:`# Criar partição swap
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
swapoff /swapfile`}),e.jsx(d,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"lsblk"})," — liste discos e partições"]}),e.jsxs("li",{children:[e.jsx("code",{children:"df -h"})," / ",e.jsx("code",{children:"du -sh"})," — espaço ocupado"]}),e.jsxs("li",{children:[e.jsx("code",{children:"fdisk"})," / ",e.jsx("code",{children:"cfdisk"})," — particione (",e.jsx("code",{children:"apk add util-linux"}),")"]}),e.jsxs("li",{children:[e.jsx("code",{children:"mkfs.ext4"})," / ",e.jsx("code",{children:"mkfs.xfs"})," — formate"]}),e.jsxs("li",{children:[e.jsx("code",{children:"mount"})," / ",e.jsx("code",{children:"umount"})," — monte e desmonte"]}),e.jsxs("li",{children:[e.jsx("code",{children:"blkid"})," — UUIDs para montagem persistente"]}),e.jsxs("li",{children:["Swap com ",e.jsx("code",{children:"mkswap"})," + ",e.jsx("code",{children:"swapon"})]})]})})]})}export{n as default};
