import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Backup() {
  return (
    <PageContainer
      title="Backup — Estratégias de Cópia de Segurança"
      subtitle="tar, rsync, restic, cron — monte uma estratégia de backup completa no Alpine."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine em produção. Backup não é opcional — é a última linha de defesa.
      </AlertBox>

      <p>
        Existem dois tipos de pessoas: as que fazem backup e as que ainda vão
        perder dados. O Alpine oferece todas as ferramentas para montar uma
        estratégia de backup robusta — do tar simples ao restic com snapshots.
      </p>

      <h2>1. Regra 3-2-1</h2>
      <CodeBlock
        code={`# A regra de ouro dos backups:
# 3 cópias dos dados
# 2 mídias diferentes (disco local + remoto)
# 1 cópia offsite (fora do local físico)

# Exemplo:
# 1. Servidor (dados originais)
# 2. HD externo conectado (backup local rápido)
# 3. Servidor remoto / cloud (backup offsite)`}
      />

      <h2>2. tar: backup simples</h2>
      <CodeBlock
        code={`# Backup de diretórios essenciais
tar -czf /backup/sistema-$(date +%Y%m%d).tar.gz \\
    /etc /home /var/lib /var/log

# Backup de banco de dados + arquivos
mariadb-dump --all-databases | gzip > /backup/db-$(date +%Y%m%d).sql.gz
tar -czf /backup/dados-$(date +%Y%m%d).tar.gz /var/www /backup/db-*.sql.gz

# Automatizar (cron diário)
cat > /etc/periodic/daily/backup << 'SCRIPT'
#!/bin/sh
BACKUP=/backup/daily
mkdir -p "$BACKUP"
tar -czf "$BACKUP/etc-$(date +%Y%m%d).tar.gz" /etc 2>/dev/null
tar -czf "$BACKUP/www-$(date +%Y%m%d).tar.gz" /var/www 2>/dev/null
find "$BACKUP" -name "*.tar.gz" -mtime +7 -delete
SCRIPT
chmod +x /etc/periodic/daily/backup`}
      />

      <h2>3. rsync: sincronização eficiente</h2>
      <CodeBlock
        code={`# Rsync local
rsync -avz --delete /var/www/ /backup/www/

# Rsync remoto (via SSH)
rsync -avz --delete /var/www/ \\
    usuario@servidor-backup:/backup/www/

# Opções importantes:
# -a  = archive (preserva permissões, datas, symlinks)
# -v  = verbose
# -z  = compressão durante transferência
# -P  = progresso + resume parcial
# --delete = remove arquivos no destino que não existem na origem

# Backup incremental (hard links — eficiente em espaço)
rsync -avz --link-dest=/backup/ontem/ \\
    /var/www/ /backup/hoje/`}
      />

      <h2>4. restic: backup moderno com snapshots</h2>
      <CodeBlock
        code={`# restic — backup criptografado, deduplicado, com snapshots
apk add restic

# Inicializar repositório
restic init --repo /backup/restic
# Enter password: ******

# Backup
restic backup /etc /home /var/www --repo /backup/restic

# Listar snapshots
restic snapshots --repo /backup/restic

# Restaurar snapshot específico
restic restore latest --target /tmp/restore --repo /backup/restic

# Limpar snapshots antigos (política de retenção)
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 \\
    --repo /backup/restic

# Backup remoto (SFTP/S3)
restic -r sftp:user@servidor:/backup/restic backup /etc`}
      />

      <h2>5. Script de backup completo</h2>
      <CodeBlock
        title="/usr/local/bin/backup-full.sh"
        code={`#!/bin/sh
set -eu
BACKUP_DIR="/backup/$(date +%Y%m%d-%H%M)"
mkdir -p "$BACKUP_DIR"

echo "==> Backup de configurações..."
tar -czf "$BACKUP_DIR/etc.tar.gz" /etc

echo "==> Backup de bancos..."
pg_dumpall -U postgres | gzip > "$BACKUP_DIR/all-db.sql.gz"

echo "==> Backup de arquivos..."
rsync -avz /var/www/ "$BACKUP_DIR/www/"

echo "==> Backup no restic..."
restic backup /etc /var/www --repo /backup/restic

echo "==> Limpando backups antigos (7 dias)..."
find /backup -maxdepth 1 -type d -name "20*" -mtime +7 -exec rm -rf {} \\;

echo "✅ Backup concluído: $BACKUP_DIR"`}
      />

      <AlertBox type="warning" title="Backup não testado = backup que não existe">
        Restaure em um ambiente de teste periodicamente. Um backup que você
        nunca testou pode estar corrompido — e você só descobre na emergência.
      </AlertBox>

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>Regra 3-2-1: 3 cópias, 2 mídias, 1 offsite</li>
          <li><code>tar</code> para backups simples e pontuais</li>
          <li><code>rsync</code> para sincronização eficiente</li>
          <li><code>restic</code> para snapshots criptografados com deduplicação</li>
          <li>Automatize com <code>/etc/periodic/</code> e cron</li>
          <li><strong>Teste a restauração periodicamente</strong></li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}