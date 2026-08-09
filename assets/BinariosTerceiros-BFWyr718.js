import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as s,A as i,C as o}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(s,{title:"Software Fora dos Repositórios",subtitle:"Binários estáticos, gerenciadores de linguagem, Flatpak, AppImage e compilação manual — tudo que não está no apk.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs(i,{type:"info",title:"Pré-requisitos",children:["Domínio do ",e.jsx("code",{children:"apk"})," e familiaridade com repositórios. Este capítulo assume que você já sabe instalar e remover pacotes normalmente."]}),e.jsx("p",{children:"Os repositórios do Alpine cobrem a maioria das necessidades, mas eventualmente você vai querer algo que não está lá: um binário Go, uma ferramenta Rust, um script Python com dependências específicas. Este capítulo mostra como lidar com software fora do apk — e as armadilhas específicas do Alpine."}),e.jsx("h2",{children:"1. A diferença crucial: musl vs glibc"}),e.jsxs("p",{children:["Este é ",e.jsx("strong",{children:"o ponto mais importante"})," do capítulo. A maioria dos binários pré-compilados para Linux são linked contra glibc. O Alpine usa musl. Resultado:"]}),e.jsx(a,{title:"O que acontece com binários glibc no Alpine",lines:[{type:"cmd",text:"./meu-programa-linux-amd64"},{type:"err",text:"bash: ./meu-programa-linux-amd64: No such file or directory"},{type:"cmd",text:"ldd ./meu-programa-linux-amd64"},{type:"err",text:"/lib/ld-linux-x86-64.so.2 => not found"},{type:"comment",text:"# O linker glibc não existe no Alpine — binário inútil."}]}),e.jsx(o,{title:"Três caminhos para software externo no Alpine",code:`1. Binário ESTÁTICO (musl)     ✅ Sempre funciona. Compilado com musl,
                                  sem dependências externas.

2. Binário ESTÁTICO (glibc)    ⚠️  Às vezes funciona se for 100% estático.
                                  Mas é raro; a maioria linka libc dinamicamente.

3. Binário DINÂMICO (glibc)    ❌ Não funciona. Precisa de glibc, que não
                                  existe no Alpine.

Regra de ouro: sempre busque binários MUSL ou ESTÁTICOS.`}),e.jsxs(i,{type:"warning",title:"Como identificar se um binário é compatível",children:["Use ",e.jsx("code",{children:"file ./binario"})," e ",e.jsx("code",{children:"ldd ./binario"}),". Se o ldd mostrar ",e.jsx("code",{children:"/lib/ld-musl-x86_64.so.1"})," ou ",e.jsx("code",{children:"statically linked"}),", funciona. Se mostrar ",e.jsx("code",{children:"/lib/ld-linux-x86-64.so.2"}),", é glibc e",e.jsx("strong",{children:"não funciona"})," no Alpine."]}),e.jsx("h2",{children:"2. Binários estáticos: o caminho feliz"}),e.jsx("p",{children:"Go e Rust produzem binários estáticos por padrão. Isso significa que você pode copiar um binário compilado em qualquer lugar e rodar no Alpine sem instalar nada:"}),e.jsx(o,{title:"Baixando e usando binários estáticos",code:`# Exemplo: instalar o Caddy (servidor web em Go)
# 1. Baixar o binário estático oficial
wget https://github.com/caddyserver/caddy/releases/download/v2.9/caddy_2.9_linux_amd64.tar.gz
tar xzf caddy_2.9_linux_amd64.tar.gz

# 2. Verificar se é compatível
file ./caddy
# caddy: ELF 64-bit LSB executable, x86-64, statically linked

# 3. Instalar manualmente
mv caddy /usr/local/bin/
caddy version
# ✅ Funciona perfeitamente no Alpine!`}),e.jsx("p",{children:"Ferramentas populares com binários estáticos que rodam nativamente:"}),e.jsx(o,{title:"Binários que funcionam direto no Alpine",code:`# Go:        caddy, hugo, syncthing, restic, prometheus, grafana
# Rust:      ripgrep, fd, bat, exa/eza, delta, zellij
# Zig:       (tudo que compilar com zig cc)
# C static:  busybox (óbvio), dropbear, toybox

# Dica: muitos projetos Go publicam binários com "musl" no nome.
# Ex: tailscale_1.82_amd64.tgz → não especifica musl, mas é Go → funciona
#     syncthing-linux-amd64-musl.tar.gz → explícito, é o ideal`}),e.jsx("h2",{children:"3. gcompat: rodando binários glibc no Alpine"}),e.jsxs("p",{children:["Se você ",e.jsx("strong",{children:"precisa"})," rodar um binário glibc (ex: um software corporativo fechado, um jogo, uma ferramenta antiga), existe o pacote"," ",e.jsx("code",{children:"gcompat"}),":"]}),e.jsx(o,{title:"Instalando e usando gcompat",code:`# gcompat fornece um linker glibc compatível + símbolos básicos
apk add gcompat

# Agora binários glibc "simples" podem funcionar:
ldd ./binario-glibc
# /lib/ld-linux-x86-64.so.2 => /lib/ld-linux-x86-64.so.2  ← resolvido!

# Mas NÃO é garantido:
# - Funciona para binários que usam funções básicas da glibc
# - FALHA para binários com NSS, locales complexos, ou símbolos obscuros
# - Performance pode ser pior
# - Use como último recurso`}),e.jsxs(i,{type:"warning",title:"gcompat é gambiarra, não solução",children:["O gcompat é uma camada de compatibilidade, não uma glibc completa. Se o binário quebrar com erro de símbolo (",e.jsx("code",{children:"undefined symbol"}),"), não há o que fazer a não ser compilar para musl ou rodar num container Debian."]}),e.jsx("h2",{children:"4. Gerenciadores de linguagem: pip, cargo, npm, go"}),e.jsx("p",{children:"Se o software que você quer é uma ferramenta Python, Node, Rust ou Go, instale o runtime e use o gerenciador da linguagem:"}),e.jsx(o,{title:"Instalando runtimes e usando gerenciadores nativos",code:`# Python + pip
apk add python3 py3-pip
pip install ansible       # instala no sistema (use venv para isolar!)

# Node.js + npm
apk add nodejs npm
npm install -g typescript # -g instala global

# Rust + cargo (via rustup)
apk add curl build-base   # build-base = gcc + make + libc-dev
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install ripgrep     # compila e instala

# Go
apk add go
go install github.com/junegunn/fzf@latest  # instala em ~/go/bin`}),e.jsxs(i,{type:"info",title:"build-base: o meta-pacote essencial para compilar",children:[e.jsx("code",{children:"apk add build-base"})," instala gcc, g++, make, musl-dev, binutils e headers. É o equivalente ao ",e.jsx("code",{children:"build-essential"})," do Debian. Sempre que for compilar algo no Alpine, instale isso primeiro."]}),e.jsx("p",{children:"Para Python, isole seus projetos com venv — o pip no sistema pode conflitar com pacotes do apk:"}),e.jsx(o,{code:`python3 -m venv ~/meu-projeto/.venv
source ~/meu-projeto/.venv/bin/activate
pip install fastapi uvicorn
# Instalado apenas no venv, zero conflitos com o sistema`}),e.jsx("h2",{children:"5. Compilando do zero"}),e.jsx("p",{children:"Para software em C/C++ que não está nos repositórios, compilar localmente é a solução definitiva — e no Alpine é mais simples que em outras distros:"}),e.jsx(o,{title:"Compilando software C no Alpine",code:`# 1. Instalar ferramentas de build
apk add build-base git autoconf automake libtool pkgconfig

# 2. Clonar e compilar (exemplo: stow)
git clone https://github.com/aspiers/stow.git
cd stow
autoreconf -ivf
./configure --prefix=/usr/local
make -j$(nproc)
make install

# 3. O binário vai para /usr/local/bin/stow
stow --version
# ✅ Compilado com musl, funciona nativamente`}),e.jsxs("p",{children:["Sempre use ",e.jsx("code",{children:"--prefix=/usr/local"})," para não misturar com pacotes do apk, que vão para ",e.jsx("code",{children:"/usr"}),"."]}),e.jsx("h2",{children:"6. Flatpak, AppImage e Snap"}),e.jsx("p",{children:"Os formatos universais de empacotamento têm suporte limitado no Alpine:"}),e.jsx(o,{title:"Formatos universais no Alpine",code:`# FLATPAK — NÃO existe oficialmente no Alpine.
# O Flatpak depende de systemd, bubblewrap com glibc, e outras
# coisas que o Alpine não tem. Alternativa: usar containers Docker.

# APPIMAGE — FUNCIONA se o AppImage for estático ou musl.
# A maioria dos AppImages é glibc → não funciona.
# Para testar:
wget https://exemplo.com/app.AppImage
chmod +x app.AppImage
./app.AppImage --appimage-extract  # extrai e roda, às vezes funciona

# SNAP — NÃO existe no Alpine. O snapd depende de systemd.`}),e.jsxs(i,{type:"info",title:"A alternativa Alpine: containers",children:["A filosofia Alpine para software complexo é: ",e.jsx("strong",{children:"rode num container"}),". Se um programa precisa de glibc, systemd, ou 200 dependências ausentes, um ",e.jsx("code",{children:"docker run debian ./programa"})," é mais rápido e limpo do que tentar adaptar."]}),e.jsx("h2",{children:"7. Onde achar software para Alpine"}),e.jsx(o,{title:"Fontes de software compatível",code:`# 1. Repositórios oficiais (sempre a primeira opção)
apk search <termo>
#    https://pkgs.alpinelinux.org/  (interface web)

# 2. Binários estáticos de projetos Go/Rust
#    GitHub Releases de: caddy, syncthing, restic, hugo, ripgrep...

# 3. Alpine Community no GitHub
#    https://github.com/alpinelinux/aports
#    (procure na branch da sua versão)

# 4. Alpine Wiki — pacotes não oficiais
#    https://wiki.alpinelinux.org/

# 5. Container Images
#    docker run --rm -v $(pwd):/work alpine:edge sh -c "comando"
#    (roda qualquer coisa do edge sem instalar na máquina)`}),e.jsx(a,{title:"Exemplo: conferindo se um binário funciona",lines:[{type:"cmd",text:"file /usr/local/bin/caddy"},{type:"out",text:"/usr/local/bin/caddy: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, Go BuildID=..., not stripped"},{type:"ok",text:"# static + Go → compatível com Alpine!"},{type:"cmd",text:"ldd /usr/local/bin/caddy"},{type:"out",text:"not a dynamic executable"},{type:"ok",text:"# Confirmado: sem dependências externas."}]}),e.jsxs(i,{type:"success",title:"Resumo: hierarquia de decisão",children:["Quando precisar de software fora do apk, siga esta ordem:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"apk search"})," — sempre tente os repositórios primeiro"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Binário estático"})," (Go/Rust) — baixe do GitHub Releases"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"pip/cargo/npm/go install"})," — use o gerenciador da linguagem"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Compilar do zero"})," — ",e.jsx("code",{children:"build-base + ./configure && make"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"gcompat"})," — último recurso para binários glibc"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Container"})," — se nada acima funcionar, ",e.jsx("code",{children:"docker run"})]})]})]})]})}export{t as default};
