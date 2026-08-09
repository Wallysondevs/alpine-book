import{j as e}from"./index-YFyZeUD9.js";import{P as i,A as o,C as a}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(i,{title:"Compilação & build-base",subtitle:"gcc, make, musl-dev, autotools, cmake, meson — compile qualquer coisa no Alpine.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Alpine instalado. Nenhum conhecimento prévio de compilação é necessário — este capítulo começa do zero."}),e.jsxs("p",{children:["Compilar software é o último recurso quando não existe pacote no apk. O Alpine torna isso fácil com o meta-pacote ",e.jsx("code",{children:"build-base"})," ","que instala tudo que você precisa em um comando."]}),e.jsx("h2",{children:"1. build-base: o pacote mágico"}),e.jsx(a,{code:`# Instalar TUDO para compilar C/C++
apk add build-base

# O build-base inclui:
# gcc          → compilador C (GNU Compiler Collection)
# g++          → compilador C++
# make         → automação de build
# musl-dev     → headers e libs da musl (equivalente ao libc6-dev)
# binutils     → linker, assembler, etc.
# pkgconfig    → detecção de bibliotecas

# Tamanho: ~200 MB (só instale em máquinas de dev/build)`}),e.jsx("h2",{children:"2. Compilação clássica: ./configure && make"}),e.jsx(a,{code:`# Fluxo universal para software em C (autotools)
git clone https://github.com/usuario/projeto.git
cd projeto

# 1. Gerar script configure (se não vier pronto)
autoreconf -ivf         # opcional, se tiver autoconf

# 2. Configurar
./configure --prefix=/usr/local

# 3. Compilar
make -j$(nproc)         # -jN = usa N núcleos em paralelo

# 4. Instalar
make install             # ou doas make install

# Limpar build
make clean
make distclean`}),e.jsx("h2",{children:"3. cmake: build system moderno"}),e.jsx(a,{code:`apk add cmake

# Fluxo cmake
mkdir build && cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local
make -j$(nproc)
doas make install

# Flags comuns:
# -DCMAKE_BUILD_TYPE=Release   → otimizado (sem debug)
# -DBUILD_TESTS=OFF             → pular testes
# -DCMAKE_INSTALL_PREFIX=...    → destino da instalação`}),e.jsx("h2",{children:"4. meson: o mais rápido"}),e.jsx(a,{code:`apk add meson ninja

# Fluxo meson + ninja
meson setup build --prefix=/usr/local
ninja -C build
doas ninja -C build install`}),e.jsx("h2",{children:"5. Bibliotecas comuns de desenvolvimento"}),e.jsx(a,{code:`# Headers (-dev) de bibliotecas populares:
apk add openssl-dev        # OpenSSL/LibreSSL
apk add zlib-dev            # compressão zlib
apk add ncurses-dev         # terminais (interface texto)
apk add readline-dev        # edição de linha
apk add libffi-dev          # FFI (chamadas dinâmicas)
apk add linux-headers       # headers do kernel

# Linguagens:
apk add python3-dev         # headers Python (para extensões C)
apk add nodejs-dev          # headers Node.js (para addons nativos)`}),e.jsx("h2",{children:"6. Dicas e troubleshooting"}),e.jsx(a,{code:`# Erro: "configure: error: C compiler cannot create executables"
# → apk add build-base

# Erro: "fatal error: xxx.h: No such file or directory"
# → procure o pacote -dev: apk search xxx-dev

# Erro: "cannot find -lxxx" (linker)
# → apk add xxx-dev (a lib estática .a ou .so symlink)

# Prefixo: sempre use /usr/local para compilações manuais
# /usr       → gerenciado pelo apk
# /usr/local → gerenciado por você (não conflita)

# Compilar em RAM (/tmp tmpfs) acelera builds:
cp -r projeto /tmp/projeto && cd /tmp/projeto && make`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add build-base"})," — tudo para compilar C/C++"]}),e.jsxs("li",{children:[e.jsx("code",{children:"./configure && make && make install"})," — fluxo clássico"]}),e.jsxs("li",{children:[e.jsx("code",{children:"cmake + make"})," ou ",e.jsx("code",{children:"meson + ninja"})," — alternativas modernas"]}),e.jsxs("li",{children:["Pacotes ",e.jsx("code",{children:"-dev"})," fornecem headers e bibliotecas de desenvolvimento"]}),e.jsxs("li",{children:["Instale em ",e.jsx("code",{children:"/usr/local"})," para não conflitar com o apk"]})]})})]})}export{d as default};
