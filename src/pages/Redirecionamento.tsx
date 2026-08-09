import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Redirecionamento() {
  return (
    <PageContainer
      title="Redirecionamento &amp; Pipes"
      subtitle=">, >>, 2>, |, tee, xargs, /dev/null, here-docs — domine o fluxo de dados no terminal Alpine."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Terminal aberto no Alpine. Todos os conceitos funcionam no ash, bash
        e zsh — são padrão POSIX.
      </AlertBox>

      <p>
        O verdadeiro poder do terminal não está nos comandos individuais, mas
        em como você os <strong>conecta</strong>. Redirecionamentos e pipes
        transformam programas simples em pipelines de processamento de dados.
        Tudo funciona no ash do Alpine.
      </p>

      <h2>1. stdout: &gt; e &gt;&gt;</h2>
      <CodeBlock
        code={`# >  = sobrescreve o arquivo
echo "linha 1" > arquivo.txt

# >> = adiciona ao final (append)
echo "linha 2" >> arquivo.txt

# cat para conferir
cat arquivo.txt
# linha 1
# linha 2

# > para criar arquivo vazio (ou limpar existente)
> arquivo.log

# Redirecionar saída de QUALQUER comando
ls -la /etc > lista-etc.txt
apk search nginx > pacotes-nginx.txt`}
      />

      <h2>2. stderr: 2&gt; e 2&gt;&gt;</h2>
      <p>
        Programas escrevem em duas saídas independentes: stdout (1) para dados
        e stderr (2) para erros. Saber separá-las é essencial:
      </p>
      <CodeBlock
        code={`# 2>  = redireciona APENAS stderr
apk search xxx 2> erros.txt

# 2>> = append de stderr
apk search xxx 2>> erros.txt

# 2>&1 = manda stderr para ONDE stdout estiver indo
apk update > log.txt 2>&1    # stdout E stderr no mesmo arquivo

# &> = atalho para stdout + stderr (funciona no ash!)
apk update &> log.txt

# Separar stdout e stderr em arquivos diferentes
apk update > ok.txt 2> erros.txt

# Descartar stderr (mandar para /dev/null)
apk update 2>/dev/null`}
      />

      <Terminal
        title="Separando stdout de stderr"
        lines={[
          { type: "cmd", text: "ls /etc/hosts /etc/naoexiste > /tmp/out.txt 2> /tmp/err.txt" },
          { type: "cmd", text: "cat /tmp/out.txt" },
          { type: "out", text: "/etc/hosts" },
          { type: "cmd", text: "cat /tmp/err.txt" },
          { type: "out", text: "ls: /etc/naoexiste: No such file or directory" },
        ]}
      />

      <h2>3. /dev/null: o buraco negro</h2>
      <CodeBlock
        code={`# /dev/null descarta TUDO que recebe
# Útil para suprimir saída indesejada:

# Rodar comando em silêncio
apk update > /dev/null 2>&1

# Só ver o código de saída (0=ok, 1=erro)
apk search nginx > /dev/null 2>&1
echo {"$"}?     # 0 = encontrou

# Verificar se um arquivo existe sem ver output
test -f /etc/hosts && echo "existe"
# (test não produz stdout, mas ilustra o padrão)`}
      />

      <h2>4. Pipes: | (conectando comandos)</h2>
      <p>
        O pipe (<code>|</code>) pega o stdout de um comando e joga no stdin
        do próximo. É a cola que une o ecossistema Unix:
      </p>
      <CodeBlock
        code={`# Básico: filtrar saída
ps aux | grep nginx

# Múltiplos pipes
apk search -v | grep python | sort

# Combinar com redirecionamento
apk info -L nginx | grep bin > bins-do-nginx.txt

# Contar linhas (wc -l)
apk info | wc -l      # quantos pacotes instalados?

# head/tail após pipe
dmesg | tail -20

# grep antes de less (paginador)
apk info -L nginx | less`}
      />

      <Terminal
        title="Pipeline prático"
        lines={[
          { type: "cmd", text: "apk search -v | grep -i server | sort | head -5" },
          { type: "out", text: "apache2-2.4.63-r0 - A high performance Unix web server" },
          { type: "out", text: "darkhttpd-1.16-r0 - Small and secure webserver" },
          { type: "out", text: "lighttpd-1.4.78-r0 - A secure, fast, and flexible webserver" },
          { type: "comment", text: "# search → filtra → ordena → primeiras 5 linhas" },
        ]}
      />

      <h2>5. tee: bifurcando o fluxo</h2>
      <p>
        O <code>tee</code> escreve no arquivo E na tela ao mesmo tempo — como
        um T na tubulação:
      </p>
      <CodeBlock
        code={`# Ver na tela E salvar em arquivo
apk update | tee update.log

# Append (-a) em vez de sobrescrever
dmesg | tee -a /var/log/dmesg.txt

# tee com pipe continua
apk search python | tee python.txt | grep django

# tee com doas para escrever em arquivos do sistema
dmesg | doas tee /var/log/boot.txt`}
      />

      <h2>6. xargs: transformando stdin em argumentos</h2>
      <p>
        Alguns comandos não aceitam stdin — eles querem argumentos. O{" "}
        <code>xargs</code> resolve isso:
      </p>
      <CodeBlock
        code={`# Encontrar e apagar arquivos .tmp
find /tmp -name "*.tmp" | xargs rm

# Com confirmação (-p)
find /tmp -name "*.tmp" | xargs -p rm

# Lidando com espaços em nomes (-0 com find -print0)
find . -name "*.log" -print0 | xargs -0 rm

# Limitar itens por comando (-n)
echo "a b c d e f" | xargs -n 2
# a b
# c d
# e f

# Executar comando em paralelo (-P)
find . -name "*.jpg" | xargs -P 4 -I {} convert {} {}.png`}
      />

      <h2>7. Here-docs: texto multi-linha no terminal</h2>
      <p>
        Here-documents permitem escrever blocos de texto diretamente no shell,
        sem arquivos externos:
      </p>
      <CodeBlock
        code={`# Criar arquivo com múltiplas linhas
cat > config.ini << 'EOF'
[server]
host = 0.0.0.0
port = 8080
debug = false
EOF

# Passar script para um comando
doas ash << 'SCRIPT'
apk update
apk add nginx
rc-update add nginx
rc-service nginx start
SCRIPT

# Here-string (<<<) — uma linha só (funciona no bash, NÃO no ash)
# bash -c 'read a <<< "hello"; echo $a'`}
      />

      <AlertBox type="info" title="Here-docs com e sem aspas no delimitador">
        Com aspas (<code>&lt;&lt; 'EOF'</code>): o shell NÃO expande variáveis.
        Sem aspas (<code>&lt;&lt; EOF</code>): variáveis como $HOME são expandidas.
      </AlertBox>

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>&gt;</code> sobrescreve, <code>&gt;&gt;</code> adiciona</li>
          <li><code>2&gt;</code> para stderr; <code>2&gt;&amp;1</code> ou <code>&amp;&gt;</code> para juntar</li>
          <li><code>/dev/null</code> é o buraco negro — descarte o que não interessa</li>
          <li><code>|</code> conecta stdout de um comando ao stdin do próximo</li>
          <li><code>tee</code> bifurca: escreve no arquivo e mostra na tela</li>
          <li><code>xargs</code> converte stdin em argumentos de linha de comando</li>
          <li>Here-docs (<code>&lt;&lt; EOF</code>) para blocos de texto multi-linha</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}