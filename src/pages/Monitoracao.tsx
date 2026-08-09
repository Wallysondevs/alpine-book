import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Monitoracao() {
  return (
    <PageContainer
      title="Monitoramento"
      subtitle="free, vmstat, iostat, sar, nethogs, netdata — monitore recursos no Alpine e saiba o que está consumindo."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Conforto com terminal. As ferramentas básicas (free, df) já estão no
        sistema; as avançadas instalamos ao longo do capítulo.
      </AlertBox>

      <p>
        Monitorar não é só ver se o sistema está lento. É saber <em>por que</em>{" "}
        está lento: CPU? RAM? Disco? Rede? O Alpine tem ferramentas leves para
        cada camada. Vamos do básico ao avançado.
      </p>

      <h2>1. CPU: load average e uso</h2>
      <Terminal
        title="Carga da CPU"
        lines={[
          { type: "cmd", text: "uptime" },
          { type: "out", text: "14:00:00 up 15 days, 3:22, load average: 0.05, 0.10, 0.08" },
          { type: "comment", text: "# load: 1min 5min 15min. < 1 por núcleo = tranquilo." },
          { type: "cmd", text: "nproc" },
          { type: "out", text: "4" },
          { type: "comment", text: "# 4 núcleos → load até 2.0 é aceitável, acima de 4.0 é problema." },
        ]}
      />

      <CodeBlock
        title="vmstat — uso de CPU em tempo real"
        code={`# vmstat já vem no Alpine (BusyBox)
vmstat 2 5       # a cada 2 segundos, 5 amostras
# r = processos esperando CPU (> núcleos = gargalo)
# us = user CPU%, sy = system CPU%, id = idle%
# wa = I/O wait (se alto, disco é o gargalo)`}
      />

      <h2>2. Memória: além do free</h2>
      <CodeBlock
        title="Análise de memória"
        code={`# free — visão rápida
free -h

# /proc/meminfo — detalhamento completo
cat /proc/meminfo | grep -E "MemTotal|MemAvailable|Buffers|Cached|SwapTotal"

# MemAvailable é o que realmente importa (memória usável).
# MemFree puro pode ser enganoso (Linux usa RAM para cache).

# Processos que mais consomem memória:
ps aux --sort=-%mem | head -10       # procps
# ou:
top -b -n 1 -o %MEM | head -20      # procps-ng`}
      />

      <h2>3. Disco: I/O e latência</h2>
      <CodeBlock
        title="iostat e iotop"
        code={`# iostat — estatísticas de disco
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
du -sh /var/* | sort -rh | head -10   # top 10 diretórios em /var`}
      />

      <h2>4. Rede: tráfego por processo e interface</h2>
      <CodeBlock
        title="Monitoramento de rede"
        code={`# nethogs — largura de banda por processo
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
ip -s link               # estatísticas de cada interface`}
      />

      <h2>5. netdata: monitoring completo</h2>
      <p>
        O <strong>netdata</strong> é um painel de monitoramento em tempo real
        que roda no navegador. Consome ~30 MB de RAM e monitora CPU, RAM, disco,
        rede, processos, serviços e muito mais:
      </p>
      <CodeBlock
        title="Instalando netdata no Alpine"
        code={`# Instalar (está no community)
apk add netdata

# Iniciar
rc-update add netdata
rc-service netdata start

# Acessar: http://seu-ip:19999
# Painel web com gráficos em tempo real, alertas, etc.

# Configuração: /etc/netdata/netdata.conf
# Módulos: /etc/netdata/  (cpu, memory, disk, network, ...)`}
      />

      <AlertBox type="info" title="Netdata para servidores">
        O netdata é perfeito para servidores Alpine: instalação em 1 minuto,
        zero configuração inicial, e você tem um dashboard completo no navegador.
        Para VPS com 1 GB de RAM, o consumo adicional (~30 MB) é insignificante.
      </AlertBox>

      <h2>6. sar: coleta histórica</h2>
      <p>
        Enquanto ferramentas como htop mostram o <em>agora</em>, o{" "}
        <strong>sar</strong> (System Activity Reporter) coleta dados ao longo do
        tempo para análise posterior:
      </p>
      <CodeBlock
        title="sar — análise histórica"
        code={`apk add sysstat

# Habilitar coleta (a cada 10 minutos)
rc-update add sysstat
rc-service sysstat start

# Consultar dados históricos:
sar                     # CPU do dia inteiro
sar -r                  # memória
sar -b                  # I/O
sar -n DEV              # rede por dispositivo
sar -f /var/log/sa/sa09 # dados de um dia específico

# Os dados ficam em /var/log/sa/`}
      />

      <h2>7. Script de saúde rápida</h2>
      <CodeBlock
        title="saude.sh — check-up de 10 segundos"
        code={`#!/bin/sh
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
ip -s link | grep -A1 "eth0\|ens\|wlan"`}
      />

      <AlertBox type="success" title="Resumo: qual ferramenta para cada situação">
        <ol>
          <li>Visão rápida → <code>free -h</code>, <code>df -h</code>, <code>uptime</code></li>
          <li>Processos ao vivo → <code>htop</code> / <code>btop</code></li>
          <li>CPU/memória histórica → <code>vmstat</code>, <code>sar</code></li>
          <li>Disco → <code>iostat</code>, <code>iotop</code></li>
          <li>Rede → <code>nethogs</code>, <code>iftop</code>, <code>vnstat</code></li>
          <li>Dashboard completo → <code>netdata</code> (web, 30 MB RAM)</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}