import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as i,A as t,C as o}from"./AlertBox-C2CyWd7R.js";function r(){return e.jsxs(i,{title:"Navegação",subtitle:"pwd, cd, ls, find, which — domine a locomoção pelo sistema de arquivos com as versões BusyBox.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx(t,{type:"info",title:"Pré-requisitos",children:"Terminal aberto no Alpine. Todos os comandos deste capítulo usam as versões BusyBox — nenhum pacote extra necessário."}),e.jsxs("p",{children:["Navegar no terminal é como andar de bicicleta: depois que aprende, vira instinto. Mas o Alpine tem suas particularidades — o BusyBox implementa versões reduzidas de ",e.jsx("code",{children:"ls"}),", ",e.jsx("code",{children:"find"})," e cia. Saber as diferenças evita frustração."]}),e.jsx("h2",{children:"1. pwd: onde estou?"}),e.jsx(s,{lines:[{type:"cmd",text:"pwd"},{type:"out",text:"/home/wallyson"},{type:"cmd",text:"pwd -P"},{type:"out",text:"/home/wallyson"},{type:"comment",text:"# -P mostra o caminho físico (resolve symlinks)"}]}),e.jsx("h2",{children:"2. cd: movendo-se"}),e.jsx(o,{title:"cd — navegação essencial",code:`cd /etc                # caminho absoluto (começa com /)
cd ../                  # sobe um nível
cd ../../               # sobe dois níveis
cd ~                    # home do usuário
cd -                    # volta para o diretório anterior
cd                      # sem argumentos = home

# Dica: $OLDPWD guarda o diretório anterior
echo $OLDPWD            # onde você estava antes do último cd`}),e.jsx("h2",{children:"2. ls: listando diretórios (versão BusyBox)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"ls"})," do BusyBox cobre 90% do uso diário, mas faltam algumas flags GNU. Aqui está o que funciona:"]}),e.jsx(o,{title:"ls — flags que funcionam no BusyBox",code:`ls -l       # formato longo (permissões, tamanho, data)
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
ls --group-directories-first  # ❌`}),e.jsx(s,{title:"Exemplos práticos do ls",lines:[{type:"cmd",text:"ls -lh /etc"},{type:"out",text:"total 88K"},{type:"out",text:"-rw-r--r-- 1 root root  203 ... apk"},{type:"out",text:"drwxr-xr-x 2 root root 4.0K ... conf.d"},{type:"out",text:"-rw-r--r-- 1 root root  353 ... fstab"},{type:"cmd",text:"ls -d /etc/*.d"},{type:"out",text:"/etc/conf.d  /etc/doas.d  /etc/profile.d  ..."}]}),e.jsxs(t,{type:"info",title:"Quando precisar do ls GNU",children:[e.jsx("code",{children:"apk add coreutils"})," instala o ",e.jsx("code",{children:"ls"})," completo (com --color, --group-directories-first e todas as flags). O binário fica em"," ",e.jsx("code",{children:"/usr/bin/ls"})," e tem precedência sobre o applet BusyBox."]}),e.jsx("h2",{children:"3. find: busca de arquivos"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"find"})," do BusyBox é funcional para buscas simples. Para buscas complexas (regex, múltiplas ações), instale o pacote"," ",e.jsx("code",{children:"findutils"}),":"]}),e.jsx(o,{title:"find — padrões essenciais",code:`# BusyBox find (vem instalado)
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
# Agora find tem -regex, -printf, -delete e mais.`}),e.jsx("h2",{children:"4. which e whereis: encontrando binários"}),e.jsx(s,{title:"Localizando comandos",lines:[{type:"cmd",text:"which ls"},{type:"out",text:"/bin/ls"},{type:"comment",text:"# /bin/ls → /usr/bin/ls (symlink usrmerge)"},{type:"cmd",text:"which apk"},{type:"out",text:"/sbin/apk"},{type:"cmd",text:"which python3"},{type:"out",text:"/usr/bin/python3"},{type:"cmd",text:"which nonexistent"},{type:"out",text:""},{type:"comment",text:"# which não mostra nada se não encontrar — código de saída 1"}]}),e.jsxs("p",{children:[e.jsx("code",{children:"whereis"})," busca também páginas de manual e fontes. No Alpine, o pacote ",e.jsx("code",{children:"util-linux"})," (quase sempre instalado) fornece o whereis:"]}),e.jsx(o,{code:`whereis ls
# ls: /bin/ls /usr/share/man/man1/ls.1.gz`}),e.jsx("h2",{children:"5. Atalhos e convenções"}),e.jsx(o,{title:"Símbolos que você usa o tempo todo",code:`.   = diretório atual
..  = diretório pai
~   = home do usuário (/home/wallyson)
-   = último diretório (cd -)
/   = raiz do sistema

# Caminho absoluto: começa com /
cd /etc/nginx/conf.d/

# Caminho relativo: a partir de onde você está
cd ../conf.d/      # sobe um nível, desce pra conf.d
cd ./arquivos/     # ./ é opcional (mesmo que cd arquivos/)`}),e.jsx("h2",{children:"6. tree: visualizando a hierarquia"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"tree"})," não vem instalado, mas é um pacote de 50 KB:"]}),e.jsx(s,{title:"Instalando e usando tree",lines:[{type:"cmd",text:"apk add tree"},{type:"out",text:"OK: 50 KiB em 58 pacotes"},{type:"cmd",text:"tree -L 2 /etc/apk"},{type:"out",text:"/etc/apk"},{type:"out",text:"├── arch"},{type:"out",text:"├── cache"},{type:"out",text:"├── keys/"},{type:"out",text:"├── protected_paths.d/"},{type:"out",text:"├── repositories"},{type:"out",text:"└── world"}]}),e.jsxs(t,{type:"success",title:"Resumo",children:[e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"pwd"})," — onde estou | ",e.jsx("code",{children:"cd"})," — para onde vou"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ls -la"})," cobre 90% das listagens no BusyBox"]}),e.jsxs("li",{children:[e.jsx("code",{children:"find -name"})," funciona; para regex, ",e.jsx("code",{children:"apk add findutils"})]}),e.jsxs("li",{children:[e.jsx("code",{children:"which"})," e ",e.jsx("code",{children:"whereis"})," localizam binários"]}),e.jsxs("li",{children:["Caminhos: absoluto (",e.jsx("code",{children:"/etc"}),") vs relativo (",e.jsx("code",{children:"../conf.d"}),")"]})]}),"A navegação no Alpine é igual a qualquer Linux, com a vantagem de ser mais enxuta — menos diretórios para se perder."]})]})}export{r as default};
