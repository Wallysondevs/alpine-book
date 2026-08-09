import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hardening() {
  return (
    <PageContainer
      title="Hardening &amp; Auditoria"
      subtitle="Kernel hardening, sysctl, permissões, auditoria de arquivos e boas práticas CIS."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Servidor Alpine em produção. Acesso root. Algumas mudanças requerem
        reboot — planeje uma janela de manutenção.
      </AlertBox>

      <p>
        Hardening é a arte de reduzir a superfície de ataque no nível do kernel
        e do sistema de arquivos. O Alpine já é enxuto por padrão, mas você pode
        ir além com ajustes de kernel, permissões e auditoria contínua.
      </p>

      <h2>1. Kernel hardening (sysctl)</h2>
      <CodeBlock
        title="/etc/sysctl.d/99-hardening.conf"
        code={`# Proteções de rede
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
sysctl -p /etc/sysctl.d/99-hardening.conf`}
      />

      <h2>2. /tmp e mounts seguros</h2>
      <CodeBlock
        code={`# /etc/fstab — opções de segurança
tmpfs   /tmp   tmpfs   defaults,noexec,nosuid,nodev   0 0
tmpfs   /dev/shm   tmpfs   defaults,noexec,nosuid,nodev   0 0

# noexec  = não permite executar binários
# nosuid  = ignora bits SUID/SGID
# nodev   = não permite dispositivos

# Verificar mounts atuais
mount | grep -E "/tmp|/dev/shm"`}
      />

      <h2>3. Remover SUID desnecessário</h2>
      <CodeBlock
        code={`# Arquivos SUID permitem execução como dono (geralmente root)
# Liste todos os SUID do sistema
find / -perm -4000 -type f 2>/dev/null

# Saída típica (Alpine):
# /usr/bin/doas        ← necessário
# /usr/bin/su          ← necessário
# /usr/bin/newgrp      ← necessário
# /usr/bin/chsh        ← pode remover se não troca shell

# Remover SUID de binário desnecessário
chmod -s /usr/bin/chsh`}
      />

      <h2>4. Auditoria: apk audit e integridade</h2>
      <Terminal
        title="Verificando integridade do sistema"
        lines={[
          { type: "cmd", text: "apk audit" },
          { type: "out", text: "No missing files or dependencies detected." },
          { type: "ok", text: "# Nenhum arquivo de sistema corrompido." },
          { type: "cmd", text: "apk audit --backup" },
          { type: "warn", text: "M /etc/ssh/sshd_config" },
          { type: "warn", text: "M /etc/nginx/http.d/site.conf" },
          { type: "comment", text: "# M=Modificado. Normal — você editou esses arquivos." },
          { type: "cmd", text: "apk audit --system" },
          { type: "warn", text: "A /root/script.sh" },
          { type: "comment", text: "# A=Adicionado. Não veio de pacote. Verifique se é legítimo." },
        ]}
      />

      <h2>5. Permissões de arquivos sensíveis</h2>
      <CodeBlock
        code={`# Verificar permissões críticas
ls -l /etc/shadow        # deve ser -rw------- (root root)
ls -l /etc/doas.d/       # deve ser root root
ls -l /etc/ssh/ssh_host_*_key  # chaves privadas: -rw------- (root root)

# Corrigir permissões
chmod 600 /etc/shadow
chmod 600 /etc/ssh/ssh_host_*_key
chmod 644 /etc/ssh/ssh_host_*_key.pub

# Encontrar arquivos writable por todos
find / -perm -o+w -type f 2>/dev/null | grep -v /proc/ | grep -v /sys/`}
      />

      <h2>6. Auditoria de usuários e grupos</h2>
      <CodeBlock
        code={`# Quem pode virar root?
grep -E "wheel|root" /etc/group
grep -E "permit|:wheel" /etc/doas.d/doas.conf

# Usuários com shell de login
grep -v /sbin/nologin /etc/passwd | grep -v /bin/false

# Usuários sem senha (conta bloqueada)
awk -F: '($2 == "" || $2 == "!") {print $1}' /etc/shadow

# Últimos logins
last -10`}
      />

      <h2>7. Lynis: auditoria automatizada</h2>
      <CodeBlock
        code={`# Lynis — auditor de segurança para Linux
apk add lynis

# Rodar auditoria completa
lynis audit system

# O relatório fica em /var/log/lynis-report.dat
# Sugestões aparecem como "suggestion[]" no output.
# Cada sugestão tem um ID que você pode pesquisar:
# https://cisofy.com/lynis/controls/`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>sysctl</code> — hardening de kernel (ASLR, SYN cookies, kptr)</li>
          <li><code>/tmp noexec,nosuid,nodev</code> — mounts seguros</li>
          <li><code>find / -perm -4000</code> — audite SUID</li>
          <li><code>apk audit --system</code> — arquivos estranhos?</li>
          <li><code>lynis audit system</code> — auditoria completa automática</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}