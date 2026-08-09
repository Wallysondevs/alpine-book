import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Apk() {
  return (
    <PageContainer
      title="apk — Gerenciador de Pacotes"
      subtitle="O coração do Alpine. apk instala, remove, atualiza e gerencia todo o software com comandos simples e rápidos."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado, community ativo, <code>apk update</code> funcionando.
        Se pulou os capítulos anteriores, volte e configure isso antes.
      </AlertBox>

      <p>
        O <code>apk</code> (Alpine Package Keeper) é uma das melhores coisas do
        Alpine. Ele foi escrito do zero em C, é extremamente rápido e gerencia
        tudo com um único binário estático. Nada de <code>apt</code> +{" "}
        <code>dpkg</code> + <code>apt-get</code> + <code>apt-cache</code> — o apk
        faz tudo sozinho, em frações de segundo. Este capítulo cobre cada comando
        e flag que você vai usar no dia a dia.
      </p>

      {/* ===== SEÇÃO 1 ===== */}
      <h2>1. Filosofia do apk</h2>
      <p>
        Antes dos comandos, entenda os princípios. O apk foi projetado para:
      </p>
      <CodeBlock
        title="Os 4 pilares do apk"
        code={`1. RÁPIDO   — índices em SQLite, resolução de dependências em C,
            instalação em paralelo. Um apk add nginx leva &lt; 2 segundos.

2. SIMPLES  — um binário faz tudo: buscar, instalar, remover, info.
            Sem subcomandos complexos, sem apt vs apt-get.

3. ESTÁTICO — o apk é linked estaticamente contra musl. Funciona
            mesmo com o sistema quebrado (só precisa do kernel).

4. ATÔMICO  — cada pacote é um .apk (tar.gz comprimido). Instalar
            é descompactar. Remover é apagar. Sem dpkg-reconfigure.`}
      />

      {/* ===== SEÇÃO 2 ===== */}
      <h2>2. update e upgrade: a dupla essencial</h2>
      <p>
        O ciclo básico que você vai repetir centenas de vezes:
      </p>
      <Terminal
        title="Ciclo update + upgrade"
        lines={[
          { type: "cmd", text: "apk update" },
          { type: "out", text: "fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz" },
          { type: "out", text: "fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/community/x86_64/APKINDEX.tar.gz" },
          { type: "ok", text: "v3.24-1-gabc123 [https://dl-cdn.alpinelinux.org/alpine/v3.24/main]" },
          { type: "ok", text: "v3.24-1-gdef456 [https://dl-cdn.alpinelinux.org/alpine/v3.24/community]" },
          { type: "cmd", text: "apk upgrade" },
          { type: "out", text: "(1/2) Upgrading musl (1.2.5-r2 -> 1.2.5-r3)" },
          { type: "out", text: "(2/2) Upgrading openssh (9.9_p1-r0 -> 9.9_p1-r1)" },
          { type: "out", text: "OK: 4 MiB em 57 pacotes" },
        ]}
      />

      <p>
        <strong>update</strong> sincroniza os índices locais (arquivos APKINDEX
        que listam o que existe nos repositórios). <strong>upgrade</strong> compara
        os índices com o que está instalado e aplica as diferenças. Rode{" "}
        <code>update</code> sempre antes de instalar qualquer coisa.
      </p>

      <CodeBlock
        title="flags úteis do upgrade"
        code={`apk upgrade -i              # interativo: pergunta antes de cada pacote
apk upgrade -s              # simula (dry-run): mostra o que faria sem fazer
apk upgrade --available     # atualiza mesmo que a versão instalada seja a mesma
                            # (útil quando uma dependência mudou sem bump de versão)`}
      />

      <AlertBox type="info" title="apk upgrade vs apk upgrade -U">
        <code>apk upgrade -U</code> ou <code>apk upgrade --update-cache</code> faz
        o update e o upgrade num comando só. Prático, mas esconde o estado dos
        índices — se der erro, você não sabe se foi no fetch ou na instalação. Eu
        prefiro os dois separados.
      </AlertBox>

      {/* ===== SEÇÃO 3 ===== */}
      <h2>3. add: instalando pacotes</h2>
      <p>
        Instalar software no Alpine é uma linha. O apk resolve dependências,
        baixa os .apk e descompacta tudo em paralelo:
      </p>
      <Terminal
        title="Instalando pacotes"
        lines={[
          { type: "cmd", text: "apk add nginx" },
          { type: "out", text: "(1/3) Installing pcre2 (10.45-r0)" },
          { type: "out", text: "(2/3) Installing nginx (1.28.0-r0)" },
          { type: "out", text: "(3/3) Installing nginx-openrc (1.28.0-r0)" },
          { type: "out", text: "OK: 12 MiB em 60 pacotes" },
        ]}
      />

      <CodeBlock
        title="add — flags essenciais"
        code={`# Instalar múltiplos de uma vez
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
apk add --no-scripts postgresql`}
      />

      {/* ===== SEÇÃO 4 ===== */}
      <h2>4. search: encontrando pacotes</h2>
      <p>
        O <code>apk search</code> varre o nome e a descrição dos pacotes. Ele
        aceita padrões de busca parcial — você não precisa do nome exato:
      </p>
      <Terminal
        title="Buscando pacotes"
        lines={[
          { type: "cmd", text: "apk search nginx" },
          { type: "out", text: "nginx-1.28.0-r0" },
          { type: "out", text: "nginx-mod-http-geoip2-1.28.0-r0" },
          { type: "out", text: "nginx-openrc-1.28.0-r0" },
          { type: "out", text: "nginx-mod-http-lua-1.28.0-r0" },
          { type: "out", text: "..." },
        ]}
      />

      <CodeBlock
        title="search — modos de busca"
        code={`# Busca básica (nome e descrição)
apk search python

# Modo verboso: mostra versão e descrição
apk search -v postgresql
# postgresql-17.4-r0 - A sophisticated object-relational DBMS

# Buscar em repositório específico
apk search -r docker

# Buscar por arquivo dentro do pacote (qual pacote tem esse binário?)
apk search -f /usr/bin/rsync`}
      />

      {/* ===== SEÇÃO 5 ===== */}
      <h2>5. del: removendo pacotes</h2>
      <p>
        Remover é tão simples quanto instalar. O apk também remove dependências
        órfãs automaticamente se você pedir:
      </p>
      <CodeBlock
        title="del — removendo pacotes"
        code={`# Remover um pacote
apk del nginx

# Remover múltiplos
apk del neovim git curl

# Remover com dependências que sobraram órfãs
apk del --purge nginx

# Simular remoção (dry-run)
apk del -s htop`}
      />

      <AlertBox type="warning" title="Cuidado com remoção de dependências">
        <code>apk del</code> por padrão remove o pacote mas <strong>não</strong>{" "}
        remove as dependências que vieram com ele. Isso é seguro, mas deixa
        resíduos. Use <code>apk del --purge</code> para limpar os órfãos, mas
        antes confira com <code>apk info --depends</code> o que mais usa aquela
        dependência.
      </AlertBox>

      {/* ===== SEÇÃO 6 ===== */}
      <h2>6. info: inspecionando pacotes</h2>
      <p>
        O <code>apk info</code> é o canivete suíço para inspeção. Ele responde
        perguntas como "quais arquivos esse pacote instalou?", "quem depende
        dessa lib?" e "esse arquivo veio de qual pacote?":
      </p>
      <CodeBlock
        title="info — consultas essenciais"
        code={`# Listar todos os pacotes instalados
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
# /usr/bin/ssh is owned by openssh-client-9.9_p1-r0`}
      />

      <Terminal
        title="Descobrindo o dono de um arquivo"
        lines={[
          { type: "cmd", text: "apk info -W /etc/nginx/nginx.conf" },
          { type: "out", text: "/etc/nginx/nginx.conf is owned by nginx-1.28.0-r0" },
          { type: "cmd", text: "apk info -W /bin/ls" },
          { type: "out", text: "/bin/ls is owned by busybox-1.37.0-r3" },
        ]}
      />

      {/* ===== SEÇÃO 7 ===== */}
      <h2>7. Cache: gerenciando os .apk baixados</h2>
      <p>
        O apk guarda os pacotes baixados em <code>/var/cache/apk/</code>. Com o
        tempo, isso acumula. O Alpine não limpa sozinho — a limpeza é sua:
      </p>
      <CodeBlock
        title="Gerenciando o cache do apk"
        code={`# Ver quanto espaço o cache ocupa
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
apk add --no-cache docker`}
      />

      <AlertBox type="info" title="--no-cache em containers">
        Em Dockerfiles, você vai ver <code>apk add --no-cache nano</code> o tempo
        todo. Isso evita que o cache entre na camada do container, reduzindo a
        imagem final. Em VM ou bare metal, o cache é bem-vindo — agiliza
        reinstalações.
      </AlertBox>

      {/* ===== SEÇÃO 8 ===== */}
      <h2>8. world: o "manifesto" do sistema</h2>
      <p>
        O arquivo <code>/etc/apk/world</code> é a lista dos pacotes que você pediu
        <strong>explicitamente</strong>. Tudo que veio como dependência não aparece
        aqui. Esse arquivo é a alma do gerenciamento de pacotes:
      </p>
      <CodeBlock
        title="Entendendo o /etc/apk/world"
        code={`# Ver o que você instalou manualmente
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
# nodejs=20.18.0-r0`}
      />

      <p>
        Quando você faz <code>apk del nginx</code>, o apk remove o nginx do world
        E desinstala o pacote. Se outras coisas dependiam dele, o apk avisa.
      </p>

      {/* ===== SEÇÃO 9 ===== */}
      <h2>9. Version pinning e hold</h2>
      <p>
        Às vezes você precisa travar um pacote numa versão específica. O apk tem
        dois mecanismos para isso:
      </p>
      <CodeBlock
        title="Fixando versões de pacotes"
        code={`# 1. Instalar versão específica (pinning)
apk add nodejs=20.18.0-r0

# O world agora tem nodejs=20.18.0-r0 — o apk NÃO vai atualizar
# esse pacote até você remover o = do world.

# 2. Segurar pacote (hold — não atualiza no upgrade)
apk add nodejs=20.18.0-r0   # instala uma vez

# Ou editar o world manualmente:
echo "nodejs=20.18.0-r0" >> /etc/apk/world

# Para "soltar" o pacote:
apk add nodejs               # reinstala sem versão fixa
# Ou editar /etc/apk/world e tirar o =versao`}
      />

      <AlertBox type="warning" title="Pinning é manual, não esqueça">
        Pacotes fixados <strong>não recebem atualizações de segurança</strong>.
        Use com moderação — só para coisas que realmente quebram em versões novas,
        e revise periodicamente.
      </AlertBox>

      {/* ===== SEÇÃO 10 ===== */}
      <h2>10. fix: reparando o sistema</h2>
      <p>
        Se algo quebrou — dependências inconsistentes, arquivos corrompidos,
        instalação interrompida — o <code>apk fix</code> tenta consertar:
      </p>
      <CodeBlock
        title="apk fix — primeiros socorros"
        code={`# Reinstalar TODOS os pacotes do world
apk fix

# Reinstalar um pacote específico
apk fix nginx

# Verificar integridade de todos os pacotes instalados
apk audit

# Ver arquivos modificados (comparando com o pacote original)
apk audit --backup
# /etc/nginx/nginx.conf  ← modificado por você
# /etc/ssh/sshd_config   ← modificado por você`}
      />

      <Terminal
        title="Diagnosticando com apk audit"
        lines={[
          { type: "cmd", text: "apk audit" },
          { type: "out", text: "No missing files or dependencies detected." },
          { type: "ok", text: "# Sistema íntegro" },
          { type: "cmd", text: "apk audit --backup" },
          { type: "warn", text: "M /etc/nginx/nginx.conf" },
          { type: "warn", text: "M /etc/ssh/sshd_config" },
          { type: "comment", text: "# M = Modificado, A = Adicionado, D = Deletado" },
        ]}
      />

      {/* ===== SEÇÃO 11 ===== */}
      <h2>11. Erros comuns e como resolver</h2>

      <h3>NOT FOUND — pacote não encontrado</h3>
      <CodeBlock
        title="Erro: unsatisfiable constraints"
        code={`apk add xyz
# ERROR: unsatisfiable constraints:
#   xyz (missing):
#     required by: world[xyz]

# Causas prováveis:
# 1. Repositório community não está ativo → apk update && setup-apkrepos
# 2. Nome errado → apk search -v xyz
# 3. Pacote foi removido/movido do repositório`}
      />

      <h3>CONFLICT — conflito entre pacotes</h3>
      <CodeBlock
        title="Erro: conflicting packages"
        code={`# O apk avisa quando dois pacotes não podem coexistir:
# ERROR: unsatisfiable constraints:
#   package-a conflicts with package-b

# Solução: escolha um. Use apk info -R em cada um para ver
# qual tem mais dependentes e remova o outro.`}
      />

      <h3>BAD SIGNATURE — assinatura inválida</h3>
      <CodeBlock
        title="Erro: bad signature"
        code={`# Significa que o índice ou pacote não foi assinado com uma chave
# confiável. Soluções:

# 1. Atualizar as chaves do Alpine:
apk add -u alpine-keys

# 2. Se for um repo de terceiros, importar a chave:
cp chave.rsa.pub /etc/apk/keys/

# 3. Se for um repo local de testes, usar --allow-untrusted:
apk add --allow-untrusted meu-pacote.apk`}
      />

      {/* ===== SEÇÃO 12 ===== */}
      <h2>12. Comandos avançados</h2>
      <CodeBlock
        title="apk — flags e comandos para power users"
        code={`# Instalar um .apk local (sem repo)
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
ls -lt /var/log/apk* 2>/dev/null || echo "apk não mantém log de transações"`}
      />

      <AlertBox type="success" title="Resumo: comandos que você vai usar todo dia">
        <ol>
          <li><code>apk update && apk upgrade</code> — manter o sistema atualizado</li>
          <li><code>apk add <strong>pacote</strong></code> — instalar</li>
          <li><code>apk search <strong>termo</strong></code> — encontrar</li>
          <li><code>apk info -L <strong>pacote</strong></code> — arquivos instalados</li>
          <li><code>apk info -W <strong>/caminho</strong></code> — dono do arquivo</li>
          <li><code>apk del <strong>pacote</strong></code> — remover</li>
          <li><code>apk cache clean</code> — liberar espaço</li>
          <li><code>apk audit</code> — verificar integridade</li>
        </ol>
        O apk é simples e previsível — depois de uma semana usando, você nem
        pensa mais nisso. É o gerenciador de pacotes mais direto do mundo Linux.
      </AlertBox>
    </PageContainer>
  );
}