import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Logs() {
  return (
    <PageContainer
      title="Logs — syslog no Alpine"
      subtitle="Sem journald: BusyBox syslogd, syslog-ng, logrotate e como centralizar logs no Alpine."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado com OpenRC funcional. Se você vem do systemd, esqueça
        o <code>journalctl</code> — o Alpine faz logs de um jeito diferente.
      </AlertBox>

      <p>
        O Alpine <strong>não tem journald</strong>. Em vez disso, ele usa o
        modelo Unix clássico: um daemon de syslog escreve mensagens em arquivos
        de texto em <code>/var/log/</code>. É mais simples, ocupa menos memória
        e os logs são arquivos de texto puro — grep, tail e less funcionam
        naturalmente.
      </p>

      <h2>1. BusyBox syslogd: o padrão mínimo</h2>
      <p>
        O Alpine traz o <code>syslogd</code> do BusyBox por padrão. Ele é
        ativado durante o <code>setup-alpine</code>:
      </p>
      <Terminal
        title="Verificando o syslog padrão"
        lines={[
          { type: "cmd", text: "rc-service syslog status" },
          { type: "out", text: "* status: started" },
          { type: "cmd", text: "ls -lh /var/log/messages" },
          { type: "out", text: "-rw-r--r-- 1 root root 234K Aug 9 14:00 /var/log/messages" },
          { type: "cmd", text: "tail -5 /var/log/messages" },
          { type: "out", text: "Aug  9 13:45:00 alpine daemon.info sshd[1234]: Accepted publickey for wallyson" },
          { type: "out", text: "Aug  9 13:50:00 alpine cron.info crond[1235]: USER root pid 5678 cmd run-parts /etc/periodic/15min" },
        ]}
      />

      <CodeBlock
        title="Configuração do busybox syslogd"
        code={`# Configuração em /etc/conf.d/syslog
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
rc-service syslog restart`}
      />

      <p>
        O syslogd do BusyBox é <strong>muito básico</strong>: um arquivo só,
        sem rotação, sem filtros, sem envio remoto. Para servidores, você vai
        querer algo mais robusto.
      </p>

      <h2>2. syslog-ng: syslog profissional</h2>
      <CodeBlock
        title="Instalando syslog-ng"
        code={`# 1. Instalar
apk add syslog-ng

# 2. Parar o busybox syslog
rc-service syslog stop
rc-update del syslog

# 3. Iniciar syslog-ng
rc-update add syslog-ng
rc-service syslog-ng start

# Configuração: /etc/syslog-ng/syslog-ng.conf
# (arquivo de config extenso e comentado — siga os exemplos)`}
      />

      <p>
        Com syslog-ng você pode separar logs por facility (auth, cron, mail...),
        por severidade (info, warn, err...), enviar para servidores remotos e
        muito mais.
      </p>

      <CodeBlock
        title="syslog-ng: configuração típica"
        code={`# /etc/syslog-ng/syslog-ng.conf (trechos essenciais)

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
log { source(s_local); destination(d_messages); };`}
      />

      <h2>3. logrotate: rotação de logs</h2>
      <p>
        Sem rotação, os logs crescem até encher o disco. O Alpine traz o
        busybox <code>logrotate</code> no pacote <code>dcron</code>:
      </p>
      <CodeBlock
        title="Configurando logrotate"
        code={`# Configuração principal
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
cat /etc/periodic/daily/logrotate`}
      />

      <h2>4. dmesg: logs do kernel</h2>
      <Terminal
        title="Mensagens do kernel"
        lines={[
          { type: "cmd", text: "dmesg | tail -10" },
          { type: "out", text: "[ 12.34] EXT4-fs (sda3): mounted filesystem with ordered data mode" },
          { type: "out", text: "[ 13.45] Adding 2097148k swap on /dev/sda2" },
          { type: "cmd", text: "dmesg -T | tail -5" },
          { type: "out", text: "[Sun Aug  9 13:45:00 2026] sshd[1234]: ..." },
          { type: "comment", text: "# -T converte timestamps para formato legível" },
          { type: "cmd", text: "dmesg -w" },
          { type: "comment", text: "# -w = watch (segue em tempo real, Ctrl+C para sair)" },
        ]}
      />

      <h2>5. Onde cada coisa loga no Alpine</h2>
      <CodeBlock
        title="Mapa de logs do Alpine"
        code={`/var/log/messages       ← syslog: tudo que o busybox syslogd coleta
/var/log/rc.log          ← OpenRC: start/stop de serviços
/var/log/dmesg           ← snapshot do dmesg no boot
/var/log/auth.log        ← autenticação (login, SSH, doas) — syslog-ng
/var/log/cron.log        ← tarefas agendadas — syslog-ng
/var/log/nginx/          ← Nginx (se instalado e configurado)
/var/log/apk/            ← (vazio por padrão — apk não loga transações)

# dmesg não é um arquivo, é um buffer circular do kernel.
# Use 'dmesg > /var/log/dmesg.txt' para salvar em arquivo.`}
      />

      <h2>6. Centralizando logs</h2>
      <CodeBlock
        title="Enviando logs para um servidor remoto"
        code={`# syslog-ng: enviar tudo para um servidor central
destination d_remote {
    syslog("10.0.0.50" transport("tcp") port(514));
};
log { source(s_local); destination(d_remote); };

# Ou usar rsyslog como alternativa:
apk add rsyslog
# Config: /etc/rsyslog.conf

# Para ambientes cloud: usar logger + ferramenta nativa
# Ex: AWS CloudWatch agent, GCP ops-agent, etc.`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><strong>BusyBox syslogd</strong> para sistemas simples (um arquivo: messages)</li>
          <li><strong>syslog-ng</strong> para servidores (filtros, separação, remoto)</li>
          <li><strong>logrotate</strong> para não encher o disco</li>
          <li><strong>dmesg</strong> para logs do kernel (buffer circular)</li>
          <li><strong>/var/log/rc.log</strong> para debug do OpenRC</li>
          <li>Sem journald = logs são texto puro. grep, tail, less funcionam.</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}