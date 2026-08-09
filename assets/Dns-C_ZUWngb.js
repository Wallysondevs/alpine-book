import{j as e,T as n}from"./index-YFyZeUD9.js";import{P as c,A as s,C as o}from"./AlertBox-C2CyWd7R.js";function i(){return e.jsxs(c,{title:"DNS — Resolução de Nomes",subtitle:"/etc/resolv.conf, dig, nslookup, dnsmasq, unbound — configure e diagnostique DNS no Alpine.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Rede funcionando. Se você não consegue resolver nomes, este capítulo vai diagnosticar e resolver."}),e.jsx("p",{children:"DNS é o catálogo telefônico da internet: traduz nomes (google.com) em IPs (142.250.80.46). Quando quebra, parece que a internet caiu. Vamos dominar DNS no Alpine — da configuração básica ao cache local."}),e.jsx("h2",{children:"1. /etc/resolv.conf: o arquivo que manda"}),e.jsx(o,{code:`# Configuração mínima
cat /etc/resolv.conf
# nameserver 1.1.1.1      ← Cloudflare (rápido, privacidade)
# nameserver 8.8.8.8      ← Google (fallback)

# Opções extras:
# options timeout:1        ← timeout de 1 segundo
# options attempts:2       ← tenta 2 vezes
# options rotate           ← alterna entre servidores

# Testar resolução imediata
ping -c 1 google.com`}),e.jsxs(s,{type:"warning",title:"resolv.conf pode ser sobrescrito",children:["Se você usa DHCP, o ",e.jsx("code",{children:"resolvconf"})," pode reescrever este arquivo. Para travar: ",e.jsx("code",{children:"chattr +i /etc/resolv.conf"})," (imutável) ou configure o DNS fixo no ",e.jsx("code",{children:"/etc/network/interfaces"}),"."]}),e.jsx("h2",{children:"2. dig e nslookup: diagnosticando DNS"}),e.jsx(n,{title:"Consultas DNS com dig",lines:[{type:"cmd",text:"apk add bind-tools"},{type:"cmd",text:"dig google.com"},{type:"out",text:";ANSWER SECTION:"},{type:"out",text:"google.com.  300  IN  A  142.250.80.46"},{type:"cmd",text:"dig +short google.com"},{type:"out",text:"142.250.80.46"}]}),e.jsx(o,{code:`# dig — consultas específicas
dig +short google.com            # só o IP
dig MX google.com                # servidores de email
dig NS google.com                # servidores DNS do domínio
dig -x 8.8.8.8                   # reverso (IP → nome)
dig @1.1.1.1 google.com          # consultar servidor específico

# nslookup — mais simples, interativo
nslookup google.com
nslookup google.com 1.1.1.1      # servidor específico`}),e.jsx("h2",{children:"3. host: consulta rápida"}),e.jsx(o,{code:`# host — direto ao ponto
host google.com
# google.com has address 142.250.80.46
# google.com mail is handled by 10 smtp.google.com.

host 8.8.8.8
# 8.8.8.8.in-addr.arpa domain name pointer dns.google.`}),e.jsx("h2",{children:"4. dnsmasq: cache DNS local"}),e.jsx("p",{children:"Um cache DNS local acelera consultas repetidas e reduz tráfego. O dnsmasq é leve e já faz DHCP também:"}),e.jsx(o,{code:`# Instalar
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
dig google.com    # ~0ms (cache local)`}),e.jsx("h2",{children:"5. unbound: resolver recursivo completo"}),e.jsx("p",{children:"Enquanto o dnsmasq encaminha para um servidor (1.1.1.1), o unbound resolve sozinho, consultando os servidores raiz. Mais privacidade:"}),e.jsx(o,{code:`apk add unbound

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
echo "nameserver 127.0.0.1" > /etc/resolv.conf`}),e.jsx("h2",{children:"6. Diagnóstico: por que o nome não resolve?"}),e.jsx(o,{code:`# Checklist quando o DNS falha:

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
grep google.com /etc/hosts`}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"/etc/resolv.conf"})," — lista de servidores DNS"]}),e.jsxs("li",{children:[e.jsx("code",{children:"dig +short"})," — diagnóstico rápido de DNS"]}),e.jsxs("li",{children:[e.jsx("code",{children:"dnsmasq"})," — cache local (~200 KB, recomendado)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"unbound"})," — resolver recursivo completo (~2 MB)"]}),e.jsx("li",{children:"Se resolve IP mas não nome: o problema é DNS"})]})})]})}export{i as default};
