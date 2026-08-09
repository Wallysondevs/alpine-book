import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as i,A as o,C as a}from"./AlertBox-C2CyWd7R.js";function r(){return e.jsxs(i,{title:"apk — Gerenciador de Pacotes",subtitle:"O coração do Alpine. apk instala, remove, atualiza e gerencia todo o software com comandos simples e rápidos.",difficulty:"iniciante",timeToRead:"25 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Alpine instalado, community ativo, ",e.jsx("code",{children:"apk update"})," funcionando. Se pulou os capítulos anteriores, volte e configure isso antes."]}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"apk"})," (Alpine Package Keeper) é uma das melhores coisas do Alpine. Ele foi escrito do zero em C, é extremamente rápido e gerencia tudo com um único binário estático. Nada de ",e.jsx("code",{children:"apt"})," +"," ",e.jsx("code",{children:"dpkg"})," + ",e.jsx("code",{children:"apt-get"})," + ",e.jsx("code",{children:"apt-cache"})," — o apk faz tudo sozinho, em frações de segundo. Este capítulo cobre cada comando e flag que você vai usar no dia a dia."]}),e.jsx("h2",{children:"1. Filosofia do apk"}),e.jsx("p",{children:"Antes dos comandos, entenda os princípios. O apk foi projetado para:"}),e.jsx(a,{title:"Os 4 pilares do apk",code:`1. RÁPIDO   — índices em SQLite, resolução de dependências em C,
            instalação em paralelo. Um apk add nginx leva &lt; 2 segundos.

2. SIMPLES  — um binário faz tudo: buscar, instalar, remover, info.
            Sem subcomandos complexos, sem apt vs apt-get.

3. ESTÁTICO — o apk é linked estaticamente contra musl. Funciona
            mesmo com o sistema quebrado (só precisa do kernel).

4. ATÔMICO  — cada pacote é um .apk (tar.gz comprimido). Instalar
            é descompactar. Remover é apagar. Sem dpkg-reconfigure.`}),e.jsx("h2",{children:"2. update e upgrade: a dupla essencial"}),e.jsx("p",{children:"O ciclo básico que você vai repetir centenas de vezes:"}),e.jsx(s,{title:"Ciclo update + upgrade",lines:[{type:"cmd",text:"apk update"},{type:"out",text:"fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz"},{type:"out",text:"fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/community/x86_64/APKINDEX.tar.gz"},{type:"ok",text:"v3.24-1-gabc123 [https://dl-cdn.alpinelinux.org/alpine/v3.24/main]"},{type:"ok",text:"v3.24-1-gdef456 [https://dl-cdn.alpinelinux.org/alpine/v3.24/community]"},{type:"cmd",text:"apk upgrade"},{type:"out",text:"(1/2) Upgrading musl (1.2.5-r2 -> 1.2.5-r3)"},{type:"out",text:"(2/2) Upgrading openssh (9.9_p1-r0 -> 9.9_p1-r1)"},{type:"out",text:"OK: 4 MiB em 57 pacotes"}]}),e.jsxs("p",{children:[e.jsx("strong",{children:"update"})," sincroniza os índices locais (arquivos APKINDEX que listam o que existe nos repositórios). ",e.jsx("strong",{children:"upgrade"})," compara os índices com o que está instalado e aplica as diferenças. Rode"," ",e.jsx("code",{children:"update"})," sempre antes de instalar qualquer coisa."]}),e.jsx(a,{title:"flags úteis do upgrade",code:`apk upgrade -i              # interativo: pergunta antes de cada pacote
apk upgrade -s              # simula (dry-run): mostra o que faria sem fazer
apk upgrade --available     # atualiza mesmo que a versão instalada seja a mesma
                            # (útil quando uma dependência mudou sem bump de versão)`}),e.jsxs(o,{type:"info",title:"apk upgrade vs apk upgrade -U",children:[e.jsx("code",{children:"apk upgrade -U"})," ou ",e.jsx("code",{children:"apk upgrade --update-cache"})," faz o update e o upgrade num comando só. Prático, mas esconde o estado dos índices — se der erro, você não sabe se foi no fetch ou na instalação. Eu prefiro os dois separados."]}),e.jsx("h2",{children:"3. add: instalando pacotes"}),e.jsx("p",{children:"Instalar software no Alpine é uma linha. O apk resolve dependências, baixa os .apk e descompacta tudo em paralelo:"}),e.jsx(s,{title:"Instalando pacotes",lines:[{type:"cmd",text:"apk add nginx"},{type:"out",text:"(1/3) Installing pcre2 (10.45-r0)"},{type:"out",text:"(2/3) Installing nginx (1.28.0-r0)"},{type:"out",text:"(3/3) Installing nginx-openrc (1.28.0-r0)"},{type:"out",text:"OK: 12 MiB em 60 pacotes"}]}),e.jsx(a,{title:"add — flags essenciais",code:`# Instalar múltiplos de uma vez
apk add neovim git curl

# Simular instalação (dry-run)
apk add -s htop

# Instalar sem perguntar (modo silencioso)
apk add -q docker

# Instalar versão específica
apk add nodejs=20.18.0-r0

# Forçar reinstalação (mesmo já instalado)
apk add -f python3

# Instalar sem executar scripts de pós-instalação
apk add --no-scripts postgresql`}),e.jsx("h2",{children:"4. search: encontrando pacotes"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"apk search"})," varre o nome e a descrição dos pacotes. Ele aceita padrões de busca parcial — você não precisa do nome exato:"]}),e.jsx(s,{title:"Buscando pacotes",lines:[{type:"cmd",text:"apk search nginx"},{type:"out",text:"nginx-1.28.0-r0"},{type:"out",text:"nginx-mod-http-geoip2-1.28.0-r0"},{type:"out",text:"nginx-openrc-1.28.0-r0"},{type:"out",text:"nginx-mod-http-lua-1.28.0-r0"},{type:"out",text:"..."}]}),e.jsx(a,{title:"search — modos de busca",code:`# Busca básica (nome e descrição)
apk search python

# Modo verboso: mostra versão e descrição
apk search -v postgresql
# postgresql-17.4-r0 - A sophisticated object-relational DBMS

# Buscar em repositório específico
apk search -r docker

# Buscar por arquivo dentro do pacote (qual pacote tem esse binário?)
apk search -f /usr/bin/rsync`}),e.jsx("h2",{children:"5. del: removendo pacotes"}),e.jsx("p",{children:"Remover é tão simples quanto instalar. O apk também remove dependências órfãs automaticamente se você pedir:"}),e.jsx(a,{title:"del — removendo pacotes",code:`# Remover um pacote
apk del nginx

# Remover múltiplos
apk del neovim git curl

# Remover com dependências que sobraram órfãs
apk del --purge nginx

# Simular remoção (dry-run)
apk del -s htop`}),e.jsxs(o,{type:"warning",title:"Cuidado com remoção de dependências",children:[e.jsx("code",{children:"apk del"})," por padrão remove o pacote mas ",e.jsx("strong",{children:"não"})," ","remove as dependências que vieram com ele. Isso é seguro, mas deixa resíduos. Use ",e.jsx("code",{children:"apk del --purge"})," para limpar os órfãos, mas antes confira com ",e.jsx("code",{children:"apk info --depends"})," o que mais usa aquela dependência."]}),e.jsx("h2",{children:"6. info: inspecionando pacotes"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"apk info"}),' é o canivete suíço para inspeção. Ele responde perguntas como "quais arquivos esse pacote instalou?", "quem depende dessa lib?" e "esse arquivo veio de qual pacote?":']}),e.jsx(a,{title:"info — consultas essenciais",code:`# Listar todos os pacotes instalados
apk info
apk info | wc -l    # quantos pacotes?

# Info detalhada de um pacote (versão, descrição, licença, tamanho)
apk info nginx

# Listar TODOS os arquivos que um pacote instalou
apk info -L nginx
# /etc/nginx/
# /etc/nginx/nginx.conf
# /usr/sbin/nginx
# ...

# Quais pacotes DEPENDEM deste? (dependência reversa)
apk info -R musl
# alpine-base, busybox, openssh, ... (quase tudo)

# Quais dependências este pacote precisa? (dependência direta)
apk info --depends nginx

# DE QUAL PACOTE veio este arquivo? (who-owns)
apk info -W /usr/bin/ssh
# /usr/bin/ssh is owned by openssh-client-9.9_p1-r0`}),e.jsx(s,{title:"Descobrindo o dono de um arquivo",lines:[{type:"cmd",text:"apk info -W /etc/nginx/nginx.conf"},{type:"out",text:"/etc/nginx/nginx.conf is owned by nginx-1.28.0-r0"},{type:"cmd",text:"apk info -W /bin/ls"},{type:"out",text:"/bin/ls is owned by busybox-1.37.0-r3"}]}),e.jsx("h2",{children:"7. Cache: gerenciando os .apk baixados"}),e.jsxs("p",{children:["O apk guarda os pacotes baixados em ",e.jsx("code",{children:"/var/cache/apk/"}),". Com o tempo, isso acumula. O Alpine não limpa sozinho — a limpeza é sua:"]}),e.jsx(a,{title:"Gerenciando o cache do apk",code:`# Ver quanto espaço o cache ocupa
du -sh /var/cache/apk

# Limpar pacotes antigos (mantém só a versão instalada)
apk cache clean

# Limpar TUDO (inclui a versão atual — não quebra nada, 
# só força re-download se precisar reinstalar)
apk cache clean -a

# Baixar um pacote sem instalar (útil para inspecionar)
apk fetch nginx
# salva nginx-1.28.0-r0.apk no diretório atual

# Instalar SEM usar cache (força download)
apk add --no-cache docker`}),e.jsxs(o,{type:"info",title:"--no-cache em containers",children:["Em Dockerfiles, você vai ver ",e.jsx("code",{children:"apk add --no-cache nano"})," o tempo todo. Isso evita que o cache entre na camada do container, reduzindo a imagem final. Em VM ou bare metal, o cache é bem-vindo — agiliza reinstalações."]}),e.jsx("h2",{children:'8. world: o "manifesto" do sistema'}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"/etc/apk/world"})," é a lista dos pacotes que você pediu",e.jsx("strong",{children:"explicitamente"}),". Tudo que veio como dependência não aparece aqui. Esse arquivo é a alma do gerenciamento de pacotes:"]}),e.jsx(a,{title:"Entendendo o /etc/apk/world",code:`# Ver o que você instalou manualmente
cat /etc/apk/world
# alpine-base
# doas
# neovim
# nodejs
# openssh
# ...

# Adicionar um pacote sem instalar (marca só no world)
apk add -t nginx   # --virtual: não instala, só registra intenção

# Remover do world sem desinstalar (a dependência vira "órfã")
apk del --no-purge nginx

# O world também aceita version pinning:
# nodejs=20.18.0-r0`}),e.jsxs("p",{children:["Quando você faz ",e.jsx("code",{children:"apk del nginx"}),", o apk remove o nginx do world E desinstala o pacote. Se outras coisas dependiam dele, o apk avisa."]}),e.jsx("h2",{children:"9. Version pinning e hold"}),e.jsx("p",{children:"Às vezes você precisa travar um pacote numa versão específica. O apk tem dois mecanismos para isso:"}),e.jsx(a,{title:"Fixando versões de pacotes",code:`# 1. Instalar versão específica (pinning)
apk add nodejs=20.18.0-r0

# O world agora tem nodejs=20.18.0-r0 — o apk NÃO vai atualizar
# esse pacote até você remover o = do world.

# 2. Segurar pacote (hold — não atualiza no upgrade)
apk add nodejs=20.18.0-r0   # instala uma vez

# Ou editar o world manualmente:
echo "nodejs=20.18.0-r0" >> /etc/apk/world

# Para "soltar" o pacote:
apk add nodejs               # reinstala sem versão fixa
# Ou editar /etc/apk/world e tirar o =versao`}),e.jsxs(o,{type:"warning",title:"Pinning é manual, não esqueça",children:["Pacotes fixados ",e.jsx("strong",{children:"não recebem atualizações de segurança"}),". Use com moderação — só para coisas que realmente quebram em versões novas, e revise periodicamente."]}),e.jsx("h2",{children:"10. fix: reparando o sistema"}),e.jsxs("p",{children:["Se algo quebrou — dependências inconsistentes, arquivos corrompidos, instalação interrompida — o ",e.jsx("code",{children:"apk fix"})," tenta consertar:"]}),e.jsx(a,{title:"apk fix — primeiros socorros",code:`# Reinstalar TODOS os pacotes do world
apk fix

# Reinstalar um pacote específico
apk fix nginx

# Verificar integridade de todos os pacotes instalados
apk audit

# Ver arquivos modificados (comparando com o pacote original)
apk audit --backup
# /etc/nginx/nginx.conf  ← modificado por você
# /etc/ssh/sshd_config   ← modificado por você`}),e.jsx(s,{title:"Diagnosticando com apk audit",lines:[{type:"cmd",text:"apk audit"},{type:"out",text:"No missing files or dependencies detected."},{type:"ok",text:"# Sistema íntegro"},{type:"cmd",text:"apk audit --backup"},{type:"warn",text:"M /etc/nginx/nginx.conf"},{type:"warn",text:"M /etc/ssh/sshd_config"},{type:"comment",text:"# M = Modificado, A = Adicionado, D = Deletado"}]}),e.jsx("h2",{children:"11. Erros comuns e como resolver"}),e.jsx("h3",{children:"NOT FOUND — pacote não encontrado"}),e.jsx(a,{title:"Erro: unsatisfiable constraints",code:`apk add xyz
# ERROR: unsatisfiable constraints:
#   xyz (missing):
#     required by: world[xyz]

# Causas prováveis:
# 1. Repositório community não está ativo → apk update && setup-apkrepos
# 2. Nome errado → apk search -v xyz
# 3. Pacote foi removido/movido do repositório`}),e.jsx("h3",{children:"CONFLICT — conflito entre pacotes"}),e.jsx(a,{title:"Erro: conflicting packages",code:`# O apk avisa quando dois pacotes não podem coexistir:
# ERROR: unsatisfiable constraints:
#   package-a conflicts with package-b

# Solução: escolha um. Use apk info -R em cada um para ver
# qual tem mais dependentes e remova o outro.`}),e.jsx("h3",{children:"BAD SIGNATURE — assinatura inválida"}),e.jsx(a,{title:"Erro: bad signature",code:`# Significa que o índice ou pacote não foi assinado com uma chave
# confiável. Soluções:

# 1. Atualizar as chaves do Alpine:
apk add -u alpine-keys

# 2. Se for um repo de terceiros, importar a chave:
cp chave.rsa.pub /etc/apk/keys/

# 3. Se for um repo local de testes, usar --allow-untrusted:
apk add --allow-untrusted meu-pacote.apk`}),e.jsx("h2",{children:"12. Comandos avançados"}),e.jsx(a,{title:"apk — flags e comandos para power users",code:`# Instalar um .apk local (sem repo)
apk add --allow-untrusted ./meu-pacote.apk

# Adicionar repositório temporário (uma instalação só)
apk add -X https://meu-repo/alpine/v3.24/testing meu-pacote

# Listar pacotes que NÃO estão no world (dependências órfãs)
apk info --installed | while read p; do
  grep -q "^$p$" /etc/apk/world || echo "$p (órfã?)"
done

# Criar um pacote .apk a partir de um diretório (tar.gz)
apk index -o APKINDEX.tar.gz *.apk

# Ver o que mudou no último upgrade
ls -lt /var/log/apk* 2>/dev/null || echo "apk não mantém log de transações"`}),e.jsxs(o,{type:"success",title:"Resumo: comandos que você vai usar todo dia",children:[e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk update && apk upgrade"})," — manter o sistema atualizado"]}),e.jsxs("li",{children:[e.jsxs("code",{children:["apk add ",e.jsx("strong",{children:"pacote"})]})," — instalar"]}),e.jsxs("li",{children:[e.jsxs("code",{children:["apk search ",e.jsx("strong",{children:"termo"})]})," — encontrar"]}),e.jsxs("li",{children:[e.jsxs("code",{children:["apk info -L ",e.jsx("strong",{children:"pacote"})]})," — arquivos instalados"]}),e.jsxs("li",{children:[e.jsxs("code",{children:["apk info -W ",e.jsx("strong",{children:"/caminho"})]})," — dono do arquivo"]}),e.jsxs("li",{children:[e.jsxs("code",{children:["apk del ",e.jsx("strong",{children:"pacote"})]})," — remover"]}),e.jsxs("li",{children:[e.jsx("code",{children:"apk cache clean"})," — liberar espaço"]}),e.jsxs("li",{children:[e.jsx("code",{children:"apk audit"})," — verificar integridade"]})]}),"O apk é simples e previsível — depois de uma semana usando, você nem pensa mais nisso. É o gerenciador de pacotes mais direto do mundo Linux."]})]})}export{r as default};
