import{j as e}from"./index-YFyZeUD9.js";import{P as s,A as a,C as i}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(s,{title:"KVM — Virtualização com QEMU",subtitle:"Máquinas virtuais no Alpine: qemu-system, módulos KVM, imagens qcow2 e rede bridge.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["CPU com suporte a virtualização (Intel VT-x ou AMD-V). Verifique:"," ",e.jsx("code",{children:'grep -E "vmx|svm" /proc/cpuinfo'}),". Se não retornar nada, seu hardware não suporta KVM."]}),e.jsx("p",{children:"KVM (Kernel-based Virtual Machine) transforma o Linux num hypervisor nativo. Com QEMU, você roda VMs com performance quase bare-metal. O Alpine suporta KVM — e com os binários qemu-system, você cria VMs em minutos."}),e.jsx("h2",{children:"1. Verificar e ativar KVM"}),e.jsx(i,{code:`# 1. Verificar suporte do CPU
grep -E "vmx|svm" /proc/cpuinfo | head -1
# flags: ... vmx ...  (Intel) ou ... svm ... (AMD)

# 2. Carregar módulo KVM
modprobe kvm
modprobe kvm_intel     # Intel
# ou:
modprobe kvm_amd       # AMD

# 3. Verificar
lsmod | grep kvm
ls -l /dev/kvm         # deve existir

# 4. Adicionar ao boot
echo "kvm" >> /etc/modules
echo "kvm_intel" >> /etc/modules   # ou kvm_amd`}),e.jsx("h2",{children:"2. Instalar QEMU"}),e.jsx(i,{code:`# QEMU completo para x86_64
apk add qemu-system-x86_64 qemu-img

# Pacotes adicionais úteis:
apk add qemu-system-arm        # ARM
apk add qemu-system-aarch64    # ARM64
apk add qemu-ui-gtk            # interface gráfica
apk add qemu-audio-pa          # áudio PulseAudio`}),e.jsx("h2",{children:"3. Primeira VM: Alpine minimalista"}),e.jsx(i,{code:`# 1. Criar disco virtual (qcow2 — cresce sob demanda)
qemu-img create -f qcow2 alpine.qcow2 10G

# 2. Boot da ISO para instalar
qemu-system-x86_64 \\
    -m 1024 \\                  # 1 GB RAM
    -cpu host \\                # usa recursos do CPU
    -enable-kvm \\              # aceleração KVM
    -cdrom alpine-standard-3.24.0-x86_64.iso \\
    -drive file=alpine.qcow2,if=virtio \\
    -netdev user,id=net0 \\
    -device virtio-net,netdev=net0 \\
    -vga qxl \\                 # vídeo com resolução alta
    -display gtk                # janela gráfica

# 3. Depois de instalar, boot sem ISO:
qemu-system-x86_64 \\
    -m 1024 -cpu host -enable-kvm \\
    -drive file=alpine.qcow2,if=virtio \\
    -netdev user,id=net0 -device virtio-net,netdev=net0 \\
    -vga qxl -display gtk`}),e.jsx("h2",{children:"4. QEMU headless (servidor, sem GUI)"}),e.jsx(i,{code:`# VM sem interface gráfica — acesso via SSH/VNC
qemu-system-x86_64 \\
    -m 2048 \\
    -cpu host \\
    -enable-kvm \\
    -smp 2 \\                   # 2 núcleos
    -drive file=alpine.qcow2,if=virtio \\
    -netdev user,id=net0,hostfwd=tcp::2222-:22 \\
    -device virtio-net,netdev=net0 \\
    -nographic \\               # sem janela gráfica
    -daemonize                  # background

# Acesso SSH: ssh -p 2222 usuario@localhost
# hostfwd mapeia host:2222 → VM:22

# VNC para acesso gráfico remoto:
qemu-system-x86_64 \\
    ... \\
    -vnc :0                    # VNC na porta 5900`}),e.jsx("h2",{children:"5. Rede bridge (modo avançado)"}),e.jsx("p",{children:"O modo user é NAT. Para dar um IP real da rede à VM, use bridge:"}),e.jsx(i,{code:`# 1. Criar bridge no host (/etc/network/interfaces)
auto br0
iface br0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1
    bridge-ports eth0

# 2. Criar interface tap para a VM
ip tuntap add tap0 mode tap
ip link set tap0 up
ip link set tap0 master br0

# 3. QEMU com bridge
qemu-system-x86_64 \\
    ... \\
    -netdev tap,id=net0,ifname=tap0,script=no \\
    -device virtio-net,netdev=net0

# Agora a VM recebe IP do DHCP da rede física.`}),e.jsx("h2",{children:"6. qemu-img: gerenciar discos"}),e.jsx(i,{code:`# Criar disco
qemu-img create -f qcow2 disco.qcow2 20G

# Info do disco
qemu-img info disco.qcow2
# virtual size: 20 GiB
# disk size: 1.2 GiB  (qcow2 cresce sob demanda)

# Converter formatos
qemu-img convert -f raw -O qcow2 disco.img disco.qcow2

# Snapshot
qemu-img snapshot -c antes-da-atualizacao disco.qcow2
qemu-img snapshot -l disco.qcow2      # listar snapshots
qemu-img snapshot -a antes-da-atualizacao disco.qcow2  # restaurar

# Redimensionar (aumentar)
qemu-img resize disco.qcow2 +10G`}),e.jsx("h2",{children:"7. Script de VM rápida"}),e.jsx(i,{title:"cria-vm.sh",code:`#!/bin/sh
NAME="$1"
RAM={""$"}{"{"}2:-1024{"}""}
DISK={""$"}{"{"}3:-10G{"}""}

qemu-img create -f qcow2 "$NAME.qcow2" "$DISK"

qemu-system-x86_64 \\
    -name "$NAME" \\
    -m "$RAM" \\
    -cpu host \\
    -enable-kvm \\
    -smp 2 \\
    -drive file="$NAME.qcow2",if=virtio \\
    -cdrom alpine-standard-3.24.0-x86_64.iso \\
    -netdev user,id=net0,hostfwd=tcp::2222-:22 \\
    -device virtio-net,netdev=net0 \\
    -nographic

# Uso: ./cria-vm.sh meu-servidor 2048 20G`}),e.jsx(a,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"grep vmx /proc/cpuinfo"})," — confirme suporte KVM"]}),e.jsx("li",{children:e.jsx("code",{children:"apk add qemu-system-x86_64 qemu-img"})}),e.jsx("li",{children:e.jsx("code",{children:"qemu-img create -f qcow2 disco.qcow2 10G"})}),e.jsxs("li",{children:[e.jsx("code",{children:"-enable-kvm -cpu host"})," para performance nativa"]}),e.jsxs("li",{children:[e.jsx("code",{children:"-nographic"})," para servidores headless; ",e.jsx("code",{children:"-vnc :0"})," para acesso remoto"]}),e.jsx("li",{children:"Bridge (tap) para IP real na rede; user+hostfwd para NAT"})]})})]})}export{t as default};
