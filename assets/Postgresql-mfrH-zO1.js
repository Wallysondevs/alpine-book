import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as o,A as t,C as s}from"./AlertBox-C2CyWd7R.js";function c(){return e.jsxs(o,{title:"PostgreSQL no Alpine",subtitle:"Instale, configure, crie bancos e usuários, pg_dump e tuning essencial.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx(t,{type:"info",title:"Pré-requisitos",children:"Alpine com pelo menos 512 MB de RAM. PostgreSQL está no repositório community. Se ainda não ativou o community, volte aos Primeiros Passos."}),e.jsx("p",{children:"PostgreSQL é o banco relacional mais avançado do mundo open source. No Alpine, a instalação é limpa e o serviço OpenRC funciona sem surpresas. Vamos do zero ao banco funcional em 10 minutos."}),e.jsx("h2",{children:"1. Instalação"}),e.jsx(s,{code:`# Instalar PostgreSQL
apk add postgresql17 postgresql17-client

# Inicializar o cluster (cria o diretório de dados)
rc-service postgresql setup
# Ou manualmente:
# su - postgres -c "initdb -D /var/lib/postgresql/17/data"

# Iniciar
rc-update add postgresql
rc-service postgresql start`}),e.jsx("h2",{children:"2. Criar banco e usuário"}),e.jsx(a,{title:"Setup inicial do PostgreSQL",lines:[{type:"comment",text:"# O PostgreSQL tem seu próprio usuário 'postgres'"},{type:"cmd",text:"su - postgres"},{type:"out",text:"postgres@alpine:~$"},{type:"cmd",text:"psql"},{type:"out",text:"postgres=#"},{type:"cmd",text:"CREATE USER meusite WITH PASSWORD 'senha-forte';"},{type:"out",text:"CREATE ROLE"},{type:"cmd",text:"CREATE DATABASE meusite OWNER meusite;"},{type:"out",text:"CREATE DATABASE"},{type:"cmd",text:"GRANT ALL PRIVILEGES ON DATABASE meusite TO meusite;"},{type:"out",text:"GRANT"},{type:"cmd",text:"\\q"},{type:"cmd",text:"exit"}]}),e.jsx("h2",{children:"3. Configuração de acesso"}),e.jsx(s,{title:"/var/lib/postgresql/17/data/pg_hba.conf",code:`# Permitir conexão local com senha
local   all             all                     scram-sha-256
host    all             all     127.0.0.1/32    scram-sha-256

# Permitir acesso de uma rede interna
host    all             all     10.0.0.0/24     scram-sha-256

# Aplicar:
rc-service postgresql reload`}),e.jsx(s,{title:"/var/lib/postgresql/17/data/postgresql.conf — escutar em todas interfaces",code:`# Descomente e mude:
listen_addresses = 'localhost, 10.0.0.1'   # ou '*' para todas

# Aplicar:
rc-service postgresql restart`}),e.jsx("h2",{children:"4. Comandos psql essenciais"}),e.jsx(s,{code:`# Conectar
psql -U meusite -d meusite

# Dentro do psql:
\\l            # listar bancos
\\du           # listar usuários
\\dt           # listar tabelas
\\d usuarios   # descrever tabela
\\q            # sair

# Executar SQL do terminal
psql -U meusite -d meusite -c "SELECT version();"
psql -U meusite -d meusite -f script.sql   # rodar arquivo SQL`}),e.jsx("h2",{children:"5. Backup e restauração"}),e.jsx(s,{code:`# BACKUP de um banco
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
chmod +x /etc/periodic/daily/pg-backup`}),e.jsx("h2",{children:"6. Tuning rápido"}),e.jsx(s,{code:`# /var/lib/postgresql/17/data/postgresql.conf

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
psql -U postgres -c "SHOW shared_buffers;"`}),e.jsx(t,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:e.jsx("code",{children:"apk add postgresql17 && rc-service postgresql setup"})}),e.jsxs("li",{children:[e.jsx("code",{children:"su - postgres → psql"})," para administrar"]}),e.jsx("li",{children:e.jsx("code",{children:"CREATE USER / CREATE DATABASE / GRANT"})}),e.jsxs("li",{children:[e.jsx("code",{children:"pg_hba.conf"})," controla quem acessa; ",e.jsx("code",{children:"postgresql.conf"})," tuning"]}),e.jsxs("li",{children:[e.jsx("code",{children:"pg_dump/pg_restore"})," para backup"]}),e.jsxs("li",{children:[e.jsx("code",{children:"shared_buffers"})," e ",e.jsx("code",{children:"work_mem"})," são os parâmetros principais"]})]})})]})}export{c as default};
