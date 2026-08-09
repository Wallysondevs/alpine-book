import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Visualizacao() {
  return (
    <PageContainer
      title="Visualização de Arquivos"
      subtitle="cat, head, tail, less, grep, strings, file — leia e inspecione qualquer arquivo no terminal."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Navegação básica (<code>cd</code>, <code>ls</code>). O Alpine já traz
        todos os comandos deste capítulo via BusyBox.
      </AlertBox>

      <p>
        Antes de editar, você quer <strong>ver</strong> o que está no arquivo.
        Seja um log de 50 MB ou um config de 10 linhas, o Alpine tem as
        ferramentas certas — começando pelas versões BusyBox e subindo para os
        pacotes completos quando necessário.
      </p>

      <h2>1. cat: o canivete suíço</h2>
      <p>
        <code>cat</code> (concatenate) joga o conteúdo do arquivo na tela. Para
        arquivos pequenos, é a ferramenta mais rápida:
      </p>
      <CodeBlock
        title="cat — usos essenciais"
        code={`cat arquivo.txt           # exibe o conteúdo
cat -n arquivo.txt         # numera as linhas
cat -b arquivo.txt         # numera só linhas não-vazias
cat arq1.txt arq2.txt      # concatena múltiplos arquivos
cat arq1.txt arq2.txt > uniao.txt  # junta num arquivo novo

# ⚠️  NUNCA use cat em arquivos binários — vai bagunçar o terminal.
#     Se acontecer, digite: reset (Enter)`}
      />

      <h2>2. head e tail: primeiras e últimas linhas</h2>
      <Terminal
        title="head e tail em ação"
        lines={[
          { type: "cmd", text: "head -5 /etc/apk/repositories" },
          { type: "out", text: "https://dl-cdn.alpinelinux.org/alpine/v3.24/main" },
          { type: "out", text: "https://dl-cdn.alpinelinux.org/alpine/v3.24/community" },
          { type: "cmd", text: "tail -3 /var/log/messages" },
          { type: "out", text: "Aug  9 14:00:00 alpine cron[1234]: ..." },
        ]}
      />

      <CodeBlock
        title="head e tail — flags importantes"
        code={`head -20 arquivo           # primeiras 20 linhas
tail -20 arquivo           # últimas 20 linhas
tail -f /var/log/syslog    # SEGUE o arquivo (live — Ctrl+C para sair)
tail -F /var/log/syslog    # segue, mas reconecta se o arquivo for rotacionado
head -c 100 arquivo        # primeiros 100 BYTES (não linhas)

# O tail -f é a ferramenta #1 para debugging em tempo real.`}
      />

      <h2>3. less: paginador interativo</h2>
      <p>
        Para arquivos grandes, <code>less</code> permite rolar, buscar e navegar:
      </p>
      <CodeBlock
        title="less — comandos de navegação"
        code={`less arquivo.log         # abre o arquivo

# Navegação dentro do less:
# Espaço       → próxima página
# b            → página anterior
# g            → início do arquivo
# G            → final do arquivo
# /palavra     → busca para frente
# ?palavra     → busca para trás
# n            → próxima ocorrência
# q            → sair

# ⚠️  No Alpine, less NÃO vem instalado. O BusyBox tem 'more',
#     que é mais limitado (só rola para frente).

apk add less              # instala o less completo (recomendado)`}
      />

      <AlertBox type="info" title="more (BusyBox) vs less">
        O <code>more</code> do BusyBox só desce (<code>Enter</code> = uma linha,
        <code>Espaço</code> = uma página). Não sobe, não busca. Instale{" "}
        <code>less</code> para um paginador de verdade — são 150 KB.
      </AlertBox>

      <h2>4. grep: busca em arquivos</h2>
      <p>
        O <code>grep</code> do BusyBox é suficiente para buscas simples. Para
        regex avançado, instale o pacote <code>grep</code> (GNU grep):
      </p>
      <CodeBlock
        title="grep — padrões essenciais"
        code={`grep "erro" arquivo.log           # busca a palavra 'erro'
grep -i "error" *.log             # case-insensitive
grep -r "listen" /etc/            # recursivo em diretórios
grep -v "debug" arquivo.log       # EXCLUI linhas com 'debug'
grep -n "error" arquivo.log       # mostra número da linha
grep -c "error" arquivo.log       # conta ocorrências
grep -l "error" *.log             # mostra só nomes de arquivos
grep -A 3 "error" arquivo.log     # 3 linhas DEPOIS da ocorrência
grep -B 3 "error" arquivo.log     # 3 linhas ANTES da ocorrência
grep -C 3 "error" arquivo.log     # 3 linhas de contexto (antes + depois)

# ⚠️  -A/-B/-C NÃO existem no BusyBox grep. Instale: apk add grep`}
      />

      <Terminal
        title="grep no dia a dia"
        lines={[
          { type: "cmd", text: "grep -i \"error\" /var/log/messages | tail -5" },
          { type: "out", text: "Aug  9 13:45:00 alpine daemon.err sshd[1234]: error: ..." },
          { type: "cmd", text: "grep -r \"PermitRootLogin\" /etc/ssh/" },
          { type: "out", text: "/etc/ssh/sshd_config:#PermitRootLogin prohibit-password" },
          { type: "out", text: "/etc/ssh/sshd_config:PermitRootLogin no" },
        ]}
      />

      <h2>5. file: identificando tipos de arquivo</h2>
      <p>
        O Linux não usa extensões para determinar o tipo de arquivo — usa{" "}
        <em>magic bytes</em>. O comando <code>file</code> lê esses bytes:
      </p>
      <Terminal
        title="file identifica qualquer coisa"
        lines={[
          { type: "cmd", text: "file /bin/ls" },
          { type: "out", text: "/bin/ls: symbolic link to usr/bin/ls" },
          { type: "cmd", text: "file /usr/bin/ls" },
          { type: "out", text: "/usr/bin/ls: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-musl-x86_64.so.1" },
          { type: "cmd", text: "file documento.pdf" },
          { type: "out", text: "documento.pdf: PDF document, version 1.4" },
          { type: "cmd", text: "file foto.jpg" },
          { type: "out", text: "foto.jpg: JPEG image data, Exif standard" },
        ]}
      />

      <AlertBox type="info" title="file no Alpine">
        O <code>file</code> <strong>não vem instalado</strong> por padrão. Use{" "}
        <code>apk add file</code> (~50 KB, vale cada byte).
      </AlertBox>

      <h2>6. strings: extraindo texto de binários</h2>
      <p>
        Arquivos binários contêm texto embutido — mensagens de erro, URLs,
        credenciais hardcoded. O <code>strings</code> extrai tudo:
      </p>
      <CodeBlock
        title="strings — caçando texto em binários"
        code={`# Buscar texto legível em um executável
strings /usr/bin/ssh | grep -i "usage"

# Encontrar URLs em binários (engenharia reversa leve)
strings /usr/bin/curl | grep "https://"

# strings também é BusyBox — funcional mas limitado
# Para strings GNU completo: apk add binutils`}
      />

      <h2>7. hexdump: vendo os bytes crus</h2>
      <p>
        Para inspecionar arquivos no nível mais baixo possível:
      </p>
      <CodeBlock
        title="hexdump e od"
        code={`# hexdump (BusyBox)
hexdump -C arquivo.bin | head
# 00000000  7f 45 4c 46 02 01 01 00  ...

# od (octal dump — também BusyBox)
od -c arquivo           # mostra caracteres
od -x arquivo           # mostra em hexadecimal

# Para hexdump completo: apk add util-linux`}
      />

      <AlertBox type="success" title="Resumo: qual ferramenta para cada situação">
        <ol>
          <li>Arquivo pequeno → <code>cat</code> ou <code>cat -n</code></li>
          <li>Começo/fim rápido → <code>head</code> / <code>tail</code></li>
          <li>Arquivo grande, navegar → <code>less</code> (instale: <code>apk add less</code>)</li>
          <li>Buscar texto → <code>grep</code> (para grep completo: <code>apk add grep</code>)</li>
          <li>Identificar tipo → <code>file</code> (instale: <code>apk add file</code>)</li>
          <li>Extrair texto de binário → <code>strings</code></li>
          <li>Ver bytes crus → <code>hexdump -C</code></li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}