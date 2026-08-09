import{j as e}from"./index-YFyZeUD9.js";import{P as o,A as s,C as a}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(o,{title:"Segurança Básica",subtitle:"Firewall, SSH hardening, atualizações, doas e as boas práticas que protegem um servidor Alpine.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Alpine em produção (VPS, servidor físico). Não espere até ser comprometido para pensar em segurança."}),e.jsx("p",{children:"O Alpine já é mais seguro que a média por natureza: menos software = menos superfície de ataque. Mas segurança não é automática. Este capítulo reúne as medidas essenciais que todo servidor Alpine deve ter."}),e.jsx("h2",{children:"1. Atualizações: sua primeira linha de defesa"}),e.jsx(a,{code:`# Atualizar diariamente (automatize!)
echo '0 3 * * * apk update && apk upgrade -q' | crontab -

# Verificar updates disponíveis sem instalar
apk update && apk upgrade -s

# Inscrever-se em alertas de segurança Alpine
# https://security.alpinelinux.org/
# RSS/Atom: https://secdb.alpinelinux.org/atom.xml`}),e.jsx("h2",{children:"2. Firewall: feche tudo, abra só o necessário"}),e.jsx(a,{code:`# Ver regras atuais
iptables -L -n

# Bloquear tudo que não é explicitamente liberado
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Liberar tráfego local
iptables -A INPUT -i lo -j ACCEPT

# Liberar conexões já estabelecidas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Liberar SSH (porta 22 ou customizada)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Liberar HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Salvar regras
/etc/init.d/iptables save
rc-update add iptables`}),e.jsx("h2",{children:"3. SSH: hardening obrigatório"}),e.jsx(a,{code:`# /etc/ssh/sshd_config — ajustes críticos

PermitRootLogin no               # NUNCA permita root
PasswordAuthentication no         # só chave SSH
PubkeyAuthentication yes
MaxAuthTries 3                    # 3 tentativas, depois bloqueia
ClientAliveInterval 300           # desconecta inativos (5 min)
ClientAliveCountMax 2             # ...após 2 tentativas
AllowUsers wallyson               # whitelist de usuários
Port 2222                         # porta não padrão

# Aplicar:
rc-service sshd restart`}),e.jsx("h2",{children:"4. doas: privilégios mínimos"}),e.jsx(a,{code:`# Princípio do menor privilégio: cada usuário pode fazer só o necessário

# /etc/doas.d/doas.conf
permit persist :wheel as root                    # admins podem tudo
permit nopass deploy as root cmd rc-service     # deploy só reinicia
permit nopass backup as root cmd tar             # backup só empacota
deny :wheel as root cmd reboot shutdown         # ninguém desliga

# Auditar uso do doas
grep doas /var/log/messages`}),e.jsx("h2",{children:"5. Serviços: rode só o essencial"}),e.jsx(a,{code:`# Liste TUDO que está rodando
rc-status

# Remova o que não usa
rc-update del bluetooth    # (provavelmente não existe no Alpine)
rc-update del avahi-daemon

# Serviços mínimos para um servidor web:
# sshd, nginx, php-fpm, mariadb, crond, chronyd

# Verificar portas abertas
ss -tlnp
# Cada porta é um risco. Feche o que não usa.`}),e.jsx("h2",{children:"6. Fail2ban: bloquear ataques de força bruta"}),e.jsx(a,{code:`apk add fail2ban

# Configurar proteção SSH
cat > /etc/fail2ban/jail.local << 'EOF'
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 3600
findtime = 600
EOF

rc-update add fail2ban
rc-service fail2ban start

# Ver IPs banidos
fail2ban-client status sshd`}),e.jsx("h2",{children:"7. Checklist de segurança"}),e.jsx(a,{code:`# ✅ Rode este checklist no seu servidor:

[ ] apk update && apk upgrade — sistema atualizado
[ ] iptables ativo com política DROP como padrão
[ ] SSH: PermitRootLogin no, PasswordAuthentication no
[ ] doas configurado, ninguém loga como root
[ ] Serviços mínimos rodando (rc-status)
[ ] fail2ban protegendo SSH
[ ] /tmp montado com noexec,nosuid
[ ] Senhas fortes (nunca "admin", "123456", "password")
[ ] Backups automáticos e testados`}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:"Atualize diariamente (cron)"}),e.jsx("li",{children:"Firewall com política DROP; abra só o necessário"}),e.jsx("li",{children:"SSH: sem root, sem senha, porta customizada"}),e.jsx("li",{children:"doas com privilégios mínimos por usuário"}),e.jsx("li",{children:"Serviços: menos é mais seguro"}),e.jsx("li",{children:"fail2ban para bloquear scanners"})]})})]})}export{t as default};
