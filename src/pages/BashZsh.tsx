import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function BashZsh() {
  return (
    <PageContainer
      title="Bash &amp; Zsh no Alpine"
      subtitle="Instale bash e zsh, configure .bashrc/.zshrc, oh-my-zsh e autocompletions — o melhor dos dois mundos."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado. Se você ainda não leu o capítulo sobre ash, leia
        primeiro — ele explica como trocar o shell padrão.
      </AlertBox>

      <p>
        O ash é funcional, mas para uso diário no terminal muita gente prefere
        bash (familiaridade) ou zsh (produtividade). Ambos estão a um{" "}
        <code>apk add</code> de distância e funcionam perfeitamente no Alpine.
      </p>

      <h2>1. Instalação rápida</h2>
      <CodeBlock
        title="Instalando bash e zsh"
        code={`# Bash
apk add bash bash-completion

# Zsh
apk add zsh zsh-completions

# Shadow (para chsh)
apk add shadow

# Trocar shell padrão
chsh -s /bin/bash    # ou /bin/zsh

# Verificar
echo {"$"}SHELL
# /bin/bash`}
      />

      <h2>2. Bash: configuração básica</h2>
      <CodeBlock
        title="~/.bashrc — o essencial"
        code={`# Criar ~/.bashrc
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
[ -f /usr/share/bash-completion/bash_completion ] && \
    source /usr/share/bash-completion/bash_completion
EOF

source ~/.bashrc`}
      />

      <h2>3. Zsh: configuração e oh-my-zsh</h2>
      <Terminal
        title="Primeiro login no zsh"
        lines={[
          { type: "cmd", text: "zsh" },
          { type: "out", text: "This is the Z Shell configuration function for new users." },
          { type: "out", text: "You are seeing this because you have no ~/.zshrc." },
          { type: "out", text: "Please select a configuration (1-2):" },
          { type: "comment", text: "# Pressione 2 para o setup mínimo, ou 0 para sair." },
        ]}
      />

      <CodeBlock
        title="Instalando oh-my-zsh"
        code={`# oh-my-zsh (framework popular de plugins e temas)
apk add git curl
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Plugins úteis (adicione ao ~/.zshrc):
# plugins=(git docker apk command-not-found sudo)

# Tema (powerlevel10k — popular e rápido)
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  ~/.oh-my-zsh/custom/themes/powerlevel10k
# Edite ~/.zshrc: ZSH_THEME="powerlevel10k/powerlevel10k"

# Recarregar
source ~/.zshrc`}
      />

      <h2>4. Bash completion no Alpine</h2>
      <CodeBlock
        title="Autocompletions para bash"
        code={`# Instalar o framework de completion
apk add bash-completion

# Habilitar no ~/.bashrc (já incluso se você usou o template acima)
source /usr/share/bash-completion/bash_completion

# Completions específicas por pacote:
apk add git          # já traz git-completion para bash
apk add docker-cli-compose  # completions de docker compose

# Testar:
systemctl --v  # (tab) → não funciona no Alpine (sem systemd)
rc-service {"<"}tab{">"}{"<"}tab{">"}  # lista serviços OpenRC
apk add {"<"}tab{">"}{"<"}tab{">"}     # lista pacotes disponíveis`}
      />

      <h2>5. Zsh completion e plugins</h2>
      <CodeBlock
        title="Superpoderes do zsh"
        code={`# Completion nativa do zsh (já vem habilitada)
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
echo "source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc`}
      />

      <h2>6. Qual escolher?</h2>
      <CodeBlock
        title="ash vs bash vs zsh — decisão rápida"
        code={`ash   → servidores mínimos, containers, scripts POSIX
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
exit   # volta para o shell anterior`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add bash zsh shadow</code> — instala tudo em 5 segundos</li>
          <li><code>chsh -s /bin/bash</code> — troca shell padrão</li>
          <li><code>~/.bashrc</code> / <code>~/.zshrc</code> — personalize</li>
          <li><code>bash-completion</code> — autocompletions para bash</li>
          <li><code>oh-my-zsh</code> — plugins + temas para zsh</li>
          <li>Não troque o shell do root — mantenha ash por segurança</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}