import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as t,A as a,C as o}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(t,{title:"Monitoramento",subtitle:"free, vmstat, iostat, sar, nethogs, netdata — monitore recursos no Alpine e saiba o que está consumindo.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx(a,{type:"info",title:"Pré-requisitos",children:"Conforto com terminal. As ferramentas básicas (free, df) já estão no sistema; as avançadas instalamos ao longo do capítulo."}),e.jsxs("p",{children:["Monitorar não é só ver se o sistema está lento. É saber ",e.jsx("em",{children:"por que"})," ","está lento: CPU? RAM? Disco? Rede? O Alpine tem ferramentas leves para cada camada. Vamos do básico ao avançado."]}),e.jsx("h2",{children:"1. CPU: load average e uso"}),e.jsx(s,{title:"Carga da CPU",lines:[{type:"cmd",text:"uptime"},{type:"out",text:"14:00:00 up 15 days, 3:22, load average: 0.05, 0.10, 0.08"},{type:"comment",text:"# load: 1min 5min 15min. < 1 por núcleo = tranquilo."},{type:"cmd",text:"nproc"},{type:"out",text:"4"},{type:"comment",text:"# 4 núcleos → load até 2.0 é aceitável, acima de 4.0 é problema."}]}),e.jsx(o,{title:"vmstat — uso de CPU em tempo real",code:`# vmstat já vem no Alpine (BusyBox)
vmstat 2 5       # a cada 2 segundos, 5 amostras
# r = processos esperando CPU (> núcleos = gargalo)
# us = user CPU%, sy = system CPU%, id = idle%
# wa = I/O wait (se alto, disco é o gargalo)`}),e.jsx("h2",{children:"2. Memória: além do free"}),e.jsx(o,{title:"Análise de memória",code:`# free — visão rápida
free -h

# /proc/meminfo — detalhamento completo
cat /proc/meminfo | grep -E "MemTotal|MemAvailable|Buffers|Cached|SwapTotal"

# MemAvailable é o que realmente importa (memória usável).
# MemFree puro pode ser enganoso (Linux usa RAM para cache).

# Processos que mais consomem memória:
ps aux --sort=-%mem | head -10       # procps
# ou:
top -b -n 1 -o %MEM | head -20      # procps-ng`}),e.jsx("h2",{children:"3. Disco: I/O e latência"}),e.jsx(o,{title:"iostat e iotop",code:`# iostat — estatísticas de disco
apk add sysstat
iostat -x 2 3          # a cada 2s, 3 amostras
# %util: quanto o disco está ocupado (> 80% = preocupante)
# await: latência média de I/O em ms

# iotop — quais processos estão batendo no disco
apk add iotop
iotop                   # interface estilo htop para I/O
iotop -o                # só processos com I/O ativo

# df/du — espaço em disco (mais simples)
df -h
du -sh /var/* | sort -rh | head -10   # top 10 diretórios em /var`}),e.jsx("h2",{children:"4. Rede: tráfego por processo e interface"}),e.jsx(o,{title:"Monitoramento de rede",code:`# nethogs — largura de banda por processo
apk add nethogs
nethogs                 # interface interativa (precisa root)

# iftop — largura de banda por conexão
apk add iftop
iftop -i eth0

# nload — gráfico ASCII de tráfego (simples e bonito)
apk add nload
nload eth0

# vnstat — histórico de tráfego (leve, background)
apk add vnstat
vnstat -i eth0          # tráfego desde o boot
vnstat -d               # tráfego diário

# Estatísticas básicas (sem instalar nada):
cat /proc/net/dev        # bytes/pacotes por interface
ip -s link               # estatísticas de cada interface`}),e.jsx("h2",{children:"5. netdata: monitoring completo"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"netdata"})," é um painel de monitoramento em tempo real que roda no navegador. Consome ~30 MB de RAM e monitora CPU, RAM, disco, rede, processos, serviços e muito mais:"]}),e.jsx(o,{title:"Instalando netdata no Alpine",code:`# Instalar (está no community)
apk add netdata

# Iniciar
rc-update add netdata
rc-service netdata start

# Acessar: http://seu-ip:19999
# Painel web com gráficos em tempo real, alertas, etc.

# Configuração: /etc/netdata/netdata.conf
# Módulos: /etc/netdata/  (cpu, memory, disk, network, ...)`}),e.jsx(a,{type:"info",title:"Netdata para servidores",children:"O netdata é perfeito para servidores Alpine: instalação em 1 minuto, zero configuração inicial, e você tem um dashboard completo no navegador. Para VPS com 1 GB de RAM, o consumo adicional (~30 MB) é insignificante."}),e.jsx("h2",{children:"6. sar: coleta histórica"}),e.jsxs("p",{children:["Enquanto ferramentas como htop mostram o ",e.jsx("em",{children:"agora"}),", o"," ",e.jsx("strong",{children:"sar"})," (System Activity Reporter) coleta dados ao longo do tempo para análise posterior:"]}),e.jsx(o,{title:"sar — análise histórica",code:`apk add sysstat

# Habilitar coleta (a cada 10 minutos)
rc-update add sysstat
rc-service sysstat start

# Consultar dados históricos:
sar                     # CPU do dia inteiro
sar -r                  # memória
sar -b                  # I/O
sar -n DEV              # rede por dispositivo
sar -f /var/log/sa/sa09 # dados de um dia específico

# Os dados ficam em /var/log/sa/`}),e.jsx("h2",{children:"7. Script de saúde rápida"}),e.jsx(o,{title:"saude.sh — check-up de 10 segundos",code:`#!/bin/sh
echo "=== $(date) ==="
echo ""
echo "--- Uptime & Load ---"
uptime
echo ""
echo "--- Memória ---"
free -h
echo ""
echo "--- Disco ---"
df -h /
echo ""
echo "--- Top 5 CPU ---"
ps aux --sort=-%cpu 2>/dev/null | head -6 || ps -o pid,%cpu,comm | sort -k2 -rn | head -6
echo ""
echo "--- Top 5 MEM ---"
ps aux --sort=-%mem 2>/dev/null | head -6 || ps -o pid,%mem,comm | sort -k2 -rn | head -6
echo ""
echo "--- Rede ---"
ip -s link | grep -A1 "eth0|ens|wlan"`}),e.jsx(a,{type:"success",title:"Resumo: qual ferramenta para cada situação",children:e.jsxs("ol",{children:[e.jsxs("li",{children:["Visão rápida → ",e.jsx("code",{children:"free -h"}),", ",e.jsx("code",{children:"df -h"}),", ",e.jsx("code",{children:"uptime"})]}),e.jsxs("li",{children:["Processos ao vivo → ",e.jsx("code",{children:"htop"})," / ",e.jsx("code",{children:"btop"})]}),e.jsxs("li",{children:["CPU/memória histórica → ",e.jsx("code",{children:"vmstat"}),", ",e.jsx("code",{children:"sar"})]}),e.jsxs("li",{children:["Disco → ",e.jsx("code",{children:"iostat"}),", ",e.jsx("code",{children:"iotop"})]}),e.jsxs("li",{children:["Rede → ",e.jsx("code",{children:"nethogs"}),", ",e.jsx("code",{children:"iftop"}),", ",e.jsx("code",{children:"vnstat"})]}),e.jsxs("li",{children:["Dashboard completo → ",e.jsx("code",{children:"netdata"})," (web, 30 MB RAM)"]})]})})]})}export{d as default};
