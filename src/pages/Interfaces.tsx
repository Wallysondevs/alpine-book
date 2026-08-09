import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Interfaces() {
  return (
    <PageContainer
      title="Configuração de Rede — interfaces"
      subtitle="/etc/network/interfaces no Alpine: DHCP, IP fixo, VLAN, bridge, Wi-Fi — tudo pelo arquivo de config."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Entenda IP, máscara, gateway e DNS (capítulo anterior). Acesso root.
      </AlertBox>

      <p>
        O Alpine configura rede pelo arquivo <code>/etc/network/interfaces</code>{" "}
        — o mesmo formato do Debian, mas mais enxuto. Nada de NetworkManager,
        systemd-networkd ou netplan. Um arquivo, um serviço OpenRC, e pronto.
      </p>

      <h2>1. O arquivo /etc/network/interfaces</h2>
      <Terminal
        title="Configuração típica (DHCP)"
        lines={[
          { type: "cmd", text: "cat /etc/network/interfaces" },
          { type: "out", text: "auto lo" },
          { type: "out", text: "iface lo inet loopback" },
          { type: "out", text: "" },
          { type: "out", text: "auto eth0" },
          { type: "out", text: "iface eth0 inet dhcp" },
        ]}
      />

      <CodeBlock
        title="Sintaxe básica"
        code={`# auto eth0      → ativa a interface no boot
# iface eth0 inet → configura IPv4 (inet6 para IPv6)
# dhcp            → pega IP automaticamente
# static          → IP fixo (você define)

# Aplicar mudanças sem reboot:
rc-service networking restart`}
      />

      <h2>2. IP estático</h2>
      <CodeBlock
        code={`# /etc/network/interfaces — IP fixo
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1

# Com DNS (editar /etc/resolv.conf separadamente)
echo "nameserver 1.1.1.1" > /etc/resolv.conf
echo "nameserver 8.8.8.8" >> /etc/resolv.conf

# Notação CIDR (alternativa ao netmask)
iface eth0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1`}
      />

      <h2>3. Múltiplas interfaces</h2>
      <CodeBlock
        code={`# Servidor com duas redes: interna + externa
auto lo
iface lo inet loopback

# Rede externa (DHCP do provedor)
auto eth0
iface eth0 inet dhcp

# Rede interna (IP fixo)
auto eth1
iface eth1 inet static
    address 10.0.0.1/24`}
      />

      <h2>4. VLAN, bridge e bonding</h2>
      <CodeBlock
        code={`# VLAN (tag 100 na eth0)
auto eth0.100
iface eth0.100 inet static
    address 10.0.100.1/24

# Bridge (para VMs/containers)
auto br0
iface br0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1
    bridge-ports eth0
    bridge-stp off

# Bonding (agregação de links)
auto bond0
iface bond0 inet static
    address 10.0.0.10/24
    bond-slaves eth0 eth1
    bond-mode 802.3ad
    bond-miimon 100`}
      />

      <h2>5. Wi-Fi com wpa_supplicant</h2>
      <CodeBlock
        code={`# 1. Instalar ferramentas
apk add wpa_supplicant wireless-tools

# 2. Configurar /etc/network/interfaces
auto wlan0
iface wlan0 inet dhcp
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

# 3. Configurar Wi-Fi
cat > /etc/wpa_supplicant/wpa_supplicant.conf << 'EOF'
network={
    ssid="MinhaRede"
    psk="minha-senha"
}
EOF

# 4. Reiniciar rede
rc-service networking restart`}
      />

      <h2>6. /etc/resolv.conf e resolvconf</h2>
      <CodeBlock
        code={`# DNS manual (simples)
echo "nameserver 1.1.1.1" > /etc/resolv.conf

# resolvconf (gerencia DNS automaticamente)
apk add resolvconf
rc-update add resolvconf
# Agora as configs de DNS vêm do DHCP automaticamente.

# Ver os servidores DNS ativos
cat /etc/resolv.conf
# nameserver 192.168.1.1   (via DHCP)
# nameserver 1.1.1.1       (backup manual)`}
      />

      <h2>7. Troubleshooting de rede</h2>
      <CodeBlock
        title="Serviço networking travou?"
        code={`# Status do serviço
rc-service networking status

# Reiniciar (cuidado: derruba a rede!)
rc-service networking restart

# Log de rede
dmesg | grep eth
cat /var/log/messages | grep networking

# Testar config sem aplicar
ifup -n eth0          # dry-run

# interfaces com erro de sintaxe: edite manualmente
# /etc/network/interfaces e rode:
/etc/init.d/networking --quiet restart`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>Configuração em <code>/etc/network/interfaces</code></li>
          <li><code>dhcp</code> para automático, <code>static</code> para IP fixo</li>
          <li><code>rc-service networking restart</code> para aplicar</li>
          <li>VLAN, bridge e bonding via keywords no mesmo arquivo</li>
          <li>Wi-Fi: <code>wpa_supplicant</code> + entrada no interfaces</li>
          <li>DNS: <code>/etc/resolv.conf</code> manual ou <code>resolvconf</code> automático</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}