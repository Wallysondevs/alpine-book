import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Vim() {
  return (
    <PageContainer
      title="Vim &amp; Neovim no Alpine"
      subtitle="Instale Vim ou Neovim, configuração básica, plugins e use como editor principal no terminal."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Terminal aberto. Se você nunca usou Vim, prepare-se para uma curva de
        aprendizado que compensa pelo resto da vida.
      </AlertBox>

      <p>
        O Alpine não traz editor de texto além do <code>vi</code> do BusyBox
        (que é muito limitado). Instalar Vim ou Neovim são dois comandos — e
        você ganha um editor completo para desenvolvimento e sysadmin.
      </p>

      <h2>1. vi (BusyBox) vs Vim vs Neovim</h2>
      <CodeBlock
        code={`# vi (BusyBox) — já vem instalado, MUITO limitado
vi arquivo.txt
# Não tem syntax highlight, undo múltiplo, plugins.

# Vim — editor clássico, syntax highlight, scripts
apk add vim

# Neovim — fork moderno, LSP nativo, plugins Lua
apk add neovim

# Recomendação: Neovim para desenvolvimento, Vim para sysadmin.`}
      />

      <h2>2. Sobrevivência: comandos essenciais</h2>
      <CodeBlock
        code={`# MODOS (a parte mais confusa para iniciantes)
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
n N          # próxima/anterior ocorrência`}
      />

      <h2>3. Configuração mínima (~/.vimrc ou ~/.config/nvim/init.vim)</h2>
      <CodeBlock
        code={`" Configuração essencial
syntax on                    " syntax highlight
set number                   " números de linha
set relativenumber           " números relativos
set tabstop=4                " tab = 4 espaços
set shiftwidth=4
set expandtab                " tabs viram espaços
set ignorecase               " busca case-insensitive
set smartcase                " ...exceto se usar maiúsculas
set mouse=a                  " suporte a mouse
set clipboard=unnamedplus    " usa clipboard do sistema`}
      />

      <h2>4. Neovim + plugins modernos</h2>
      <CodeBlock
        code={`# Instalar gerenciador de plugins (lazy.nvim)
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
EOF`}
      />

      <AlertBox type="info" title="kickstart.nvim para iniciantes">
        O <strong>kickstart.nvim</strong> é uma config pronta e comentada do
        Neovim com LSP, treesitter, telescope e tudo mais. Clone e adapte:{" "}
        <code>git clone https://github.com/nvim-lua/kickstart.nvim.git ~/.config/nvim</code>
      </AlertBox>

      <h2>5. Atalhos que salvam vidas</h2>
      <CodeBlock
        code={`# Sempre usei nano e me perdi:
# export EDITOR=nvim  (no ~/.profile)

# Abrir Vim direto em uma linha:
vim +42 arquivo.txt

# Editar arquivo como root:
# (não use doas vim — pode bagunçar permissões do home)
doas vim /etc/nginx/http.d/site.conf

# Substituir texto em múltiplos arquivos:
vim -p *.tsx           # abre todos em tabs
# :tabdo %s/antigo/novo/g | update`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add neovim</code> (ou <code>vim</code>)</li>
          <li>Modos: Normal (ESC), Insert (i), Command (:)</li>
          <li><code>:wq</code> salva e sai; <code>:q!</code> sai sem salvar</li>
          <li>h j k l ou setas para navegar; / para buscar</li>
          <li>lazy.nvim para plugins; kickstart.nvim para config pronta</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}