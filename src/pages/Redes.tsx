import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Redes() {
  return (
    <PageContainer
      title="Fundamentos de Rede"
      subtitle="ip, ss, ping, traceroute — entenda IP, máscara, gateway e DNS no Alpine."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine com rede funcionando. Se você está sem internet, resolva isso
        primeiro — este capítulo é para entender, não para emergências.
      </AlertBox>

      <p>
        Rede no Linux é um ecossistema de ferramentas que evoluiu ao longo de
        décadas. O Alpine mantém o essencial: <code>ip</code> (moderno, parte do
        iproute2), <code>ss</code> (substituto do netstat), <code>ping</code> e{" "}
        <code>traceroute</code>. Sem systemd-networkd, sem NetworkManager. Apenas
        o que funciona.
      </p>

      <h2>1. Conceitos: IP, máscara, gateway, DNS</h2>
      <CodeBlock
        code={`# Seu IP e máscara
ip addr show
# inet 192.168.1.100/24    ← IP 192.168.1.100, máscara /24 (255.255.255.0)

# Gateway (roteador padrão)
ip route show default
# default via 192.168.1.1 dev eth0

# DNS (servidor de nomes)
cat /etc/resolv.conf
# nameserver 1.1.1.1
# nameserver 8.8.8.8

# Hostname da máquina
hostname
# alpine-server`}
      />

      <h2>2. ip: a ferramenta moderna</h2>
      <Terminal
        title="Inspecionando interfaces com ip"
        lines={[
          { type: "cmd", text: "ip addr" },
          { type: "out", text: "1: lo: ... state UNKNOWN" },
          { type: "out", text: "    inet 127.0.0.1/8" },
          { type: "out", text: "2: eth0: ... state UP" },
          { type: "out", text: "    inet 192.168.1.100/24" },
          { type: "out", text: "    link/ether 00:11:22:33:44:55" },
        ]}
      />

      <CodeBlock
        code={`# Interfaces e endereços
ip addr show                    # todas as interfaces
ip addr show eth0               # uma interface específica
ip -br addr                     # resumo (brief)

# Rotas
ip route show                   # tabela de rotas
ip route show default           # gateway padrão
ip route get 8.8.8.8            # qual rota para este IP?

# Estatísticas
ip -s link                      # bytes/pacotes por interface
ip -s link show eth0

# Ativar/desativar interface
ip link set eth0 up
ip link set eth0 down`}
      />

      <AlertBox type="info" title="ip vs ifconfig">
        <code>ifconfig</code> é o comando antigo (pacote net-tools). O Alpine
        não instala por padrão — use <code>ip</code>, que é mais moderno e já
        vem no BusyBox. Se precisar do ifconfig: <code>apk add net-tools</code>.
      </AlertBox>

      <h2>3. ss: investigando conexões</h2>
      <Terminal
        title="Conexões ativas com ss"
        lines={[
          { type: "cmd", text: "ss -tlnp" },
          { type: "out", text: "State  Recv-Q Send-Q Local Address:Port  Peer Address:Port" },
          { type: "out", text: "LISTEN 0      128    0.0.0.0:22          0.0.0.0:*    (sshd)" },
          { type: "out", text: "LISTEN 0      128    [::]:22             [::]:*       (sshd)" },
        ]}
      />

      <CodeBlock
        code={`# ss — substitui netstat (mais rápido, mais limpo)
ss -tlnp          # TCP ouvindo (-t), listening (-l), numérico (-n), processo (-p)
ss -tlnp | grep :80     # quem está ouvindo na porta 80?
ss -an            # TODAS as conexões
ss -s             # sumário estatístico
ss -tp            # conexões TCP com processos

# netstat (se preferir o antigo)
apk add net-tools
netstat -tlnp     # mesmo resultado, sintaxe clássica`}
      />

      <h2>4. ping e traceroute: testando conectividade</h2>
      <CodeBlock
        code={`# PING — o host está vivo?
ping -c 4 8.8.8.8              # 4 pacotes, depois para
ping -c 4 google.com           # testa resolução DNS também

# Erros comuns de ping
# "Destination Host Unreachable" → sem gateway/rota
# "Network is unreachable" → interface down ou IP errado
# "Name or service not known" → DNS não funciona
# Sem resposta (100% packet loss) → firewall ou host offline

# TRACEROUTE — qual o caminho até o destino?
apk add traceroute
traceroute 8.8.8.8             # mostra cada salto (hop)
traceroute -n 8.8.8.8          # sem resolver nomes (mais rápido)

# MTR — traceroute contínuo
apk add mtr
mtr 8.8.8.8                    # interface interativa, mostra perda por hop`}
      />

      <h2>5. Diagnóstico rápido de rede</h2>
      <CodeBlock
        title="script diagnose-rede.sh"
        code={`#!/bin/sh
echo "=== INTERFACES ==="
ip -br addr
echo ""
echo "=== GATEWAY ==="
ip route show default
echo ""
echo "=== DNS ==="
cat /etc/resolv.conf
echo ""
echo "=== PING GATEWAY ==="
GATEWAY=$(ip route show default | awk '{print $3}')
ping -c 2 -W 1 "$GATEWAY" && echo "OK" || echo "FALHOU"
echo ""
echo "=== PING INTERNET ==="
ping -c 2 -W 1 8.8.8.8 && echo "OK" || echo "FALHOU"`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>ip addr</code> — seus IPs; <code>ip route</code> — rotas</li>
          <li><code>ss -tlnp</code> — quem está ouvindo em qual porta</li>
          <li><code>ping</code> — conectividade; <code>traceroute</code> — caminho</li>
          <li>Gateway = roteador padrão; DNS = tradutor nome→IP</li>
          <li>Prefira <code>ip</code> ao <code>ifconfig</code>; <code>ss</code> ao <code>netstat</code></li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}