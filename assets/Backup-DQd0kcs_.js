import{j as e}from"./index-YFyZeUD9.js";import{P as r,A as s,C as a}from"./AlertBox-C2CyWd7R.js";function o(){return e.jsxs(r,{title:"Backup — Estratégias de Cópia de Segurança",subtitle:"tar, rsync, restic, cron — monte uma estratégia de backup completa no Alpine.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Alpine em produção. Backup não é opcional — é a última linha de defesa."}),e.jsx("p",{children:"Existem dois tipos de pessoas: as que fazem backup e as que ainda vão perder dados. O Alpine oferece todas as ferramentas para montar uma estratégia de backup robusta — do tar simples ao restic com snapshots."}),e.jsx("h2",{children:"1. Regra 3-2-1"}),e.jsx(a,{code:`# A regra de ouro dos backups:
# 3 cópias dos dados
# 2 mídias diferentes (disco local + remoto)
# 1 cópia offsite (fora do local físico)

# Exemplo:
# 1. Servidor (dados originais)
# 2. HD externo conectado (backup local rápido)
# 3. Servidor remoto / cloud (backup offsite)`}),e.jsx("h2",{children:"2. tar: backup simples"}),e.jsx(a,{code:`# Backup de diretórios essenciais
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
chmod +x /etc/periodic/daily/backup`}),e.jsx("h2",{children:"3. rsync: sincronização eficiente"}),e.jsx(a,{code:`# Rsync local
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
    /var/www/ /backup/hoje/`}),e.jsx("h2",{children:"4. restic: backup moderno com snapshots"}),e.jsx(a,{code:`# restic — backup criptografado, deduplicado, com snapshots
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
restic -r sftp:user@servidor:/backup/restic backup /etc`}),e.jsx("h2",{children:"5. Script de backup completo"}),e.jsx(a,{title:"/usr/local/bin/backup-full.sh",code:`#!/bin/sh
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

echo "✅ Backup concluído: $BACKUP_DIR"`}),e.jsx(s,{type:"warning",title:"Backup não testado = backup que não existe",children:"Restaure em um ambiente de teste periodicamente. Um backup que você nunca testou pode estar corrompido — e você só descobre na emergência."}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:"Regra 3-2-1: 3 cópias, 2 mídias, 1 offsite"}),e.jsxs("li",{children:[e.jsx("code",{children:"tar"})," para backups simples e pontuais"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rsync"})," para sincronização eficiente"]}),e.jsxs("li",{children:[e.jsx("code",{children:"restic"})," para snapshots criptografados com deduplicação"]}),e.jsxs("li",{children:["Automatize com ",e.jsx("code",{children:"/etc/periodic/"})," e cron"]}),e.jsx("li",{children:e.jsx("strong",{children:"Teste a restauração periodicamente"})})]})})]})}export{o as default};
