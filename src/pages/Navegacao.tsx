import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Navegacao() {
  return (
    <PageContainer
      title="Navegação"
      subtitle="pwd, cd, ls, find, which — domine a locomoção pelo sistema de arquivos com as versões BusyBox."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Terminal aberto no Alpine. Todos os comandos deste capítulo usam as
        versões BusyBox — nenhum pacote extra necessário.
      </AlertBox>

      <p>
        Navegar no terminal é como andar de bicicleta: depois que aprende, vira
        instinto. Mas o Alpine tem suas particularidades — o BusyBox implementa
        versões reduzidas de <code>ls</code>, <code>find</code> e cia. Saber as
        diferenças evita frustração.
      </p>

      <h2>1. pwd: onde estou?</h2>
      <Terminal
        lines={[
          { type: "cmd", text: "pwd" },
          { type: "out", text: "/home/wallyson" },
          { type: "cmd", text: "pwd -P" },
          { type: "out", text: "/home/wallyson" },
          { type: "comment", text: "# -P mostra o caminho físico (resolve symlinks)" },
        ]}
      />

      <h2>2. cd: movendo-se</h2>
      <CodeBlock
        title="cd — navegação essencial"
        code={`cd /etc                # caminho absoluto (começa com /)
cd ../                  # sobe um nível
cd ../../               # sobe dois níveis
cd ~                    # home do usuário
cd -                    # volta para o diretório anterior
cd                      # sem argumentos = home

# Dica: $OLDPWD guarda o diretório anterior
echo $OLDPWD            # onde você estava antes do último cd`}
      />

      <h2>2. ls: listando diretórios (versão BusyBox)</h2>
      <p>
        O <code>ls</code> do BusyBox cobre 90% do uso diário, mas faltam
        algumas flags GNU. Aqui está o que funciona:
      </p>
      <CodeBlock
        title="ls — flags que funcionam no BusyBox"
        code={`ls -l       # formato longo (permissões, tamanho, data)
ls -a       # inclui arquivos ocultos (.file)
ls -la      # combina -l e -a
ls -h       # tamanhos legíveis (1K, 234M, 2G)
ls -R       # recursivo (lista subdiretórios)
ls -1       # um arquivo por linha
ls -t       # ordena por data de modificação
ls -r       # ordem reversa
ls -S       # ordena por tamanho
ls -d */    # lista só diretórios (sem conteúdo)

# Flags GNU que NÃO existem no BusyBox:
ls --color=auto     # ❌ use ls -CF ou instale coreutils
ls --group-directories-first  # ❌`}
      />

      <Terminal
        title="Exemplos práticos do ls"
        lines={[
          { type: "cmd", text: "ls -lh /etc" },
          { type: "out", text: "total 88K" },
          { type: "out", text: "-rw-r--r-- 1 root root  203 ... apk" },
          { type: "out", text: "drwxr-xr-x 2 root root 4.0K ... conf.d" },
          { type: "out", text: "-rw-r--r-- 1 root root  353 ... fstab" },
          { type: "cmd", text: "ls -d /etc/*.d" },
          { type: "out", text: "/etc/conf.d  /etc/doas.d  /etc/profile.d  ..." },
        ]}
      />

      <AlertBox type="info" title="Quando precisar do ls GNU">
        <code>apk add coreutils</code> instala o <code>ls</code> completo (com
        --color, --group-directories-first e todas as flags). O binário fica em{" "}
        <code>/usr/bin/ls</code> e tem precedência sobre o applet BusyBox.
      </AlertBox>

      <h2>3. find: busca de arquivos</h2>
      <p>
        O <code>find</code> do BusyBox é funcional para buscas simples. Para
        buscas complexas (regex, múltiplas ações), instale o pacote{" "}
        <code>findutils</code>:
      </p>
      <CodeBlock
        title="find — padrões essenciais"
        code={`# BusyBox find (vem instalado)
find /etc -name "*.conf"        # por nome exato
find /home -type f -size +1M    # arquivos maiores que 1 MB
find /tmp -type f -mtime -7     # modificados nos últimos 7 dias
find /var/log -name "*.log" -exec ls -lh {} \\;  # executa comando

# Limitações do BusyBox find:
# - Sem -regex (use findutils)
# - Sem -printf (use -exec stat ou findutils)
# - Sem -delete (use -exec rm {} \\;)

# Instalar findutils se precisar:
apk add findutils
# Agora find tem -regex, -printf, -delete e mais.`}
      />

      <h2>4. which e whereis: encontrando binários</h2>
      <Terminal
        title="Localizando comandos"
        lines={[
          { type: "cmd", text: "which ls" },
          { type: "out", text: "/bin/ls" },
          { type: "comment", text: "# /bin/ls → /usr/bin/ls (symlink usrmerge)" },
          { type: "cmd", text: "which apk" },
          { type: "out", text: "/sbin/apk" },
          { type: "cmd", text: "which python3" },
          { type: "out", text: "/usr/bin/python3" },
          { type: "cmd", text: "which nonexistent" },
          { type: "out", text: "" },
          { type: "comment", text: "# which não mostra nada se não encontrar — código de saída 1" },
        ]}
      />

      <p>
        <code>whereis</code> busca também páginas de manual e fontes. No Alpine,
        o pacote <code>util-linux</code> (quase sempre instalado) fornece o
        whereis:
      </p>
      <CodeBlock
        code={`whereis ls
# ls: /bin/ls /usr/share/man/man1/ls.1.gz`}
      />

      <h2>5. Atalhos e convenções</h2>
      <CodeBlock
        title="Símbolos que você usa o tempo todo"
        code={`.   = diretório atual
..  = diretório pai
~   = home do usuário (/home/wallyson)
-   = último diretório (cd -)
/   = raiz do sistema

# Caminho absoluto: começa com /
cd /etc/nginx/conf.d/

# Caminho relativo: a partir de onde você está
cd ../conf.d/      # sobe um nível, desce pra conf.d
cd ./arquivos/     # ./ é opcional (mesmo que cd arquivos/)`}
      />

      <h2>6. tree: visualizando a hierarquia</h2>
      <p>
        O comando <code>tree</code> não vem instalado, mas é um pacote de 50 KB:
      </p>
      <Terminal
        title="Instalando e usando tree"
        lines={[
          { type: "cmd", text: "apk add tree" },
          { type: "out", text: "OK: 50 KiB em 58 pacotes" },
          { type: "cmd", text: "tree -L 2 /etc/apk" },
          { type: "out", text: "/etc/apk" },
          { type: "out", text: "├── arch" },
          { type: "out", text: "├── cache" },
          { type: "out", text: "├── keys/" },
          { type: "out", text: "├── protected_paths.d/" },
          { type: "out", text: "├── repositories" },
          { type: "out", text: "└── world" },
        ]}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>pwd</code> — onde estou | <code>cd</code> — para onde vou</li>
          <li><code>ls -la</code> cobre 90% das listagens no BusyBox</li>
          <li><code>find -name</code> funciona; para regex, <code>apk add findutils</code></li>
          <li><code>which</code> e <code>whereis</code> localizam binários</li>
          <li>Caminhos: absoluto (<code>/etc</code>) vs relativo (<code>../conf.d</code>)</li>
        </ol>
        A navegação no Alpine é igual a qualquer Linux, com a vantagem de ser
        mais enxuta — menos diretórios para se perder.
      </AlertBox>
    </PageContainer>
  );
}