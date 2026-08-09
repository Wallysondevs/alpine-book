import{j as e}from"./index-YFyZeUD9.js";import{P as s,A as r,C as a}from"./AlertBox-C2CyWd7R.js";function i(){return e.jsxs(s,{title:"Atualizações & Release Upgrade",subtitle:"Mantenha o Alpine atualizado: patches de segurança, upgrades entre versões e rollback.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx(r,{type:"info",title:"Pré-requisitos",children:"Alpine em produção. FAÇA BACKUP antes de qualquer upgrade de versão."}),e.jsxs("p",{children:["O Alpine tem um modelo de atualizações simples: ",e.jsx("strong",{children:"patch releases"})," ","(3.24.0 → 3.24.1) são seguras e automáticas; ",e.jsx("strong",{children:"release upgrades"})," ","(3.23 → 3.24) exigem cuidado e planejamento. Vamos ver os dois."]}),e.jsx("h2",{children:"1. Atualizações diárias (patch)"}),e.jsx(a,{code:`# Atualização segura (dentro da mesma versão 3.24.x)
apk update && apk upgrade

# Automatizar (cron diário)
echo '0 3 * * * apk update && apk upgrade -q && rc-service nginx reload' | crontab -

# Simular antes de aplicar
apk upgrade -s               # dry-run

# Ver changelog
apk info -vv alpine-base     # mostra histórico de versões

# Downgrade de pacote (se algo quebrou)
apk add pacote=3.24.0-r0     # versão específica anterior`}),e.jsx("h2",{children:"2. Release upgrade: 3.23 → 3.24"}),e.jsx(a,{code:`# ⚠️  BACKUP ANTES DE TUDO
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
reboot`}),e.jsx("h2",{children:"3. Rollback: se algo quebrou"}),e.jsx(a,{code:`# Rollback de versão (voltar para 3.23):
# 1. Trocar repositórios de volta
sed -i 's/v3\\.24/v3.23/g' /etc/apk/repositories
apk update

# 2. Downgrade dos pacotes
apk upgrade --available

# 3. Restaurar kernel anterior
apk add linux-lts=3.23.x-rX

# ⚠️  Rollback nem sempre é limpo — configs podem ter mudado.
#     Se der problema: restaure o backup pré-upgrade.`}),e.jsx("h2",{children:"4. Política de versões do Alpine"}),e.jsx(a,{code:`# Ciclo de vida (aproximado):
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
# - Pode quebrar a qualquer momento`}),e.jsx("h2",{children:"5. Após o upgrade: checklist"}),e.jsx(a,{code:`# 1. Versão correta?
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
tail -50 /var/log/messages`}),e.jsx(r,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk update && apk upgrade"})," — diário, seguro"]}),e.jsxs("li",{children:["Release upgrade: troque repositórios + ",e.jsx("code",{children:"apk upgrade --available"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sempre faça backup"})," antes de upgrade de versão"]}),e.jsx("li",{children:"Rollback: reverta repositórios + downgrade (nem sempre limpo)"}),e.jsx("li",{children:"Ciclo de vida: ~2 anos por versão estável"})]})})]})}export{i as default};
