import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Apt() {
  return (
    <PageContainer
      title="APT — Gerenciador de Pacotes"
      subtitle="O coração do Ubuntu. APT instala, remove, atualiza e gerencia todo o software do sistema com comandos simples e poderosos."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Ubuntu instalado (qualquer versão LTS ou intermediária). Acesso a um terminal e
        usuário com permissão <code>sudo</code>. Não precisa saber gerenciar pacotes — vamos do zero.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Pacote</strong> — arquivo <code>.deb</code> empacotado com binários, libs,
        configs e metadados. Ubuntu/Debian distribuem todo software como pacotes.
      </p>
      <p>
        <strong>Repositório</strong> — servidor que hospeda pacotes. <code>/etc/apt/sources.list</code>
        e arquivos em <code>/etc/apt/sources.list.d/</code> listam quais repositórios o APT consulta.
      </p>
      <p>
        <strong>Dependência</strong> — outro pacote que o seu pacote precisa para funcionar.
        APT resolve dependências automaticamente; <code>dpkg</code> não.
      </p>
      <p>
        <strong>Cache APT</strong> — banco local em <code>/var/lib/apt/lists/</code> com a lista
        de pacotes disponíveis. <code>apt update</code> renova esse cache.
      </p>

      <p>
        O <strong>APT</strong> (Advanced Package Tool) é o gerenciador de pacotes do Ubuntu e de
        todas as distribuições baseadas em Debian. Ele é responsável por instalar, remover e
        atualizar software, resolvendo dependências automaticamente. Com um único comando, você
        pode instalar um aplicativo completo com todas as bibliotecas que ele precisa.
      </p>

      <h2>Os Comandos: apt vs apt-get</h2>
      <p>
        Você vai encontrar dois comandos na documentação: <code>apt</code> e <code>apt-get</code>.
        O <code>apt</code> é a versão moderna, com saída mais amigável e barra de progresso.
        O <code>apt-get</code> é o clássico, mais estável para scripts. Para uso no terminal
        do dia a dia, use sempre <code>apt</code>.
      </p>

      <AlertBox type="info" title="O que é uma flag (parâmetro)?">
        Flags são instruções extras passadas a um comando, sempre precedidas por <code>-</code>
        (flag curta, uma letra) ou <code>--</code> (flag longa, palavra completa).
        Exemplo: <code>apt install -y nginx</code> — o <code>-y</code> é a flag, o <code>nginx</code>
        é o pacote. Flags modificam o comportamento do comando.
      </AlertBox>

      <h2>1. Atualização do Sistema</h2>
      <CodeBlock
        title="Manter o sistema atualizado"
        code={`# PASSO 1: Atualizar a LISTA de pacotes disponíveis
sudo apt update
# Baixa informações dos repositórios sobre versões novas.
# Não instala nada — apenas "verifica o que há de novo".

# PASSO 2: Instalar as atualizações
sudo apt upgrade
# Instala versões mais novas dos pacotes já instalados.
# Vai perguntar "Deseja continuar? [S/n]" antes de instalar.

# A flag -y (ou --yes) responde "sim" automaticamente para todas as confirmações.
# Sem ela, o apt sempre pede confirmação antes de instalar ou remover.
sudo apt upgrade -y

# Fazer os dois de uma vez (a forma mais comum no dia a dia):
sudo apt update && sudo apt upgrade -y
# O && significa "execute o próximo comando SOMENTE se o anterior funcionou"

# PASSO AVANÇADO: Atualização completa (inclui mudanças de dependências)
sudo apt full-upgrade -y
# Pode instalar E remover pacotes se necessário.
# Necessário para grandes atualizações (ex: nova versão do kernel).

# Ver o que seria atualizado SEM instalar nada:
apt list --upgradable`}
      />

      <p>Rodando de verdade, a saída fica assim:</p>
      <Terminal
        title="wallyson@ubuntu: ~"
        lines={[
          { type: "cmd", text: "sudo apt update && sudo apt upgrade -y" },
          { type: "out", text: "[sudo] senha para wallyson:" },
          { type: "out", text: "Atingido:1 http://br.archive.ubuntu.com/ubuntu resolute InRelease" },
          { type: "out", text: "Obter:2 http://security.ubuntu.com/ubuntu resolute-security InRelease [126 kB]" },
          { type: "out", text: "Baixados 126 kB em 1s (98,7 kB/s)" },
          { type: "out", text: "Lendo listas de pacotes... Pronto" },
          { type: "out", text: "Os seguintes pacotes serao atualizados:" },
          { type: "out", text: "  firefox libssl3 python3.13 systemd tzdata (42 no total)" },
          { type: "ok", text: "42 atualizados, 0 novos, 0 a remover. 187 MB de arquivos." },
          { type: "ok", text: "Sistema atualizado com sucesso." },
        ]}
      />
      <AlertBox type="danger" title="Sempre faça apt update antes de instalar">
        Se você rodar <code>sudo apt install alguma-coisa</code> sem antes fazer
        <code>sudo apt update</code>, pode instalar uma versão desatualizada do pacote ou
        receber erros de dependência. Sempre atualize a lista primeiro.
      </AlertBox>

      <h2>2. Instalação de Pacotes</h2>
      <CodeBlock
        title="Instalar software com apt"
        code={`# Instalar um único pacote
sudo apt install vim
# Vai perguntar "Deseja continuar? [S/n]" — confirme com Enter ou S

# Instalar múltiplos pacotes de uma vez (separe por espaço)
sudo apt install git curl wget htop

# A flag -y confirma automaticamente, sem precisar responder às perguntas
sudo apt install -y nginx mysql-server php
# Equivalente a ficar digitando "S" para cada confirmação

# Instalar uma versão específica de um pacote
sudo apt install firefox=124.0+build3-0ubuntu0.24.04.1
# O = especifica a versão exata desejada

# Instalar um arquivo .deb baixado manualmente
sudo apt install ./nome-do-arquivo.deb
# O ./ indica que é um arquivo LOCAL (na pasta atual), não do repositório.
# O apt resolve as dependências automaticamente!

# Reinstalar um pacote que ficou corrompido
sudo apt install --reinstall nginx
# --reinstall = baixa e instala de novo, sobrescrevendo os arquivos atuais

# Instalar sem pacotes recomendados (instalação mais enxuta/mínima)
sudo apt install --no-install-recommends python3
# Pacotes recomendados são opcionais — sem esta flag, o apt os instala automaticamente`}
      />

      <p>Na prática, incluindo quando dá errado:</p>
      <Terminal
        title="wallyson@ubuntu: ~"
        lines={[
          { type: "cmd", text: "sudo apt install htop" },
          { type: "out", text: "Lendo listas de pacotes... Pronto" },
          { type: "out", text: "Os NOVOS pacotes a seguir serao instalados:" },
          { type: "out", text: "  htop" },
          { type: "out", text: "0 atualizados, 1 novos instalados, 0 a remover." },
          { type: "ok", text: "Configurando htop (3.3.0-1) ... ok" },
          { type: "comment", text: "# erro comum 1 — nome de pacote errado:" },
          { type: "cmd", text: "sudo apt install htopp" },
          { type: "err", text: "E: Impossivel encontrar o pacote htopp" },
          { type: "warn", text: "-> digitou errado. Use 'apt search htop' para achar o nome certo." },
          { type: "comment", text: "# erro comum 2 — o dpkg travado por outro processo:" },
          { type: "cmd", text: "sudo apt install nginx" },
          { type: "err", text: "E: Nao foi possivel obter trava /var/lib/dpkg/lock-frontend" },
          { type: "err", text: "   Em uso pelo processo unattended-upgr (pid 1423)" },
          { type: "warn", text: "-> o Ubuntu esta aplicando updates automaticos. Espere e tente de novo." },
        ]}
      />
      <h2>3. Busca e Informações</h2>
      <CodeBlock
        title="Pesquisar e inspecionar pacotes"
        code={`# Buscar pacotes pelo nome ou pela descrição
apt search vlc
apt search "video player"

# Ver informações detalhadas de um pacote ANTES de instalar
apt show nginx

# Saída do apt show:
# Package: nginx
# Version: 1.24.0-2ubuntu7
# Priority: optional
# Section: web
# Installed-Size: 3.021 kB
# Depends: libpcre2-8-0, ...   ← dependências que serão instaladas junto
# Description: small, powerful, scalable web/proxy server

# Listar TODOS os pacotes instalados no sistema
apt list --installed
# --installed = filtrar apenas os que já estão no sistema

# Verificar se um pacote específico está instalado
apt list --installed | grep nginx
# O | (pipe) passa a saída de um comando como entrada do próximo.
# grep filtra as linhas que contêm "nginx".

# Ver quais arquivos um pacote instalou
dpkg -L nginx
# -L = List files (listar arquivos do pacote)

# Descobrir qual pacote instalou um arquivo específico
dpkg -S /usr/bin/python3
# -S = Search (buscar qual pacote possui esse arquivo)

# Ver dependências de um pacote
apt depends nginx

# Ver quais pacotes dependem de um dado pacote
apt rdepends nginx
# rdepends = reverse depends (dependências reversas)`}
      />

      <h2>4. Remoção de Pacotes</h2>
      <CodeBlock
        title="Remover software de forma limpa"
        code={`# Remover um pacote (mantém arquivos de configuração em /etc/)
sudo apt remove nginx

# Remover um pacote E seus arquivos de configuração (purge = limpeza total)
sudo apt purge nginx
# Use purge quando quiser começar do zero com um serviço,
# ou quando a configuração estiver corrompida.

# Remover dependências que não são mais necessárias
sudo apt autoremove
# Quando você remove um pacote, suas dependências ficam "órfãs".
# autoremove identifica e remove essas dependências desnecessárias.

# A combinação mais completa e limpa:
sudo apt purge nginx && sudo apt autoremove -y

# Remover múltiplos pacotes de uma vez
sudo apt purge apache2 apache2-utils apache2-data`}
      />

      <AlertBox type="warning" title="remove vs purge">
        <code>apt remove</code> remove os binários mas mantém arquivos de configuração em
        <code>/etc/</code>. <code>apt purge</code> remove tudo, incluindo as configurações.
        Se você vai reinstalar o serviço, use <code>remove</code>. Se quer começar do zero
        (ex: limpar configurações ruins do MySQL), use <code>purge</code>.
      </AlertBox>

      <h2>5. Limpeza de Cache</h2>
      <CodeBlock
        title="Liberar espaço em disco"
        code={`# O APT guarda todos os .deb baixados em /var/cache/apt/archives/
# Com o tempo, isso pode ocupar vários GB.

# Ver quanto espaço o cache ocupa:
du -sh /var/cache/apt/archives/
# du = disk usage (uso de disco)
# -s = summary (mostrar apenas o total, não listar cada arquivo)
# -h = human readable (mostrar em KB, MB, GB — não em bytes brutos)

# Remover .deb de versões ANTIGAS (mantém a versão atual instalada)
sudo apt autoclean
# Seguro — mantém os pacotes atuais no cache caso precise reinstalar sem internet.

# Remover TODOS os .deb do cache (economiza mais espaço)
sudo apt clean

# Ver o que o autoremove iria remover SEM fazer nada (simulação):
sudo apt autoremove --dry-run
# --dry-run = "ensaio geral" — mostra o que aconteceria, mas não executa

# Limpeza completa de uma vez:
sudo apt autoremove -y && sudo apt clean`}
      />

      <h2>6. Repositórios e Sources.list</h2>
      <p>
        O APT busca pacotes em <strong>repositórios</strong>. A lista de repositórios fica em
        <code>/etc/apt/sources.list</code> e nos arquivos em <code>/etc/apt/sources.list.d/</code>.
      </p>
      <CodeBlock
        title="Entendendo e gerenciando repositórios"
        code={`# Ver repositórios configurados:
cat /etc/apt/sources.list

# Formato de uma linha de repositório:
# deb https://archive.ubuntu.com/ubuntu noble main restricted universe multiverse
# ^   ^                                 ^      ^    ^         ^        ^
# tipo  URL do servidor                  codinome componentes

# Habilitar repositório universe (pacotes mantidos pela comunidade):
sudo add-apt-repository universe
# universe = pacotes open source mantidos pela comunidade (não pela Canonical)

# Habilitar multiverse (software com restrições de licença):
sudo add-apt-repository multiverse
# multiverse = software proprietário ou com restrições legais (ex: codecs de vídeo)

# Adicionar repositório PPA (Personal Package Archive):
sudo add-apt-repository ppa:nome/repositorio
# PPA = repositórios mantidos por desenvolvedores independentes no Launchpad

# Exemplos de PPAs populares:
sudo add-apt-repository ppa:graphics-drivers/ppa     # Drivers NVIDIA recentes

# Remover um PPA:
sudo add-apt-repository --remove ppa:nome/repositorio
# --remove = inverso do comando, remove em vez de adicionar

# Após adicionar qualquer repositório, sempre atualize a lista:
sudo apt update`}
      />

      <h2>7. Repositório de Terceiros (Manual)</h2>
      <CodeBlock
        title="Adicionar repositório com chave GPG"
        code={`# Exemplo: Adicionar repositório oficial do VS Code (Microsoft)

# 1. Baixar e instalar a chave GPG do repositório
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | \\
    gpg --dearmor | \\
    sudo tee /usr/share/keyrings/microsoft.gpg > /dev/null
# wget = baixar da internet
# -q = quiet (silencioso, sem barra de progresso)
# -O- = output para stdout (- = saída padrão, em vez de salvar em arquivo)
# gpg --dearmor = converter a chave do formato texto para binário
# tee = salvar em arquivo E também mostrar na tela
# > /dev/null = descartar a saída da tela (só queremos salvar o arquivo)

# 2. Adicionar o repositório
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] \\
    https://packages.microsoft.com/repos/code stable main" | \\
    sudo tee /etc/apt/sources.list.d/vscode.list
# arch=amd64 = este repositório é para processadores 64-bit (x86_64)
# signed-by = usar esta chave para verificar a autenticidade dos pacotes

# 3. Atualizar e instalar
sudo apt update
sudo apt install code`}
      />

      <h2>8. Comandos Úteis do dpkg</h2>
      <CodeBlock
        title="dpkg — o instalador de baixo nível"
        code={`# dpkg é o programa que de fato instala os .deb. O APT usa o dpkg por baixo.

# Instalar um arquivo .deb manualmente (sem resolver dependências!)
sudo dpkg -i google-chrome-stable_current_amd64.deb
# -i = install (instalar)
# Se faltar dependências, o dpkg falhará. Corrija com:
sudo apt install -f
# -f = fix-broken (corrigir dependências quebradas)

# Ver todos os pacotes instalados
dpkg -l
# -l = list (listar)

# Ver arquivos instalados por um pacote
dpkg -L firefox
# -L = List files of package (listar arquivos DO pacote, letra maiúscula)

# Ver qual pacote instalou um arquivo específico
dpkg -S /usr/bin/firefox
# -S = Search (buscar qual pacote possui esse caminho)

# Verificar status e informações de um pacote
dpkg -s nginx
# -s = status

# Reconfigurar um pacote (refaz as perguntas de configuração):
sudo dpkg-reconfigure tzdata     # Reconfigurar fuso horário
sudo dpkg-reconfigure locales    # Reconfigurar idioma do sistema`}
      />
    </PageContainer>
  );
}
