import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as a,A as o,C as t}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(a,{title:"Fundamentos de Rede",subtitle:"ip, ss, ping, traceroute — entenda IP, máscara, gateway e DNS no Alpine.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Alpine com rede funcionando. Se você está sem internet, resolva isso primeiro — este capítulo é para entender, não para emergências."}),e.jsxs("p",{children:["Rede no Linux é um ecossistema de ferramentas que evoluiu ao longo de décadas. O Alpine mantém o essencial: ",e.jsx("code",{children:"ip"})," (moderno, parte do iproute2), ",e.jsx("code",{children:"ss"})," (substituto do netstat), ",e.jsx("code",{children:"ping"})," e"," ",e.jsx("code",{children:"traceroute"}),". Sem systemd-networkd, sem NetworkManager. Apenas o que funciona."]}),e.jsx("h2",{children:"1. Conceitos: IP, máscara, gateway, DNS"}),e.jsx(t,{code:`# Seu IP e máscara
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
# alpine-server`}),e.jsx("h2",{children:"2. ip: a ferramenta moderna"}),e.jsx(s,{title:"Inspecionando interfaces com ip",lines:[{type:"cmd",text:"ip addr"},{type:"out",text:"1: lo: ... state UNKNOWN"},{type:"out",text:"    inet 127.0.0.1/8"},{type:"out",text:"2: eth0: ... state UP"},{type:"out",text:"    inet 192.168.1.100/24"},{type:"out",text:"    link/ether 00:11:22:33:44:55"}]}),e.jsx(t,{code:`# Interfaces e endereços
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
ip link set eth0 down`}),e.jsxs(o,{type:"info",title:"ip vs ifconfig",children:[e.jsx("code",{children:"ifconfig"})," é o comando antigo (pacote net-tools). O Alpine não instala por padrão — use ",e.jsx("code",{children:"ip"}),", que é mais moderno e já vem no BusyBox. Se precisar do ifconfig: ",e.jsx("code",{children:"apk add net-tools"}),"."]}),e.jsx("h2",{children:"3. ss: investigando conexões"}),e.jsx(s,{title:"Conexões ativas com ss",lines:[{type:"cmd",text:"ss -tlnp"},{type:"out",text:"State  Recv-Q Send-Q Local Address:Port  Peer Address:Port"},{type:"out",text:"LISTEN 0      128    0.0.0.0:22          0.0.0.0:*    (sshd)"},{type:"out",text:"LISTEN 0      128    [::]:22             [::]:*       (sshd)"}]}),e.jsx(t,{code:`# ss — substitui netstat (mais rápido, mais limpo)
ss -tlnp          # TCP ouvindo (-t), listening (-l), numérico (-n), processo (-p)
ss -tlnp | grep :80     # quem está ouvindo na porta 80?
ss -an            # TODAS as conexões
ss -s             # sumário estatístico
ss -tp            # conexões TCP com processos

# netstat (se preferir o antigo)
apk add net-tools
netstat -tlnp     # mesmo resultado, sintaxe clássica`}),e.jsx("h2",{children:"4. ping e traceroute: testando conectividade"}),e.jsx(t,{code:`# PING — o host está vivo?
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
mtr 8.8.8.8                    # interface interativa, mostra perda por hop`}),e.jsx("h2",{children:"5. Diagnóstico rápido de rede"}),e.jsx(t,{title:"script diagnose-rede.sh",code:`#!/bin/sh
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
ping -c 2 -W 1 8.8.8.8 && echo "OK" || echo "FALHOU"`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"ip addr"})," — seus IPs; ",e.jsx("code",{children:"ip route"})," — rotas"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ss -tlnp"})," — quem está ouvindo em qual porta"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ping"})," — conectividade; ",e.jsx("code",{children:"traceroute"})," — caminho"]}),e.jsx("li",{children:"Gateway = roteador padrão; DNS = tradutor nome→IP"}),e.jsxs("li",{children:["Prefira ",e.jsx("code",{children:"ip"})," ao ",e.jsx("code",{children:"ifconfig"}),"; ",e.jsx("code",{children:"ss"})," ao ",e.jsx("code",{children:"netstat"})]})]})})]})}export{n as default};
