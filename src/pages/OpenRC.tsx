import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function OpenRC() {
  return (
    <PageContainer
      title="OpenRC — O Init do Alpine"
      subtitle="Domine o sistema de init do Alpine: serviços, runlevels, scripts de init e troubleshooting."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado. Se você vem do systemd (Debian, Ubuntu, Fedora), prepare-se
        para um modelo diferente — mais simples, mais transparente.
      </AlertBox>

      <p>
        O Alpine <strong>não usa systemd</strong>. Ele usa o <strong>OpenRC</strong>,
        um sistema de init leve e portável baseado em scripts shell. Não há
        journald, não há cgroups obrigatórios, não há D-Bus como dependência.
        É init puro: scripts em <code>/etc/init.d/</code> que você pode ler,
        entender e modificar.
      </p>

      <h2>1. Filosofia: OpenRC vs systemd</h2>
      <CodeBlock
        title="OpenRC em 30 segundos"
        code={`systemd                           OpenRC
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
# 4. Mínimo: ~200 KB, zero dependências externas`}
      />

      <h2>2. rc-status: o painel de controle</h2>
      <Terminal
        title="Estado dos serviços no sistema"
        lines={[
          { type: "cmd", text: "rc-status" },
          { type: "out", text: "Runlevel: default" },
          { type: "out", text: " sshd                         [ started ]" },
          { type: "out", text: " chronyd                      [ started ]" },
          { type: "out", text: " networking                   [ started ]" },
          { type: "out", text: " local                        [ started ]" },
          { type: "out", text: " crond                        [ started ]" },
          { type: "out", text: "" },
          { type: "out", text: "Dynamic Runlevel: hotplugged" },
          { type: "out", text: "Dynamic Runlevel: needed/wanted" },
          { type: "cmd", text: "rc-status --servicelist" },
          { type: "out", text: "acpid  chronyd  crond  modules  networking  sshd  ..." },
          { type: "comment", text: "# --servicelist mostra todos os serviços DISPONÍVEIS" },
        ]}
      />

      <CodeBlock
        title="rc-status — modos de consulta"
        code={`rc-status                    # runlevel atual (default)
rc-status -a                  # TODOS os runlevels
rc-status -r                  # só runlevel atual, formato curto
rc-status -c                  # serviços que CRASHARAM (útil para debug)
rc-status --manual            # serviços iniciados manualmente

# Runlevels padrão no Alpine:
# sysinit  → montagem de /proc, /sys, /dev...
# boot     → hardware, filesystems, módulos
# default  → serviços do dia a dia (ssh, cron, ...)
# shutdown → parágrafo final antes do desligamento`}
      />

      <h2>3. rc-service: controlar serviços</h2>
      <CodeBlock
        title="rc-service — gerenciando serviços"
        code={`# INICIAR / PARAR / REINICIAR
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
# * describe: start stop restart reload status zap`}
      />

      <Terminal
        title="zap: o botão de emergência"
        lines={[
          { type: "comment", text: "# zap = reseta o estado sem tocar no processo" },
          { type: "comment", text: "# Use quando o serviço CRASHOU mas o OpenRC acha que está rodando." },
          { type: "cmd", text: "rc-service sshd status" },
          { type: "out", text: "* status: crashed" },
          { type: "cmd", text: "rc-service sshd zap" },
          { type: "out", text: "* Manually resetting sshd to stopped state" },
          { type: "cmd", text: "rc-service sshd start" },
          { type: "ok", text: "* Starting sshd ... [ OK ]" },
        ]}
      />

      <h2>4. rc-update: controlar o boot</h2>
      <CodeBlock
        title="rc-update — quais serviços iniciam automaticamente"
        code={`# ADICIONAR serviço ao boot (runlevel default)
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
rc-update show -v sshd`}
      />

      <h2>5. Anatomia de um script de init</h2>
      <p>
        Vamos ler um script real. O OpenRC é transparente — você pode abrir
        qualquer script em <code>/etc/init.d/</code> e entender:
      </p>
      <CodeBlock
        title="/etc/init.d/sshd — estrutura real comentada"
        code={`#!/sbin/openrc-run

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
}`}
      />

      <AlertBox type="info" title="Você pode criar seus próprios scripts de init">
        Copie qualquer script de <code>/etc/init.d/</code> como molde, edite
        as funções <code>start()</code> e <code>stop()</code>, e você tem um
        serviço controlado pelo OpenRC. É shell script puro — qualquer pessoa
        que sabe bash consegue escrever um.
      </AlertBox>

      <h2>6. /etc/conf.d: configuração de serviços</h2>
      <p>
        No OpenRC, a configuração de cada serviço fica em{" "}
        <code>/etc/conf.d/&lt;serviço&gt;</code> — não no script de init. Isso
        mantém o script limpo e permite atualizações sem perder configs:
      </p>
      <CodeBlock
        title="Exemplos de /etc/conf.d/"
        code={`# /etc/conf.d/hostname
hostname="alpine-server"

# /etc/conf.d/keymaps
keymap="br-abnt2"

# /etc/conf.d/networking
# (configuração de rede — interfaces, DHCP, estático...)

# Variáveis que o script de init lê com 'source':
# source /etc/conf.d/hostname
# echo "Setting hostname to $hostname"`}
      />

      <h2>7. Dependências: need, use, after, before</h2>
      <CodeBlock
        title="As palavras-chave de dependência"
        code={`depend() {
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
}`}
      />

      <h2>8. Logs de serviço no OpenRC</h2>
      <p>
        O OpenRC não tem journald. Os logs vão para o syslog (se instalado)
        ou para arquivos em <code>/var/log/</code>:
      </p>
      <CodeBlock
        title="Onde encontrar logs de serviço"
        code={`# 1. Log do OpenRC (início/parada de serviços)
cat /var/log/rc.log

# 2. Log do syslog (se busybox syslogd estiver rodando)
cat /var/log/messages | grep sshd

# 3. Registrar stdout/stderr de um serviço
#    Adicione ao script de init:
#    output_log="/var/log/meu-servico.log"
#    error_log="/var/log/meu-servico.log"

# 4. Verificar com dmesg (mensagens do kernel)
dmesg | tail -20`}
      />

      <h2>9. Troubleshooting: serviço não inicia</h2>
      <CodeBlock
        title="Debug de serviços travados"
        code={`# 1. Estado atual
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
echo $?                     # 0 = OK`}
      />

      <h2>10. Serviços essenciais (exemplos práticos)</h2>
      <CodeBlock
        title="Ativando serviços comuns no Alpine"
        code={`# SSH (já coberto, mas é o exemplo canônico)
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
rc-update add modules boot`}
      />

      <AlertBox type="success" title="Resumo: comandos que você vai usar todo dia">
        <ol>
          <li><code>rc-status</code> — painel geral dos serviços</li>
          <li><code>rc-service &lt;nome&gt; start/stop/restart/status</code></li>
          <li><code>rc-update add/del &lt;nome&gt;</code> — controla boot</li>
          <li><code>rc-service &lt;nome&gt; zap</code> — reset de emergência</li>
          <li><code>cat /var/log/rc.log</code> — debug de inicialização</li>
          <li>Scripts em <code>/etc/init.d/</code>, configs em <code>/etc/conf.d/</code></li>
        </ol>
        O OpenRC é o sistema de init mais compreensível do mundo Linux. Depois
        de uma semana, você nunca mais vai sentir falta do systemd.
      </AlertBox>
    </PageContainer>
  );
}