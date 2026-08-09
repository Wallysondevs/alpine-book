import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Mariadb() {
  return (
    <PageContainer
      title="MariaDB — Banco de Dados"
      subtitle="Instale, configure, crie usuários e bancos, backup e tuning básico no Alpine."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine com pelo menos 512 MB de RAM (1 GB recomendado). MariaDB é leve
        mas precisa de memória para dados e índices.
      </AlertBox>

      <p>
        MariaDB é o fork comunitário do MySQL, mantido pelo criador original.
        O Alpine tem pacotes oficiais no community — instalação rápida, serviço
        OpenRC, e configuração familiar para quem já usou MySQL.
      </p>

      <h2>1. Instalação e inicialização</h2>
      <CodeBlock
        code={`# Instalar MariaDB
apk add mariadb mariadb-client

# Inicializar o banco (cria as tabelas do sistema)
mariadb-install-db --user=mysql --datadir=/var/lib/mysql

# Iniciar serviço
rc-update add mariadb
rc-service mariadb start

# Configurar senha root (IMPORTANTE!)
mariadb-secure-installation
# Responda:
# - Enter current password: (vazio, primeiro acesso)
# - Set root password? Y → defina senha forte
# - Remove anonymous users? Y
# - Disallow root login remotely? Y
# - Remove test database? Y
# - Reload privilege tables? Y`}
      />

      <h2>2. Primeiros comandos SQL</h2>
      <Terminal
        title="Criando banco e usuário"
        lines={[
          { type: "cmd", text: "mariadb -u root -p" },
          { type: "out", text: "Enter password: ********" },
          { type: "out", text: "MariaDB [(none)]>" },
          { type: "cmd", text: "CREATE DATABASE meusite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" },
          { type: "out", text: "Query OK" },
          { type: "cmd", text: "CREATE USER 'meusite'@'localhost' IDENTIFIED BY 'senha-forte';" },
          { type: "out", text: "Query OK" },
          { type: "cmd", text: "GRANT ALL PRIVILEGES ON meusite.* TO 'meusite'@'localhost';" },
          { type: "out", text: "Query OK" },
          { type: "cmd", text: "FLUSH PRIVILEGES;" },
          { type: "out", text: "Query OK" },
          { type: "cmd", text: "exit" },
        ]}
      />

      <h2>3. Configuração essencial</h2>
      <CodeBlock
        title="/etc/my.cnf.d/mariadb-server.cnf — ajustes"
        code={`[mysqld]
# Tamanho do buffer InnoDB (~50% da RAM disponível)
innodb_buffer_pool_size = 512M

# Log de consultas lentas (> 2 segundos)
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Conexões máximas
max_connections = 50

# Character set padrão
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Tamanho máximo de pacote (para imports grandes)
max_allowed_packet = 64M`}
      />

      <h2>4. Backup e restauração</h2>
      <CodeBlock
        code={`# BACKUP de um banco
mariadb-dump -u root -p meusite > meusite-backup.sql

# Backup de TODOS os bancos
mariadb-dump -u root -p --all-databases > all-backup.sql

# Backup com compressão
mariadb-dump -u root -p meusite | gzip > meusite-backup.sql.gz

# RESTAURAÇÃO
mariadb -u root -p meusite < meusite-backup.sql

# De arquivo comprimido
gunzip < meusite-backup.sql.gz | mariadb -u root -p meusite

# Script de backup diário
cat > /etc/periodic/daily/mariadb-backup << 'SCRIPT'
#!/bin/sh
BACKUP_DIR="/backup/mariadb"
mkdir -p "$BACKUP_DIR"
mariadb-dump --all-databases | gzip > "$BACKUP_DIR/backup-$(date +%Y%m%d).sql.gz"
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
SCRIPT
chmod +x /etc/periodic/daily/mariadb-backup`}
      />

      <h2>5. Tuning rápido</h2>
      <CodeBlock
        code={`# Verificar status do servidor
mariadb -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
mariadb -u root -p -e "SHOW PROCESSLIST;"

# Ver tamanho dos bancos
mariadb -u root -p -e "
  SELECT table_schema AS 'Banco',
         ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'MB'
  FROM information_schema.tables
  GROUP BY table_schema;"

# Otimizar tabelas
mariadb-check -u root -p --auto-repair --optimize --all-databases`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add mariadb mariadb-client</code> — instalação</li>
          <li><code>mariadb-install-db + mariadb-secure-installation</code> — setup</li>
          <li><code>CREATE DATABASE / CREATE USER / GRANT</code> — SQL básico</li>
          <li><code>mariadb-dump</code> — backup; <code>mariadb &lt; file.sql</code> — restore</li>
          <li><code>innodb_buffer_pool_size</code> — tuning principal</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}