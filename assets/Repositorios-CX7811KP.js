import{j as e,T as o}from"./index-YFyZeUD9.js";import{P as i,A as s,C as a}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(i,{title:"Repositórios & Branches",subtitle:"main, community, testing, edge, mirrors e versionamento — domine a estrutura de repositórios do Alpine.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsxs(s,{type:"info",title:"Pré-requisitos",children:["Domínio básico do ",e.jsx("code",{children:"apk"})," (add, update, search). O capítulo anterior cobre tudo que você precisa."]}),e.jsxs("p",{children:["O Alpine organiza seus pacotes em ",e.jsx("strong",{children:"repositórios"})," ","(main, community, testing) e ",e.jsx("strong",{children:"branches"})," (v3.24, edge). Saber navegar nessa estrutura é o que separa um usuário casual de alguém que realmente entende o que está instalando — e de onde."]}),e.jsx("h2",{children:"1. A anatomia de um repositório"}),e.jsxs("p",{children:["Um repositório Alpine é simplesmente um diretório HTTP com um arquivo de índice (",e.jsx("code",{children:"APKINDEX.tar.gz"}),") e os pacotes (",e.jsx("code",{children:".apk"}),"). Nada de banco de dados complexo como o apt — é um tar.gz com metadados em texto puro:"]}),e.jsx(a,{title:"O que tem num repositório Alpine",code:`# Estrutura típica de um mirror:
https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/
├── APKINDEX.tar.gz      ← índice assinado (nomes, versões, dependências)
├── alpine-base-3.24.0-r0.apk
├── busybox-1.37.0-r3.apk
├── musl-1.2.5-r3.apk
└── ... (milhares de .apk)

# O apk baixa o APKINDEX, verifica a assinatura, consulta localmente
# e só baixa os .apk que precisa instalar.`}),e.jsx("p",{children:"Você pode inspecionar o índice manualmente:"}),e.jsx(a,{code:`# Baixar e descompactar o índice para ver os metadados
wget -qO- https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz | tar xzO
# P:alpine-base
# V:3.24.0-r0
# A:x86_64
# S:12345
# I:67890
# T:Alpine base package
# D:busybox musl ...
# ...`}),e.jsx("h2",{children:"2. main, community e testing"}),e.jsx("p",{children:"O Alpine divide os pacotes em três repositórios oficiais, por nível de suporte e estabilidade:"}),e.jsx(a,{title:"Os três repositórios oficiais",code:`main        ← suportado pela equipe Alpine Core. Pacotes essenciais
              e infraestrutura: kernel, musl, busybox, apk, openssh.
              ~3.000 pacotes. Update de segurança garantido.

community   ← mantido pela comunidade (qualquer um pode contribuir).
              Docker, KVM, Python libs, Node.js, desktop, etc.
              ~3.000 pacotes. Atualizações de segurança feitas por
              voluntários.

testing     ← staging para novos pacotes e versões. PODE QUEBRAR.
              Use só para testar ou pegar versões bleeding-edge.
              NÃO use em produção.`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"setup-alpine"})," ativa o ",e.jsx("code",{children:"main"})," por padrão. O"," ",e.jsx("code",{children:"community"})," você já ativou no capítulo de Primeiros Passos. O"," ",e.jsx("code",{children:"testing"})," vamos configurar agora:"]}),e.jsx(a,{title:"Ativando testing (com cautela)",code:`# Adicionar testing ao final de /etc/apk/repositories
echo "https://dl-cdn.alpinelinux.org/alpine/v3.24/testing" >> /etc/apk/repositories
apk update

# ⚠️  Agora você tem acesso a ~2.000 pacotes extras, MAS:
# - testing NÃO recebe updates de segurança garantidos
# - Pacotes podem ser removidos sem aviso
# - Versões podem ser instáveis

# Boa prática: NÃO ative testing globalmente. Use pinning:
apk add -X https://dl-cdn.alpinelinux.org/alpine/v3.24/testing meu-pacote`}),e.jsxs(s,{type:"warning",title:"Testing + upgrade = problema",children:["Se você ativar testing globalmente e rodar ",e.jsx("code",{children:"apk upgrade"}),", o apk pode substituir pacotes do main/community por versões do testing. Resultado: sistema instável. Use sempre a flag ",e.jsx("code",{children:"-X"})," para pacotes pontuais."]}),e.jsx("h2",{children:"3. Branches: stable vs edge"}),e.jsx("p",{children:"O Alpine tem dois canais principais de versão:"}),e.jsx(a,{title:"Stable releases vs Edge",code:`STABLE (v3.24, v3.23, v3.22...)
  - Lançada a cada ~6 meses (junho e dezembro)
  - Pacotes congelados na versão de lançamento
  - Só recebe correções de segurança e bugs críticos
  - Ex: v3.24.0 → v3.24.1 → v3.24.2 (patch releases)
  - Ideal para servidores e produção

EDGE (rolling release)
  - Atualizada continuamente (sem versão fixa)
  - Sempre com as versões mais recentes de tudo
  - Pode quebrar a qualquer momento
  - Ideal para desenvolvimento, testes e desktop pessoal`}),e.jsxs("p",{children:["Mudar de uma stable para edge (ou vice-versa) é só alterar as URLs em"," ",e.jsx("code",{children:"/etc/apk/repositories"})," e rodar ",e.jsx("code",{children:"apk upgrade"}),":"]}),e.jsx(a,{title:"Migrando de v3.24 para edge (e voltando)",code:`# 1. Trocar v3.24 por edge nos repositórios
sed -i 's/v3.24/edge/g' /etc/apk/repositories
apk update
apk upgrade --available

# 2. Para VOLTAR de edge para v3.24:
#    Não tem downgrade automático. O caminho é reinstalar.

# Ver qual branch você está usando:
apk info alpine-base | grep -oP 'vd+.d+' || echo "edge"`}),e.jsxs(s,{type:"danger",title:"Não misture stable com edge no mesmo arquivo",children:["Se ",e.jsx("code",{children:"/etc/apk/repositories"})," tiver URLs de v3.24 E de edge ao mesmo tempo, o apk vai tentar resolver dependências entre elas e o resultado é imprevisível. Use uma branch por vez."]}),e.jsx("h2",{children:"4. Mirrors: escolhendo o servidor mais rápido"}),e.jsxs("p",{children:["O Alpine usa uma CDN global (",e.jsx("code",{children:"dl-cdn.alpinelinux.org"}),") que automaticamente escolhe o mirror mais próximo. Na maioria dos casos, você não precisa mudar nada. Mas se quiser usar um mirror específico:"]}),e.jsx(a,{title:"Trocar de mirror",code:`# 1. Lista oficial de mirrors:
#    https://mirrors.alpinelinux.org/

# 2. Editar /etc/apk/repositories manualmente:
#    Antes: https://dl-cdn.alpinelinux.org/alpine/v3.24/main
#    Depois: https://mirror.uepg.br/alpine/v3.24/main  (Brasil)

# 3. Ou usar o setup-apkrepos com a flag -1 (escolher manual):
setup-apkrepos -1
# Mostra uma lista numerada de mirrors para escolher

# 4. Testar a velocidade de diferentes mirrors
curl -w "%{time_total}s
" -o /dev/null -s https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz
curl -w "%{time_total}s
" -o /dev/null -s https://mirror.uepg.br/alpine/v3.24/main/x86_64/APKINDEX.tar.gz`}),e.jsxs(s,{type:"info",title:"Mirror brasileiro",children:["A UFPR mantém o mirror ",e.jsx("code",{children:"mirror.uepg.br/alpine/"}),". Para uso no Brasil, reduz a latência de ~180ms (CDN global) para ~10ms."]}),e.jsx("h2",{children:"5. Pinning: repositório por pacote"}),e.jsxs("p",{children:["Você pode instalar um pacote de um repositório específico sem adicioná-lo globalmente. Isso é ",e.jsx("strong",{children:"pinning de repositório"}),":"]}),e.jsx(a,{title:"Instalando de repositórios específicos",code:`# Instalar do testing sem ativar testing globalmente
apk add -X https://dl-cdn.alpinelinux.org/alpine/v3.24/testing neovim

# Instalar de um repo de terceiros
apk add -X https://meu-servidor/repo ./meu-pacote.apk

# Instalar de um repo local (diretório)
apk add -X /home/wallyson/meus-pacotes meu-pacote

# A flag -X vale só para ESSE comando. O repositório
# não aparece em /etc/apk/repositories.`}),e.jsx("p",{children:"Isso é especialmente útil para testing — você pega o que precisa sem contaminar o sistema inteiro."}),e.jsx("h2",{children:"6. Repositórios de terceiros"}),e.jsx("p",{children:"Nem tudo está nos repositórios oficiais. A comunidade mantém repositórios extras com software popular que não foi aceito no community (ainda):"}),e.jsx(a,{title:"Exemplos de repositórios de terceiros",code:`# Edge Community (versões bleeding-edge do community)
# https://dl-cdn.alpinelinux.org/alpine/edge/community

# Repositórios notáveis da comunidade:
# - testing-wireless: drivers Wi-Fi extras
# - @coder/apps: code-server, etc.

# SEMPRE verifique a procedência antes de adicionar um repo
# externo. O arquivo de chave pública (.rsa.pub) precisa estar
# em /etc/apk/keys/ para que o apk confie no repositório.`}),e.jsxs(s,{type:"warning",title:"Segurança: repositórios externos",children:["Qualquer repositório que você adiciona pode ",e.jsx("strong",{children:"substituir"})," ","pacotes do sistema. Um repositório malicioso poderia trocar seu",e.jsx("code",{children:"openssh"})," por uma versão com backdoor. Adicione apenas repositórios confiáveis, de preferência com a chave pública verificada."]}),e.jsx("h2",{children:"7. Criando um repositório local"}),e.jsx("p",{children:"Para testes, ambientes offline ou distribuição interna, você pode criar seu próprio repositório em segundos:"}),e.jsx(a,{title:"Criando um repositório local",code:`# 1. Juntar alguns .apk num diretório
mkdir -p /home/wallyson/meu-repo
cp *.apk /home/wallyson/meu-repo/

# 2. Gerar o índice
cd /home/wallyson/meu-repo
apk index -o APKINDEX.unsigned.tar.gz *.apk

# 3. Assinar o índice (precisa de chave, veja capítulo abuild)
#    Para testes, use --allow-untrusted:
apk add -X /home/wallyson/meu-repo --allow-untrusted meu-pacote

# 4. Servir via HTTP (para outras máquinas)
cd /home/wallyson/meu-repo && python3 -m http.server 8080
# Agora outras máquinas podem usar:
# apk add -X http://192.168.1.100:8080 meu-pacote`}),e.jsx("h2",{children:"8. Diagnóstico: entendendo o que está configurado"}),e.jsx(o,{title:"Inspecionando a configuração de repositórios",lines:[{type:"cmd",text:"cat /etc/apk/repositories"},{type:"out",text:"https://dl-cdn.alpinelinux.org/alpine/v3.24/main"},{type:"out",text:"https://dl-cdn.alpinelinux.org/alpine/v3.24/community"},{type:"cmd",text:"apk update 2>&1 | head -5"},{type:"out",text:"fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz"},{type:"out",text:"fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/community/x86_64/APKINDEX.tar.gz"},{type:"ok",text:"# Dois repositórios ativos, ambos respondendo"}]}),e.jsx(a,{title:"Consultas úteis",code:`# Ver de qual repositório veio um pacote
apk info nginx | grep -i origin

# Ver TODAS as branches disponíveis nos mirrors
apk search -r ""    # lista todos os pacotes disponíveis

# Verificar se um mirror específico está funcionando
apk update --repository https://meu-mirror/alpine/v3.24/main`}),e.jsxs(s,{type:"success",title:"Resumo",children:[e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"main"})," = essencial, oficial, seguro"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"community"})," = extra, mantido pela comunidade, ative sempre"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"testing"})," = bleeding-edge, use com ",e.jsx("code",{children:"-X"})," por pacote"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"v3.24"})," = stable, congelada, para produção"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"edge"})," = rolling, sempre atualizada, para dev/desktop"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mirrors"})," = CDN automática funciona bem; troque só se necessário"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pinning"})," = ",e.jsx("code",{children:"-X url"})," instala de um repo sem ativá-lo"]})]}),"O Alpine tem a estrutura de repositórios mais enxuta do mundo Linux. Em 10 minutos você entendeu tudo. O resto é prática."]})]})}export{n as default};
