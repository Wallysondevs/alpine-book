import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function SistemaArquivos() {
  return (
    <PageContainer
      title="Hierarquia &amp; BusyBox"
      subtitle="Entenda a árvore de diretórios do Alpine, o que faz cada pasta, e como o BusyBox molda o sistema de arquivos."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado e terminal aberto. Este capítulo é teórico-prático —
        leia com o shell do lado para explorar enquanto aprende.
      </AlertBox>

      <p>
        O Alpine segue o FHS (Filesystem Hierarchy Standard), mas com adaptações
        minimalistas. Quem vem do Debian/Ubuntu sente diferenças: binários
        unificados, ausência de certas pastas, e a onipresença do BusyBox. Este
        capítulo percorre cada diretório e explica o que realmente importa.
      </p>

      {/* ===== SEÇÃO 1 ===== */}
      <h2>1. Visão geral: a raiz do sistema</h2>
      <Terminal
        title="O que tem na raiz depois de uma instalação limpa"
        lines={[
          { type: "cmd", text: "ls -1 /" },
          { type: "out", text: "bin" },
          { type: "out", text: "boot" },
          { type: "out", text: "dev" },
          { type: "out", text: "etc" },
          { type: "out", text: "home" },
          { type: "out", text: "lib" },
          { type: "out", text: "media" },
          { type: "out", text: "mnt" },
          { type: "out", text: "opt" },
          { type: "out", text: "proc" },
          { type: "out", text: "root" },
          { type: "out", text: "run" },
          { type: "out", text: "sbin" },
          { type: "out", text: "srv" },
          { type: "out", text: "sys" },
          { type: "out", text: "tmp" },
          { type: "out", text: "usr" },
          { type: "out", text: "var" },
          { type: "comment", text: "# 19 diretórios. Um Debian típico tem 22+." },
        ]}
      />

      {/* ===== SEÇÃO 2 ===== */}
      <h2>2. /bin, /sbin e o usrmerge</h2>
      <p>
        No Alpine, <code>/bin</code> e <code>/sbin</code> são <strong>symlinks
        para <code>/usr/bin</code></strong>. É o chamado <em>usrmerge</em> —
        todos os binários ficam num lugar só:
      </p>
      <Terminal
        title="A verdade sobre /bin e /sbin"
        lines={[
          { type: "cmd", text: "ls -l /bin" },
          { type: "out", text: "lrwxrwxrwx 1 root root 7 ... /bin -> usr/bin" },
          { type: "cmd", text: "ls -l /sbin" },
          { type: "out", text: "lrwxrwxrwx 1 root root 8 ... /sbin -> usr/sbin" },
          { type: "cmd", text: "ls -l /lib" },
          { type: "out", text: "lrwxrwxrwx 1 root root 7 ... /lib -> usr/lib" },
          { type: "comment", text: "# Tudo unificado. Sem /bin vs /usr/bin para se preocupar." },
        ]}
      />

      <p>
        O Debian também adotou usrmerge (desde o Debian 10), mas no Alpine é
        obrigatório — a ISO já vem assim. Isso significa que você pode usar{" "}
        <code>/bin/ls</code> ou <code>/usr/bin/ls</code> indistintamente.
      </p>

      <AlertBox type="info" title="Por que isso importa?">
        Scripts que usam shebangs como <code>#!/bin/bash</code> funcionam
        normalmente porque <code>/bin</code> resolve para <code>/usr/bin</code>.
        Já em sistemas sem usrmerge, <code>/bin/bash</code> poderia não existir.
      </AlertBox>

      {/* ===== SEÇÃO 3 ===== */}
      <h2>3. /etc — o centro de controle</h2>
      <p>
        O Alpine concentra configurações em <code>/etc</code> de forma mais
        organizada que outras distros. Destaques:
      </p>
      <CodeBlock
        title="Diretórios essenciais dentro de /etc"
        code={`/etc/apk/            ← repositórios, chaves, world, cache config
/etc/conf.d/         ← config de serviços OpenRC (hostname, keymaps, ...)
/etc/init.d/         ← scripts de init do OpenRC
/etc/runlevels/      ← quais serviços iniciam em cada runlevel
/etc/periodic/       ← scripts executados periodicamente (crond)
/etc/doas.d/         ← configuração do doas (equivalente ao sudoers.d)
/etc/ssh/            ← sshd_config, chaves do host
/etc/profile.d/      ← scripts carregados no login (.profile)`}
      />

      <p>
        A diferença mais visível: no Alpine, cada serviço OpenRC tem suas
        variáveis de configuração em <code>/etc/conf.d/&lt;serviço&gt;</code>{" "}
        em vez de editar o script de init diretamente:
      </p>
      <CodeBlock
        title="Exemplo: config do hostname"
        code={`# No Alpine, o hostname fica em:
cat /etc/conf.d/hostname
# hostname="alpine-server"

# E o script de init lê essa variável:
# /etc/init.d/hostname → source /etc/conf.d/hostname`}
      />

      {/* ===== SEÇÃO 4 ===== */}
      <h2>4. /tmp: um sistema de arquivos em RAM</h2>
      <p>
        Por padrão, o Alpine monta <code>/tmp</code> como <strong>tmpfs</strong>{" "}
        — um disco virtual na RAM. Tudo que você coloca lá <strong>some no
        reboot</strong>:
      </p>
      <Terminal
        title="Confirmando que /tmp é tmpfs"
        lines={[
          { type: "cmd", text: "mount | grep /tmp" },
          { type: "out", text: "tmpfs on /tmp type tmpfs (rw,noatime,size=...) " },
          { type: "cmd", text: "df -h /tmp" },
          { type: "out", text: "Filesystem      Size  Used Avail Use% Mounted on" },
          { type: "out", text: "tmpfs           1.9G  156K  1.9G   1% /tmp" },
          { type: "comment", text: "# Metade da RAM por padrão, configurável." },
        ]}
      />

      <p>
        Isso é ótimo para performance (arquivos temporários não tocam o disco),
        mas requer atenção:
      </p>
      <CodeBlock
        title="Ajustando o tmpfs do /tmp"
        code={`# Ver o tamanho atual
df -h /tmp

# Aumentar o /tmp para 4 GB (em /etc/fstab):
tmpfs   /tmp   tmpfs   size=4G,noatime   0 0

# Para arquivos que precisam sobreviver ao reboot:
# Use /var/tmp (persiste em disco)`}
      />

      {/* ===== SEÇÃO 5 ===== */}
      <h2>5. /var: dados que persistem</h2>
      <p>
        Enquanto <code>/tmp</code> é volátil, <code>/var</code> é persistente.
        Aqui moram os dados que mudam durante a operação do sistema:
      </p>
      <CodeBlock
        title="O que vive em /var"
        code={`/var/cache/apk/      ← pacotes .apk baixados (limpe com apk cache clean)
/var/log/            ← logs do sistema (se syslog estiver instalado)
/var/lib/            ← dados de estado (bancos, docker, etc.)
/var/spool/cron/     ← crontabs dos usuários
/var/tmp/            ← temporários persistentes (sobrevivem ao reboot)
/var/www/            ← raiz de servidores web (Caddy, Nginx)
/var/mail/           ← mail spool`}
      />

      {/* ===== SEÇÃO 6 ===== */}
      <h2>6. /proc e /sys: janelas para o kernel</h2>
      <p>
        <code>/proc</code> e <code>/sys</code> são pseudo-sistemas de arquivos
        que expõem informações do kernel. Não ocupam espaço em disco — são
        gerados em tempo real:
      </p>
      <CodeBlock
        title="Consultas rápidas em /proc e /sys"
        code={`# /proc — informações de processos e sistema
cat /proc/cpuinfo        # detalhes da CPU
cat /proc/meminfo        # memória (free -h é mais legível)
cat /proc/version        # versão do kernel
cat /proc/uptime         # segundos desde o boot (1º número)
cat /proc/loadavg        # load average (1, 5, 15 min)

# /sys — parâmetros do kernel e dispositivos
cat /sys/class/net/eth0/address   # MAC address
cat /sys/block/sda/size           # tamanho do disco em setores`}
      />

      {/* ===== SEÇÃO 7 ===== */}
      <h2>7. /dev: dispositivos são arquivos</h2>
      <p>
        No Linux, tudo é arquivo — inclusive discos, terminais e dispositivos:
      </p>
      <CodeBlock
        title="Dispositivos essenciais em /dev"
        code={`/dev/sda, /dev/nvme0n1   ← discos
/dev/sda1, /dev/sda2        ← partições
/dev/tty1, /dev/ttyS0       ← terminais
/dev/null                   ← buraco negro (descarta tudo)
/dev/zero                   ← fonte infinita de zeros
/dev/random, /dev/urandom   ← entropia
/dev/stdin, /dev/stdout     ← entrada/saída padrão`}
      />

      {/* ===== SEÇÃO 8 ===== */}
      <h2>8. Filesystem em modo diskless (overlay)</h2>
      <p>
        No modo <strong>diskless</strong> (ou <em>data</em>), o Alpine carrega o
        sistema base numa imagem squashfs na RAM e usa um <strong>overlay
        filesystem</strong> para modificações:
      </p>
      <CodeBlock
        title="Como funciona o overlay no diskless"
        code={`# Camadas do overlay:
# lowerdir  = sistema base read-only (ISO/APKs na RAM)
# upperdir  = modificações (gravadas em disco/USB, se configurado)
# workdir   = diretório de trabalho do overlay

# O resultado: você "escreve" em /etc, /home, /var...
# mas na verdade está escrevendo na camada superior.
# O sistema base permanece imutável.

# Modo sys (instalação normal em disco) NÃO usa overlay —
# é um filesystem ext4/xfs normal, como qualquer distro.`}
      />

      {/* ===== SEÇÃO 9 ===== */}
      <h2>9. apk audit: arquivos modificados</h2>
      <p>
        O comando <code>apk audit</code> compara os arquivos instalados com o
        que o pacote espera. É uma ferramenta de integridade e diagnóstico:
      </p>
      <Terminal
        title="Auditando o sistema de arquivos"
        lines={[
          { type: "cmd", text: "apk audit" },
          { type: "out", text: "No missing files or dependencies detected." },
          { type: "ok", text: "# Sistema íntegro — nenhum arquivo corrompido." },
          { type: "cmd", text: "apk audit --backup" },
          { type: "warn", text: "M /etc/nginx/nginx.conf" },
          { type: "warn", text: "M /etc/ssh/sshd_config" },
          { type: "comment", text: "# M = Modificado. Você editou esses arquivos." },
          { type: "cmd", text: "apk audit --system" },
          { type: "warn", text: "A /root/meu-script.sh" },
          { type: "comment", text: "# A = Adicionado. Não veio de nenhum pacote." },
        ]}
      />

      <AlertBox type="warning" title="apk audit não é verificação de segurança">
        O <code>apk audit</code> mostra o que difere do pacote original — útil
        para saber o que você customizou. Para verificar <em>intrusão</em>, você
        precisa de ferramentas como AIDE, Tripwire ou verificadores de checksum.
      </AlertBox>

      {/* ===== SEÇÃO 10 ===== */}
      <h2>10. Alpine vs Debian: diferenças na estrutura</h2>
      <CodeBlock
        title="O que muda de Debian para Alpine na árvore de diretórios"
        code={`Característica         Debian/Ubuntu              Alpine
─────────────────────   ────────────────────────   ──────────────────────
Shell padrão           /bin/bash (GNU bash)       /bin/sh → busybox ash
Coreutils              GNU coreutils               BusyBox (applets)
/lib structure         /lib/x86_64-linux-gnu/      /lib/ (mais enxuto)
/usr merge             Opcional (padrão no 10+)    Obrigatório
Locales                /usr/share/locale/ (cheio)  /usr/share/locale/ (vazio)
Tmpfiles               systemd-tmpfiles            OpenRC (bootmisc)
Logs                   /var/log/syslog (rsyslog)   /var/log/messages (opcional)
Documentação           /usr/share/doc/ (extenso)   /usr/share/doc/ (mínimo)
Init                   systemd                     OpenRC`}
      />

      <AlertBox type="success" title="Resumo">
        O sistema de arquivos do Alpine é FHS com minimalismo:
        <ol>
          <li><strong>usrmerge</strong> — /bin, /sbin e /lib são symlinks para /usr</li>
          <li><strong>/etc/conf.d/</strong> — configs de serviços centralizadas</li>
          <li><strong>/tmp</strong> — tmpfs (RAM), volátil por padrão</li>
          <li><strong>BusyBox</strong> — a maioria dos comandos são applets de um binário só</li>
          <li><strong>apk audit</strong> — descubra o que foi modificado no sistema</li>
        </ol>
        Conhecer sua árvore de diretórios é o primeiro passo para administrar
        qualquer Linux com confiança. No Alpine, isso é mais simples que em
        qualquer outra distro.
      </AlertBox>
    </PageContainer>
  );
}