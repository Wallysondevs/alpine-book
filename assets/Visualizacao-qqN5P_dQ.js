import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as o,A as i,C as a}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(o,{title:"Visualização de Arquivos",subtitle:"cat, head, tail, less, grep, strings, file — leia e inspecione qualquer arquivo no terminal.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs(i,{type:"info",title:"Pré-requisitos",children:["Navegação básica (",e.jsx("code",{children:"cd"}),", ",e.jsx("code",{children:"ls"}),"). O Alpine já traz todos os comandos deste capítulo via BusyBox."]}),e.jsxs("p",{children:["Antes de editar, você quer ",e.jsx("strong",{children:"ver"})," o que está no arquivo. Seja um log de 50 MB ou um config de 10 linhas, o Alpine tem as ferramentas certas — começando pelas versões BusyBox e subindo para os pacotes completos quando necessário."]}),e.jsx("h2",{children:"1. cat: o canivete suíço"}),e.jsxs("p",{children:[e.jsx("code",{children:"cat"})," (concatenate) joga o conteúdo do arquivo na tela. Para arquivos pequenos, é a ferramenta mais rápida:"]}),e.jsx(a,{title:"cat — usos essenciais",code:`cat arquivo.txt           # exibe o conteúdo
cat -n arquivo.txt         # numera as linhas
cat -b arquivo.txt         # numera só linhas não-vazias
cat arq1.txt arq2.txt      # concatena múltiplos arquivos
cat arq1.txt arq2.txt > uniao.txt  # junta num arquivo novo

# ⚠️  NUNCA use cat em arquivos binários — vai bagunçar o terminal.
#     Se acontecer, digite: reset (Enter)`}),e.jsx("h2",{children:"2. head e tail: primeiras e últimas linhas"}),e.jsx(s,{title:"head e tail em ação",lines:[{type:"cmd",text:"head -5 /etc/apk/repositories"},{type:"out",text:"https://dl-cdn.alpinelinux.org/alpine/v3.24/main"},{type:"out",text:"https://dl-cdn.alpinelinux.org/alpine/v3.24/community"},{type:"cmd",text:"tail -3 /var/log/messages"},{type:"out",text:"Aug  9 14:00:00 alpine cron[1234]: ..."}]}),e.jsx(a,{title:"head e tail — flags importantes",code:`head -20 arquivo           # primeiras 20 linhas
tail -20 arquivo           # últimas 20 linhas
tail -f /var/log/syslog    # SEGUE o arquivo (live — Ctrl+C para sair)
tail -F /var/log/syslog    # segue, mas reconecta se o arquivo for rotacionado
head -c 100 arquivo        # primeiros 100 BYTES (não linhas)

# O tail -f é a ferramenta #1 para debugging em tempo real.`}),e.jsx("h2",{children:"3. less: paginador interativo"}),e.jsxs("p",{children:["Para arquivos grandes, ",e.jsx("code",{children:"less"})," permite rolar, buscar e navegar:"]}),e.jsx(a,{title:"less — comandos de navegação",code:`less arquivo.log         # abre o arquivo

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

apk add less              # instala o less completo (recomendado)`}),e.jsxs(i,{type:"info",title:"more (BusyBox) vs less",children:["O ",e.jsx("code",{children:"more"})," do BusyBox só desce (",e.jsx("code",{children:"Enter"})," = uma linha,",e.jsx("code",{children:"Espaço"})," = uma página). Não sobe, não busca. Instale"," ",e.jsx("code",{children:"less"})," para um paginador de verdade — são 150 KB."]}),e.jsx("h2",{children:"4. grep: busca em arquivos"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"grep"})," do BusyBox é suficiente para buscas simples. Para regex avançado, instale o pacote ",e.jsx("code",{children:"grep"})," (GNU grep):"]}),e.jsx(a,{title:"grep — padrões essenciais",code:`grep "erro" arquivo.log           # busca a palavra 'erro'
grep -i "error" *.log             # case-insensitive
grep -r "listen" /etc/            # recursivo em diretórios
grep -v "debug" arquivo.log       # EXCLUI linhas com 'debug'
grep -n "error" arquivo.log       # mostra número da linha
grep -c "error" arquivo.log       # conta ocorrências
grep -l "error" *.log             # mostra só nomes de arquivos
grep -A 3 "error" arquivo.log     # 3 linhas DEPOIS da ocorrência
grep -B 3 "error" arquivo.log     # 3 linhas ANTES da ocorrência
grep -C 3 "error" arquivo.log     # 3 linhas de contexto (antes + depois)

# ⚠️  -A/-B/-C NÃO existem no BusyBox grep. Instale: apk add grep`}),e.jsx(s,{title:"grep no dia a dia",lines:[{type:"cmd",text:'grep -i "error" /var/log/messages | tail -5'},{type:"out",text:"Aug  9 13:45:00 alpine daemon.err sshd[1234]: error: ..."},{type:"cmd",text:'grep -r "PermitRootLogin" /etc/ssh/'},{type:"out",text:"/etc/ssh/sshd_config:#PermitRootLogin prohibit-password"},{type:"out",text:"/etc/ssh/sshd_config:PermitRootLogin no"}]}),e.jsx("h2",{children:"5. file: identificando tipos de arquivo"}),e.jsxs("p",{children:["O Linux não usa extensões para determinar o tipo de arquivo — usa"," ",e.jsx("em",{children:"magic bytes"}),". O comando ",e.jsx("code",{children:"file"})," lê esses bytes:"]}),e.jsx(s,{title:"file identifica qualquer coisa",lines:[{type:"cmd",text:"file /bin/ls"},{type:"out",text:"/bin/ls: symbolic link to usr/bin/ls"},{type:"cmd",text:"file /usr/bin/ls"},{type:"out",text:"/usr/bin/ls: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-musl-x86_64.so.1"},{type:"cmd",text:"file documento.pdf"},{type:"out",text:"documento.pdf: PDF document, version 1.4"},{type:"cmd",text:"file foto.jpg"},{type:"out",text:"foto.jpg: JPEG image data, Exif standard"}]}),e.jsxs(i,{type:"info",title:"file no Alpine",children:["O ",e.jsx("code",{children:"file"})," ",e.jsx("strong",{children:"não vem instalado"})," por padrão. Use"," ",e.jsx("code",{children:"apk add file"})," (~50 KB, vale cada byte)."]}),e.jsx("h2",{children:"6. strings: extraindo texto de binários"}),e.jsxs("p",{children:["Arquivos binários contêm texto embutido — mensagens de erro, URLs, credenciais hardcoded. O ",e.jsx("code",{children:"strings"})," extrai tudo:"]}),e.jsx(a,{title:"strings — caçando texto em binários",code:`# Buscar texto legível em um executável
strings /usr/bin/ssh | grep -i "usage"

# Encontrar URLs em binários (engenharia reversa leve)
strings /usr/bin/curl | grep "https://"

# strings também é BusyBox — funcional mas limitado
# Para strings GNU completo: apk add binutils`}),e.jsx("h2",{children:"7. hexdump: vendo os bytes crus"}),e.jsx("p",{children:"Para inspecionar arquivos no nível mais baixo possível:"}),e.jsx(a,{title:"hexdump e od",code:`# hexdump (BusyBox)
hexdump -C arquivo.bin | head
# 00000000  7f 45 4c 46 02 01 01 00  ...

# od (octal dump — também BusyBox)
od -c arquivo           # mostra caracteres
od -x arquivo           # mostra em hexadecimal

# Para hexdump completo: apk add util-linux`}),e.jsx(i,{type:"success",title:"Resumo: qual ferramenta para cada situação",children:e.jsxs("ol",{children:[e.jsxs("li",{children:["Arquivo pequeno → ",e.jsx("code",{children:"cat"})," ou ",e.jsx("code",{children:"cat -n"})]}),e.jsxs("li",{children:["Começo/fim rápido → ",e.jsx("code",{children:"head"})," / ",e.jsx("code",{children:"tail"})]}),e.jsxs("li",{children:["Arquivo grande, navegar → ",e.jsx("code",{children:"less"})," (instale: ",e.jsx("code",{children:"apk add less"}),")"]}),e.jsxs("li",{children:["Buscar texto → ",e.jsx("code",{children:"grep"})," (para grep completo: ",e.jsx("code",{children:"apk add grep"}),")"]}),e.jsxs("li",{children:["Identificar tipo → ",e.jsx("code",{children:"file"})," (instale: ",e.jsx("code",{children:"apk add file"}),")"]}),e.jsxs("li",{children:["Extrair texto de binário → ",e.jsx("code",{children:"strings"})]}),e.jsxs("li",{children:["Ver bytes crus → ",e.jsx("code",{children:"hexdump -C"})]})]})})]})}export{n as default};
