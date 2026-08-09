import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as i,A as s,C as o}from"./AlertBox-C2CyWd7R.js";function c(){return e.jsxs(i,{title:"Shell BusyBox — ash",subtitle:"O shell padrão do Alpine não é bash — é ash. Entenda as diferenças, o PS1, o history e como trocar para bash/zsh.",difficulty:"iniciante",timeToRead:"18 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Alpine instalado e terminal aberto. Você já está usando ash — só não sabia. Vamos descobrir juntos."}),e.jsxs("p",{children:["No Alpine, quando você abre um terminal, não é o bash que responde. É o"," ",e.jsx("strong",{children:"ash"})," (Almquist Shell), implementado pelo BusyBox. Ele é enxuto, compatível com POSIX e serve perfeitamente para administração de sistemas. Mas tem diferenças importantes se você vem do bash."]}),e.jsx("h2",{children:"1. Confirmando que você está no ash"}),e.jsx(a,{lines:[{type:"cmd",text:"echo $0"},{type:"out",text:"ash"},{type:"cmd",text:"echo $SHELL"},{type:"out",text:"/bin/ash"},{type:"cmd",text:"readlink /bin/sh"},{type:"out",text:"busybox"},{type:"comment",text:"# /bin/sh é um symlink para o busybox, que executa o applet ash."}]}),e.jsx("h2",{children:"2. ash vs bash: o que muda na prática"}),e.jsx(o,{title:"Diferenças essenciais entre ash e bash",code:`Funcionalidade           bash                    ash (Alpine)
─────────────────────    ────────────────────    ──────────────────
Arrays associativos      declare -A arr=([a]=1)  ❌ NÃO existe
[[ ]] (testes estendidos) [[ {"$"}a == {"$"}b ]]         ❌ Use [ ] com POSIX
{"$"}{"{"}var:offset:length{"}"}     expansão de string     ✅ Funciona
{"$"}RANDOM                  número aleatório        ❌ Use awk ou /dev/urandom
read -p "Prompt" var     prompt no read          ❌ Use echo + read
history                  ilimitado, busca Ctrl+R ❌ Limitado (~256 linhas)
PS1 com cores            \\[\\e[32m\\] etc.       ✅ Funciona com escape codes
source                   source ~/.profile       . ~/.profile (source = .)`}),e.jsx("h2",{children:"3. PS1: personalizando o prompt"}),e.jsxs("p",{children:["O prompt padrão do ash é ",e.jsx("code",{children:"$"})," (usuário) ou ",e.jsx("code",{children:"#"})," ","(root). Você pode personalizá-lo com a variável ",e.jsx("code",{children:"PS1"}),":"]}),e.jsx(o,{title:"Personalizando o PS1",code:`# Prompt padrão Alpine
export PS1='\\w \\$ '
# /home/wallyson $

# Prompt com cores (funciona no ash!)
export PS1='\\[\\e[32m\\]\\u{"@"}\\h\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\] \\{"$"} '
# wallyson@alpine:~ $  (verde e azul)

# Escape codes do PS1:
# \\u = usuário       \\h = hostname curto
# \\w = diretório     \\W = só nome do diretório
# \\$ = $ ou #        \\t = hora (HH:MM:SS)

# Persistir: adicione ao ~/.profile
echo "PS1='\\u@\\h:\\w \\$ '" >> ~/.profile`}),e.jsx("h2",{children:"4. History: o básico que funciona"}),e.jsx("p",{children:"O ash do BusyBox tem history limitado comparado ao bash. Veja o que funciona:"}),e.jsx(o,{title:"History no ash",code:`# Ver histórico
history

# Últimos N comandos
history 10

# Executar comando do histórico por número
!42            # repete o comando 42

# Setas ↑ ↓ funcionam para navegar

# Ctrl+R NÃO funciona (busca reversa é bash/zsh)

# Tamanho do histórico (padrão: ~256)
echo $HISTFILESIZE
# Para aumentar, exporte no ~/.profile:
echo 'export HISTFILESIZE=1000' >> ~/.profile

# Salvar histórico no arquivo
history -a ~/.ash_history
# O ash NÃO salva histórico automaticamente como o bash.
# Veja a dica abaixo para configurar isso.`}),e.jsxs(s,{type:"info",title:"Salvar histórico automaticamente no ash",children:["Adicione ao ",e.jsx("code",{children:"~/.profile"}),":"," ",e.jsx("code",{children:"export HISTFILE=~/.ash_history"})," e"," ",e.jsx("code",{children:"trap 'history -a' EXIT"}),". Isso salva o histórico ao sair do shell. Não é perfeito como o bash, mas resolve."]}),e.jsx("h2",{children:"5. /etc/profile e ~/.profile"}),e.jsx("p",{children:"O ash carrega configurações destes arquivos no login:"}),e.jsx(o,{title:"Arquivos de inicialização do ash",code:`# 1. /etc/profile — configuração GLOBAL (root edita)
cat /etc/profile
# export PATH=/usr/local/bin:/usr/bin:/bin:...
# export LANG=C.UTF-8
# [ -f /etc/profile.d/*.sh ] && source /etc/profile.d/*.sh

# 2. ~/.profile — configuração PESSOAL (você edita)
# Crie se não existir:
cat > ~/.profile << 'EOF'
export EDITOR=nvim
export PATH="$HOME/.local/bin:$PATH"
alias ll='ls -la'
alias update='doas apk update && doas apk upgrade'
PS1='\\u{"@"}\\h:\\w \\{"$"} '
EOF

# 3. Recarregar após editar:
. ~/.profile`}),e.jsxs("p",{children:[e.jsx("strong",{children:"Atenção:"})," o ash NÃO lê ",e.jsx("code",{children:"~/.bashrc"}),","," ",e.jsx("code",{children:"~/.bash_profile"})," ou ",e.jsx("code",{children:"~/.zshrc"}),". Só o"," ",e.jsx("code",{children:"/etc/profile"})," e o ",e.jsx("code",{children:"~/.profile"}),"."]}),e.jsx("h2",{children:"6. Trocar para bash ou zsh"}),e.jsx("p",{children:"Se as limitações do ash incomodam, trocar de shell são dois comandos:"}),e.jsx(o,{title:"Instalando e trocando o shell padrão",code:`# Instalar bash
apk add bash
# ou zsh
apk add zsh

# Ver shells disponíveis
cat /etc/shells
# /bin/ash
# /bin/bash
# /bin/zsh

# Trocar seu shell padrão (precisa do pacote shadow)
apk add shadow
chsh -s /bin/bash
# Senha: ******

# No próximo login, você estará no bash.
# Para testar sem trocar o padrão:
bash   # inicia um subshell bash
zsh    # inicia um subshell zsh`}),e.jsx("h2",{children:"7. Dicas para scripts no ash"}),e.jsx(o,{title:"Escrevendo scripts compatíveis com ash",code:`#!/bin/sh
# Use #!/bin/sh, não #!/bin/bash — garante compatibilidade com ash.

# ✅ Use [ ] para testes (POSIX)
if [ "$a" = "$b" ]; then ...

# ❌ Evite [[ ]] (bash-only)
# ❌ Evite arrays associativos
# ❌ Evite {"$"}{"{"}var,,{"}"} (lowercase) e {"$"}{"{"}var^^{"}"} (uppercase)

# ✅ Use case em vez de [[ =~ ]]
case "$var" in
    start|stop) echo "ok" ;;
    *) echo "desconhecido" ;;
esac

# ✅ Scripts enxutos funcionam no ash — e no bash também.
#    É o melhor dos dois mundos: escreva POSIX, rode em qualquer lugar.`}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:["O Alpine usa ",e.jsx("strong",{children:"ash"})," (BusyBox) — não bash"]}),e.jsx("li",{children:"Funciona bem para administração; diferenças aparecem em scripts complexos"}),e.jsxs("li",{children:[e.jsx("code",{children:"PS1"})," customiza o prompt; ",e.jsx("code",{children:"~/.profile"})," carrega configs"]}),e.jsxs("li",{children:["History é limitado (sem Ctrl+R); use ",e.jsx("code",{children:"trap"})," para salvar"]}),e.jsxs("li",{children:["Quer bash? ",e.jsx("code",{children:"apk add bash && chsh -s /bin/bash"})]}),e.jsxs("li",{children:["Scripts: use ",e.jsx("code",{children:"#!/bin/sh"})," e POSIX — roda em qualquer lugar"]})]})})]})}export{c as default};
