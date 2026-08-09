import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Abuild() {
  return (
    <PageContainer
      title="Criando Pacotes com aports & abuild"
      subtitle="Empacote software para o Alpine: estrutura do aports, APKBUILD, abuild e submissão de contribuições."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Domínio do <code>apk</code>, shell script, e familiaridade com compilação
        (<code>build-base</code>, <code>./configure && make</code>). Este é um
        capítulo avançado — mas a recompensa é poder empacotar qualquer coisa.
      </AlertBox>

      <p>
        O Alpine não tem milhares de mantenedores oficiais. A maior parte dos
        pacotes do <strong>community</strong> foi enviada por pessoas como você.
        Empacotar software para o Alpine é surpreendentemente simples: um script
        shell chamado <code>APKBUILD</code> descreve o que baixar, como compilar
        e onde instalar. O <code>abuild</code> faz o resto.
      </p>

      {/* ===== SEÇÃO 1 ===== */}
      <h2>1. O ecossistema aports</h2>
      <p>
        O repositório <code>aports</code> (Alpine Ports) contém a receita de
        <strong>todos</strong> os pacotes do Alpine. É uma árvore de diretórios
        organizada por categoria:
      </p>
      <CodeBlock
        title="Estrutura do aports"
        code={`aports/
├── main/           ← pacotes essenciais (kernel, musl, busybox...)
│   ├── alpine-base/
│   │   └── APKBUILD
│   ├── musl/
│   │   ├── APKBUILD
│   │   └── ld-musl.path   (arquivos extras do pacote)
│   └── ...
├── community/      ← mantido pela comunidade
│   ├── docker/
│   │   └── APKBUILD
│   └── ...
├── testing/        ← staging
└── scripts/        ← bootstrap, cross-compile, helpers`}
      />

      <p>
        Cada diretório contém um <code>APKBUILD</code> — um script shell com
        variáveis que descrevem o pacote. É isso. Sem XML, sem YAML, sem
        centenas de linhas de boilerplate.
      </p>

      {/* ===== SEÇÃO 2 ===== */}
      <h2>2. Preparando o ambiente</h2>
      <CodeBlock
        title="Instalando as ferramentas de empacotamento"
        code={`# 1. Ferramentas essenciais
apk add abuild build-base git alpine-sdk

# alpine-sdk é um meta-pacote que instala:
#   abuild, build-base, git, fakeroot, sudo, attr,
#   patch, installkernel, e outras ferramentas de build

# 2. Gerar chaves de assinatura (uma vez na vida)
abuild-keygen -a -i
# Cria ~/.abuild/wallyson-XXXXXXXX.rsa (privada)
# Cria ~/.abuild/wallyson-XXXXXXXX.rsa.pub (pública)
# A chave pública vai para /etc/apk/keys/ automaticamente

# 3. Clonar o aports (opcional — para contribuir oficialmente)
git clone https://gitlab.alpinelinux.org/alpine/aports.git ~/aports
# Ou o mirror no GitHub:
# git clone https://github.com/alpinelinux/aports.git ~/aports`}
      />

      <p>
        Você <strong>não precisa</strong> clonar o aports inteiro para criar
        seus próprios pacotes. Pode começar com um diretório vazio e um
        APKBUILD.
      </p>

      {/* ===== SEÇÃO 3 ===== */}
      <h2>3. Anatomia de um APKBUILD</h2>
      <p>
        Um APKBUILD mínimo tem esta estrutura:
      </p>
      <CodeBlock
        title="APKBUILD mínimo comentado — para o pacote 'ola'"
        code={`# Maintainer: Seu Nome <seu@email.com>
pkgname=ola            # nome do pacote (minúsculas, sem espaços)
pkgver=1.0             # versão upstream
pkgrel=0               # revisão Alpine (incrementa a cada ajuste no APKBUILD)
pkgdesc="Um programa que diz olá"  # descrição curta
url="https://exemplo.com/ola"      # site do projeto
arch="all"             # all | x86_64 | aarch64 | armhf | ...
license="MIT"          # SPDX license identifier
depends=""             # dependências de runtime (separadas por espaço)
makedepends="build-base" # dependências só para compilar
source="ola-$pkgver.tar.gz::https://exemplo.com/ola-\$pkgver.tar.gz"
                       # fonte: arquivo local ou URL (usa \$pkgver como variável)

build() {
    # Compila o software. $builddir é o diretório onde o source foi extraído.
    cd "$builddir"
    make
}

package() {
    # Instala no $pkgdir (raiz falsa — NÃO é o sistema real!)
    cd "$builddir"
    make install DESTDIR="\$pkgdir"
}`}
      />

      <p>
        As variáveis chave que você mais vai usar:
      </p>
      <CodeBlock
        title="Variáveis do APKBUILD — referência rápida"
        code={`pkgname     nome do pacote
pkgver      versão upstream
pkgrel      revisão do empacotamento (começa em 0)
pkgdesc     descrição (uma linha)
url         site do projeto
arch        arquitetura(s): x86_64, aarch64, all, noarch...
license     licença SPDX: MIT, GPL-3.0-only, Apache-2.0...
depends     runtime: pacotes necessários para USAR
makedepends build-time: pacotes necessários para COMPILAR
checkdepends pacotes necessários para RODAR TESTES
source      arquivos fonte (URL, local, patch)
subpackages subpacotes: \$pkgname-dev, \$pkgname-doc, \$pkgname-openrc...
options     !check (pula testes), !strip (não stripar), suid...
install     script de pós-instalação (\$pkgname.pre-install, etc.)`}
      />

      {/* ===== SEÇÃO 4 ===== */}
      <h2>4. Criando um pacote do zero com newapkbuild</h2>
      <p>
        O comando <code>newapkbuild</code> gera um APKBUILD esqueleto
        automaticamente, detectando o tipo de build do projeto:
      </p>
      <Terminal
        title="Criando um APKBUILD automático"
        lines={[
          { type: "cmd", text: "newapkbuild -n ola -d \"Um programa que diz olá\" -u https://exemplo.com/ola -l MIT -a all" },
          { type: "out", text: "Creating ola/APKBUILD..." },
          { type: "ok", text: "# APKBUILD gerado em ola/APKBUILD" },
          { type: "out", text: "" },
          { type: "comment", text: "# Flags do newapkbuild:" },
          { type: "comment", text: "# -n NOME    nome do pacote" },
          { type: "comment", text: "# -d DESC    descrição" },
          { type: "comment", text: "# -u URL     site do projeto" },
          { type: "comment", text: "# -l LIC     licença (MIT, GPL...)" },
          { type: "comment", text: "# -a ARCH    arquitetura" },
          { type: "comment", text: "# -s         usa sourceforge como mirror" },
          { type: "comment", text: "# -c         copia o source local (não baixa)" },
        ]}
      />

      <p>
        O <code>newapkbuild</code> reconhece automaticamente projetos que usam
        autotools, cmake, meson, perl, python, ruby e Go, e gera as funções{" "}
        <code>build()</code> e <code>package()</code> apropriadas.
      </p>

      <AlertBox type="info" title="Build systems detectados automaticamente">
        <ul>
          <li><code>configure && make</code> → autotools</li>
          <li><code>CMakeLists.txt</code> → cmake</li>
          <li><code>meson.build</code> → meson</li>
          <li><code>setup.py / pyproject.toml</code> → python (pip)</li>
          <li><code>Cargo.toml</code> → rust/cargo</li>
          <li><code>go.mod</code> → go</li>
        </ul>
      </AlertBox>

      {/* ===== SEÇÃO 5 ===== */}
      <h2>5. Build, teste e instalação local</h2>
      <Terminal
        title="Compilando e testando o pacote"
        lines={[
          { type: "cmd", text: "cd ola" },
          { type: "cmd", text: "abuild -r" },
          { type: "out", text: ">>> ola: Fetching https://exemplo.com/ola-1.0.tar.gz" },
          { type: "out", text: ">>> ola: Building..." },
          { type: "out", text: ">>> ola: Running tests..." },
          { type: "out", text: ">>> ola: Packaging..." },
          { type: "ok", text: ">>> ola: Build successful!" },
          { type: "out", text: "" },
          { type: "comment", text: "# O .apk está em ~/packages/ola-1.0-r0.apk" },
        ]}
      />

      <CodeBlock
        title="Ciclo completo de build"
        code={`# 1. Download das fontes (source)
abuild fetch

# 2. Verificar checksums e integridade
abuild checksum

# 3. Build + teste + pacote (tudo de uma vez)
abuild -r          # -r = instala makedepends automaticamente

# 4. Instalar localmente para teste
apk add --allow-untrusted ~/packages/ola-1.0-r0.apk

# 5. Testar se funciona
ola
# Olá, mundo!

# 6. Remover depois do teste
apk del ola`}
      />

      <p>
        Se o build falhar, o abuild diz exatamente onde. Erros comuns:
      </p>
      <CodeBlock
        title="Erros comuns de build e soluções"
        code={`# "makedepends missing: libxyz-dev"
# → apk add libxyz-dev  (adicione ao makedepends)

# "checksum mismatch"
# → rode 'abuild checksum' de novo (a fonte mudou?)

# "test failed"
# → adicione options="!check" para pular testes
#   (mas antes tente entender por que falhou)

# "Permission denied" durante package()
# → use DESTDIR="\$pkgdir" em make install (isso é a causa #1)`}
      />

      {/* ===== SEÇÃO 6 ===== */}
      <h2>6. Subpackages: -dev, -doc, -openrc</h2>
      <p>
        Pacotes grandes são divididos em subpacotes. O mais comum é separar os
        headers de desenvolvimento:
      </p>
      <CodeBlock
        title="APKBUILD com subpackages"
        code={`# No APKBUILD principal:
subpackages="\$pkgname-dev \$pkgname-doc \$pkgname-openrc"

# \$pkgname-dev é automático: o abuild separa headers, .a, .so, pkg-config
# \$pkgname-doc é automático: man pages e documentação
# \$pkgname-openrc você precisa criar manualmente:

# Exemplo de subpackage manual:
bash() {
    # Este subpackage instala o bash (não o shell padrão)
    pkgdesc="Bash completions for ola"
    depends="bash"
    mkdir -p "\$subpkgdir"/usr/share/bash-completion/completions
    mv "\$pkgdir"/usr/share/bash-completion/completions/ola \
       "\$subpkgdir"/usr/share/bash-completion/completions/
}`}
      />

      {/* ===== SEÇÃO 7 ===== */}
      <h2>7. Repositório local com índice assinado</h2>
      <p>
        Depois de criar alguns pacotes, você vai querer um repositório local
        para instalá-los com <code>apk add</code> normal:
      </p>
      <CodeBlock
        title="Criando e usando um repositório local"
        code={`# 1. Juntar os .apk num diretório
mkdir -p ~/meu-repo
cp ~/packages/*.apk ~/meu-repo/

# 2. Gerar o índice assinado
cd ~/meu-repo
apk index -o APKINDEX.tar.gz *.apk
abuild-sign APKINDEX.tar.gz
# Agora o índice está assinado com sua chave

# 3. Adicionar aos repositórios do sistema
echo "/home/wallyson/meu-repo" >> /etc/apk/repositories
apk update

# 4. Instalar como qualquer pacote normal
apk add ola
# ✅ Instalado do seu repositório local!`}
      />

      <AlertBox type="info" title="Repositório local vs /etc/apk/repositories">
        Repositórios locais com caminho absoluto (<code>/home/...</code>) só
        funcionam na própria máquina. Para compartilhar, sirva via HTTP
        (Caddy, Nginx, ou <code>python3 -m http.server</code>) e use a URL.
      </AlertBox>

      {/* ===== SEÇÃO 8 ===== */}
      <h2>8. Contribuindo para o Alpine (community)</h2>
      <p>
        Se você empacotou algo útil, o fluxo para enviar ao repositório oficial
        community é:
      </p>
      <CodeBlock
        title="Fluxo de contribuição para o aports"
        code={`# 1. Fork do aports no GitLab
#    https://gitlab.alpinelinux.org/alpine/aports

# 2. Clonar seu fork
git clone git@gitlab.alpinelinux.org:seu-user/aports.git
cd aports

# 3. Criar branch com o nome do pacote
git checkout -b community/meu-pacote

# 4. Copiar seu APKBUILD para o diretório certo
mkdir -p community/meu-pacote
cp ~/meu-pacote/APKBUILD community/meu-pacote/

# 5. Rodar o linter local
apkbuild-lint community/meu-pacote/APKBUILD

# 6. Commit e push
git add community/meu-pacote/
git commit -m "community/meu-pacote: new aport"
git push origin community/meu-pacote

# 7. Abrir Merge Request no GitLab
#    Descreva o software, por que merece estar no community,
#    e anexe logs de build bem-sucedido.`}
      />

      <AlertBox type="info" title="Critérios para aceitação no community">
        <ul>
          <li>Software ativo (último commit &lt; 1 ano)</li>
          <li>Licença open source aprovada pela OSI</li>
          <li>Build limpo, sem warnings do apkbuild-lint</li>
          <li>Não duplica funcionalidade já existente</li>
          <li>APKBUILD de qualidade (variáveis corretas, sem hardcode)</li>
        </ul>
        O processo de review leva de alguns dias a semanas, dependendo da
        disponibilidade dos maintainers.
      </AlertBox>

      {/* ===== SEÇÃO 9 ===== */}
      <h2>9. Dicas e boas práticas</h2>
      <CodeBlock
        title="Checklist de qualidade do APKBUILD"
        code={`# ✓ checklist antes de submeter:
[ ] pkgname em minúsculas, sem underscore (use hífen)
[ ] pkgver bate com upstream
[ ] pkgrel começa em 0
[ ] license usa identificador SPDX correto
[ ] source tem checksum (rode 'abuild checksum')
[ ] makedepends lista TUDO necessário para compilar
[ ] depends lista TUDO necessário em runtime
[ ] build() e package() usam \$builddir e \$pkgdir
[ ] 'abuild -r' passa limpo
[ ] 'apkbuild-lint' não tem warnings
[ ] O pacote instala e funciona (teste manual)`}
      />

      <p>
        E algumas dicas de ouro de quem já empacotou bastante:
      </p>
      <CodeBlock
        title="Dicas de veteranos"
        code={`# 1. SEMPRE cheque a licença. Pacotes com licença restritiva
#    (ex: "free for non-commercial use") são rejeitados.

# 2. Use check(): rode os testes upstream se existirem.
#    Se não existirem, pelo menos um smoke test básico.

# 3. \$pkgver vs \$pkgrel: pkgver muda quando upstream lança
#    versão nova. pkgrel muda quando VOCÊ ajusta o APKBUILD
#    (corrige dependência, patch, flag de compilação).

# 4. Patch com moderação: prefira flags de ./configure a
#    patches. Cada patch é manutenção futura.

# 5. Leia outros APKBUILDs. O melhor aprendizado é ver como
#    os pacotes existentes resolvem problemas similares.`}
      />

      <AlertBox type="success" title="Resumo">
        Empacotar para o Alpine é um script shell de ~30 linhas:
        <ol>
          <li><code>apk add alpine-sdk && abuild-keygen -a -i</code> — setup único</li>
          <li><code>newapkbuild -n pacote ...</code> — gerar esqueleto</li>
          <li>Editar <code>APKBUILD</code> — preencher variáveis e funções</li>
          <li><code>abuild -r</code> — compilar e empacotar</li>
          <li><code>apk add ~/packages/*.apk</code> — testar</li>
        </ol>
        Com isso você consegue empacotar qualquer software para Alpine. E se
        o pacote for útil para outros, é só abrir um MR no aports. É assim que
        o community cresce — um APKBUILD de cada vez.
      </AlertBox>
    </PageContainer>
  );
}