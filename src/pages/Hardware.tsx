import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Hardware() {
  return (
    <PageContainer
      title="Informações de Hardware"
      subtitle="lspci, lsusb, dmesg, /proc, /sys, free, uptime — descubra tudo sobre o hardware do seu Alpine."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. Os comandos básicos vêm no Alpine; alguns extras precisam de
        pacotes — todos indicados.
      </AlertBox>

      <p>
        Saber o que tem dentro da máquina é o primeiro passo para qualquer
        diagnóstico. Driver de rede não carrega? Disco não aparece? Performance
        ruim? Este capítulo cobre todas as ferramentas de inspeção de hardware
        disponíveis no Alpine.
      </p>

      <h2>1. CPU: modelo, núcleos, arquitetura</h2>
      <CodeBlock
        title="Informações da CPU"
        code={`# Modelo e specs
cat /proc/cpuinfo | grep "model name" | head -1
# model name : Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz

# Número de núcleos
nproc
# 12

# Arquitetura
uname -m
# x86_64

# Bits do sistema (32 ou 64)
getconf LONG_BIT
# 64`}
      />

      <h2>2. Memória: RAM e swap</h2>
      <Terminal
        title="Estado da memória"
        lines={[
          { type: "cmd", text: "free -h" },
          { type: "out", text: "              total    used    free   shared  buff/cache   available" },
          { type: "out", text: "Mem:           3.8G    512M    2.8G     12M        489M        3.2G" },
          { type: "out", text: "Swap:          2.0G      0B    2.0G" },
          { type: "cmd", text: "cat /proc/meminfo | head -10" },
          { type: "out", text: "MemTotal:  3987456 kB" },
          { type: "out", text: "MemFree:   2934120 kB" },
          { type: "out", text: "MemAvailable: 3356100 kB" },
        ]}
      />

      <h2>3. Discos e armazenamento</h2>
      <CodeBlock
        title="Informações de disco"
        code={`# Lista de discos e partições
lsblk
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,MODEL

# Detalhes de cada disco
hdparm -I /dev/sda         # info detalhada (modelo, firmware, features)
apk add hdparm             # instalar se necessário

# SMART (saúde do disco)
apk add smartmontools
smartctl -a /dev/sda       # todos os atributos SMART
smartctl -H /dev/sda       # só o status de saúde (PASSED/FAILED)
smartctl -t short /dev/sda # teste rápido`}
      />

      <h2>4. PCI e USB: dispositivos conectados</h2>
      <Terminal
        title="Listando hardware PCI e USB"
        lines={[
          { type: "cmd", text: "apk add pciutils usbutils" },
          { type: "out", text: "OK: 1.2 MiB em 60 pacotes" },
          { type: "cmd", text: "lspci" },
          { type: "out", text: "00:00.0 Host bridge: Intel Corporation 440FX" },
          { type: "out", text: "00:01.0 ISA bridge: Intel Corporation 82371SB" },
          { type: "out", text: "00:03.0 Ethernet controller: Red Hat, Inc. Virtio network device" },
          { type: "out", text: "00:04.0 SCSI storage controller: Red Hat, Inc. Virtio block device" },
          { type: "cmd", text: "lsusb" },
          { type: "out", text: "Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub" },
        ]}
      />

      <CodeBlock
        title="Inspeção detalhada de dispositivos"
        code={`# PCI detalhado
lspci -v                    # verbose (drivers, memória, IRQ)
lspci -k                    # mostra drivers do kernel em uso
lspci -nn                   # IDs numéricos (útil para buscar compatibilidade)

# USB detalhado
lsusb -v                    # verbose (muita informação)
lsusb -t                    # árvore de dispositivos USB

# Encontrar um dispositivo específico
lspci | grep -i network
lspci | grep -i vga`}
      />

      <h2>5. Módulos do kernel</h2>
      <CodeBlock
        title="Gerenciando módulos (drivers)"
        code={`# Listar módulos carregados
lsmod

# Info detalhada de um módulo
modinfo ext4
modinfo virtio_net

# Carregar módulo manualmente
modprobe virtio_net

# Remover módulo
modprobe -r virtio_net

# Módulos carregados no boot
cat /etc/modules
# virtio_net
# virtio_blk

# Adicionar ao initramfs (se necessário no boot)
# Edite /etc/mkinitfs/mkinitfs.conf, adicione à lista features
# Ex: features="base virtio ext4"`}
      />

      <h2>6. Temperatura e sensores</h2>
      <CodeBlock
        title="Monitoramento térmico"
        code={`# lm-sensors (hardware monitoring)
apk add lm-sensors
sensors-detect        # detecta sensores (responda YES a tudo)
sensors               # mostra temperaturas e voltagens

# Temperatura da CPU (via /sys)
cat /sys/class/thermal/thermal_zone0/temp
# 45000  → 45.0°C (dividir por 1000)

# Temperatura de discos NVMe
cat /sys/class/nvme/nvme0/device/hwmon/hwmon0/temp1_input`}
      />

      <h2>7. uptime, load e informações do sistema</h2>
      <Terminal
        title="Estado geral do sistema"
        lines={[
          { type: "cmd", text: "uptime" },
          { type: "out", text: "14:00:00 up 15 days,  3:22,  load average: 0.05, 0.10, 0.08" },
          { type: "comment", text: "# 15 dias ligado, carga quase zero → servidor ocioso" },
          { type: "cmd", text: "cat /proc/loadavg" },
          { type: "out", text: "0.05 0.10 0.08 1/234 12345" },
          { type: "comment", text: "# load 1min 5min 15min  running/total lastPID" },
          { type: "cmd", text: "hostnamectl 2>/dev/null || cat /etc/alpine-release" },
          { type: "out", text: "3.24.0" },
        ]}
      />

      <h2>8. Script rápido de inventário</h2>
      <CodeBlock
        title="inventario.sh — perfil completo da máquina"
        code={`#!/bin/sh
echo "=== CPU ==="
grep "model name" /proc/cpuinfo | head -1
echo "Núcleos: $(nproc)"
echo ""
echo "=== MEMÓRIA ==="
free -h
echo ""
echo "=== DISCOS ==="
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
echo ""
echo "=== REDE ==="
ip -br addr
echo ""
echo "=== SISTEMA ==="
uname -r
cat /etc/alpine-release
uptime`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>nproc</code> / <code>/proc/cpuinfo</code> — CPU</li>
          <li><code>free -h</code> — memória</li>
          <li><code>lsblk</code> / <code>df -h</code> — discos</li>
          <li><code>lspci</code> / <code>lsusb</code> — dispositivos (<code>apk add pciutils usbutils</code>)</li>
          <li><code>lsmod</code> / <code>modinfo</code> — módulos do kernel</li>
          <li><code>sensors</code> — temperatura (<code>apk add lm-sensors</code>)</li>
          <li><code>uptime</code> — há quanto tempo está ligado</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}