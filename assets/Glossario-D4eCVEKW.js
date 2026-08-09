import{j as e}from"./index-YFyZeUD9.js";import{P as a,C as o,A as i}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(a,{title:"Glossário",subtitle:"Termos essenciais do ecossistema Alpine, Linux e OpenRC — referência rápida.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsx("p",{children:"Um dicionário rápido dos termos que aparecem ao longo do curso. Ideal para consulta durante os estudos ou no dia a dia com o Alpine."}),e.jsx("h2",{children:"A-E"}),e.jsx(o,{code:`abuild      Ferramenta de build de pacotes .apk
apk         Alpine Package Keeper — gerenciador de pacotes
aports      Repositório de APKBUILDs do Alpine (receitas de pacotes)
ash         Almquist Shell — shell padrão do Alpine (via BusyBox)
awall       Alpine Wall — firewall declarativo do Alpine
BusyBox     Binário que fornece dezenas de comandos Unix em um só
cgroups     Control groups — isolamento de recursos (usado por Docker)
chrony      Cliente NTP leve para sincronização de relógio
community   Repositório de pacotes mantido pela comunidade
coreutils   Pacote com versões GNU completas de comandos (ls, cp, mv...)`}),e.jsx("h2",{children:"D-L"}),e.jsx(o,{code:`dcron       Daemon de cron do BusyBox (agendamento de tarefas)
diskless    Modo Alpine que roda o sistema base na RAM
doas        "Dedicated OpenBSD Application Subexecutor" — substituto do sudo
edge        Branch rolling-release do Alpine (atualização contínua)
FHS         Filesystem Hierarchy Standard — padrão de diretórios Linux
glibc       GNU C Library — biblioteca C padrão do Debian/Ubuntu
hardening   Práticas de fortalecimento da segurança do sistema
initramfs   Sistema de arquivos inicial carregado na RAM durante o boot
LBU         Alpine Local Backup — backup de configs no modo diskless
LVM         Logical Volume Manager — gerenciamento flexível de discos
LUKS        Linux Unified Key Setup — criptografia de disco`}),e.jsx("h2",{children:"M-Z"}),e.jsx(o,{code:`main        Repositório oficial de pacotes (suportado pela equipe Alpine)
mkinitfs    Ferramenta que gera o initramfs do Alpine
musl        Biblioteca C leve (alternativa à glibc) — padrão do Alpine
OpenRC      Sistema de init do Alpine (alternativa ao systemd)
overlay     Sistema de arquivos em camadas (usado no modo diskless)
POSIX       Portable Operating System Interface — padrão Unix
qcow2       Formato de disco virtual do QEMU (cresce sob demanda)
runlevel    Estado de inicialização do OpenRC (boot, default, shutdown)
syslinux    Bootloader leve para BIOS
testing     Repositório de staging para novos pacotes
tmpfs       Sistema de arquivos em RAM (usado em /tmp)
usrmerge    Unificação de /bin, /sbin e /lib em /usr
wheel        Grupo de administradores (tradição BSD)
WireGuard   VPN moderna integrada ao kernel Linux`}),e.jsxs(i,{type:"info",title:"Faltou algum termo?",children:["O Alpine Wiki (",e.jsx("code",{children:"wiki.alpinelinux.org"}),") tem um glossário mais extenso. Este cobre os termos usados ao longo do curso."]})]})}export{d as default};
