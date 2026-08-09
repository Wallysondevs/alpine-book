import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Postgresql() {
  return (
    <PageContainer
      title="PostgreSQL no Alpine"
      subtitle="Instale, configure, crie bancos e usuários, pg_dump e tuning essencial."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine com pelo menos 512 MB de RAM. PostgreSQL está no repositório
        community. Se ainda não ativou o community, volte aos Primeiros Passos.
      </AlertBox>

      <p>
        PostgreSQL é o banco relacional mais avançado do mundo open source. No
        Alpine, a instalação é limpa e o serviço OpenRC funciona sem surpresas.
        Vamos do zero ao banco funcional em 10 minutos.
      </p>

      <h2>1. Instalação</h2>
      <CodeBlock
        code={`# Instalar PostgreSQL
apk add postgresql17 postgresql17-client

# Inicializar o cluster (cria o diretório de dados)
rc-service postgresql setup
# Ou manualmente:
# su - postgres -c "initdb -D /var/lib/postgresql/17/data"

# Iniciar
rc-update add postgresql
rc-service postgresql start`}
      />

      <h2>2. Criar banco e usuário</h2>
      <Terminal
        title="Setup inicial do PostgreSQL"
        lines={[
          { type: "comment", text: "# O PostgreSQL tem seu próprio usuário 'postgres'" },
          { type: "cmd", text: "su - postgres" },
          { type: "out", text: "postgres@alpine:~$" },
          { type: "cmd", text: "psql" },
          { type: "out", text: "postgres=#" },
          { type: "cmd", text: "CREATE USER meusite WITH PASSWORD 'senha-forte';" },
          { type: "out", text: "CREATE ROLE" },
          { type: "cmd", text: "CREATE DATABASE meusite OWNER meusite;" },
          { type: "out", text: "CREATE DATABASE" },
          { type: "cmd", text: "GRANT ALL PRIVILEGES ON DATABASE meusite TO meusite;" },
          { type: "out", text: "GRANT" },
          { type: "cmd", text: "\\q" },
          { type: "cmd", text: "exit" },
        ]}
      />

      <h2>3. Configuração de acesso</h2>
      <CodeBlock
        title="/var/lib/postgresql/17/data/pg_hba.conf"
        code={`# Permitir conexão local com senha
local   all             all                     scram-sha-256
host    all             all     127.0.0.1/32    scram-sha-256

# Permitir acesso de uma rede interna
host    all             all     10.0.0.0/24     scram-sha-256

# Aplicar:
rc-service postgresql reload`}
      />

      <CodeBlock
        title="/var/lib/postgresql/17/data/postgresql.conf — escutar em todas interfaces"
        code={`# Descomente e mude:
listen_addresses = 'localhost, 10.0.0.1'   # ou '*' para todas

# Aplicar:
rc-service postgresql restart`}
      />

      <h2>4. Comandos psql essenciais</h2>
      <CodeBlock
        code={`# Conectar
psql -U meusite -d meusite

# Dentro do psql:
\\l            # listar bancos
\\du           # listar usuários
\\dt           # listar tabelas
\\d usuarios   # descrever tabela
\\q            # sair

# Executar SQL do terminal
psql -U meusite -d meusite -c "SELECT version();"
psql -U meusite -d meusite -f script.sql   # rodar arquivo SQL`}
      />

      <h2>5. Backup e restauração</h2>
      <CodeBlock
        code={`# BACKUP de um banco
pg_dump -U meusite meusite > meusite-backup.sql

# Backup customizado (compressão, paralelo)
pg_dump -U meusite -Fc meusite > meusite-backup.dump

# Backup de TODOS os bancos
pg_dumpall -U postgres > all-backup.sql

# RESTAURAÇÃO
psql -U meusite -d meusite < meusite-backup.sql

# Restauração de dump customizado
pg_restore -U meusite -d meusite meusite-backup.dump

# Backup diário automático
cat > /etc/periodic/daily/pg-backup << 'SCRIPT'
#!/bin/sh
sudo -u postgres pg_dumpall | gzip > "/backup/pg/backup-$(date +%Y%m%d).sql.gz"
find /backup/pg -name "*.sql.gz" -mtime +7 -delete
SCRIPT
chmod +x /etc/periodic/daily/pg-backup`}
      />

      <h2>6. Tuning rápido</h2>
      <CodeBlock
        code={`# /var/lib/postgresql/17/data/postgresql.conf

# Memória compartilhada (~25% da RAM)
shared_buffers = 256MB

# Cache de plano de consulta
effective_cache_size = 1GB

# Memória para operações (sort, hash)
work_mem = 16MB
maintenance_work_mem = 128MB

# Autovacuum (deixe ligado!)
autovacuum = on

# Log de consultas lentas
log_min_duration_statement = 1000   # ms (1s)

# Conferir configurações aplicadas:
psql -U postgres -c "SHOW shared_buffers;"`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add postgresql17 && rc-service postgresql setup</code></li>
          <li><code>su - postgres → psql</code> para administrar</li>
          <li><code>CREATE USER / CREATE DATABASE / GRANT</code></li>
          <li><code>pg_hba.conf</code> controla quem acessa; <code>postgresql.conf</code> tuning</li>
          <li><code>pg_dump/pg_restore</code> para backup</li>
          <li><code>shared_buffers</code> e <code>work_mem</code> são os parâmetros principais</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}