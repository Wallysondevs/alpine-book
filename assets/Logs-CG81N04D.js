import{j as o,T as s}from"./index-YFyZeUD9.js";import{P as t,A as a,C as e}from"./AlertBox-C2CyWd7R.js";function n(){return o.jsxs(t,{title:"Logs — syslog no Alpine",subtitle:"Sem journald: BusyBox syslogd, syslog-ng, logrotate e como centralizar logs no Alpine.",difficulty:"intermediario",timeToRead:"15 min",children:[o.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Alpine instalado com OpenRC funcional. Se você vem do systemd, esqueça o ",o.jsx("code",{children:"journalctl"})," — o Alpine faz logs de um jeito diferente."]}),o.jsxs("p",{children:["O Alpine ",o.jsx("strong",{children:"não tem journald"}),". Em vez disso, ele usa o modelo Unix clássico: um daemon de syslog escreve mensagens em arquivos de texto em ",o.jsx("code",{children:"/var/log/"}),". É mais simples, ocupa menos memória e os logs são arquivos de texto puro — grep, tail e less funcionam naturalmente."]}),o.jsx("h2",{children:"1. BusyBox syslogd: o padrão mínimo"}),o.jsxs("p",{children:["O Alpine traz o ",o.jsx("code",{children:"syslogd"})," do BusyBox por padrão. Ele é ativado durante o ",o.jsx("code",{children:"setup-alpine"}),":"]}),o.jsx(s,{title:"Verificando o syslog padrão",lines:[{type:"cmd",text:"rc-service syslog status"},{type:"out",text:"* status: started"},{type:"cmd",text:"ls -lh /var/log/messages"},{type:"out",text:"-rw-r--r-- 1 root root 234K Aug 9 14:00 /var/log/messages"},{type:"cmd",text:"tail -5 /var/log/messages"},{type:"out",text:"Aug  9 13:45:00 alpine daemon.info sshd[1234]: Accepted publickey for wallyson"},{type:"out",text:"Aug  9 13:50:00 alpine cron.info crond[1235]: USER root pid 5678 cmd run-parts /etc/periodic/15min"}]}),o.jsx(e,{title:"Configuração do busybox syslogd",code:`# Configuração em /etc/conf.d/syslog
cat /etc/conf.d/syslog
# SYSLOGD_OPTS="-t -O /var/log/messages"
# -t    = timestamp em todas as mensagens
# -O    = arquivo de saída (padrão: /var/log/messages)
# -s N  = tamanho máximo do buffer circular (padrão: 200)

# Opções extras úteis:
# SYSLOGD_OPTS="-t -O /var/log/messages -s 500 -b 10"
# -s 500  = buffer maior (500 KB)
# -b 10   = 10 mensagens por segundo (rate limiting)

# Aplicar mudanças:
rc-service syslog restart`}),o.jsxs("p",{children:["O syslogd do BusyBox é ",o.jsx("strong",{children:"muito básico"}),": um arquivo só, sem rotação, sem filtros, sem envio remoto. Para servidores, você vai querer algo mais robusto."]}),o.jsx("h2",{children:"2. syslog-ng: syslog profissional"}),o.jsx(e,{title:"Instalando syslog-ng",code:`# 1. Instalar
apk add syslog-ng

# 2. Parar o busybox syslog
rc-service syslog stop
rc-update del syslog

# 3. Iniciar syslog-ng
rc-update add syslog-ng
rc-service syslog-ng start

# Configuração: /etc/syslog-ng/syslog-ng.conf
# (arquivo de config extenso e comentado — siga os exemplos)`}),o.jsx("p",{children:"Com syslog-ng você pode separar logs por facility (auth, cron, mail...), por severidade (info, warn, err...), enviar para servidores remotos e muito mais."}),o.jsx(e,{title:"syslog-ng: configuração típica",code:`# /etc/syslog-ng/syslog-ng.conf (trechos essenciais)

# Fontes de mensagens
source s_local {
    system();           # /dev/log (socket Unix)
    internal();         # mensagens do próprio syslog-ng
};

# Destinos: arquivos separados por facility
destination d_auth    { file("/var/log/auth.log"); };
destination d_cron    { file("/var/log/cron.log"); };
destination d_mail    { file("/var/log/mail.log"); };
destination d_messages { file("/var/log/messages"); };

# Filtros: rotear mensagens para o destino certo
filter f_auth { facility(auth, authpriv); };
filter f_cron { facility(cron); };

# Log: conectando fonte → filtro → destino
log { source(s_local); filter(f_auth); destination(d_auth); };
log { source(s_local); filter(f_cron); destination(d_cron); };
log { source(s_local); destination(d_messages); };`}),o.jsx("h2",{children:"3. logrotate: rotação de logs"}),o.jsxs("p",{children:["Sem rotação, os logs crescem até encher o disco. O Alpine traz o busybox ",o.jsx("code",{children:"logrotate"})," no pacote ",o.jsx("code",{children:"dcron"}),":"]}),o.jsx(e,{title:"Configurando logrotate",code:`# Configuração principal
cat /etc/logrotate.conf
# weekly          # rotaciona semanalmente
# rotate 4        # mantém 4 rotações
# create          # cria arquivo novo após rotacionar
# compress        # comprime logs antigos

# Config por serviço: /etc/logrotate.d/
cat /etc/logrotate.d/nginx
# /var/log/nginx/*.log {
#     daily
#     rotate 7
#     missingok
#     notifempty
#     compress
#     delaycompress
#     sharedscripts
#     postrotate
#         rc-service nginx reload
#     endscript
# }

# Forçar rotação (testar):
logrotate -f /etc/logrotate.conf

# Logrotate roda via cron:
cat /etc/periodic/daily/logrotate`}),o.jsx("h2",{children:"4. dmesg: logs do kernel"}),o.jsx(s,{title:"Mensagens do kernel",lines:[{type:"cmd",text:"dmesg | tail -10"},{type:"out",text:"[ 12.34] EXT4-fs (sda3): mounted filesystem with ordered data mode"},{type:"out",text:"[ 13.45] Adding 2097148k swap on /dev/sda2"},{type:"cmd",text:"dmesg -T | tail -5"},{type:"out",text:"[Sun Aug  9 13:45:00 2026] sshd[1234]: ..."},{type:"comment",text:"# -T converte timestamps para formato legível"},{type:"cmd",text:"dmesg -w"},{type:"comment",text:"# -w = watch (segue em tempo real, Ctrl+C para sair)"}]}),o.jsx("h2",{children:"5. Onde cada coisa loga no Alpine"}),o.jsx(e,{title:"Mapa de logs do Alpine",code:`/var/log/messages       ← syslog: tudo que o busybox syslogd coleta
/var/log/rc.log          ← OpenRC: start/stop de serviços
/var/log/dmesg           ← snapshot do dmesg no boot
/var/log/auth.log        ← autenticação (login, SSH, doas) — syslog-ng
/var/log/cron.log        ← tarefas agendadas — syslog-ng
/var/log/nginx/          ← Nginx (se instalado e configurado)
/var/log/apk/            ← (vazio por padrão — apk não loga transações)

# dmesg não é um arquivo, é um buffer circular do kernel.
# Use 'dmesg > /var/log/dmesg.txt' para salvar em arquivo.`}),o.jsx("h2",{children:"6. Centralizando logs"}),o.jsx(e,{title:"Enviando logs para um servidor remoto",code:`# syslog-ng: enviar tudo para um servidor central
destination d_remote {
    syslog("10.0.0.50" transport("tcp") port(514));
};
log { source(s_local); destination(d_remote); };

# Ou usar rsyslog como alternativa:
apk add rsyslog
# Config: /etc/rsyslog.conf

# Para ambientes cloud: usar logger + ferramenta nativa
# Ex: AWS CloudWatch agent, GCP ops-agent, etc.`}),o.jsx(a,{type:"success",title:"Resumo",children:o.jsxs("ol",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"BusyBox syslogd"})," para sistemas simples (um arquivo: messages)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"syslog-ng"})," para servidores (filtros, separação, remoto)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"logrotate"})," para não encher o disco"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"dmesg"})," para logs do kernel (buffer circular)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"/var/log/rc.log"})," para debug do OpenRC"]}),o.jsx("li",{children:"Sem journald = logs são texto puro. grep, tail, less funcionam."})]})})]})}export{n as default};
