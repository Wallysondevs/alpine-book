import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ManPages() {
  return (
    <PageContainer
      title="Documentação — man pages"
      subtitle="O Alpine não traz man pages por padrão. Instale, use man, whatis, apropos e descubra a documentação offline."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <AlertBox type="warning" title="man NÃO vem instalado!">
        O Alpine minimalista remove as man pages para economizar espaço. Se
        você tentar <code>man ls</code> num Alpine recém-instalado, vai receber
        "man: command not found". Instalar são dois comandos.
      </AlertBox>

      <p>
        Documentação offline é essencial em servidores sem internet ou quando
        você quer confirmar uma flag sem abrir o navegador. O Alpine separa as
        man pages em pacotes — você instala só o que precisa.
      </p>

      <h2>1. Instalando o sistema de man</h2>
      <Terminal
        title="Instalação completa de man pages"
        lines={[
          { type: "cmd", text: "apk add man-pages mandoc" },
          { type: "out", text: "(1/3) Installing man-pages (documentação base)" },
          { type: "out", text: "(2/3) Installing mandoc (visualizador leve)" },
          { type: "out", text: "(3/3) Installing mandoc-apropos (busca)" },
          { type: "ok", text: "# ~2 MB. Agora man funciona." },
          { type: "cmd", text: "man ls" },
          { type: "out", text: "LS(1)           User Commands          LS(1)" },
          { type: "out", text: "NAME" },
          { type: "out", text: "   ls - list directory contents" },
          { type: "out", text: "..." },
        ]}
      />

      <AlertBox type="info" title="mandoc é o visualizador padrão do Alpine">
        O Alpine usa <code>mandoc</code> em vez do <code>man-db</code> (Debian)
        ou <code>man</code> tradicional. Mais leve, mesma funcionalidade.
        O comando <code>man</code> é um symlink para <code>mandoc</code>.
      </AlertBox>

      <h2>2. Seções do manual</h2>
      <CodeBlock
        title="As 9 seções do manual Unix"
        code={`1   Comandos de usuário        man 1 ls
2   Chamadas de sistema         man 2 open
3   Funções de biblioteca       man 3 printf
4   Dispositivos e drivers      man 4 tty
5   Formatos de arquivo         man 5 crontab
6   Jogos                       man 6 fortune
7   Miscelânea                  man 7 signal
8   Administração do sistema    man 8 mount
9   Kernel                      man 9 modules

# Quando um termo existe em várias seções:
man printf     # mostra seção 1 (comando)
man 3 printf   # mostra seção 3 (função C)

# Descobrir em quais seções um termo aparece:
whatis printf
# printf (1) - format and print data
# printf (3) - formatted output conversion`}
      />

      <h2>3. whatis e apropos: buscando</h2>
      <Terminal
        lines={[
          { type: "cmd", text: "whatis tar" },
          { type: "out", text: "tar (1) - archiving utility" },
          { type: "cmd", text: "apropos partition" },
          { type: "out", text: "fdisk (8) - manipulate disk partition table" },
          { type: "out", text: "sfdisk (8) - display or manipulate a disk partition table" },
          { type: "out", text: "parted (8) - a partition manipulation program" },
          { type: "comment", text: "# apropos busca na DESCRIÇÃO, não só no nome." },
          { type: "cmd", text: "apropos -s 1,8 network" },
          { type: "comment", text: "# Busca nas seções 1 e 8 (comandos + admin)" },
        ]}
      />

      <h2>4. --help: documentação instantânea</h2>
      <p>
        Muitos comandos trazem ajuda embutida com <code>--help</code>. Não
        substitui o man, mas é mais rápido para flags:
      </p>
      <CodeBlock
        code={`# Ajuda rápida (funciona em quase todos os comandos)
apk --help
tar --help
grep --help

# BusyBox: ajuda compacta
busybox --help       # lista todos os applets
busybox ls --help    # ajuda do applet ls

# Comandos sem man page (scripts, ferramentas próprias)
setup-alpine --help  # o assistente de instalação`}
      />

      <h2>5. Documentação online do Alpine</h2>
      <CodeBlock
        title="Recursos oficiais"
        code={`# Wiki oficial (a documentação de referência)
# https://wiki.alpinelinux.org/

# Páginas de manual online
# https://man.archlinux.org/  (Arch, mas a maioria dos comandos é igual)
# https://linux.die.net/man/

# Documentação de pacotes: descrição e dependências
apk info -d nginx
apk info -d docker

# Lista de arquivos de um pacote
apk info -L nginx | grep -E "\.1$|\.5$|\.8$"
# Procura por man pages dentro do pacote.`}
      />

      <h2>6. Man pages por pacote</h2>
      <p>
        Muitos pacotes no Alpine separam a documentação em subpacotes{" "}
        <code>-doc</code>. Se o <code>man</code> não encontra nada:
      </p>
      <CodeBlock
        title="Instalando documentação de um pacote específico"
        code={`# Exemplo: documentação do Nginx
apk search nginx-doc
# nginx-doc-1.28.0-r0

apk add nginx-doc
man nginx   # agora funciona!

# Outros pacotes -doc comuns:
# openssh-doc, bash-doc, git-doc, python3-doc...

# Se não existir -doc, veja se o pacote base já inclui:
apk info -L nginx | grep man`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add man-pages mandoc</code> — instala o sistema de man</li>
          <li><code>man &lt;comando&gt;</code> — manual; <code>man &lt;seção&gt; &lt;comando&gt;</code> — seção específica</li>
          <li><code>whatis</code> — descrição curta; <code>apropos</code> — busca por palavra-chave</li>
          <li><code>--help</code> para ajuda rápida; <code>wiki.alpinelinux.org</code> para tutoriais</li>
          <li>Pacotes <code>-doc</code> contêm man pages adicionais</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}