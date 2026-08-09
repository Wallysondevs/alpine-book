import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Vpn() {
  return (
    <PageContainer
      title="VPN — WireGuard no Alpine"
      subtitle="WireGuard: instalação, configuração ponto-a-ponto, serviço OpenRC e cliente road-warrior."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Duas máquinas Alpine (ou Alpine + qualquer Linux) com rede. WireGuard
        é multi-plataforma: funciona também no Windows, Mac, Android e iOS.
      </AlertBox>

      <p>
        WireGuard é a VPN moderna: está no kernel Linux desde a versão 5.6,
        tem código mínimo (~4.000 linhas), é extremamente rápida e usa
        criptografia de ponta. O Alpine tem suporte completo — módulo no
        kernel e ferramentas no userspace.
      </p>

      <h2>1. Instalação</h2>
      <CodeBlock
        code={`# Instalar ferramentas (módulo já está no kernel Alpine)
apk add wireguard-tools

# Verificar se o módulo carrega
modprobe wireguard
lsmod | grep wireguard

# Instalar wg-quick (script auxiliar, opcional mas prático)
apk add wireguard-tools-wg-quick`}
      />

      <h2>2. Ponto-a-ponto: duas máquinas</h2>
      <CodeBlock
        code={`# === SERVIDOR (10.0.0.1) ===

# 1. Gerar chaves
wg genkey | tee /etc/wireguard/private.key | wg pubkey > /etc/wireguard/public.key
chmod 600 /etc/wireguard/private.key

# 2. Criar config: /etc/wireguard/wg0.conf
cat > /etc/wireguard/wg0.conf << 'EOF'
[Interface]
Address = 10.0.0.1/24
PrivateKey = <chave-privada-do-servidor>
ListenPort = 51820

[Peer]
PublicKey = <chave-publica-do-cliente>
AllowedIPs = 10.0.0.2/32
EOF

# === CLIENTE (10.0.0.2) ===

# Mesmos passos, config invertida:
[Interface]
Address = 10.0.0.2/24
PrivateKey = <chave-privada-do-cliente>

[Peer]
PublicKey = <chave-publica-do-servidor>
Endpoint = 192.168.1.100:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25`}
      />

      <h2>3. Subir a VPN</h2>
      <Terminal
        title="Ativando o túnel WireGuard"
        lines={[
          { type: "comment", text: "# Em AMBAS as máquinas:" },
          { type: "cmd", text: "wg-quick up wg0" },
          { type: "out", text: "[#] ip link add wg0 type wireguard" },
          { type: "out", text: "[#] wg setconf wg0 /etc/wireguard/wg0.conf" },
          { type: "out", text: "[#] ip addr add 10.0.0.1/24 dev wg0" },
          { type: "ok", text: "[#] ip link set wg0 up" },
          { type: "out", text: "" },
          { type: "cmd", text: "wg show" },
          { type: "out", text: "interface: wg0" },
          { type: "out", text: "  listening port: 51820" },
          { type: "out", text: "  peer: <chave>  endpoint: 192.168.1.200:51820" },
          { type: "out", text: "    latest handshake: 5 seconds ago" },
          { type: "out", text: "    transfer: 1.2 MiB received, 3.4 MiB sent" },
        ]}
      />

      <p>
        Testar: <code>ping 10.0.0.2</code> do servidor,{" "}
        <code>ping 10.0.0.1</code> do cliente. Se responder, a VPN está ativa.
      </p>

      <h2>4. Serviço OpenRC</h2>
      <CodeBlock
        code={`# Ativar no boot
rc-update add wg-quick
# O serviço procura por /etc/wireguard/wg0.conf e sobe automaticamente.

# Iniciar/parar manualmente
rc-service wg-quick start wg0
rc-service wg-quick stop wg0

# Para múltiplos túneis, crie wg1.conf, wg2.conf, etc.
# Todos sobem automaticamente com o serviço.`}
      />

      <h2>5. VPN road-warrior (clientes móveis)</h2>
      <CodeBlock
        title="Servidor para aceitar múltiplos clientes"
        code={`# /etc/wireguard/wg0.conf — servidor multi-cliente
[Interface]
Address = 10.0.0.1/24
PrivateKey = <chave-servidor>
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Cliente 1
[Peer]
PublicKey = <chave-cliente-1>
AllowedIPs = 10.0.0.2/32

# Cliente 2
[Peer]
PublicKey = <chave-cliente-2>
AllowedIPs = 10.0.0.3/32

# Habilitar roteamento no kernel
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p`}
      />

      <h2>6. Troubleshooting</h2>
      <CodeBlock
        code={`# Ver status do túnel
wg show
wg show wg0

# Handshake não acontece?
# → Porta 51820/UDP aberta no firewall?
# → Endpoint correto? (IP público do peer)
# → Chaves trocadas? (PrivateKey ↔ PublicKey do peer)

# Tunnel sobe mas não passa tráfego?
# → AllowedIPs no peer do outro lado inclui seu IP?
# → Rotas: ip route show | grep wg0

# Debug
echo "module wireguard +p" > /sys/kernel/debug/dynamic_debug/control
dmesg | grep wireguard

# Testar porta UDP (com nc)
nc -u 192.168.1.100 51820   # deve ficar esperando (aberto)
# Se recusar conexão: firewall ou porta errada`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add wireguard-tools</code> — instalação</li>
          <li><code>wg genkey</code> — gere chaves pública/privada</li>
          <li><code>/etc/wireguard/wg0.conf</code> — configuração do túnel</li>
          <li><code>wg-quick up wg0</code> — ativar; <code>wg show</code> — verificar</li>
          <li><code>rc-update add wg-quick</code> — ativar no boot</li>
          <li>Porta 51820/UDP + roteamento IP para road-warrior</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}