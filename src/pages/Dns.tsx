import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Dns() {
  return (
    <PageContainer
      title="DNS — Resolução de Nomes"
      subtitle="/etc/resolv.conf, dig, nslookup, dnsmasq, unbound — configure e diagnostique DNS no Alpine."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Rede funcionando. Se você não consegue resolver nomes, este capítulo
        vai diagnosticar e resolver.
      </AlertBox>

      <p>
        DNS é o catálogo telefônico da internet: traduz nomes (google.com) em
        IPs (142.250.80.46). Quando quebra, parece que a internet caiu. Vamos
        dominar DNS no Alpine — da configuração básica ao cache local.
      </p>

      <h2>1. /etc/resolv.conf: o arquivo que manda</h2>
      <CodeBlock
        code={`# Configuração mínima
cat /etc/resolv.conf
# nameserver 1.1.1.1      ← Cloudflare (rápido, privacidade)
# nameserver 8.8.8.8      ← Google (fallback)

# Opções extras:
# options timeout:1        ← timeout de 1 segundo
# options attempts:2       ← tenta 2 vezes
# options rotate           ← alterna entre servidores

# Testar resolução imediata
ping -c 1 google.com`}
      />

      <AlertBox type="warning" title="resolv.conf pode ser sobrescrito">
        Se você usa DHCP, o <code>resolvconf</code> pode reescrever este
        arquivo. Para travar: <code>chattr +i /etc/resolv.conf</code> (imutável)
        ou configure o DNS fixo no <code>/etc/network/interfaces</code>.
      </AlertBox>

      <h2>2. dig e nslookup: diagnosticando DNS</h2>
      <Terminal
        title="Consultas DNS com dig"
        lines={[
          { type: "cmd", text: "apk add bind-tools" },
          { type: "cmd", text: "dig google.com" },
          { type: "out", text: ";ANSWER SECTION:" },
          { type: "out", text: "google.com.  300  IN  A  142.250.80.46" },
          { type: "cmd", text: "dig +short google.com" },
          { type: "out", text: "142.250.80.46" },
        ]}
      />

      <CodeBlock
        code={`# dig — consultas específicas
dig +short google.com            # só o IP
dig MX google.com                # servidores de email
dig NS google.com                # servidores DNS do domínio
dig -x 8.8.8.8                   # reverso (IP → nome)
dig @1.1.1.1 google.com          # consultar servidor específico

# nslookup — mais simples, interativo
nslookup google.com
nslookup google.com 1.1.1.1      # servidor específico`}
      />

      <h2>3. host: consulta rápida</h2>
      <CodeBlock
        code={`# host — direto ao ponto
host google.com
# google.com has address 142.250.80.46
# google.com mail is handled by 10 smtp.google.com.

host 8.8.8.8
# 8.8.8.8.in-addr.arpa domain name pointer dns.google.`}
      />

      <h2>4. dnsmasq: cache DNS local</h2>
      <p>
        Um cache DNS local acelera consultas repetidas e reduz tráfego. O
        dnsmasq é leve e já faz DHCP também:
      </p>
      <CodeBlock
        code={`# Instalar
apk add dnsmasq

# Configurar cache local
echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "server=8.8.8.8" >> /etc/dnsmasq.conf
echo "cache-size=500" >> /etc/dnsmasq.conf

# Iniciar
rc-update add dnsmasq
rc-service dnsmasq start

# Configurar sistema para usar o cache local
echo "nameserver 127.0.0.1" > /etc/resolv.conf

# Testar: a primeira consulta é lenta, a segunda é instantânea
dig google.com    # ~30ms (vai à internet)
dig google.com    # ~0ms (cache local)`}
      />

      <h2>5. unbound: resolver recursivo completo</h2>
      <p>
        Enquanto o dnsmasq encaminha para um servidor (1.1.1.1), o unbound
        resolve sozinho, consultando os servidores raiz. Mais privacidade:
      </p>
      <CodeBlock
        code={`apk add unbound

# Configuração mínima: /etc/unbound/unbound.conf
cat >> /etc/unbound/unbound.conf << 'EOF'
server:
    interface: 127.0.0.1
    access-control: 127.0.0.0/8 allow
    do-ip4: yes
    do-ip6: no
    do-udp: yes
    do-tcp: yes
EOF

rc-update add unbound
rc-service unbound start

# Usar:
echo "nameserver 127.0.0.1" > /etc/resolv.conf`}
      />

      <h2>6. Diagnóstico: por que o nome não resolve?</h2>
      <CodeBlock
        code={`# Checklist quando o DNS falha:

# 1. /etc/resolv.conf existe e tem nameservers?
cat /etc/resolv.conf

# 2. O nameserver está acessível?
ping -c 1 1.1.1.1

# 3. A porta 53 (DNS) está aberta no firewall?
dig @1.1.1.1 google.com

# 4. Resolve por IP mas não por nome?
# → 100% problema de DNS

# 5. /etc/nsswitch.conf está correto?
grep hosts /etc/nsswitch.conf
# hosts: files dns   ← deve ter 'dns'

# 6. Arquivo /etc/hosts está bloqueando?
grep google.com /etc/hosts`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>/etc/resolv.conf</code> — lista de servidores DNS</li>
          <li><code>dig +short</code> — diagnóstico rápido de DNS</li>
          <li><code>dnsmasq</code> — cache local (~200 KB, recomendado)</li>
          <li><code>unbound</code> — resolver recursivo completo (~2 MB)</li>
          <li>Se resolve IP mas não nome: o problema é DNS</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}