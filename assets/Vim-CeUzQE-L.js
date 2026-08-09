import{j as i}from"./index-YFyZeUD9.js";import{P as o,A as e,C as a}from"./AlertBox-C2CyWd7R.js";function t(){return i.jsxs(o,{title:"Vim & Neovim no Alpine",subtitle:"Instale Vim ou Neovim, configuração básica, plugins e use como editor principal no terminal.",difficulty:"iniciante",timeToRead:"12 min",children:[i.jsx(e,{type:"info",title:"Pré-requisitos",children:"Terminal aberto. Se você nunca usou Vim, prepare-se para uma curva de aprendizado que compensa pelo resto da vida."}),i.jsxs("p",{children:["O Alpine não traz editor de texto além do ",i.jsx("code",{children:"vi"})," do BusyBox (que é muito limitado). Instalar Vim ou Neovim são dois comandos — e você ganha um editor completo para desenvolvimento e sysadmin."]}),i.jsx("h2",{children:"1. vi (BusyBox) vs Vim vs Neovim"}),i.jsx(a,{code:`# vi (BusyBox) — já vem instalado, MUITO limitado
vi arquivo.txt
# Não tem syntax highlight, undo múltiplo, plugins.

# Vim — editor clássico, syntax highlight, scripts
apk add vim

# Neovim — fork moderno, LSP nativo, plugins Lua
apk add neovim

# Recomendação: Neovim para desenvolvimento, Vim para sysadmin.`}),i.jsx("h2",{children:"2. Sobrevivência: comandos essenciais"}),i.jsx(a,{code:`# MODOS (a parte mais confusa para iniciantes)
# Normal (ESC)  → navegar, comandos
# Insert (i)    → digitar texto
# Visual (v)    → selecionar texto
# Command (:)    → comandos como salvar, sair

# SAIR (piada clássica: como sair do Vim?)
ESC :q!      # sair sem salvar
ESC :wq      # salvar e sair
ESC ZZ       # salvar e sair (atalho)

# EDITAR
i            # entrar no modo insert
ESC          # voltar ao modo normal
u            # undo (desfazer)
Ctrl+r       # redo (refazer)
dd           # deletar linha
yy           # copiar linha
p            # colar

# NAVEGAR
h j k l      # ← ↓ ↑ → (setas também funcionam)
w            # próxima palavra
b            # palavra anterior
0            # início da linha
$            # fim da linha
gg           # início do arquivo
G            # fim do arquivo
/termo       # buscar
n N          # próxima/anterior ocorrência`}),i.jsx("h2",{children:"3. Configuração mínima (~/.vimrc ou ~/.config/nvim/init.vim)"}),i.jsx(a,{code:`" Configuração essencial
syntax on                    " syntax highlight
set number                   " números de linha
set relativenumber           " números relativos
set tabstop=4                " tab = 4 espaços
set shiftwidth=4
set expandtab                " tabs viram espaços
set ignorecase               " busca case-insensitive
set smartcase                " ...exceto se usar maiúsculas
set mouse=a                  " suporte a mouse
set clipboard=unnamedplus    " usa clipboard do sistema`}),i.jsx("h2",{children:"4. Neovim + plugins modernos"}),i.jsx(a,{code:`# Instalar gerenciador de plugins (lazy.nvim)
git clone https://github.com/folke/lazy.nvim.git \\
  ~/.local/share/nvim/lazy/lazy.nvim

# Config mínima: ~/.config/nvim/init.lua
cat > ~/.config/nvim/init.lua << 'EOF'
vim.opt.number = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4

-- Lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
  { "neovim/nvim-lspconfig" },
  { "catppuccin/nvim", name = "catppuccin", priority = 1000 },
})
EOF`}),i.jsxs(e,{type:"info",title:"kickstart.nvim para iniciantes",children:["O ",i.jsx("strong",{children:"kickstart.nvim"})," é uma config pronta e comentada do Neovim com LSP, treesitter, telescope e tudo mais. Clone e adapte:"," ",i.jsx("code",{children:"git clone https://github.com/nvim-lua/kickstart.nvim.git ~/.config/nvim"})]}),i.jsx("h2",{children:"5. Atalhos que salvam vidas"}),i.jsx(a,{code:`# Sempre usei nano e me perdi:
# export EDITOR=nvim  (no ~/.profile)

# Abrir Vim direto em uma linha:
vim +42 arquivo.txt

# Editar arquivo como root:
# (não use doas vim — pode bagunçar permissões do home)
doas vim /etc/nginx/http.d/site.conf

# Substituir texto em múltiplos arquivos:
vim -p *.tsx           # abre todos em tabs
# :tabdo %s/antigo/novo/g | update`}),i.jsx(e,{type:"success",title:"Resumo",children:i.jsxs("ol",{children:[i.jsxs("li",{children:[i.jsx("code",{children:"apk add neovim"})," (ou ",i.jsx("code",{children:"vim"}),")"]}),i.jsx("li",{children:"Modos: Normal (ESC), Insert (i), Command (:)"}),i.jsxs("li",{children:[i.jsx("code",{children:":wq"})," salva e sai; ",i.jsx("code",{children:":q!"})," sai sem salvar"]}),i.jsx("li",{children:"h j k l ou setas para navegar; / para buscar"}),i.jsx("li",{children:"lazy.nvim para plugins; kickstart.nvim para config pronta"})]})})]})}export{t as default};
