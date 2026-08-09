import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Atualizacoes() {
  return (
    <PageContainer
      title="Atualizações &amp; Release Upgrade"
      subtitle="Mantenha o Alpine atualizado: patches de segurança, upgrades entre versões e rollback."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine em produção. FAÇA BACKUP antes de qualquer upgrade de versão.
      </AlertBox>

      <p>
        O Alpine tem um modelo de atualizações simples: <strong>patch releases</strong>{" "}
        (3.24.0 → 3.24.1) são seguras e automáticas; <strong>release upgrades</strong>{" "}
        (3.23 → 3.24) exigem cuidado e planejamento. Vamos ver os dois.
      </p>

      <h2>1. Atualizações diárias (patch)</h2>
      <CodeBlock
        code={`# Atualização segura (dentro da mesma versão 3.24.x)
apk update && apk upgrade

# Automatizar (cron diário)
echo '0 3 * * * apk update && apk upgrade -q && rc-service nginx reload' | crontab -

# Simular antes de aplicar
apk upgrade -s               # dry-run

# Ver changelog
apk info -vv alpine-base     # mostra histórico de versões

# Downgrade de pacote (se algo quebrou)
apk add pacote=3.24.0-r0     # versão específica anterior`}
      />

      <h2>2. Release upgrade: 3.23 → 3.24</h2>
      <CodeBlock
        code={`# ⚠️  BACKUP ANTES DE TUDO
tar -czf /backup/alpine-pre-upgrade.tar.gz /etc /home /var/lib

# 1. Atualizar para a última patch da versão ATUAL
apk update && apk upgrade

# 2. Trocar repositórios para a nova versão
sed -i 's/v3\\.23/v3.24/g' /etc/apk/repositories
apk update

# 3. Upgrade completo
apk upgrade --available

# 4. Atualizar kernel e initramfs
apk add -u linux-lts
update-kernel /boot/vmlinuz-lts

# 5. Verificar pacotes órfãos
apk audit

# 6. Reboot
reboot`}
      />

      <h2>3. Rollback: se algo quebrou</h2>
      <CodeBlock
        code={`# Rollback de versão (voltar para 3.23):
# 1. Trocar repositórios de volta
sed -i 's/v3\\.24/v3.23/g' /etc/apk/repositories
apk update

# 2. Downgrade dos pacotes
apk upgrade --available

# 3. Restaurar kernel anterior
apk add linux-lts=3.23.x-rX

# ⚠️  Rollback nem sempre é limpo — configs podem ter mudado.
#     Se der problema: restaure o backup pré-upgrade.`}
      />

      <h2>4. Política de versões do Alpine</h2>
      <CodeBlock
        code={`# Ciclo de vida (aproximado):
# v3.24  → lançada jun/2026, EOL ~jun/2028 (~2 anos)
# v3.23  → lançada dez/2025, EOL ~dez/2027
# v3.22  → lançada jun/2025, EOL ~jun/2027

# Patch releases (3.24.0 → 3.24.1 → 3.24.2):
# - A cada ~2 meses
# - Só correções de segurança e bugs críticos
# - Upgrade seguro e recomendado

# Edge (rolling release):
# - Atualizada continuamente
# - Para dev/desktop, NÃO para produção
# - Pode quebrar a qualquer momento`}
      />

      <h2>5. Após o upgrade: checklist</h2>
      <CodeBlock
        code={`# 1. Versão correta?
cat /etc/alpine-release
uname -r

# 2. Serviços rodando?
rc-status
rc-service nginx status
rc-service sshd status

# 3. Portas ouvindo?
ss -tlnp

# 4. Discos montados?
df -h
mount | grep "^/dev"

# 5. Pacotes órfãos ou quebrados?
apk audit
apk fix

# 6. Logs de erro?
dmesg | grep -i error | tail -10
tail -50 /var/log/messages`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk update && apk upgrade</code> — diário, seguro</li>
          <li>Release upgrade: troque repositórios + <code>apk upgrade --available</code></li>
          <li><strong>Sempre faça backup</strong> antes de upgrade de versão</li>
          <li>Rollback: reverta repositórios + downgrade (nem sempre limpo)</li>
          <li>Ciclo de vida: ~2 anos por versão estável</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}