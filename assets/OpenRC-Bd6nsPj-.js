import{j as e,T as o}from"./index-YFyZeUD9.js";import{P as r,A as t,C as s}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(r,{title:"OpenRC — O Init do Alpine",subtitle:"Domine o sistema de init do Alpine: serviços, runlevels, scripts de init e troubleshooting.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx(t,{type:"info",title:"Pré-requisitos",children:"Alpine instalado. Se você vem do systemd (Debian, Ubuntu, Fedora), prepare-se para um modelo diferente — mais simples, mais transparente."}),e.jsxs("p",{children:["O Alpine ",e.jsx("strong",{children:"não usa systemd"}),". Ele usa o ",e.jsx("strong",{children:"OpenRC"}),", um sistema de init leve e portável baseado em scripts shell. Não há journald, não há cgroups obrigatórios, não há D-Bus como dependência. É init puro: scripts em ",e.jsx("code",{children:"/etc/init.d/"})," que você pode ler, entender e modificar."]}),e.jsx("h2",{children:"1. Filosofia: OpenRC vs systemd"}),e.jsx(s,{title:"OpenRC em 30 segundos",code:`systemd                           OpenRC
────────                           ──────
systemctl start sshd        →      rc-service sshd start
systemctl enable sshd       →      rc-update add sshd
systemctl status sshd       →      rc-service sshd status
journalctl -u sshd          →      cat /var/log/messages | grep sshd
systemd-analyze blame       →      (não tem equivalente direto)

# Princípios do OpenRC:
# 1. Transparente: cada serviço é um script shell em /etc/init.d/
# 2. Configurável: variáveis em /etc/conf.d/<servico>
# 3. Paralelo: dependências declaradas com 'need', 'use', 'after'
# 4. Mínimo: ~200 KB, zero dependências externas`}),e.jsx("h2",{children:"2. rc-status: o painel de controle"}),e.jsx(o,{title:"Estado dos serviços no sistema",lines:[{type:"cmd",text:"rc-status"},{type:"out",text:"Runlevel: default"},{type:"out",text:" sshd                         [ started ]"},{type:"out",text:" chronyd                      [ started ]"},{type:"out",text:" networking                   [ started ]"},{type:"out",text:" local                        [ started ]"},{type:"out",text:" crond                        [ started ]"},{type:"out",text:""},{type:"out",text:"Dynamic Runlevel: hotplugged"},{type:"out",text:"Dynamic Runlevel: needed/wanted"},{type:"cmd",text:"rc-status --servicelist"},{type:"out",text:"acpid  chronyd  crond  modules  networking  sshd  ..."},{type:"comment",text:"# --servicelist mostra todos os serviços DISPONÍVEIS"}]}),e.jsx(s,{title:"rc-status — modos de consulta",code:`rc-status                    # runlevel atual (default)
rc-status -a                  # TODOS os runlevels
rc-status -r                  # só runlevel atual, formato curto
rc-status -c                  # serviços que CRASHARAM (útil para debug)
rc-status --manual            # serviços iniciados manualmente

# Runlevels padrão no Alpine:
# sysinit  → montagem de /proc, /sys, /dev...
# boot     → hardware, filesystems, módulos
# default  → serviços do dia a dia (ssh, cron, ...)
# shutdown → parágrafo final antes do desligamento`}),e.jsx("h2",{children:"3. rc-service: controlar serviços"}),e.jsx(s,{title:"rc-service — gerenciando serviços",code:`# INICIAR / PARAR / REINICIAR
rc-service sshd start
rc-service sshd stop
rc-service sshd restart
rc-service sshd reload          # recarrega config sem parar (se suportado)

# STATUS (com detalhes)
rc-service sshd status
# * status: started

# VERIFICAR se está rodando (código de saída: 0=sim, 3=não)
rc-service sshd status -q && echo "OK"

# LISTAR todos os comandos que um serviço aceita
rc-service sshd describe
# * describe: start stop restart reload status zap`}),e.jsx(o,{title:"zap: o botão de emergência",lines:[{type:"comment",text:"# zap = reseta o estado sem tocar no processo"},{type:"comment",text:"# Use quando o serviço CRASHOU mas o OpenRC acha que está rodando."},{type:"cmd",text:"rc-service sshd status"},{type:"out",text:"* status: crashed"},{type:"cmd",text:"rc-service sshd zap"},{type:"out",text:"* Manually resetting sshd to stopped state"},{type:"cmd",text:"rc-service sshd start"},{type:"ok",text:"* Starting sshd ... [ OK ]"}]}),e.jsx("h2",{children:"4. rc-update: controlar o boot"}),e.jsx(s,{title:"rc-update — quais serviços iniciam automaticamente",code:`# ADICIONAR serviço ao boot (runlevel default)
rc-update add sshd
# Agora o sshd inicia automaticamente a cada boot.

# REMOVER serviço do boot
rc-update del sshd

# VER quais serviços estão em cada runlevel
rc-update show
#          boot | default
#   networking |      default
#        sshd   |      default
#      chronyd  |      default

# ADICIONAR em runlevel específico
rc-update add meu-script custom    # runlevel 'custom'

# VER detalhes de um serviço específico
rc-update show -v sshd`}),e.jsx("h2",{children:"5. Anatomia de um script de init"}),e.jsxs("p",{children:["Vamos ler um script real. O OpenRC é transparente — você pode abrir qualquer script em ",e.jsx("code",{children:"/etc/init.d/"})," e entender:"]}),e.jsx(s,{title:"/etc/init.d/sshd — estrutura real comentada",code:`#!/sbin/openrc-run

# Metadados
description="OpenSSH server"

# Dependências
depend() {
    need net              # precisa de rede ANTES
    use dns logger        # usa DNS e logger se disponíveis
    after firewall        # inicia DEPOIS do firewall
}

# Função start — o que acontece quando você roda 'rc-service sshd start'
start() {
    ebegin "Starting sshd"
    start-stop-daemon --start --exec /usr/sbin/sshd -- -D
    eend $?
}

# Função stop
stop() {
    ebegin "Stopping sshd"
    start-stop-daemon --stop --exec /usr/sbin/sshd
    eend $?
}

# reload — recarrega config (envia SIGHUP)
reload() {
    ebegin "Reloading sshd"
    start-stop-daemon --signal HUP --exec /usr/sbin/sshd
    eend $?
}`}),e.jsxs(t,{type:"info",title:"Você pode criar seus próprios scripts de init",children:["Copie qualquer script de ",e.jsx("code",{children:"/etc/init.d/"})," como molde, edite as funções ",e.jsx("code",{children:"start()"})," e ",e.jsx("code",{children:"stop()"}),", e você tem um serviço controlado pelo OpenRC. É shell script puro — qualquer pessoa que sabe bash consegue escrever um."]}),e.jsx("h2",{children:"6. /etc/conf.d: configuração de serviços"}),e.jsxs("p",{children:["No OpenRC, a configuração de cada serviço fica em"," ",e.jsx("code",{children:"/etc/conf.d/<serviço>"})," — não no script de init. Isso mantém o script limpo e permite atualizações sem perder configs:"]}),e.jsx(s,{title:"Exemplos de /etc/conf.d/",code:`# /etc/conf.d/hostname
hostname="alpine-server"

# /etc/conf.d/keymaps
keymap="br-abnt2"

# /etc/conf.d/networking
# (configuração de rede — interfaces, DHCP, estático...)

# Variáveis que o script de init lê com 'source':
# source /etc/conf.d/hostname
# echo "Setting hostname to $hostname"`}),e.jsx("h2",{children:"7. Dependências: need, use, after, before"}),e.jsx(s,{title:"As palavras-chave de dependência",code:`depend() {
    # need = OBRIGATÓRIO. Se falhar, este serviço NÃO inicia.
    need net

    # use = OPCIONAL. Usa se estiver disponível, ignora se não.
    use dns logger

    # after = inicia DEPOIS (ordenação, não dependência forte)
    after firewall

    # before = inicia ANTES
    before ntpd

    # provide = este serviço FORNECE uma funcionalidade virtual
    provide webserver

    # keyword = restringe a plataforma
    keyword -jail -prefix -lxc
}`}),e.jsx("h2",{children:"8. Logs de serviço no OpenRC"}),e.jsxs("p",{children:["O OpenRC não tem journald. Os logs vão para o syslog (se instalado) ou para arquivos em ",e.jsx("code",{children:"/var/log/"}),":"]}),e.jsx(s,{title:"Onde encontrar logs de serviço",code:`# 1. Log do OpenRC (início/parada de serviços)
cat /var/log/rc.log

# 2. Log do syslog (se busybox syslogd estiver rodando)
cat /var/log/messages | grep sshd

# 3. Registrar stdout/stderr de um serviço
#    Adicione ao script de init:
#    output_log="/var/log/meu-servico.log"
#    error_log="/var/log/meu-servico.log"

# 4. Verificar com dmesg (mensagens do kernel)
dmesg | tail -20`}),e.jsx("h2",{children:"9. Troubleshooting: serviço não inicia"}),e.jsx(s,{title:"Debug de serviços travados",code:`# 1. Estado atual
rc-service sshd status -v
# * status: stopped
# * (mostra a última ação e resultado)

# 2. Log de inicialização
cat /var/log/rc.log | grep sshd

# 3. Iniciar em modo verbose
rc-service sshd start -v
# Mostra cada passo do script de init

# 4. Verificar dependências
rc-service sshd needsme   # serviços que dependem deste
rc-service sshd ineed      # dependências obrigatórias (need)
rc-service sshd iuse       # dependências opcionais (use)

# 5. Crash loop: zap + start
rc-service sshd zap
rc-service sshd start

# 6. Verificar se o binário existe e funciona
/usr/sbin/sshd -t          # testa config sem iniciar
echo $?                     # 0 = OK`}),e.jsx("h2",{children:"10. Serviços essenciais (exemplos práticos)"}),e.jsx(s,{title:"Ativando serviços comuns no Alpine",code:`# SSH (já coberto, mas é o exemplo canônico)
apk add openssh
rc-update add sshd
rc-service sshd start

# CRON (tarefas agendadas)
apk add dcron
rc-update add dcron
rc-service dcron start

# NETWORKING (já ativo por padrão da instalação)
rc-service networking status
cat /etc/conf.d/networking    # config de rede

# LOCAL (scripts locais, executa /etc/local.d/*.start no boot)
rc-update add local
# Crie scripts em /etc/local.d/ com extensão .start ou .stop

# MODULES (carrega módulos do kernel listados em /etc/modules)
rc-update add modules boot`}),e.jsxs(t,{type:"success",title:"Resumo: comandos que você vai usar todo dia",children:[e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"rc-status"})," — painel geral dos serviços"]}),e.jsx("li",{children:e.jsx("code",{children:"rc-service <nome> start/stop/restart/status"})}),e.jsxs("li",{children:[e.jsx("code",{children:"rc-update add/del <nome>"})," — controla boot"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rc-service <nome> zap"})," — reset de emergência"]}),e.jsxs("li",{children:[e.jsx("code",{children:"cat /var/log/rc.log"})," — debug de inicialização"]}),e.jsxs("li",{children:["Scripts em ",e.jsx("code",{children:"/etc/init.d/"}),", configs em ",e.jsx("code",{children:"/etc/conf.d/"})]})]}),"O OpenRC é o sistema de init mais compreensível do mundo Linux. Depois de uma semana, você nunca mais vai sentir falta do systemd."]})]})}export{d as default};
