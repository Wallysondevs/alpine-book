import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Awall() {
  return (
    <PageContainer
      title="Firewall — awall (Alpine Wall)"
      subtitle="O firewall nativo do Alpine: políticas declarativas, awall enable, tradução para iptables/nftables."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Rede configurada e funcionando. Acesso root. Conhecimento básico de
        portas TCP/UDP. Awall é específico do Alpine — não existe em outras distros.
      </AlertBox>

      <p>
        O Alpine criou seu próprio gerenciador de firewall: o{" "}
        <strong>awall</strong> (Alpine Wall). Ele usa arquivos JSON declarativos
        e traduz para iptables ou nftables. A ideia é simples: você declara{" "}
        <em>o que quer</em> (abrir porta 80, liberar SSH), e o awall gera
        as regras. Sem iptables -A -p tcp --dport.
      </p>

      <h2>1. Instalação e conceitos</h2>
      <CodeBlock
        code={`# Instalar awall (não vem por padrão)
apk add awall

# Conceitos:
# Policy  → arquivo JSON em /etc/awall/optional/ que declara regras
# Enable  → ativar uma policy (awall enable nome)
# Translate → gerar regras de iptables/nftables a partir das policies
# Activate  → aplicar as regras no kernel

# awall suporta dois backends:
# iptables  (padrão, mais estável)
# nftables  (moderno, mais rápido)`}
      />

      <h2>2. Primeiro firewall: liberar SSH + Web</h2>
      <CodeBlock
        code={`# Criar policy /etc/awall/optional/servidor-web.json
cat > /etc/awall/optional/servidor-web.json << 'EOF'
{
  "description": "Servidor web com SSH",
  "filter": [
    {
      "in": "internet",
      "out": "_fw",
      "service": ["ssh", "http", "https"],
      "action": "accept"
    }
  ]
}
EOF

# Ativar a policy
awall enable servidor-web

# Traduzir para iptables
awall translate

# Aplicar
awall activate

# Verificar regras aplicadas
iptables -L -n`}
      />

      <p>
        Os serviços (<code>ssh</code>, <code>http</code>, <code>https</code>)
        são pré-definidos em <code>/usr/share/awall/services/</code>. Você
        pode listar todos:
      </p>
      <CodeBlock
        code={`# Listar serviços disponíveis
ls /usr/share/awall/services/
# dns.json  http.json  https.json  mysql.json  ntp.json
# postgresql.json  smtp.json  ssh.json  ...

# Ver definição de um serviço
cat /usr/share/awall/services/ssh.json`}
      />

      <h2>3. Políticas comuns</h2>
      <CodeBlock
        title="Servidor web com banco local"
        code={`{
  "description": "Web + banco interno",
  "filter": [
    {
      "in": "internet",
      "out": "_fw",
      "service": ["ssh", "http", "https"],
      "action": "accept"
    },
    {
      "in": "_fw",
      "out": "_fw",
      "service": ["postgresql"],
      "action": "accept",
      "src": "127.0.0.1"
    }
  ]
}`}
      />

      <CodeBlock
        title="VPN + porta customizada"
        code={`{
  "description": "WireGuard + app na porta 8080",
  "filter": [
    {
      "in": "internet",
      "out": "_fw",
      "service": ["ssh", "wireguard"],
      "action": "accept"
    },
    {
      "in": "internet",
      "out": "_fw",
      "port": "8080",
      "proto": "tcp",
      "action": "accept"
    }
  ]
}`}
      />

      <h2>4. awall list, disable, reset</h2>
      <CodeBlock
        code={`# Listar policies ativas
awall list

# Desativar uma policy
awall disable servidor-web

# Ver o que seria traduzido (dry-run)
awall translate --dry-run

# Remover TODAS as regras (abrir tudo — emergência!)
awall deactivate

# Reaplicar config atual
awall activate`}
      />

      <h2>5. Zonas e redes</h2>
      <CodeBlock
        title="Definindo zonas customizadas"
        code={`# /etc/awall/private/custom-zones.json
{
  "zone": {
    "internet": { "iface": "eth0" },
    "lan": { "iface": "eth1" }
  }
}

# Agora você pode usar "lan" como source/dest nas policies
{
  "filter": [
    {
      "in": "lan",
      "out": "_fw",
      "service": ["ssh", "postgresql"],
      "action": "accept"
    }
  ]
}`}
      />

      <h2>6. Awall com nftables (backend moderno)</h2>
      <CodeBlock
        code={`# Mudar para nftables
apk add nftables
awall translate --backend nftables
awall activate

# Ver regras nftables
nft list ruleset`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add awall</code> — instala o firewall do Alpine</li>
          <li>Crie JSON em <code>/etc/awall/optional/</code></li>
          <li><code>awall enable nome</code> → <code>awall translate</code> → <code>awall activate</code></li>
          <li>Serviços pré-definidos: ssh, http, https, dns, postgresql, etc.</li>
          <li><code>awall list</code>, <code>awall disable</code>, <code>awall deactivate</code></li>
          <li>Backend: iptables (padrão) ou nftables (moderno)</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}