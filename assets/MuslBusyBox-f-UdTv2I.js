import{j as e,T as i}from"./index-B6WkqzKp.js";import{P as a}from"./PageContainer-xeC4bAGy.js";import{A as o,C as s}from"./AlertBox-DkDKuT6s.js";function l(){return e.jsxs(a,{title:"musl libc & BusyBox",subtitle:"As duas peças que tornam o Alpine minúsculo — e o que muda na prática para você.",difficulty:"iniciante",timeToRead:"18 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Um Alpine rodando (VM, VPS ou container) para acompanhar os comandos. Nenhum conhecimento prévio de sistemas é exigido."}),e.jsxs("p",{children:["Quase todo Linux que você conhece usa a mesma dupla: ",e.jsx("strong",{children:"glibc"}),"(a biblioteca C do projeto GNU) e os ",e.jsx("strong",{children:"coreutils GNU"})," (ls, cp, cat...). O Alpine trocou as duas por alternativas menores:",e.jsx("strong",{children:" musl libc"})," e ",e.jsx("strong",{children:"BusyBox"}),". Este capítulo explica o que cada uma faz e o que muda no seu dia a dia."]}),e.jsx("h2",{children:"1. O que é uma libc?"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"biblioteca C padrão"})," (libc) é a camada entre os programas e o kernel: funções como abrir arquivos, alocar memória, resolver nomes de rede e formatar texto passam por ela. ",e.jsx("em",{children:"Todo"})," programa dinâmico do sistema usa a libc o tempo todo — ela é a peça mais fundamental do userspace."]}),e.jsx(s,{title:"Comparando as libcs",code:`glibc
  - Padrão em Debian, Ubuntu, Fedora, RHEL
  - Enorme: otimizada para compatibilidade máxima
  - Licença LGPL
  - Recursos: locales completos, NSS, NSS-DNS, muitos "extras"

musl (usada no Alpine)
  - ~1/10 do tamanho da glibc
  - Licença MIT
  - Foco em correção e simplicidade (segue o padrão POSIX de perto)
  - Menos "mágica" implícita — comportamento mais previsível`}),e.jsx(i,{title:"wallyson@alpine: ~",lines:[{type:"cmd",text:"ldd --version 2>&1 | head -1"},{type:"out",text:"musl libc (x86_64)"},{type:"out",text:"Version 1.2.5"},{type:"cmd",text:"ls -la /lib/ld-musl-x86_64.so.1"},{type:"out",text:"lrwxrwxrwx    1 root     root          20 Jun 10 08:12 /lib/ld-musl-x86_64.so.1 -> /lib/libc.musl-x86_64.so.1"}]}),e.jsx("h2",{children:"2. A consequência prática da musl"}),e.jsxs("p",{children:["Binários compilados para glibc ",e.jsx("strong",{children:"não rodam"}),' num sistema musl (e vice-versa), a menos que sejam estáticos ou usem runtime próprio. É por isso que alguns programas baixados da internet ("baixe o binário pré-compilado") falham no Alpine — assunto do capítulo de software de terceiros. Em containers isso aparece muito: wheels de Python com binário ',e.jsx("code",{children:"manylinux"})," às vezes precisam ser recompilados."]}),e.jsxs(o,{type:"warning",title:"musl não é glibc de outro nome",children:['Se um programa fechar com "not found" num executável que existe, ou com erro estranho de locale, suspeite de incompatibilidade musl/glibc. O capítulo',e.jsx("strong",{children:" Compilação & build-base"})," mostra como resolver isso compilando localmente."]}),e.jsx("h2",{children:"3. O que é o BusyBox"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"BusyBox"})," é um único binário que reúne mais de 300 utilitários clássicos do Unix — os chamados ",e.jsx("strong",{children:"applets"}),": ",e.jsx("code",{children:"ls"}),",",e.jsx("code",{children:"cp"}),", ",e.jsx("code",{children:"grep"}),", ",e.jsx("code",{children:"awk"}),", ",e.jsx("code",{children:"vi"}),",",e.jsx("code",{children:"sh"})," (o shell ",e.jsx("code",{children:"ash"}),"), ",e.jsx("code",{children:"init"})," e até",e.jsx("code",{children:"crond"}),". Cada applet é uma versão compacta, focada no essencial."]}),e.jsx(s,{title:"Como funciona por dentro",code:`# /bin/ls NÃO é um programa "ls": é um link para o busybox
ls -la /bin/ls
# lrwxrwxrwx  1 root root  7 ... /bin/ls -> busybox

# Quando você roda "ls", o busybox verifica argv[0]
# e executa o applet correspondente. Um binário, 300+ ferramentas.

# Listar todos os applets disponíveis:
busybox --list

# Contar:
busybox --list | wc -l`}),e.jsx(i,{title:"wallyson@alpine: ~",lines:[{type:"cmd",text:"ls -la /bin/ls"},{type:"out",text:"lrwxrwxrwx    1 root     root             7 Jun 10 08:12 /bin/ls -> busybox"},{type:"cmd",text:"busybox --list | wc -l"},{type:"out",text:"312"},{type:"cmd",text:"du -h /bin/busybox"},{type:"out",text:"856.0K	/bin/busybox"},{type:"ok",text:"# 312 ferramentas dentro de um binário de menos de 1 MB"}]}),e.jsx("h2",{children:"4. Diferenças BusyBox vs GNU no dia a dia"}),e.jsxs("p",{children:["Os applets cobrem o uso comum, mas têm ",e.jsx("strong",{children:"menos flags"})," que as versões GNU. Você percebe isso em três situações típicas:"]}),e.jsx(s,{title:"Onde as diferenças aparecem",code:`# 1) --help longo pode não existir do jeito GNU:
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
doas apk add findutils`}),e.jsxs(o,{type:"info",title:"A lista de pacotes substitutos",children:["Quando precisar do comportamento GNU completo: ",e.jsx("code",{children:"apk add coreutils"}),"(ls, cp, mv...), ",e.jsx("code",{children:"findutils"})," (find), ",e.jsx("code",{children:"grep"}),",",e.jsx("code",{children:"sed"}),", ",e.jsx("code",{children:"gawk"}),", ",e.jsx("code",{children:"procps"})," (ps/top),",e.jsx("code",{children:"tar"}),", ",e.jsx("code",{children:"gzip"}),", ",e.jsx("code",{children:"util-linux"})," (fdisk, lsblk...). Os capítulos seguintes indicam quando cada um vale a pena."]}),e.jsx("h2",{children:"5. Somando tudo: o tamanho do sistema"}),e.jsx("p",{children:"A dupla musl + BusyBox é o motivo dos números impressionantes do Alpine:"}),e.jsx(i,{title:"wallyson@alpine: ~",lines:[{type:"cmd",text:"du -sh /bin /sbin /lib 2>/dev/null"},{type:"out",text:"1.5M	/bin"},{type:"out",text:"12.0K	/sbin"},{type:"out",text:"8.2M	/lib"},{type:"cmd",text:"apk info | wc -l"},{type:"out",text:"54"},{type:"ok",text:"# binários essenciais + libs em ~10 MB. Um Ubuntu passa de 1 GB."}]}),e.jsx("h2",{children:"6. Verificando a dupla no seu sistema"}),e.jsx(s,{title:"Checklist musl + BusyBox",code:`# 1. Confirmar que a libc é a musl:
ldd --version 2>&1 | head -1

# 2. Confirmar que /bin/ls é um applet:
readlink /bin/ls

# 3. Confirmar que o shell é o ash (applet do BusyBox):
readlink /bin/sh

# 4. Ver a versão do BusyBox:
busybox | head -1`}),e.jsx(o,{type:"success",title:"Resumo",children:"musl (libc pequena e correta) + BusyBox (300+ ferramentas num binário) são a base da leveza do Alpine. O custo: menos flags por ferramenta e incompatibilidade com binários feitos para glibc — sempre resolvível com os pacotes certos."})]})}export{l as default};
