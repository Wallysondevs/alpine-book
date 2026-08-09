import{j as e,T as r}from"./index-YFyZeUD9.js";import{P as s,A as i,C as o}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(s,{title:"Variáveis de Ambiente",subtitle:"export, PATH, env, /etc/profile — o que são, onde definir e como o Alpine as carrega.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx(i,{type:"info",title:"Pré-requisitos",children:"Terminal aberto. Conceito básico de shell. Tudo aqui funciona no ash, bash e zsh — use o que preferir."}),e.jsx("p",{children:'Variáveis de ambiente são o sistema de configuração mais antigo e universal do Unix. Todo programa as lê. Saber onde e como defini-las evita aquela frustração de "funciona no terminal mas não no cron" ou "funciona com meu usuário mas não com root".'}),e.jsx("h2",{children:"1. Ver, definir e exportar"}),e.jsx(r,{lines:[{type:"cmd",text:"env"},{type:"out",text:"PATH=/usr/local/bin:/usr/bin:/bin"},{type:"out",text:"HOME=/home/wallyson"},{type:"out",text:"USER=wallyson"},{type:"out",text:"SHELL=/bin/ash"},{type:"out",text:"LANG=C.UTF-8"},{type:"out",text:"EDITOR=nvim"},{type:"comment",text:"# env lista todas as variáveis do ambiente atual."}]}),e.jsx(o,{code:`# Variável LOCAL (só nesta sessão)
MEU_NOME="Wallyson"
echo $MEU_NOME

# Variável de AMBIENTE (herdada por processos filhos)
export EDITOR=nvim
export PATH="$HOME/.local/bin:$PATH"

# Ver uma variável específica
echo $PATH
printenv PATH

# Remover variável
unset MEU_NOME

# Passar variável para UM comando sem poluir o ambiente
LANG=pt_BR.UTF-8 date`}),e.jsx("h2",{children:"2. PATH: a variável mais importante"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"PATH"})," é a lista de diretórios onde o shell procura comandos. A ordem importa — o primeiro match vence:"]}),e.jsx(o,{code:`# PATH padrão do Alpine
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Adicionar diretório ao PATH
export PATH="$HOME/.local/bin:$PATH"
export PATH="$PATH:/opt/meu-app/bin"

# Tornar permanente (adicione ao ~/.profile):
echo 'export PATH="$HOME/.local/bin:$HOME/bin:$PATH"' >> ~/.profile

# Ver onde um comando está
which python3
# /usr/bin/python3`}),e.jsx("h2",{children:"3. /etc/profile, /etc/profile.d/ e ~/.profile"}),e.jsx("p",{children:"O Alpine carrega variáveis de ambiente destes arquivos, nesta ordem:"}),e.jsx(o,{code:`# 1. /etc/profile — GLOBAL (primeiro a carregar)
cat /etc/profile
# export PATH=...
# LANG=C.UTF-8
# CHARSET=UTF-8

# 2. /etc/profile.d/*.sh — scripts drop-in (carregados em loop)
ls /etc/profile.d/

# 3. ~/.profile — PESSOAL (último, sobrescreve os anteriores)

# ⚠️  O ash NÃO lê .bashrc, .bash_profile, .zshrc`}),e.jsxs(i,{type:"info",title:"/etc/profile.d/ para sysadmins",children:["Ao instalar um software que precisa de variáveis globais, coloque um script em ",e.jsx("code",{children:"/etc/profile.d/"}),". Exemplo:"," ",e.jsx("code",{children:"/etc/profile.d/jdk.sh"})," com"," ",e.jsx("code",{children:"export JAVA_HOME=/usr/lib/jvm/java-17-openjdk"}),"."]}),e.jsx("h2",{children:"4. Variáveis no OpenRC (/etc/conf.d/)"}),e.jsxs("p",{children:["Serviços gerenciados pelo OpenRC não herdam o ambiente do seu shell. Eles leem variáveis de ",e.jsx("code",{children:"/etc/conf.d/<serviço>"}),":"]}),e.jsx(o,{code:`# Exemplo: /etc/conf.d/nginx
# NGINX_OPTS="-c /etc/nginx/nginx.conf"

# Exemplo: /etc/conf.d/myapp (serviço customizado)
# export DATABASE_URL="postgresql://localhost/myapp"
# export LOG_LEVEL="info"`}),e.jsx("h2",{children:"5. Variáveis úteis no dia a dia"}),e.jsx(o,{code:`EDITOR=nvim           # editor padrão (git commit, crontab -e)
PAGER=less              # paginador padrão
LANG=C.UTF-8            # locale do sistema
TZ=America/Fortaleza    # timezone
HISTSIZE=1000           # tamanho do histórico
MANPATH=/usr/share/man  # onde estão as man pages

# Definir no ~/.profile:
echo 'export EDITOR=nvim' >> ~/.profile
echo 'export PAGER=less' >> ~/.profile`}),e.jsx("h2",{children:'6. Debug: quando a variável "some"'}),e.jsx(o,{code:`# "Eu defini mas não funciona no cron"
# → cron tem PATH mínimo. Use caminhos absolutos.

# "Funciona no meu shell mas não no script"
# → Você definiu sem export? A variável é local ao shell.

# "Funciona como root mas não como usuário"
# → root e usuários têm ambientes diferentes.
#   Compare: env (como usuário) vs doas env

# "Defini no /etc/profile mas não aparece"
# → Re-logou? /etc/profile só carrega no login.
#   Para testar: source /etc/profile`}),e.jsx(i,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"export VAR=valor"})," — define para esta sessão e processos filhos"]}),e.jsxs("li",{children:[e.jsx("code",{children:"~/.profile"})," — configurações pessoais (carrega no login)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/etc/profile.d/"})," — scripts globais drop-in"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/etc/conf.d/"})," — variáveis de serviços OpenRC"]}),e.jsxs("li",{children:[e.jsx("code",{children:"env"})," / ",e.jsx("code",{children:"printenv"})," — listar"]}),e.jsx("li",{children:"Cron e serviços NÃO herdam seu ambiente — configure explicitamente"})]})})]})}export{t as default};
