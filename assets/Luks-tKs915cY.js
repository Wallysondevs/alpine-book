import{j as e}from"./index-YFyZeUD9.js";import{P as s,A as a,C as o}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(s,{title:"LUKS — Criptografia de Disco",subtitle:"Criptografe partições com LUKS: setup, montagem automática e boas práticas no Alpine.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsxs(a,{type:"danger",title:"⚠️  Criptografar apaga os dados da partição",children:["FAÇA BACKUP antes. Criptografar um disco em uso ",e.jsx("strong",{children:"destrói"})," ","todos os dados. Este capítulo assume disco vazio ou dados já copiados."]}),e.jsx("p",{children:"LUKS (Linux Unified Key Setup) é o padrão de criptografia de disco no Linux. Uma partição LUKS é ilegível sem a senha — protege dados em caso de roubo físico do servidor ou laptop."}),e.jsx("h2",{children:"1. Instalação e preparação"}),e.jsx(o,{code:`# Instalar ferramentas
apk add cryptsetup

# Carregar módulo do kernel
modprobe dm-crypt

# Verificar partição alvo (EX: /dev/sdb1 — DISCO VAZIO!)
lsblk`}),e.jsx("h2",{children:"2. Criar partição criptografada"}),e.jsx(o,{code:`# ⚠️  Isso APAGA /dev/sdb1

# Formatar como LUKS
cryptsetup luksFormat /dev/sdb1
# WARNING: This will overwrite data on /dev/sdb1 irrevocably.
# Are you sure? (Type 'yes'): yes
# Enter passphrase: ********
# Verify passphrase: ********

# Abrir (desbloquear) o volume
cryptsetup open /dev/sdb1 dados-cripto
# Enter passphrase: ********

# Agora /dev/mapper/dados-cripto é um dispositivo normal
# Formatar com ext4
mkfs.ext4 /dev/mapper/dados-cripto

# Montar e usar
mount /dev/mapper/dados-cripto /mnt/dados
# Use normalmente — tudo é criptografado/descriptografado em tempo real.`}),e.jsx("h2",{children:"3. Montagem automática no boot"}),e.jsx(o,{title:"/etc/fstab — entrada para volume LUKS",code:`# O volume aparece como /dev/mapper/dados-cripto
/dev/mapper/dados-cripto  /mnt/dados  ext4  defaults,noatime  0  2`}),e.jsx(o,{title:"/etc/crypttab — desbloquear no boot",code:`# Formato: <nome> <dispositivo> <keyfile> <opções>
dados-cripto  /dev/sdb1  none  luks`}),e.jsxs("p",{children:["Com essa config, o boot ",e.jsx("strong",{children:"vai pedir a senha"})," para desbloquear o disco. Para servidores headless (sem teclado), use keyfile ou dropbear SSH no initramfs."]}),e.jsx("h2",{children:"4. Comandos de gerenciamento"}),e.jsx(o,{code:`# Status do volume
cryptsetup status dados-cripto

# Adicionar segunda senha (backup)
cryptsetup luksAddKey /dev/sdb1

# Remover senha
cryptsetup luksRemoveKey /dev/sdb1

# Trocar senha
cryptsetup luksChangeKey /dev/sdb1

# Backup do header LUKS (ESSENCIAL!)
cryptsetup luksHeaderBackup /dev/sdb1 \\
  --header-backup-file /root/luks-header-backup.bin
# Guarde o backup em local seguro. Se o header corromper,
# os dados são PERDIDOS mesmo com a senha.

# Fechar volume
umount /mnt/dados
cryptsetup close dados-cripto`}),e.jsx("h2",{children:"5. Criptografar o disco raiz (/)"}),e.jsx("p",{children:"Criptografar a partição raiz é mais complexo e requer initramfs com suporte a cryptsetup. O Alpine suporta via mkinitfs:"}),e.jsx(o,{code:`# Adicionar cryptsetup ao initramfs
echo "features="base ext4 cryptsetup keymap"" >> /etc/mkinitfs/mkinitfs.conf

# Configurar /etc/crypttab e /etc/fstab com o volume criptografado
# Atualizar initramfs
mkinitfs -c /etc/mkinitfs/mkinitfs.conf -b / $(cat /etc/mkinitfs/kernel-version)

# No boot, será solicitada a senha LUKS antes de montar o /.`}),e.jsx(a,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:e.jsx("code",{children:"apk add cryptsetup"})}),e.jsxs("li",{children:[e.jsx("code",{children:"cryptsetup luksFormat /dev/sdb1"})," — cria volume"]}),e.jsxs("li",{children:[e.jsx("code",{children:"cryptsetup open /dev/sdb1 nome"})," — desbloqueia"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/etc/crypttab"})," + ",e.jsx("code",{children:"/etc/fstab"})," — boot automático"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Faça backup do header LUKS!"})," Sem ele, senha não adianta."]})]})})]})}export{d as default};
