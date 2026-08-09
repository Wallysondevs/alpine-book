import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as r,A as o,C as a}from"./AlertBox-C2CyWd7R.js";function i(){return e.jsxs(r,{title:"Redirecionamento & Pipes",subtitle:">, >>, 2>, |, tee, xargs, /dev/null, here-docs — domine o fluxo de dados no terminal Alpine.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Terminal aberto no Alpine. Todos os conceitos funcionam no ash, bash e zsh — são padrão POSIX."}),e.jsxs("p",{children:["O verdadeiro poder do terminal não está nos comandos individuais, mas em como você os ",e.jsx("strong",{children:"conecta"}),". Redirecionamentos e pipes transformam programas simples em pipelines de processamento de dados. Tudo funciona no ash do Alpine."]}),e.jsx("h2",{children:"1. stdout: > e >>"}),e.jsx(a,{code:`# >  = sobrescreve o arquivo
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
apk search nginx > pacotes-nginx.txt`}),e.jsx("h2",{children:"2. stderr: 2> e 2>>"}),e.jsx("p",{children:"Programas escrevem em duas saídas independentes: stdout (1) para dados e stderr (2) para erros. Saber separá-las é essencial:"}),e.jsx(a,{code:`# 2>  = redireciona APENAS stderr
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
apk update 2>/dev/null`}),e.jsx(s,{title:"Separando stdout de stderr",lines:[{type:"cmd",text:"ls /etc/hosts /etc/naoexiste > /tmp/out.txt 2> /tmp/err.txt"},{type:"cmd",text:"cat /tmp/out.txt"},{type:"out",text:"/etc/hosts"},{type:"cmd",text:"cat /tmp/err.txt"},{type:"out",text:"ls: /etc/naoexiste: No such file or directory"}]}),e.jsx("h2",{children:"3. /dev/null: o buraco negro"}),e.jsx(a,{code:`# /dev/null descarta TUDO que recebe
# Útil para suprimir saída indesejada:

# Rodar comando em silêncio
apk update > /dev/null 2>&1

# Só ver o código de saída (0=ok, 1=erro)
apk search nginx > /dev/null 2>&1
echo {"$"}?     # 0 = encontrou

# Verificar se um arquivo existe sem ver output
test -f /etc/hosts && echo "existe"
# (test não produz stdout, mas ilustra o padrão)`}),e.jsx("h2",{children:"4. Pipes: | (conectando comandos)"}),e.jsxs("p",{children:["O pipe (",e.jsx("code",{children:"|"}),") pega o stdout de um comando e joga no stdin do próximo. É a cola que une o ecossistema Unix:"]}),e.jsx(a,{code:`# Básico: filtrar saída
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
apk info -L nginx | less`}),e.jsx(s,{title:"Pipeline prático",lines:[{type:"cmd",text:"apk search -v | grep -i server | sort | head -5"},{type:"out",text:"apache2-2.4.63-r0 - A high performance Unix web server"},{type:"out",text:"darkhttpd-1.16-r0 - Small and secure webserver"},{type:"out",text:"lighttpd-1.4.78-r0 - A secure, fast, and flexible webserver"},{type:"comment",text:"# search → filtra → ordena → primeiras 5 linhas"}]}),e.jsx("h2",{children:"5. tee: bifurcando o fluxo"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"tee"})," escreve no arquivo E na tela ao mesmo tempo — como um T na tubulação:"]}),e.jsx(a,{code:`# Ver na tela E salvar em arquivo
apk update | tee update.log

# Append (-a) em vez de sobrescrever
dmesg | tee -a /var/log/dmesg.txt

# tee com pipe continua
apk search python | tee python.txt | grep django

# tee com doas para escrever em arquivos do sistema
dmesg | doas tee /var/log/boot.txt`}),e.jsx("h2",{children:"6. xargs: transformando stdin em argumentos"}),e.jsxs("p",{children:["Alguns comandos não aceitam stdin — eles querem argumentos. O"," ",e.jsx("code",{children:"xargs"})," resolve isso:"]}),e.jsx(a,{code:`# Encontrar e apagar arquivos .tmp
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
find . -name "*.jpg" | xargs -P 4 -I {} convert {} {}.png`}),e.jsx("h2",{children:"7. Here-docs: texto multi-linha no terminal"}),e.jsx("p",{children:"Here-documents permitem escrever blocos de texto diretamente no shell, sem arquivos externos:"}),e.jsx(a,{code:`# Criar arquivo com múltiplas linhas
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
# bash -c 'read a <<< "hello"; echo $a'`}),e.jsxs(o,{type:"info",title:"Here-docs com e sem aspas no delimitador",children:["Com aspas (",e.jsx("code",{children:"<< 'EOF'"}),"): o shell NÃO expande variáveis. Sem aspas (",e.jsx("code",{children:"<< EOF"}),"): variáveis como $HOME são expandidas."]}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:">"})," sobrescreve, ",e.jsx("code",{children:">>"})," adiciona"]}),e.jsxs("li",{children:[e.jsx("code",{children:"2>"})," para stderr; ",e.jsx("code",{children:"2>&1"})," ou ",e.jsx("code",{children:"&>"})," para juntar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/dev/null"})," é o buraco negro — descarte o que não interessa"]}),e.jsxs("li",{children:[e.jsx("code",{children:"|"})," conecta stdout de um comando ao stdin do próximo"]}),e.jsxs("li",{children:[e.jsx("code",{children:"tee"})," bifurca: escreve no arquivo e mostra na tela"]}),e.jsxs("li",{children:[e.jsx("code",{children:"xargs"})," converte stdin em argumentos de linha de comando"]}),e.jsxs("li",{children:["Here-docs (",e.jsx("code",{children:"<< EOF"}),") para blocos de texto multi-linha"]})]})})]})}export{i as default};
