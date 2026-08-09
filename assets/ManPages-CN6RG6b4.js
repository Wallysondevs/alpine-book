import{j as a,T as n}from"./index-YFyZeUD9.js";import{P as s,A as o,C as e}from"./AlertBox-C2CyWd7R.js";function d(){return a.jsxs(s,{title:"Documentação — man pages",subtitle:"O Alpine não traz man pages por padrão. Instale, use man, whatis, apropos e descubra a documentação offline.",difficulty:"iniciante",timeToRead:"10 min",children:[a.jsxs(o,{type:"warning",title:"man NÃO vem instalado!",children:["O Alpine minimalista remove as man pages para economizar espaço. Se você tentar ",a.jsx("code",{children:"man ls"}),' num Alpine recém-instalado, vai receber "man: command not found". Instalar são dois comandos.']}),a.jsx("p",{children:"Documentação offline é essencial em servidores sem internet ou quando você quer confirmar uma flag sem abrir o navegador. O Alpine separa as man pages em pacotes — você instala só o que precisa."}),a.jsx("h2",{children:"1. Instalando o sistema de man"}),a.jsx(n,{title:"Instalação completa de man pages",lines:[{type:"cmd",text:"apk add man-pages mandoc"},{type:"out",text:"(1/3) Installing man-pages (documentação base)"},{type:"out",text:"(2/3) Installing mandoc (visualizador leve)"},{type:"out",text:"(3/3) Installing mandoc-apropos (busca)"},{type:"ok",text:"# ~2 MB. Agora man funciona."},{type:"cmd",text:"man ls"},{type:"out",text:"LS(1)           User Commands          LS(1)"},{type:"out",text:"NAME"},{type:"out",text:"   ls - list directory contents"},{type:"out",text:"..."}]}),a.jsxs(o,{type:"info",title:"mandoc é o visualizador padrão do Alpine",children:["O Alpine usa ",a.jsx("code",{children:"mandoc"})," em vez do ",a.jsx("code",{children:"man-db"})," (Debian) ou ",a.jsx("code",{children:"man"})," tradicional. Mais leve, mesma funcionalidade. O comando ",a.jsx("code",{children:"man"})," é um symlink para ",a.jsx("code",{children:"mandoc"}),"."]}),a.jsx("h2",{children:"2. Seções do manual"}),a.jsx(e,{title:"As 9 seções do manual Unix",code:`1   Comandos de usuário        man 1 ls
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
# printf (3) - formatted output conversion`}),a.jsx("h2",{children:"3. whatis e apropos: buscando"}),a.jsx(n,{lines:[{type:"cmd",text:"whatis tar"},{type:"out",text:"tar (1) - archiving utility"},{type:"cmd",text:"apropos partition"},{type:"out",text:"fdisk (8) - manipulate disk partition table"},{type:"out",text:"sfdisk (8) - display or manipulate a disk partition table"},{type:"out",text:"parted (8) - a partition manipulation program"},{type:"comment",text:"# apropos busca na DESCRIÇÃO, não só no nome."},{type:"cmd",text:"apropos -s 1,8 network"},{type:"comment",text:"# Busca nas seções 1 e 8 (comandos + admin)"}]}),a.jsx("h2",{children:"4. --help: documentação instantânea"}),a.jsxs("p",{children:["Muitos comandos trazem ajuda embutida com ",a.jsx("code",{children:"--help"}),". Não substitui o man, mas é mais rápido para flags:"]}),a.jsx(e,{code:`# Ajuda rápida (funciona em quase todos os comandos)
apk --help
tar --help
grep --help

# BusyBox: ajuda compacta
busybox --help       # lista todos os applets
busybox ls --help    # ajuda do applet ls

# Comandos sem man page (scripts, ferramentas próprias)
setup-alpine --help  # o assistente de instalação`}),a.jsx("h2",{children:"5. Documentação online do Alpine"}),a.jsx(e,{title:"Recursos oficiais",code:`# Wiki oficial (a documentação de referência)
# https://wiki.alpinelinux.org/

# Páginas de manual online
# https://man.archlinux.org/  (Arch, mas a maioria dos comandos é igual)
# https://linux.die.net/man/

# Documentação de pacotes: descrição e dependências
apk info -d nginx
apk info -d docker

# Lista de arquivos de um pacote
apk info -L nginx | grep -E ".1$|.5$|.8$"
# Procura por man pages dentro do pacote.`}),a.jsx("h2",{children:"6. Man pages por pacote"}),a.jsxs("p",{children:["Muitos pacotes no Alpine separam a documentação em subpacotes"," ",a.jsx("code",{children:"-doc"}),". Se o ",a.jsx("code",{children:"man"})," não encontra nada:"]}),a.jsx(e,{title:"Instalando documentação de um pacote específico",code:`# Exemplo: documentação do Nginx
apk search nginx-doc
# nginx-doc-1.28.0-r0

apk add nginx-doc
man nginx   # agora funciona!

# Outros pacotes -doc comuns:
# openssh-doc, bash-doc, git-doc, python3-doc...

# Se não existir -doc, veja se o pacote base já inclui:
apk info -L nginx | grep man`}),a.jsx(o,{type:"success",title:"Resumo",children:a.jsxs("ol",{children:[a.jsxs("li",{children:[a.jsx("code",{children:"apk add man-pages mandoc"})," — instala o sistema de man"]}),a.jsxs("li",{children:[a.jsx("code",{children:"man <comando>"})," — manual; ",a.jsx("code",{children:"man <seção> <comando>"})," — seção específica"]}),a.jsxs("li",{children:[a.jsx("code",{children:"whatis"})," — descrição curta; ",a.jsx("code",{children:"apropos"})," — busca por palavra-chave"]}),a.jsxs("li",{children:[a.jsx("code",{children:"--help"})," para ajuda rápida; ",a.jsx("code",{children:"wiki.alpinelinux.org"})," para tutoriais"]}),a.jsxs("li",{children:["Pacotes ",a.jsx("code",{children:"-doc"})," contêm man pages adicionais"]})]})})]})}export{d as default};
