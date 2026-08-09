import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as i,A as o,C as a}from"./AlertBox-C2CyWd7R.js";function c(){return e.jsxs(i,{title:"Criando Pacotes com aports & abuild",subtitle:"Empacote software para o Alpine: estrutura do aports, APKBUILD, abuild e submissão de contribuições.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Domínio do ",e.jsx("code",{children:"apk"}),", shell script, e familiaridade com compilação (",e.jsx("code",{children:"build-base"}),", ",e.jsx("code",{children:"./configure && make"}),"). Este é um capítulo avançado — mas a recompensa é poder empacotar qualquer coisa."]}),e.jsxs("p",{children:["O Alpine não tem milhares de mantenedores oficiais. A maior parte dos pacotes do ",e.jsx("strong",{children:"community"})," foi enviada por pessoas como você. Empacotar software para o Alpine é surpreendentemente simples: um script shell chamado ",e.jsx("code",{children:"APKBUILD"})," descreve o que baixar, como compilar e onde instalar. O ",e.jsx("code",{children:"abuild"})," faz o resto."]}),e.jsx("h2",{children:"1. O ecossistema aports"}),e.jsxs("p",{children:["O repositório ",e.jsx("code",{children:"aports"})," (Alpine Ports) contém a receita de",e.jsx("strong",{children:"todos"})," os pacotes do Alpine. É uma árvore de diretórios organizada por categoria:"]}),e.jsx(a,{title:"Estrutura do aports",code:`aports/
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
└── scripts/        ← bootstrap, cross-compile, helpers`}),e.jsxs("p",{children:["Cada diretório contém um ",e.jsx("code",{children:"APKBUILD"})," — um script shell com variáveis que descrevem o pacote. É isso. Sem XML, sem YAML, sem centenas de linhas de boilerplate."]}),e.jsx("h2",{children:"2. Preparando o ambiente"}),e.jsx(a,{title:"Instalando as ferramentas de empacotamento",code:`# 1. Ferramentas essenciais
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
# git clone https://github.com/alpinelinux/aports.git ~/aports`}),e.jsxs("p",{children:["Você ",e.jsx("strong",{children:"não precisa"})," clonar o aports inteiro para criar seus próprios pacotes. Pode começar com um diretório vazio e um APKBUILD."]}),e.jsx("h2",{children:"3. Anatomia de um APKBUILD"}),e.jsx("p",{children:"Um APKBUILD mínimo tem esta estrutura:"}),e.jsx(a,{title:"APKBUILD mínimo comentado — para o pacote 'ola'",code:`# Maintainer: Seu Nome <seu@email.com>
pkgname=ola            # nome do pacote (minúsculas, sem espaços)
pkgver=1.0             # versão upstream
pkgrel=0               # revisão Alpine (incrementa a cada ajuste no APKBUILD)
pkgdesc="Um programa que diz olá"  # descrição curta
url="https://exemplo.com/ola"      # site do projeto
arch="all"             # all | x86_64 | aarch64 | armhf | ...
license="MIT"          # SPDX license identifier
depends=""             # dependências de runtime (separadas por espaço)
makedepends="build-base" # dependências só para compilar
source="ola-$pkgver.tar.gz::https://exemplo.com/ola-$pkgver.tar.gz"
                       # fonte: arquivo local ou URL (usa $pkgver como variável)

build() {
    # Compila o software. $builddir é o diretório onde o source foi extraído.
    cd "$builddir"
    make
}

package() {
    # Instala no $pkgdir (raiz falsa — NÃO é o sistema real!)
    cd "$builddir"
    make install DESTDIR="$pkgdir"
}`}),e.jsx("p",{children:"As variáveis chave que você mais vai usar:"}),e.jsx(a,{title:"Variáveis do APKBUILD — referência rápida",code:`pkgname     nome do pacote
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
subpackages subpacotes: $pkgname-dev, $pkgname-doc, $pkgname-openrc...
options     !check (pula testes), !strip (não stripar), suid...
install     script de pós-instalação ($pkgname.pre-install, etc.)`}),e.jsx("h2",{children:"4. Criando um pacote do zero com newapkbuild"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"newapkbuild"})," gera um APKBUILD esqueleto automaticamente, detectando o tipo de build do projeto:"]}),e.jsx(s,{title:"Criando um APKBUILD automático",lines:[{type:"cmd",text:'newapkbuild -n ola -d "Um programa que diz olá" -u https://exemplo.com/ola -l MIT -a all'},{type:"out",text:"Creating ola/APKBUILD..."},{type:"ok",text:"# APKBUILD gerado em ola/APKBUILD"},{type:"out",text:""},{type:"comment",text:"# Flags do newapkbuild:"},{type:"comment",text:"# -n NOME    nome do pacote"},{type:"comment",text:"# -d DESC    descrição"},{type:"comment",text:"# -u URL     site do projeto"},{type:"comment",text:"# -l LIC     licença (MIT, GPL...)"},{type:"comment",text:"# -a ARCH    arquitetura"},{type:"comment",text:"# -s         usa sourceforge como mirror"},{type:"comment",text:"# -c         copia o source local (não baixa)"}]}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"newapkbuild"})," reconhece automaticamente projetos que usam autotools, cmake, meson, perl, python, ruby e Go, e gera as funções"," ",e.jsx("code",{children:"build()"})," e ",e.jsx("code",{children:"package()"})," apropriadas."]}),e.jsx(o,{type:"info",title:"Build systems detectados automaticamente",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"configure && make"})," → autotools"]}),e.jsxs("li",{children:[e.jsx("code",{children:"CMakeLists.txt"})," → cmake"]}),e.jsxs("li",{children:[e.jsx("code",{children:"meson.build"})," → meson"]}),e.jsxs("li",{children:[e.jsx("code",{children:"setup.py / pyproject.toml"})," → python (pip)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"Cargo.toml"})," → rust/cargo"]}),e.jsxs("li",{children:[e.jsx("code",{children:"go.mod"})," → go"]})]})}),e.jsx("h2",{children:"5. Build, teste e instalação local"}),e.jsx(s,{title:"Compilando e testando o pacote",lines:[{type:"cmd",text:"cd ola"},{type:"cmd",text:"abuild -r"},{type:"out",text:">>> ola: Fetching https://exemplo.com/ola-1.0.tar.gz"},{type:"out",text:">>> ola: Building..."},{type:"out",text:">>> ola: Running tests..."},{type:"out",text:">>> ola: Packaging..."},{type:"ok",text:">>> ola: Build successful!"},{type:"out",text:""},{type:"comment",text:"# O .apk está em ~/packages/ola-1.0-r0.apk"}]}),e.jsx(a,{title:"Ciclo completo de build",code:`# 1. Download das fontes (source)
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
apk del ola`}),e.jsx("p",{children:"Se o build falhar, o abuild diz exatamente onde. Erros comuns:"}),e.jsx(a,{title:"Erros comuns de build e soluções",code:`# "makedepends missing: libxyz-dev"
# → apk add libxyz-dev  (adicione ao makedepends)

# "checksum mismatch"
# → rode 'abuild checksum' de novo (a fonte mudou?)

# "test failed"
# → adicione options="!check" para pular testes
#   (mas antes tente entender por que falhou)

# "Permission denied" durante package()
# → use DESTDIR="$pkgdir" em make install (isso é a causa #1)`}),e.jsx("h2",{children:"6. Subpackages: -dev, -doc, -openrc"}),e.jsx("p",{children:"Pacotes grandes são divididos em subpacotes. O mais comum é separar os headers de desenvolvimento:"}),e.jsx(a,{title:"APKBUILD com subpackages",code:`# No APKBUILD principal:
subpackages="$pkgname-dev $pkgname-doc $pkgname-openrc"

# $pkgname-dev é automático: o abuild separa headers, .a, .so, pkg-config
# $pkgname-doc é automático: man pages e documentação
# $pkgname-openrc você precisa criar manualmente:

# Exemplo de subpackage manual:
bash() {
    # Este subpackage instala o bash (não o shell padrão)
    pkgdesc="Bash completions for ola"
    depends="bash"
    mkdir -p "$subpkgdir"/usr/share/bash-completion/completions
    mv "$pkgdir"/usr/share/bash-completion/completions/ola        "$subpkgdir"/usr/share/bash-completion/completions/
}`}),e.jsx("h2",{children:"7. Repositório local com índice assinado"}),e.jsxs("p",{children:["Depois de criar alguns pacotes, você vai querer um repositório local para instalá-los com ",e.jsx("code",{children:"apk add"})," normal:"]}),e.jsx(a,{title:"Criando e usando um repositório local",code:`# 1. Juntar os .apk num diretório
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
# ✅ Instalado do seu repositório local!`}),e.jsxs(o,{type:"info",title:"Repositório local vs /etc/apk/repositories",children:["Repositórios locais com caminho absoluto (",e.jsx("code",{children:"/home/..."}),") só funcionam na própria máquina. Para compartilhar, sirva via HTTP (Caddy, Nginx, ou ",e.jsx("code",{children:"python3 -m http.server"}),") e use a URL."]}),e.jsx("h2",{children:"8. Contribuindo para o Alpine (community)"}),e.jsx("p",{children:"Se você empacotou algo útil, o fluxo para enviar ao repositório oficial community é:"}),e.jsx(a,{title:"Fluxo de contribuição para o aports",code:`# 1. Fork do aports no GitLab
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
#    e anexe logs de build bem-sucedido.`}),e.jsxs(o,{type:"info",title:"Critérios para aceitação no community",children:[e.jsxs("ul",{children:[e.jsx("li",{children:"Software ativo (último commit < 1 ano)"}),e.jsx("li",{children:"Licença open source aprovada pela OSI"}),e.jsx("li",{children:"Build limpo, sem warnings do apkbuild-lint"}),e.jsx("li",{children:"Não duplica funcionalidade já existente"}),e.jsx("li",{children:"APKBUILD de qualidade (variáveis corretas, sem hardcode)"})]}),"O processo de review leva de alguns dias a semanas, dependendo da disponibilidade dos maintainers."]}),e.jsx("h2",{children:"9. Dicas e boas práticas"}),e.jsx(a,{title:"Checklist de qualidade do APKBUILD",code:`# ✓ checklist antes de submeter:
[ ] pkgname em minúsculas, sem underscore (use hífen)
[ ] pkgver bate com upstream
[ ] pkgrel começa em 0
[ ] license usa identificador SPDX correto
[ ] source tem checksum (rode 'abuild checksum')
[ ] makedepends lista TUDO necessário para compilar
[ ] depends lista TUDO necessário em runtime
[ ] build() e package() usam $builddir e $pkgdir
[ ] 'abuild -r' passa limpo
[ ] 'apkbuild-lint' não tem warnings
[ ] O pacote instala e funciona (teste manual)`}),e.jsx("p",{children:"E algumas dicas de ouro de quem já empacotou bastante:"}),e.jsx(a,{title:"Dicas de veteranos",code:`# 1. SEMPRE cheque a licença. Pacotes com licença restritiva
#    (ex: "free for non-commercial use") são rejeitados.

# 2. Use check(): rode os testes upstream se existirem.
#    Se não existirem, pelo menos um smoke test básico.

# 3. $pkgver vs $pkgrel: pkgver muda quando upstream lança
#    versão nova. pkgrel muda quando VOCÊ ajusta o APKBUILD
#    (corrige dependência, patch, flag de compilação).

# 4. Patch com moderação: prefira flags de ./configure a
#    patches. Cada patch é manutenção futura.

# 5. Leia outros APKBUILDs. O melhor aprendizado é ver como
#    os pacotes existentes resolvem problemas similares.`}),e.jsxs(o,{type:"success",title:"Resumo",children:["Empacotar para o Alpine é um script shell de ~30 linhas:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add alpine-sdk && abuild-keygen -a -i"})," — setup único"]}),e.jsxs("li",{children:[e.jsx("code",{children:"newapkbuild -n pacote ..."})," — gerar esqueleto"]}),e.jsxs("li",{children:["Editar ",e.jsx("code",{children:"APKBUILD"})," — preencher variáveis e funções"]}),e.jsxs("li",{children:[e.jsx("code",{children:"abuild -r"})," — compilar e empacotar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"apk add ~/packages/*.apk"})," — testar"]})]}),"Com isso você consegue empacotar qualquer software para Alpine. E se o pacote for útil para outros, é só abrir um MR no aports. É assim que o community cresce — um APKBUILD de cada vez."]})]})}export{c as default};
