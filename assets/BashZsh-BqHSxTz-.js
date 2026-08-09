import{j as s,T as a}from"./index-YFyZeUD9.js";import{P as i,A as o,C as e}from"./AlertBox-C2CyWd7R.js";function h(){return s.jsxs(i,{title:"Bash & Zsh no Alpine",subtitle:"Instale bash e zsh, configure .bashrc/.zshrc, oh-my-zsh e autocompletions — o melhor dos dois mundos.",difficulty:"iniciante",timeToRead:"12 min",children:[s.jsx(o,{type:"info",title:"Pré-requisitos",children:"Alpine instalado. Se você ainda não leu o capítulo sobre ash, leia primeiro — ele explica como trocar o shell padrão."}),s.jsxs("p",{children:["O ash é funcional, mas para uso diário no terminal muita gente prefere bash (familiaridade) ou zsh (produtividade). Ambos estão a um"," ",s.jsx("code",{children:"apk add"})," de distância e funcionam perfeitamente no Alpine."]}),s.jsx("h2",{children:"1. Instalação rápida"}),s.jsx(e,{title:"Instalando bash e zsh",code:`# Bash
apk add bash bash-completion

# Zsh
apk add zsh zsh-completions

# Shadow (para chsh)
apk add shadow

# Trocar shell padrão
chsh -s /bin/bash    # ou /bin/zsh

# Verificar
echo {"$"}SHELL
# /bin/bash`}),s.jsx("h2",{children:"2. Bash: configuração básica"}),s.jsx(e,{title:"~/.bashrc — o essencial",code:`# Criar ~/.bashrc
cat > ~/.bashrc << 'EOF'
# Aliases básicos
alias ll='ls -la'
alias la='ls -A'
alias ..='cd ..'
alias ...='cd ../..'
alias update='doas apk update && doas apk upgrade'

# Prompt colorido
PS1='\\[\\e[32m\\]\\u{"@"}\\h\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\] \\$ '

# Editor padrão
export EDITOR=nvim

# PATH personalizado
export PATH="$HOME/.local/bin:$PATH"

# Bash completion
[ -f /usr/share/bash-completion/bash_completion ] &&     source /usr/share/bash-completion/bash_completion
EOF

source ~/.bashrc`}),s.jsx("h2",{children:"3. Zsh: configuração e oh-my-zsh"}),s.jsx(a,{title:"Primeiro login no zsh",lines:[{type:"cmd",text:"zsh"},{type:"out",text:"This is the Z Shell configuration function for new users."},{type:"out",text:"You are seeing this because you have no ~/.zshrc."},{type:"out",text:"Please select a configuration (1-2):"},{type:"comment",text:"# Pressione 2 para o setup mínimo, ou 0 para sair."}]}),s.jsx(e,{title:"Instalando oh-my-zsh",code:`# oh-my-zsh (framework popular de plugins e temas)
apk add git curl
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Plugins úteis (adicione ao ~/.zshrc):
# plugins=(git docker apk command-not-found sudo)

# Tema (powerlevel10k — popular e rápido)
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git   ~/.oh-my-zsh/custom/themes/powerlevel10k
# Edite ~/.zshrc: ZSH_THEME="powerlevel10k/powerlevel10k"

# Recarregar
source ~/.zshrc`}),s.jsx("h2",{children:"4. Bash completion no Alpine"}),s.jsx(e,{title:"Autocompletions para bash",code:`# Instalar o framework de completion
apk add bash-completion

# Habilitar no ~/.bashrc (já incluso se você usou o template acima)
source /usr/share/bash-completion/bash_completion

# Completions específicas por pacote:
apk add git          # já traz git-completion para bash
apk add docker-cli-compose  # completions de docker compose

# Testar:
systemctl --v  # (tab) → não funciona no Alpine (sem systemd)
rc-service {"<"}tab{">"}{"<"}tab{">"}  # lista serviços OpenRC
apk add {"<"}tab{">"}{"<"}tab{">"}     # lista pacotes disponíveis`}),s.jsx("h2",{children:"5. Zsh completion e plugins"}),s.jsx(e,{title:"Superpoderes do zsh",code:`# Completion nativa do zsh (já vem habilitada)
# Tente: ls -{"<"}tab{">"}  → lista todas as flags

# Plugins populares no ~/.zshrc:
plugins=(
    git             # aliases e funções git
    docker          # completion docker
    command-not-found  # sugere pacote quando comando não existe
    sudo            # Esc+Esc adiciona sudo no início
    history         # busca com h (history substring search)
)

# Sintaxe highlight (cores nos comandos enquanto digita)
apk add zsh-syntax-highlighting
echo "source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc

# Autosuggestions (sugestões cinza baseadas no histórico)
apk add zsh-autosuggestions
echo "source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc`}),s.jsx("h2",{children:"6. Qual escolher?"}),s.jsx(e,{title:"ash vs bash vs zsh — decisão rápida",code:`ash   → servidores mínimos, containers, scripts POSIX
bash   → uso geral, familiaridade Debian/Ubuntu
zsh    → desktop, produtividade, plugins e temas

# Você não precisa escolher UM:
# - Deixe ash como shell padrão do root (segurança)
# - Use bash para seu usuário diário
# - Experimente zsh no desktop

# Todos coexistem pacificamente. O chsh só muda o shell
# de login; você pode rodar qualquer um a qualquer momento:
bash   # abre um subshell bash
zsh    # abre um subshell zsh
exit   # volta para o shell anterior`}),s.jsx(o,{type:"success",title:"Resumo",children:s.jsxs("ol",{children:[s.jsxs("li",{children:[s.jsx("code",{children:"apk add bash zsh shadow"})," — instala tudo em 5 segundos"]}),s.jsxs("li",{children:[s.jsx("code",{children:"chsh -s /bin/bash"})," — troca shell padrão"]}),s.jsxs("li",{children:[s.jsx("code",{children:"~/.bashrc"})," / ",s.jsx("code",{children:"~/.zshrc"})," — personalize"]}),s.jsxs("li",{children:[s.jsx("code",{children:"bash-completion"})," — autocompletions para bash"]}),s.jsxs("li",{children:[s.jsx("code",{children:"oh-my-zsh"})," — plugins + temas para zsh"]}),s.jsx("li",{children:"Não troque o shell do root — mantenha ash por segurança"})]})})]})}export{h as default};
