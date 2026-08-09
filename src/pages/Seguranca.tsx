import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança Básica"
      subtitle="Firewall, SSH hardening, atualizações, doas e as boas práticas que protegem um servidor Alpine."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine em produção (VPS, servidor físico). Não espere até ser
        comprometido para pensar em segurança.
      </AlertBox>

      <p>
        O Alpine já é mais seguro que a média por natureza: menos software = menos
        superfície de ataque. Mas segurança não é automática. Este capítulo
        reúne as medidas essenciais que todo servidor Alpine deve ter.
      </p>

      <h2>1. Atualizações: sua primeira linha de defesa</h2>
      <CodeBlock
        code={`# Atualizar diariamente (automatize!)
echo '0 3 * * * apk update && apk upgrade -q' | crontab -

# Verificar updates disponíveis sem instalar
apk update && apk upgrade -s

# Inscrever-se em alertas de segurança Alpine
# https://security.alpinelinux.org/
# RSS/Atom: https://secdb.alpinelinux.org/atom.xml`}
      />

      <h2>2. Firewall: feche tudo, abra só o necessário</h2>
      <CodeBlock
        code={`# Ver regras atuais
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
rc-update add iptables`}
      />

      <h2>3. SSH: hardening obrigatório</h2>
      <CodeBlock
        code={`# /etc/ssh/sshd_config — ajustes críticos

PermitRootLogin no               # NUNCA permita root
PasswordAuthentication no         # só chave SSH
PubkeyAuthentication yes
MaxAuthTries 3                    # 3 tentativas, depois bloqueia
ClientAliveInterval 300           # desconecta inativos (5 min)
ClientAliveCountMax 2             # ...após 2 tentativas
AllowUsers wallyson               # whitelist de usuários
Port 2222                         # porta não padrão

# Aplicar:
rc-service sshd restart`}
      />

      <h2>4. doas: privilégios mínimos</h2>
      <CodeBlock
        code={`# Princípio do menor privilégio: cada usuário pode fazer só o necessário

# /etc/doas.d/doas.conf
permit persist :wheel as root                    # admins podem tudo
permit nopass deploy as root cmd rc-service     # deploy só reinicia
permit nopass backup as root cmd tar             # backup só empacota
deny :wheel as root cmd reboot shutdown         # ninguém desliga

# Auditar uso do doas
grep doas /var/log/messages`}
      />

      <h2>5. Serviços: rode só o essencial</h2>
      <CodeBlock
        code={`# Liste TUDO que está rodando
rc-status

# Remova o que não usa
rc-update del bluetooth    # (provavelmente não existe no Alpine)
rc-update del avahi-daemon

# Serviços mínimos para um servidor web:
# sshd, nginx, php-fpm, mariadb, crond, chronyd

# Verificar portas abertas
ss -tlnp
# Cada porta é um risco. Feche o que não usa.`}
      />

      <h2>6. Fail2ban: bloquear ataques de força bruta</h2>
      <CodeBlock
        code={`apk add fail2ban

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
fail2ban-client status sshd`}
      />

      <h2>7. Checklist de segurança</h2>
      <CodeBlock
        code={`# ✅ Rode este checklist no seu servidor:

[ ] apk update && apk upgrade — sistema atualizado
[ ] iptables ativo com política DROP como padrão
[ ] SSH: PermitRootLogin no, PasswordAuthentication no
[ ] doas configurado, ninguém loga como root
[ ] Serviços mínimos rodando (rc-status)
[ ] fail2ban protegendo SSH
[ ] /tmp montado com noexec,nosuid
[ ] Senhas fortes (nunca "admin", "123456", "password")
[ ] Backups automáticos e testados`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>Atualize diariamente (cron)</li>
          <li>Firewall com política DROP; abra só o necessário</li>
          <li>SSH: sem root, sem senha, porta customizada</li>
          <li>doas com privilégios mínimos por usuário</li>
          <li>Serviços: menos é mais seguro</li>
          <li>fail2ban para bloquear scanners</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}