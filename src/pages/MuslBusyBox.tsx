import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function MuslBusyBox() {
  return (
    <PageContainer
      title="musl libc & BusyBox"
      subtitle="As duas peças que tornam o Alpine minúsculo — e o que muda na prática para você."
      difficulty="iniciante"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Um Alpine rodando (VM, VPS ou container) para acompanhar os comandos.
        Nenhum conhecimento prévio de sistemas é exigido.
      </AlertBox>

      <p>
        Quase todo Linux que você conhece usa a mesma dupla: <strong>glibc</strong>
        (a biblioteca C do projeto GNU) e os <strong>coreutils GNU</strong> (ls, cp,
        cat...). O Alpine trocou as duas por alternativas menores:
        <strong> musl libc</strong> e <strong>BusyBox</strong>. Este capítulo explica o
        que cada uma faz e o que muda no seu dia a dia.
      </p>

      <h2>1. O que é uma libc?</h2>
      <p>
        A <strong>biblioteca C padrão</strong> (libc) é a camada entre os programas e o
        kernel: funções como abrir arquivos, alocar memória, resolver nomes de rede e
        formatar texto passam por ela. <em>Todo</em> programa dinâmico do sistema usa a
        libc o tempo todo — ela é a peça mais fundamental do userspace.
      </p>
      <CodeBlock
        title="Comparando as libcs"
        code={`glibc
  - Padrão em Debian, Ubuntu, Fedora, RHEL
  - Enorme: otimizada para compatibilidade máxima
  - Licença LGPL
  - Recursos: locales completos, NSS, NSS-DNS, muitos "extras"

musl (usada no Alpine)
  - ~1/10 do tamanho da glibc
  - Licença MIT
  - Foco em correção e simplicidade (segue o padrão POSIX de perto)
  - Menos "mágica" implícita — comportamento mais previsível`}
      />
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "ldd --version 2>&1 | head -1" },
          { type: "out", text: "musl libc (x86_64)" },
          { type: "out", text: "Version 1.2.5" },
          { type: "cmd", text: "ls -la /lib/ld-musl-x86_64.so.1" },
          { type: "out", text: "lrwxrwxrwx    1 root     root          20 Jun 10 08:12 /lib/ld-musl-x86_64.so.1 -> /lib/libc.musl-x86_64.so.1" },
        ]}
      />

      <h2>2. A consequência prática da musl</h2>
      <p>
        Binários compilados para glibc <strong>não rodam</strong> num sistema musl (e
        vice-versa), a menos que sejam estáticos ou usem runtime próprio. É por isso que
        alguns programas baixados da internet ("baixe o binário pré-compilado") falham no
        Alpine — assunto do capítulo de software de terceiros. Em containers isso aparece
        muito: wheels de Python com binário <code>manylinux</code> às vezes precisam ser
        recompilados.
      </p>
      <AlertBox type="warning" title="musl não é glibc de outro nome">
        Se um programa fechar com "not found" num executável que existe, ou com erro
        estranho de locale, suspeite de incompatibilidade musl/glibc. O capítulo
        <strong> Compilação & build-base</strong> mostra como resolver isso compilando
        localmente.
      </AlertBox>

      <h2>3. O que é o BusyBox</h2>
      <p>
        O <strong>BusyBox</strong> é um único binário que reúne mais de 300 utilitários
        clássicos do Unix — os chamados <strong>applets</strong>: <code>ls</code>,
        <code>cp</code>, <code>grep</code>, <code>awk</code>, <code>vi</code>,
        <code>sh</code> (o shell <code>ash</code>), <code>init</code> e até
        <code>crond</code>. Cada applet é uma versão compacta, focada no essencial.
      </p>
      <CodeBlock
        title="Como funciona por dentro"
        code={`# /bin/ls NÃO é um programa "ls": é um link para o busybox
ls -la /bin/ls
# lrwxrwxrwx  1 root root  7 ... /bin/ls -> busybox

# Quando você roda "ls", o busybox verifica argv[0]
# e executa o applet correspondente. Um binário, 300+ ferramentas.

# Listar todos os applets disponíveis:
busybox --list

# Contar:
busybox --list | wc -l`}
      />
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "ls -la /bin/ls" },
          { type: "out", text: "lrwxrwxrwx    1 root     root             7 Jun 10 08:12 /bin/ls -> busybox" },
          { type: "cmd", text: "busybox --list | wc -l" },
          { type: "out", text: "312" },
          { type: "cmd", text: "du -h /bin/busybox" },
          { type: "out", text: "856.0K\t/bin/busybox" },
          { type: "ok", text: "# 312 ferramentas dentro de um binário de menos de 1 MB" },
        ]}
      />

      <h2>4. Diferenças BusyBox vs GNU no dia a dia</h2>
      <p>
        Os applets cobrem o uso comum, mas têm <strong>menos flags</strong> que as
        versões GNU. Você percebe isso em três situações típicas:
      </p>
      <CodeBlock
        title="Onde as diferenças aparecem"
        code={`# 1) --help longo pode não existir do jeito GNU:
sed --help
# O BusyBox mostra uma ajuda curta (e funcional).

# 2) Algumas flags avançadas não existem:
ps auxf
# O ps do BusyBox não aceita a combinação BSD "auxf".
# Solução: instalar o pacote procps (ps/top GNU-like):
doas apk add procps

# 3) find tem menos opções (-printf, por exemplo, não existe):
find /etc -printf '%p\\n'
# find: unrecognized: -printf
# Solução: instalar o pacote findutils:
doas apk add findutils`}
      />
      <AlertBox type="info" title="A lista de pacotes substitutos">
        Quando precisar do comportamento GNU completo: <code>apk add coreutils</code>
        (ls, cp, mv...), <code>findutils</code> (find), <code>grep</code>,
        <code>sed</code>, <code>gawk</code>, <code>procps</code> (ps/top),
        <code>tar</code>, <code>gzip</code>, <code>util-linux</code> (fdisk, lsblk...).
        Os capítulos seguintes indicam quando cada um vale a pena.
      </AlertBox>

      <h2>5. Somando tudo: o tamanho do sistema</h2>
      <p>
        A dupla musl + BusyBox é o motivo dos números impressionantes do Alpine:
      </p>
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "du -sh /bin /sbin /lib 2>/dev/null" },
          { type: "out", text: "1.5M\t/bin" },
          { type: "out", text: "12.0K\t/sbin" },
          { type: "out", text: "8.2M\t/lib" },
          { type: "cmd", text: "apk info | wc -l" },
          { type: "out", text: "54" },
          { type: "ok", text: "# binários essenciais + libs em ~10 MB. Um Ubuntu passa de 1 GB." },
        ]}
      />

      <h2>6. Verificando a dupla no seu sistema</h2>
      <CodeBlock
        title="Checklist musl + BusyBox"
        code={`# 1. Confirmar que a libc é a musl:
ldd --version 2>&1 | head -1

# 2. Confirmar que /bin/ls é um applet:
readlink /bin/ls

# 3. Confirmar que o shell é o ash (applet do BusyBox):
readlink /bin/sh

# 4. Ver a versão do BusyBox:
busybox | head -1`}
      />

      <AlertBox type="success" title="Resumo">
        musl (libc pequena e correta) + BusyBox (300+ ferramentas num binário) são a base
        da leveza do Alpine. O custo: menos flags por ferramenta e incompatibilidade com
        binários feitos para glibc — sempre resolvível com os pacotes certos.
      </AlertBox>
    </PageContainer>
  );
}
