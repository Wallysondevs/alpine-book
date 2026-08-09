import{j as e,T as o}from"./index-YFyZeUD9.js";import{P as a,A as s,C as t}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(a,{title:"fstab — Montagem Automática",subtitle:"Configure montagens persistentes com /etc/fstab: UUIDs, opções, swap e solução de problemas.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs(s,{type:"info",title:"Pré-requisitos",children:["Saber montar e desmontar partições manualmente (",e.jsx("code",{children:"mount"})," /",e.jsx("code",{children:"umount"}),"). O capítulo anterior cobre isso."]}),e.jsxs("p",{children:["Montar discos manualmente com ",e.jsx("code",{children:"mount"})," funciona para testes, mas no boot você quer que tudo suba automaticamente. O arquivo"," ",e.jsx("code",{children:"/etc/fstab"})," (filesystem table) é a lista de montagens permanentes que o sistema lê durante a inicialização."]}),e.jsx("h2",{children:"1. Anatomia do fstab"}),e.jsx(o,{title:"Um fstab típico do Alpine",lines:[{type:"cmd",text:"cat /etc/fstab"},{type:"out",text:"# <fs>          <mountpoint>  <type>  <opts>       <dump> <pass>"},{type:"out",text:"UUID=abc123...  /            ext4    noatime       0      1"},{type:"out",text:"UUID=def456...  /boot        ext4    defaults      0      2"},{type:"out",text:"UUID=ghi789...  swap         swap    defaults      0      0"},{type:"out",text:"tmpfs           /tmp         tmpfs   noatime,size=2G 0   0"}]}),e.jsx(t,{title:"As 6 colunas do fstab",code:`# Coluna  Campo         Significado
# 1       fs             Dispositivo (UUID, /dev/sda1, LABEL, ou tmpfs)
# 2       mountpoint     Onde montar (deve existir como diretório)
# 3       type           Sistema de arquivos (ext4, xfs, btrfs, swap, tmpfs...)
# 4       opts           Opções de montagem (separadas por vírgula)
# 5       dump           Backup com dump(8)? 0=não, 1=sim (quase sempre 0)
# 6       pass           Ordem do fsck no boot: 0=não checar, 1=raiz, 2=outros`}),e.jsx("h2",{children:"2. Identificando dispositivos: UUID é o caminho"}),e.jsx(t,{title:"Três formas de referenciar um dispositivo no fstab",code:`# ✅ UUID (RECOMENDADO) — não muda entre boots
UUID=a1b2c3d4-...  /mnt/dados  ext4  defaults  0  2

# ⚠️  LABEL — legível, mas labels duplicadas causam conflito
LABEL="Dados"      /mnt/dados  ext4  defaults  0  2

# ❌ /dev/sdX — PODE MUDAR se adicionar/remover discos
/dev/sdb1          /mnt/dados  ext4  defaults  0  2`}),e.jsx("h2",{children:"3. Opções de montagem essenciais"}),e.jsx(t,{title:"Opções mais usadas no fstab",code:`defaults      = rw, suid, dev, exec, auto, nouser, async
noatime       = NÃO atualiza timestamp de acesso (PERFORMANCE!)
nodiratime    = não atualiza timestamp de acesso de diretórios
relatime      = atualiza acesso só se for mais antigo que modificação
ro            = read-only (montagem somente leitura)
rw            = read-write
noexec        = bloqueia execução de binários (segurança em /tmp)
nosuid        = ignora bits SUID/SGID (segurança)
user          = permite que usuário comum monte
noauto        = NÃO monta automaticamente no boot (montagem manual)

# Combinação típica para discos de dados:
UUID=xxx  /mnt/dados  ext4  defaults,noatime  0  2

# Combinação de segurança para /tmp:
tmpfs     /tmp        tmpfs  noexec,nosuid,size=2G  0  0`}),e.jsx("h2",{children:"4. Configurando swap no fstab"}),e.jsx(t,{title:"Swap em partição ou arquivo",code:`# Swap em PARTIÇÃO
UUID=xxx  none  swap  sw  0  0

# Swap em ARQUIVO (caminho absoluto)
/swapfile  none  swap  sw  0  0

# Conferir depois do boot:
swapon --show
free -h | grep Swap`}),e.jsx("h2",{children:"5. Testando sem reboot: mount -a"}),e.jsxs("p",{children:["Você ",e.jsx("strong",{children:"não precisa reiniciar"})," para testar o fstab:"]}),e.jsx(o,{title:"Testando fstab sem reboot",lines:[{type:"cmd",text:"mount -a"},{type:"comment",text:"# Se não houver output, tudo montou sem erros."},{type:"cmd",text:"mount -a -v"},{type:"out",text:"/                    : already mounted"},{type:"out",text:"/mnt/dados           : successfully mounted"},{type:"out",text:"swap                 : ignored"},{type:"ok",text:"# -v (verbose) mostra o que aconteceu."}]}),e.jsxs(s,{type:"warning",title:"Sempre teste com mount -a ANTES de reiniciar",children:["Um erro de digitação no fstab pode impedir o boot. Se você rodar"," ",e.jsx("code",{children:"mount -a"})," e der erro, corrija antes de reiniciar. Se o sistema não bootar, use um live USB, monte a raiz e edite o fstab."]}),e.jsx("h2",{children:"6. Erros comuns e soluções"}),e.jsx(t,{title:"Debugging de fstab",code:`# Erro: "mount: /mnt/dados: mount point does not exist."
# → Crie o diretório: mkdir -p /mnt/dados

# Erro: "mount: /mnt/dados: wrong fs type..."
# → Instale as ferramentas do filesystem:
#   ext4 → apk add e2fsprogs
#   xfs  → apk add xfsprogs
#   btrfs → apk add btrfs-progs

# Erro: "mount: /mnt/dados: can't find UUID=xxx"
# → O UUID mudou? Rode blkid e confira.

# Erro: "mount: /mnt/dados: special device ... does not exist."
# → O disco não está conectado? Use nofail:
#   UUID=xxx  /mnt/dados  ext4  defaults,nofail  0  2
#   Com nofail, o boot continua mesmo se o disco faltar.

# Ver mensagens detalhadas de montagem:
dmesg | grep -i mount
dmesg | grep -i "sd[a-z]"`}),e.jsx("h2",{children:"7. fstab no Alpine: o que vem por padrão"}),e.jsx(o,{title:"fstab mínimo pós-instalação",lines:[{type:"cmd",text:"cat /etc/fstab"},{type:"out",text:"UUID=abc123...  /            ext4    noatime  0  1"},{type:"out",text:"tmpfs           /tmp         tmpfs   defaults 0  0"},{type:"comment",text:"# Só duas linhas. Minimalismo Alpine."}]}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"/etc/fstab"})," = 6 colunas: fs, mountpoint, type, opts, dump, pass"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sempre use UUID"})," (não /dev/sdX)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"noatime"})," melhora performance; ",e.jsx("code",{children:"nofail"})," evita pânico no boot"]}),e.jsxs("li",{children:["Teste com ",e.jsx("code",{children:"mount -a -v"})," antes de reiniciar"]}),e.jsxs("li",{children:["Swap: ",e.jsx("code",{children:"UUID=xxx none swap sw 0 0"})]}),e.jsx("li",{children:"Se o boot falhar: live USB → monte a raiz → edite o fstab"})]})})]})}export{d as default};
