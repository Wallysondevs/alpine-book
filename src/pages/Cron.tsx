import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Cron() {
  return (
    <PageContainer
      title="Cron — Agendamento de Tarefas"
      subtitle="BusyBox crond, cronie, /etc/periodic/ e crontab — automatize tarefas no Alpine."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado com dcron ou cronie. O <code>setup-alpine</code>{" "}
        oferece ativar o cron durante a instalação.
      </AlertBox>

      <p>
        O Alpine tem uma abordagem única para tarefas agendadas: além do
        <code>crontab</code> tradicional, ele usa o diretório{" "}
        <code>/etc/periodic/</code> (hourly, daily, weekly, monthly) que executa
        scripts automaticamente — sem configurar crontab. É o melhor dos dois
        mundos.
      </p>

      <h2>1. Instalação: dcron vs cronie</h2>
      <CodeBlock
        title="Escolhendo o daemon de cron"
        code={`# OPCÃO 1: dcron (BusyBox) — mínimo, já vem com busybox
apk add dcron
rc-update add dcron
rc-service dcron start

# OPCÃO 2: cronie — mais recursos (crontab -e completo, @reboot, etc.)
apk add cronie
rc-update add cronie
rc-service cronie start

# Ambos funcionam com crontab e /etc/periodic/.
# dcron é ~50 KB; cronie é ~200 KB com mais features.`}
      />

      <h2>2. /etc/periodic/: o sistema Alpine de tarefas</h2>
      <p>
        O Alpine organiza scripts em diretórios por frequência. Qualquer script
        executável colocado nesses diretórios roda automaticamente:
      </p>
      <Terminal
        title="Explorando /etc/periodic/"
        lines={[
          { type: "cmd", text: "ls -l /etc/periodic/" },
          { type: "out", text: "15min/" },
          { type: "out", text: "daily/" },
          { type: "out", text: "hourly/" },
          { type: "out", text: "monthly/" },
          { type: "out", text: "weekly/" },
          { type: "cmd", text: "ls /etc/periodic/daily/" },
          { type: "out", text: "logrotate" },
          { type: "comment", text: "# logrotate roda automaticamente todo dia!" },
        ]}
      />

      <CodeBlock
        title="Criando uma tarefa agendada pelo /etc/periodic/"
        code={`# Criar um script de backup diário
cat > /etc/periodic/daily/backup-homes << 'EOF'
#!/bin/sh
tar -czf /backup/homes-$(date +%Y%m%d).tar.gz /home/
find /backup/ -name "homes-*" -mtime +7 -delete  # apaga backups com > 7 dias
EOF

chmod +x /etc/periodic/daily/backup-homes

# Pronto! Vai rodar todo dia, sem editar crontab.

# Para testar AGORA:
run-parts /etc/periodic/daily`}
      />

      <AlertBox type="info" title="Por que /etc/periodic/ é tão bom?">
        Scripts em <code>/etc/periodic/</code> são autocontidos, versionáveis e
        fáceis de auditar. Um <code>ls</code> mostra tudo que roda agendado.
        Compare com crontabs espalhados em contas de usuários — muito mais
        simples de gerenciar em servidores.
      </AlertBox>

      <h2>3. crontab: agendamento tradicional</h2>
      <CodeBlock
        title="crontab — sintaxe e exemplos"
        code={`# Abrir o editor do crontab
crontab -e

# Sintaxe:
# ┌─ min (0-59)
# │ ┌─ hora (0-23)
# │ │ ┌─ dia do mês (1-31)
# │ │ │ ┌─ mês (1-12)
# │ │ │ │ ┌─ dia da semana (0-7, 0=dom)
# │ │ │ │ │
# * * * * * comando

# EXEMPLOS:
# Todo dia às 3h da manhã: atualizar o sistema
0 3 * * * apk update && apk upgrade -q

# A cada 30 minutos: verificar se o site responde
*/30 * * * * curl -s -o /dev/null -w "%{http_code}" https://meu.site

# Segundas às 6h: reiniciar serviço problemático
0 6 * * 1 rc-service meu-servico restart

# A cada 15 minutos (sintaxe alternativa)
0,15,30,45 * * * * /usr/local/bin/check.sh`}
      />

      <h2>4. Gerenciando crontabs</h2>
      <CodeBlock
        title="Comandos de crontab"
        code={`crontab -e       # editar seu crontab
crontab -l       # listar seu crontab
crontab -r       # remover seu crontab
crontab -u maria -e  # editar crontab de outro usuário (root)

# Crontabs ficam em /var/spool/cron/crontabs/
ls /var/spool/cron/crontabs/
# wallyson  maria  root

# Editar manualmente (não use crontab -e):
vim /var/spool/cron/crontabs/wallyson`}
      />

      <h2>5. @reboot e outras macros</h2>
      <CodeBlock
        title="Agendamentos especiais (cronie)"
        code={`# @reboot — executa uma vez após o boot
@reboot /usr/local/bin/startup-report.sh

# @yearly   = 0 0 1 1 *
# @monthly  = 0 0 1 * *
# @weekly   = 0 0 * * 0
# @daily    = 0 0 * * *
# @hourly   = 0 * * * *

# ⚠️  @reboot só funciona no cronie, não no dcron.
# No dcron, use /etc/local.d/ para scripts de boot.`}
      />

      <h2>6. Logs e debug do cron</h2>
      <CodeBlock
        title="Verificando se as tarefas rodaram"
        code={`# Logs do cron (syslog)
grep crond /var/log/messages
# Aug  9 03:00:00 alpine cron.info crond[1234]: USER root pid 5678 cmd apk update

# Testar um script manualmente
run-parts --test /etc/periodic/daily    # lista o que rodaria (sem executar)
run-parts -v /etc/periodic/daily        # executa com verbose

# Erros comuns:
# - Script sem permissão de execução (chmod +x)
# - PATH errado (use caminhos absolutos nos scripts!)
# - Script depende de variáveis de ambiente que o cron não tem`}
      />

      <AlertBox type="warning" title="O PATH do cron é mínimo">
        Scripts rodados pelo cron têm um PATH reduzido (geralmente{" "}
        <code>/usr/bin:/bin</code>). Use sempre caminhos absolutos nos seus
        scripts: <code>/usr/bin/tar</code> em vez de <code>tar</code>.
      </AlertBox>

      <AlertBox type="success" title="Resumo: /etc/periodic/ ou crontab?">
        <ol>
          <li><strong>Servidor:</strong> prefira <code>/etc/periodic/</code> — scripts versionáveis e auditáveis</li>
          <li><strong>Usuário:</strong> use <code>crontab -e</code> para tarefas pessoais</li>
          <li><strong>Boot:</strong> <code>@reboot</code> no cronie ou <code>/etc/local.d/</code></li>
          <li><strong>Debug:</strong> <code>run-parts -v</code> e <code>grep crond /var/log/messages</code></li>
          <li><strong>Sempre:</strong> caminhos absolutos nos scripts; <code>chmod +x</code></li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}