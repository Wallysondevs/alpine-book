import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Troubleshooting() {
  return (
    <PageContainer
      title="Troubleshooting"
      subtitle="Problemas comuns e suas soluções no Alpine: boot, rede, pacotes, serviços e mais."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Como usar esta página">
        Encontre o sintoma na lista e siga a solução. Se nada resolver, os
        logs são seu melhor amigo: <code>dmesg</code>, <code>/var/log/messages</code>,{" "}
        <code>/var/log/rc.log</code>.
      </AlertBox>

      <h2>Boot e Inicialização</h2>
      <CodeBlock
        code={`❌ "Kernel panic - not syncing: VFS: Unable to mount root fs"
→ initramfs sem o driver do disco no mkinitfs.conf
→ Adicione a feature (ex: nvme, virtio, ext4) e rode update-kernel

❌ Sistema cai em "single user mode" ou shell de emergência
→ fstab com UUID errado ou disco faltando
→ Boot com live USB, monte o disco, corrija /etc/fstab

❌ "No init found" ou "switch_root: failed"
→ initramfs corrompido
→ Reconstrua: mkinitfs && update-kernel

❌ Serviço não inicia no boot
→ rc-update add <servico>   (verifique com rc-update show)
→ Veja o log: cat /var/log/rc.log | grep <servico>`}
      />

      <h2>Rede</h2>
      <CodeBlock
        code={`❌ Sem internet após instalação
→ interface configurada? cat /etc/network/interfaces
→ serviço rodando? rc-service networking status
→ cabos/conexão física? ip link show eth0 (state UP?)

❌ Resolve IP mas não nome (DNS quebrado)
→ cat /etc/resolv.conf — tem nameservers?
→ Teste: dig google.com ou ping -c1 1.1.1.1

❌ "Network is unreachable"
→ Gateway configurado? ip route show default
→ Gateway acessível? ping -c2 192.168.1.1

❌ SSH: "Connection refused"
→ sshd rodando? rc-service sshd status
→ Porta certa? ss -tlnp | grep 22`}
      />

      <h2>Pacotes (apk)</h2>
      <CodeBlock
        code={`❌ "UNSATISFIABLE CONSTRAINTS: pacote (missing)"
→ Repositório community não ativado? setup-apkrepos
→ Nome correto? apk search -v <termo>
→ apk update rodou? Sempre rode antes de instalar.

❌ "BAD SIGNATURE" ou "UNTRUSTED signature"
→ Chaves desatualizadas: apk add -u alpine-keys
→ Repo de terceiros: copie a chave .pub para /etc/apk/keys/

❌ apk upgrade quebrou o sistema
→ Boot com ISO live, monte o disco, faça chroot
→ Rode: apk fix (repara pacotes quebrados)

❌ "No space left on device"
→ df -h para ver o que está cheio
→ apk cache clean (limpa cache de pacotes)
→ /tmp cheio? (tmpfs) → reboot ou aumente size= no fstab`}
      />

      <h2>Serviços e Sistema</h2>
      <CodeBlock
        code={`❌ Serviço "crashed" — não inicia nem para
→ rc-service <nome> zap  (reseta o estado)
→ rc-service <nome> start

❌ "doas: command not found" ou doas não funciona
→ Instalou? apk add doas
→ Configurou? /etc/doas.d/doas.conf com 'permit persist :wheel'
→ Usuário no grupo wheel? groups $USER

❌ Comando não encontrado ("command not found")
→ which <comando> — está instalado?
→ Se instalado: está no PATH? echo $PATH
→ Se não: apk search <comando> && apk add <pacote>

❌ Sistema lento
→ o que está consumindo recursos? htop, iostat, iotop
→ Memória acabando? free -h; processos: ps aux --sort=-%mem
→ Disco cheio? df -h
→ I/O alto? iostat -x 2 3 (coluna %util > 80%)`}
      />

      <AlertBox type="success" title="Fluxo de debug universal">
        <ol>
          <li><strong>Qual é o sintoma exato?</strong> Anote a mensagem de erro.</li>
          <li><strong>Logs:</strong> <code>dmesg | tail -30</code>, <code>tail -50 /var/log/messages</code>, <code>cat /var/log/rc.log</code></li>
          <li><strong>Estado:</strong> <code>rc-status</code>, <code>df -h</code>, <code>free -h</code>, <code>ss -tlnp</code></li>
          <li><strong>Teste mínimo:</strong> isole o problema (ping, curl local, comando manual)</li>
          <li><strong>Busque:</strong> <code>wiki.alpinelinux.org</code> + mensagem de erro no Google</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}