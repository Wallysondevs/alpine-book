import{j as e,T as t}from"./index-YFyZeUD9.js";import{P as i,A as o,C as s}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(i,{title:"Hardening & Auditoria",subtitle:"Kernel hardening, sysctl, permissões, auditoria de arquivos e boas práticas CIS.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Servidor Alpine em produção. Acesso root. Algumas mudanças requerem reboot — planeje uma janela de manutenção."}),e.jsx("p",{children:"Hardening é a arte de reduzir a superfície de ataque no nível do kernel e do sistema de arquivos. O Alpine já é enxuto por padrão, mas você pode ir além com ajustes de kernel, permissões e auditoria contínua."}),e.jsx("h2",{children:"1. Kernel hardening (sysctl)"}),e.jsx(s,{title:"/etc/sysctl.d/99-hardening.conf",code:`# Proteções de rede
net.ipv4.tcp_syncookies = 1          # protege contra SYN flood
net.ipv4.icmp_echo_ignore_all = 1    # não responde a ping
net.ipv4.ip_forward = 0              # desative roteamento (se não é roteador)
net.ipv6.conf.all.disable_ipv6 = 1   # desative IPv6 (se não usa)

# Proteções de kernel
kernel.kptr_restrict = 2             # esconde endereços do kernel
kernel.dmesg_restrict = 1            # só root lê dmesg
kernel.yama.ptrace_scope = 1         # restringe ptrace
kernel.randomize_va_space = 2        # ASLR completo
kernel.sysrq = 0                     # desativa Magic SysRq

# Aplicar
sysctl -p /etc/sysctl.d/99-hardening.conf`}),e.jsx("h2",{children:"2. /tmp e mounts seguros"}),e.jsx(s,{code:`# /etc/fstab — opções de segurança
tmpfs   /tmp   tmpfs   defaults,noexec,nosuid,nodev   0 0
tmpfs   /dev/shm   tmpfs   defaults,noexec,nosuid,nodev   0 0

# noexec  = não permite executar binários
# nosuid  = ignora bits SUID/SGID
# nodev   = não permite dispositivos

# Verificar mounts atuais
mount | grep -E "/tmp|/dev/shm"`}),e.jsx("h2",{children:"3. Remover SUID desnecessário"}),e.jsx(s,{code:`# Arquivos SUID permitem execução como dono (geralmente root)
# Liste todos os SUID do sistema
find / -perm -4000 -type f 2>/dev/null

# Saída típica (Alpine):
# /usr/bin/doas        ← necessário
# /usr/bin/su          ← necessário
# /usr/bin/newgrp      ← necessário
# /usr/bin/chsh        ← pode remover se não troca shell

# Remover SUID de binário desnecessário
chmod -s /usr/bin/chsh`}),e.jsx("h2",{children:"4. Auditoria: apk audit e integridade"}),e.jsx(t,{title:"Verificando integridade do sistema",lines:[{type:"cmd",text:"apk audit"},{type:"out",text:"No missing files or dependencies detected."},{type:"ok",text:"# Nenhum arquivo de sistema corrompido."},{type:"cmd",text:"apk audit --backup"},{type:"warn",text:"M /etc/ssh/sshd_config"},{type:"warn",text:"M /etc/nginx/http.d/site.conf"},{type:"comment",text:"# M=Modificado. Normal — você editou esses arquivos."},{type:"cmd",text:"apk audit --system"},{type:"warn",text:"A /root/script.sh"},{type:"comment",text:"# A=Adicionado. Não veio de pacote. Verifique se é legítimo."}]}),e.jsx("h2",{children:"5. Permissões de arquivos sensíveis"}),e.jsx(s,{code:`# Verificar permissões críticas
ls -l /etc/shadow        # deve ser -rw------- (root root)
ls -l /etc/doas.d/       # deve ser root root
ls -l /etc/ssh/ssh_host_*_key  # chaves privadas: -rw------- (root root)

# Corrigir permissões
chmod 600 /etc/shadow
chmod 600 /etc/ssh/ssh_host_*_key
chmod 644 /etc/ssh/ssh_host_*_key.pub

# Encontrar arquivos writable por todos
find / -perm -o+w -type f 2>/dev/null | grep -v /proc/ | grep -v /sys/`}),e.jsx("h2",{children:"6. Auditoria de usuários e grupos"}),e.jsx(s,{code:`# Quem pode virar root?
grep -E "wheel|root" /etc/group
grep -E "permit|:wheel" /etc/doas.d/doas.conf

# Usuários com shell de login
grep -v /sbin/nologin /etc/passwd | grep -v /bin/false

# Usuários sem senha (conta bloqueada)
awk -F: '($2 == "" || $2 == "!") {print $1}' /etc/shadow

# Últimos logins
last -10`}),e.jsx("h2",{children:"7. Lynis: auditoria automatizada"}),e.jsx(s,{code:`# Lynis — auditor de segurança para Linux
apk add lynis

# Rodar auditoria completa
lynis audit system

# O relatório fica em /var/log/lynis-report.dat
# Sugestões aparecem como "suggestion[]" no output.
# Cada sugestão tem um ID que você pode pesquisar:
# https://cisofy.com/lynis/controls/`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"sysctl"})," — hardening de kernel (ASLR, SYN cookies, kptr)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/tmp noexec,nosuid,nodev"})," — mounts seguros"]}),e.jsxs("li",{children:[e.jsx("code",{children:"find / -perm -4000"})," — audite SUID"]}),e.jsxs("li",{children:[e.jsx("code",{children:"apk audit --system"})," — arquivos estranhos?"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lynis audit system"})," — auditoria completa automática"]})]})})]})}export{n as default};
