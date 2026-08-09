import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BuildBase() {
  return (
    <PageContainer
      title="Compilação &amp; build-base"
      subtitle="gcc, make, musl-dev, autotools, cmake, meson — compile qualquer coisa no Alpine."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado. Nenhum conhecimento prévio de compilação é necessário —
        este capítulo começa do zero.
      </AlertBox>

      <p>
        Compilar software é o último recurso quando não existe pacote no apk.
        O Alpine torna isso fácil com o meta-pacote <code>build-base</code>{" "}
        que instala tudo que você precisa em um comando.
      </p>

      <h2>1. build-base: o pacote mágico</h2>
      <CodeBlock
        code={`# Instalar TUDO para compilar C/C++
apk add build-base

# O build-base inclui:
# gcc          → compilador C (GNU Compiler Collection)
# g++          → compilador C++
# make         → automação de build
# musl-dev     → headers e libs da musl (equivalente ao libc6-dev)
# binutils     → linker, assembler, etc.
# pkgconfig    → detecção de bibliotecas

# Tamanho: ~200 MB (só instale em máquinas de dev/build)`}
      />

      <h2>2. Compilação clássica: ./configure && make</h2>
      <CodeBlock
        code={`# Fluxo universal para software em C (autotools)
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
make distclean`}
      />

      <h2>3. cmake: build system moderno</h2>
      <CodeBlock
        code={`apk add cmake

# Fluxo cmake
mkdir build && cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local
make -j$(nproc)
doas make install

# Flags comuns:
# -DCMAKE_BUILD_TYPE=Release   → otimizado (sem debug)
# -DBUILD_TESTS=OFF             → pular testes
# -DCMAKE_INSTALL_PREFIX=...    → destino da instalação`}
      />

      <h2>4. meson: o mais rápido</h2>
      <CodeBlock
        code={`apk add meson ninja

# Fluxo meson + ninja
meson setup build --prefix=/usr/local
ninja -C build
doas ninja -C build install`}
      />

      <h2>5. Bibliotecas comuns de desenvolvimento</h2>
      <CodeBlock
        code={`# Headers (-dev) de bibliotecas populares:
apk add openssl-dev        # OpenSSL/LibreSSL
apk add zlib-dev            # compressão zlib
apk add ncurses-dev         # terminais (interface texto)
apk add readline-dev        # edição de linha
apk add libffi-dev          # FFI (chamadas dinâmicas)
apk add linux-headers       # headers do kernel

# Linguagens:
apk add python3-dev         # headers Python (para extensões C)
apk add nodejs-dev          # headers Node.js (para addons nativos)`}
      />

      <h2>6. Dicas e troubleshooting</h2>
      <CodeBlock
        code={`# Erro: "configure: error: C compiler cannot create executables"
# → apk add build-base

# Erro: "fatal error: xxx.h: No such file or directory"
# → procure o pacote -dev: apk search xxx-dev

# Erro: "cannot find -lxxx" (linker)
# → apk add xxx-dev (a lib estática .a ou .so symlink)

# Prefixo: sempre use /usr/local para compilações manuais
# /usr       → gerenciado pelo apk
# /usr/local → gerenciado por você (não conflita)

# Compilar em RAM (/tmp tmpfs) acelera builds:
cp -r projeto /tmp/projeto && cd /tmp/projeto && make`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add build-base</code> — tudo para compilar C/C++</li>
          <li><code>./configure && make && make install</code> — fluxo clássico</li>
          <li><code>cmake + make</code> ou <code>meson + ninja</code> — alternativas modernas</li>
          <li>Pacotes <code>-dev</code> fornecem headers e bibliotecas de desenvolvimento</li>
          <li>Instale em <code>/usr/local</code> para não conflitar com o apk</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}