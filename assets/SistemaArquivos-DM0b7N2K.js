import{j as e,T as o}from"./index-YFyZeUD9.js";import{P as i,A as t,C as s}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(i,{title:"Hierarquia & BusyBox",subtitle:"Entenda a árvore de diretórios do Alpine, o que faz cada pasta, e como o BusyBox molda o sistema de arquivos.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx(t,{type:"info",title:"Pré-requisitos",children:"Alpine instalado e terminal aberto. Este capítulo é teórico-prático — leia com o shell do lado para explorar enquanto aprende."}),e.jsx("p",{children:"O Alpine segue o FHS (Filesystem Hierarchy Standard), mas com adaptações minimalistas. Quem vem do Debian/Ubuntu sente diferenças: binários unificados, ausência de certas pastas, e a onipresença do BusyBox. Este capítulo percorre cada diretório e explica o que realmente importa."}),e.jsx("h2",{children:"1. Visão geral: a raiz do sistema"}),e.jsx(o,{title:"O que tem na raiz depois de uma instalação limpa",lines:[{type:"cmd",text:"ls -1 /"},{type:"out",text:"bin"},{type:"out",text:"boot"},{type:"out",text:"dev"},{type:"out",text:"etc"},{type:"out",text:"home"},{type:"out",text:"lib"},{type:"out",text:"media"},{type:"out",text:"mnt"},{type:"out",text:"opt"},{type:"out",text:"proc"},{type:"out",text:"root"},{type:"out",text:"run"},{type:"out",text:"sbin"},{type:"out",text:"srv"},{type:"out",text:"sys"},{type:"out",text:"tmp"},{type:"out",text:"usr"},{type:"out",text:"var"},{type:"comment",text:"# 19 diretórios. Um Debian típico tem 22+."}]}),e.jsx("h2",{children:"2. /bin, /sbin e o usrmerge"}),e.jsxs("p",{children:["No Alpine, ",e.jsx("code",{children:"/bin"})," e ",e.jsx("code",{children:"/sbin"})," são ",e.jsxs("strong",{children:["symlinks para ",e.jsx("code",{children:"/usr/bin"})]}),". É o chamado ",e.jsx("em",{children:"usrmerge"})," — todos os binários ficam num lugar só:"]}),e.jsx(o,{title:"A verdade sobre /bin e /sbin",lines:[{type:"cmd",text:"ls -l /bin"},{type:"out",text:"lrwxrwxrwx 1 root root 7 ... /bin -> usr/bin"},{type:"cmd",text:"ls -l /sbin"},{type:"out",text:"lrwxrwxrwx 1 root root 8 ... /sbin -> usr/sbin"},{type:"cmd",text:"ls -l /lib"},{type:"out",text:"lrwxrwxrwx 1 root root 7 ... /lib -> usr/lib"},{type:"comment",text:"# Tudo unificado. Sem /bin vs /usr/bin para se preocupar."}]}),e.jsxs("p",{children:["O Debian também adotou usrmerge (desde o Debian 10), mas no Alpine é obrigatório — a ISO já vem assim. Isso significa que você pode usar"," ",e.jsx("code",{children:"/bin/ls"})," ou ",e.jsx("code",{children:"/usr/bin/ls"})," indistintamente."]}),e.jsxs(t,{type:"info",title:"Por que isso importa?",children:["Scripts que usam shebangs como ",e.jsx("code",{children:"#!/bin/bash"})," funcionam normalmente porque ",e.jsx("code",{children:"/bin"})," resolve para ",e.jsx("code",{children:"/usr/bin"}),". Já em sistemas sem usrmerge, ",e.jsx("code",{children:"/bin/bash"})," poderia não existir."]}),e.jsx("h2",{children:"3. /etc — o centro de controle"}),e.jsxs("p",{children:["O Alpine concentra configurações em ",e.jsx("code",{children:"/etc"})," de forma mais organizada que outras distros. Destaques:"]}),e.jsx(s,{title:"Diretórios essenciais dentro de /etc",code:`/etc/apk/            ← repositórios, chaves, world, cache config
/etc/conf.d/         ← config de serviços OpenRC (hostname, keymaps, ...)
/etc/init.d/         ← scripts de init do OpenRC
/etc/runlevels/      ← quais serviços iniciam em cada runlevel
/etc/periodic/       ← scripts executados periodicamente (crond)
/etc/doas.d/         ← configuração do doas (equivalente ao sudoers.d)
/etc/ssh/            ← sshd_config, chaves do host
/etc/profile.d/      ← scripts carregados no login (.profile)`}),e.jsxs("p",{children:["A diferença mais visível: no Alpine, cada serviço OpenRC tem suas variáveis de configuração em ",e.jsx("code",{children:"/etc/conf.d/<serviço>"})," ","em vez de editar o script de init diretamente:"]}),e.jsx(s,{title:"Exemplo: config do hostname",code:`# No Alpine, o hostname fica em:
cat /etc/conf.d/hostname
# hostname="alpine-server"

# E o script de init lê essa variável:
# /etc/init.d/hostname → source /etc/conf.d/hostname`}),e.jsx("h2",{children:"4. /tmp: um sistema de arquivos em RAM"}),e.jsxs("p",{children:["Por padrão, o Alpine monta ",e.jsx("code",{children:"/tmp"})," como ",e.jsx("strong",{children:"tmpfs"})," ","— um disco virtual na RAM. Tudo que você coloca lá ",e.jsx("strong",{children:"some no reboot"}),":"]}),e.jsx(o,{title:"Confirmando que /tmp é tmpfs",lines:[{type:"cmd",text:"mount | grep /tmp"},{type:"out",text:"tmpfs on /tmp type tmpfs (rw,noatime,size=...) "},{type:"cmd",text:"df -h /tmp"},{type:"out",text:"Filesystem      Size  Used Avail Use% Mounted on"},{type:"out",text:"tmpfs           1.9G  156K  1.9G   1% /tmp"},{type:"comment",text:"# Metade da RAM por padrão, configurável."}]}),e.jsx("p",{children:"Isso é ótimo para performance (arquivos temporários não tocam o disco), mas requer atenção:"}),e.jsx(s,{title:"Ajustando o tmpfs do /tmp",code:`# Ver o tamanho atual
df -h /tmp

# Aumentar o /tmp para 4 GB (em /etc/fstab):
tmpfs   /tmp   tmpfs   size=4G,noatime   0 0

# Para arquivos que precisam sobreviver ao reboot:
# Use /var/tmp (persiste em disco)`}),e.jsx("h2",{children:"5. /var: dados que persistem"}),e.jsxs("p",{children:["Enquanto ",e.jsx("code",{children:"/tmp"})," é volátil, ",e.jsx("code",{children:"/var"})," é persistente. Aqui moram os dados que mudam durante a operação do sistema:"]}),e.jsx(s,{title:"O que vive em /var",code:`/var/cache/apk/      ← pacotes .apk baixados (limpe com apk cache clean)
/var/log/            ← logs do sistema (se syslog estiver instalado)
/var/lib/            ← dados de estado (bancos, docker, etc.)
/var/spool/cron/     ← crontabs dos usuários
/var/tmp/            ← temporários persistentes (sobrevivem ao reboot)
/var/www/            ← raiz de servidores web (Caddy, Nginx)
/var/mail/           ← mail spool`}),e.jsx("h2",{children:"6. /proc e /sys: janelas para o kernel"}),e.jsxs("p",{children:[e.jsx("code",{children:"/proc"})," e ",e.jsx("code",{children:"/sys"})," são pseudo-sistemas de arquivos que expõem informações do kernel. Não ocupam espaço em disco — são gerados em tempo real:"]}),e.jsx(s,{title:"Consultas rápidas em /proc e /sys",code:`# /proc — informações de processos e sistema
cat /proc/cpuinfo        # detalhes da CPU
cat /proc/meminfo        # memória (free -h é mais legível)
cat /proc/version        # versão do kernel
cat /proc/uptime         # segundos desde o boot (1º número)
cat /proc/loadavg        # load average (1, 5, 15 min)

# /sys — parâmetros do kernel e dispositivos
cat /sys/class/net/eth0/address   # MAC address
cat /sys/block/sda/size           # tamanho do disco em setores`}),e.jsx("h2",{children:"7. /dev: dispositivos são arquivos"}),e.jsx("p",{children:"No Linux, tudo é arquivo — inclusive discos, terminais e dispositivos:"}),e.jsx(s,{title:"Dispositivos essenciais em /dev",code:`/dev/sda, /dev/nvme0n1   ← discos
/dev/sda1, /dev/sda2        ← partições
/dev/tty1, /dev/ttyS0       ← terminais
/dev/null                   ← buraco negro (descarta tudo)
/dev/zero                   ← fonte infinita de zeros
/dev/random, /dev/urandom   ← entropia
/dev/stdin, /dev/stdout     ← entrada/saída padrão`}),e.jsx("h2",{children:"8. Filesystem em modo diskless (overlay)"}),e.jsxs("p",{children:["No modo ",e.jsx("strong",{children:"diskless"})," (ou ",e.jsx("em",{children:"data"}),"), o Alpine carrega o sistema base numa imagem squashfs na RAM e usa um ",e.jsx("strong",{children:"overlay filesystem"})," para modificações:"]}),e.jsx(s,{title:"Como funciona o overlay no diskless",code:`# Camadas do overlay:
# lowerdir  = sistema base read-only (ISO/APKs na RAM)
# upperdir  = modificações (gravadas em disco/USB, se configurado)
# workdir   = diretório de trabalho do overlay

# O resultado: você "escreve" em /etc, /home, /var...
# mas na verdade está escrevendo na camada superior.
# O sistema base permanece imutável.

# Modo sys (instalação normal em disco) NÃO usa overlay —
# é um filesystem ext4/xfs normal, como qualquer distro.`}),e.jsx("h2",{children:"9. apk audit: arquivos modificados"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"apk audit"})," compara os arquivos instalados com o que o pacote espera. É uma ferramenta de integridade e diagnóstico:"]}),e.jsx(o,{title:"Auditando o sistema de arquivos",lines:[{type:"cmd",text:"apk audit"},{type:"out",text:"No missing files or dependencies detected."},{type:"ok",text:"# Sistema íntegro — nenhum arquivo corrompido."},{type:"cmd",text:"apk audit --backup"},{type:"warn",text:"M /etc/nginx/nginx.conf"},{type:"warn",text:"M /etc/ssh/sshd_config"},{type:"comment",text:"# M = Modificado. Você editou esses arquivos."},{type:"cmd",text:"apk audit --system"},{type:"warn",text:"A /root/meu-script.sh"},{type:"comment",text:"# A = Adicionado. Não veio de nenhum pacote."}]}),e.jsxs(t,{type:"warning",title:"apk audit não é verificação de segurança",children:["O ",e.jsx("code",{children:"apk audit"})," mostra o que difere do pacote original — útil para saber o que você customizou. Para verificar ",e.jsx("em",{children:"intrusão"}),", você precisa de ferramentas como AIDE, Tripwire ou verificadores de checksum."]}),e.jsx("h2",{children:"10. Alpine vs Debian: diferenças na estrutura"}),e.jsx(s,{title:"O que muda de Debian para Alpine na árvore de diretórios",code:`Característica         Debian/Ubuntu              Alpine
─────────────────────   ────────────────────────   ──────────────────────
Shell padrão           /bin/bash (GNU bash)       /bin/sh → busybox ash
Coreutils              GNU coreutils               BusyBox (applets)
/lib structure         /lib/x86_64-linux-gnu/      /lib/ (mais enxuto)
/usr merge             Opcional (padrão no 10+)    Obrigatório
Locales                /usr/share/locale/ (cheio)  /usr/share/locale/ (vazio)
Tmpfiles               systemd-tmpfiles            OpenRC (bootmisc)
Logs                   /var/log/syslog (rsyslog)   /var/log/messages (opcional)
Documentação           /usr/share/doc/ (extenso)   /usr/share/doc/ (mínimo)
Init                   systemd                     OpenRC`}),e.jsxs(t,{type:"success",title:"Resumo",children:["O sistema de arquivos do Alpine é FHS com minimalismo:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"usrmerge"})," — /bin, /sbin e /lib são symlinks para /usr"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"/etc/conf.d/"})," — configs de serviços centralizadas"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"/tmp"})," — tmpfs (RAM), volátil por padrão"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"BusyBox"})," — a maioria dos comandos são applets de um binário só"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"apk audit"})," — descubra o que foi modificado no sistema"]})]}),"Conhecer sua árvore de diretórios é o primeiro passo para administrar qualquer Linux com confiança. No Alpine, isso é mais simples que em qualquer outra distro."]})]})}export{d as default};
