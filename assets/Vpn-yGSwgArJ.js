import{j as e,T as i}from"./index-YFyZeUD9.js";import{P as o,A as t,C as r}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(o,{title:"VPN — WireGuard no Alpine",subtitle:"WireGuard: instalação, configuração ponto-a-ponto, serviço OpenRC e cliente road-warrior.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx(t,{type:"info",title:"Pré-requisitos",children:"Duas máquinas Alpine (ou Alpine + qualquer Linux) com rede. WireGuard é multi-plataforma: funciona também no Windows, Mac, Android e iOS."}),e.jsx("p",{children:"WireGuard é a VPN moderna: está no kernel Linux desde a versão 5.6, tem código mínimo (~4.000 linhas), é extremamente rápida e usa criptografia de ponta. O Alpine tem suporte completo — módulo no kernel e ferramentas no userspace."}),e.jsx("h2",{children:"1. Instalação"}),e.jsx(r,{code:`# Instalar ferramentas (módulo já está no kernel Alpine)
apk add wireguard-tools

# Verificar se o módulo carrega
modprobe wireguard
lsmod | grep wireguard

# Instalar wg-quick (script auxiliar, opcional mas prático)
apk add wireguard-tools-wg-quick`}),e.jsx("h2",{children:"2. Ponto-a-ponto: duas máquinas"}),e.jsx(r,{code:`# === SERVIDOR (10.0.0.1) ===

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
PersistentKeepalive = 25`}),e.jsx("h2",{children:"3. Subir a VPN"}),e.jsx(i,{title:"Ativando o túnel WireGuard",lines:[{type:"comment",text:"# Em AMBAS as máquinas:"},{type:"cmd",text:"wg-quick up wg0"},{type:"out",text:"[#] ip link add wg0 type wireguard"},{type:"out",text:"[#] wg setconf wg0 /etc/wireguard/wg0.conf"},{type:"out",text:"[#] ip addr add 10.0.0.1/24 dev wg0"},{type:"ok",text:"[#] ip link set wg0 up"},{type:"out",text:""},{type:"cmd",text:"wg show"},{type:"out",text:"interface: wg0"},{type:"out",text:"  listening port: 51820"},{type:"out",text:"  peer: <chave>  endpoint: 192.168.1.200:51820"},{type:"out",text:"    latest handshake: 5 seconds ago"},{type:"out",text:"    transfer: 1.2 MiB received, 3.4 MiB sent"}]}),e.jsxs("p",{children:["Testar: ",e.jsx("code",{children:"ping 10.0.0.2"})," do servidor,"," ",e.jsx("code",{children:"ping 10.0.0.1"})," do cliente. Se responder, a VPN está ativa."]}),e.jsx("h2",{children:"4. Serviço OpenRC"}),e.jsx(r,{code:`# Ativar no boot
rc-update add wg-quick
# O serviço procura por /etc/wireguard/wg0.conf e sobe automaticamente.

# Iniciar/parar manualmente
rc-service wg-quick start wg0
rc-service wg-quick stop wg0

# Para múltiplos túneis, crie wg1.conf, wg2.conf, etc.
# Todos sobem automaticamente com o serviço.`}),e.jsx("h2",{children:"5. VPN road-warrior (clientes móveis)"}),e.jsx(r,{title:"Servidor para aceitar múltiplos clientes",code:`# /etc/wireguard/wg0.conf — servidor multi-cliente
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
sysctl -p`}),e.jsx("h2",{children:"6. Troubleshooting"}),e.jsx(r,{code:`# Ver status do túnel
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
# Se recusar conexão: firewall ou porta errada`}),e.jsx(t,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add wireguard-tools"})," — instalação"]}),e.jsxs("li",{children:[e.jsx("code",{children:"wg genkey"})," — gere chaves pública/privada"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/etc/wireguard/wg0.conf"})," — configuração do túnel"]}),e.jsxs("li",{children:[e.jsx("code",{children:"wg-quick up wg0"})," — ativar; ",e.jsx("code",{children:"wg show"})," — verificar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rc-update add wg-quick"})," — ativar no boot"]}),e.jsx("li",{children:"Porta 51820/UDP + roteamento IP para road-warrior"})]})})]})}export{n as default};
