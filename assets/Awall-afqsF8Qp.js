import{j as e}from"./index-YFyZeUD9.js";import{P as l,A as s,C as a}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(l,{title:"Firewall — awall (Alpine Wall)",subtitle:"O firewall nativo do Alpine: políticas declarativas, awall enable, tradução para iptables/nftables.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Rede configurada e funcionando. Acesso root. Conhecimento básico de portas TCP/UDP. Awall é específico do Alpine — não existe em outras distros."}),e.jsxs("p",{children:["O Alpine criou seu próprio gerenciador de firewall: o"," ",e.jsx("strong",{children:"awall"})," (Alpine Wall). Ele usa arquivos JSON declarativos e traduz para iptables ou nftables. A ideia é simples: você declara"," ",e.jsx("em",{children:"o que quer"})," (abrir porta 80, liberar SSH), e o awall gera as regras. Sem iptables -A -p tcp --dport."]}),e.jsx("h2",{children:"1. Instalação e conceitos"}),e.jsx(a,{code:`# Instalar awall (não vem por padrão)
apk add awall

# Conceitos:
# Policy  → arquivo JSON em /etc/awall/optional/ que declara regras
# Enable  → ativar uma policy (awall enable nome)
# Translate → gerar regras de iptables/nftables a partir das policies
# Activate  → aplicar as regras no kernel

# awall suporta dois backends:
# iptables  (padrão, mais estável)
# nftables  (moderno, mais rápido)`}),e.jsx("h2",{children:"2. Primeiro firewall: liberar SSH + Web"}),e.jsx(a,{code:`# Criar policy /etc/awall/optional/servidor-web.json
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
iptables -L -n`}),e.jsxs("p",{children:["Os serviços (",e.jsx("code",{children:"ssh"}),", ",e.jsx("code",{children:"http"}),", ",e.jsx("code",{children:"https"}),") são pré-definidos em ",e.jsx("code",{children:"/usr/share/awall/services/"}),". Você pode listar todos:"]}),e.jsx(a,{code:`# Listar serviços disponíveis
ls /usr/share/awall/services/
# dns.json  http.json  https.json  mysql.json  ntp.json
# postgresql.json  smtp.json  ssh.json  ...

# Ver definição de um serviço
cat /usr/share/awall/services/ssh.json`}),e.jsx("h2",{children:"3. Políticas comuns"}),e.jsx(a,{title:"Servidor web com banco local",code:`{
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
}`}),e.jsx(a,{title:"VPN + porta customizada",code:`{
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
}`}),e.jsx("h2",{children:"4. awall list, disable, reset"}),e.jsx(a,{code:`# Listar policies ativas
awall list

# Desativar uma policy
awall disable servidor-web

# Ver o que seria traduzido (dry-run)
awall translate --dry-run

# Remover TODAS as regras (abrir tudo — emergência!)
awall deactivate

# Reaplicar config atual
awall activate`}),e.jsx("h2",{children:"5. Zonas e redes"}),e.jsx(a,{title:"Definindo zonas customizadas",code:`# /etc/awall/private/custom-zones.json
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
}`}),e.jsx("h2",{children:"6. Awall com nftables (backend moderno)"}),e.jsx(a,{code:`# Mudar para nftables
apk add nftables
awall translate --backend nftables
awall activate

# Ver regras nftables
nft list ruleset`}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add awall"})," — instala o firewall do Alpine"]}),e.jsxs("li",{children:["Crie JSON em ",e.jsx("code",{children:"/etc/awall/optional/"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"awall enable nome"})," → ",e.jsx("code",{children:"awall translate"})," → ",e.jsx("code",{children:"awall activate"})]}),e.jsx("li",{children:"Serviços pré-definidos: ssh, http, https, dns, postgresql, etc."}),e.jsxs("li",{children:[e.jsx("code",{children:"awall list"}),", ",e.jsx("code",{children:"awall disable"}),", ",e.jsx("code",{children:"awall deactivate"})]}),e.jsx("li",{children:"Backend: iptables (padrão) ou nftables (moderno)"})]})})]})}export{t as default};
