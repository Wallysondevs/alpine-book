import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Aliases() {
  return (
    <PageContainer
      title="Aliases e Funções"
      subtitle="alias, unalias e funções shell — reduza digitação e automatize tarefas repetitivas no Alpine."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Terminal aberto. Tudo aqui funciona no ash, bash e zsh.
      </AlertBox>

      <p>
        Digitar <code>rc-service nginx status</code> toda hora cansa. Aliases
        transformam comandos longos em atalhos de 2 letras. Funções shell
        fazem o mesmo com lógica condicional. 10 minutos de configuração
        economizam horas de digitação.
      </p>

      <h2>1. alias: criando atalhos</h2>
      <CodeBlock
        title="Aliases essenciais"
        code={`# Sintaxe
alias nome='comando'

# Navegação
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# ls turbinado
alias ll='ls -la'
alias la='ls -A'
alias lt='ls -lt'        # ordenado por data
alias lh='ls -lh'        # tamanhos legíveis

# Sistema Alpine (os mais úteis!)
alias up='doas apk update && doas apk upgrade'
alias add='doas apk add'
alias del='doas apk del'
alias search='apk search'
alias rst='doas rc-service'
alias rcup='doas rc-update'

# Segurança
alias rm='rm -i'          # pergunta antes de apagar
alias cp='cp -i'
alias mv='mv -i'`}
      />

      <Terminal
        lines={[
          { type: "cmd", text: "alias ll='ls -la'" },
          { type: "cmd", text: "ll /etc" },
          { type: "out", text: "total 88K" },
          { type: "out", text: "drwxr-xr-x 21 root root 4.0K ..." },
          { type: "comment", text: "# Muito mais rápido que digitar ls -la toda vez." },
        ]}
      />

      <h2>2. Gerenciando aliases</h2>
      <CodeBlock
        title="Listar, ver e remover aliases"
        code={`# Listar TODOS os aliases ativos
alias

# Ver um alias específico
alias ll
# ll='ls -la'

# Remover alias
unalias ll

# Remover todos (cuidado!)
unalias -a

# Sobrescrever um alias
alias ll='ls -lah'`}
      />

      <h2>3. Funções shell: aliases com lógica</h2>
      <p>
        Quando um alias não é suficiente (precisa de argumentos, condicionais
        ou múltiplos comandos), use funções:
      </p>
      <CodeBlock
        title="Funções shell úteis"
        code={`# Criar diretório e entrar nele
mkcd() {
    mkdir -p "{"$"}1" && cd "{"$"}1"
}

# Extrair qualquer arquivo comprimido
extract() {
    case "{"$"}1" in
        *.tar.gz|*.tgz) tar xzf "{"$"}1" ;;
        *.tar.bz2)      tar xjf "{"$"}1" ;;
        *.tar.xz)       tar xJf "{"$"}1" ;;
        *.zip)          unzip "{"$"}1" ;;
        *.7z)           7z x "{"$"}1" ;;
        *)              echo "Formato desconhecido: {"$"}1" ;;
    esac
}

# Buscar processo e matar
pkillf() {
    pkill -f "{"$"}1" && echo "Morto: {"$"}1"
}

# Backup rápido com data
bak() {
    cp "{"$"}1" "{"$"}1.bak-{"$"}(date +%Y%m%d-%H%M%S)"
}`}
      />

      <h2>4. Onde definir aliases e funções</h2>
      <CodeBlock
        title="Persistindo aliases"
        code={`# No ash (padrão Alpine):
# → ~/.profile
cat >> ~/.profile << 'EOF'
alias ll='ls -la'
alias up='doas apk update && doas apk upgrade'
alias rst='doas rc-service'
alias rcup='doas rc-update'

mkcd() { mkdir -p "{"$"}1" && cd "{"$"}1"; }
EOF

# No bash:
# → ~/.bashrc

# No zsh:
# → ~/.zshrc

# Recarregar sem sair do terminal:
. ~/.profile   # ash
source ~/.bashrc  # bash`}
      />

      <h2>5. Coleção de aliases para Alpine</h2>
      <CodeBlock
        title="Aliases prontos — copie e cole no seu ~/.profile"
        code={`# ═══ SISTEMA ═══
alias up='doas apk update && doas apk upgrade'
alias add='doas apk add'
alias del='doas apk del'
alias search='apk search'
alias info='apk info'
alias whohas='apk info -W'      # qual pacote tem esse arquivo?

# ═══ SERVIÇOS (OpenRC) ═══
alias rst='doas rc-service'
alias rcup='doas rc-update'
alias rcstat='rc-status'

# ═══ NAVEGAÇÃO ═══
alias ..='cd ..'
alias ...='cd ../..'
alias ll='ls -la'
alias la='ls -A'
alias lt='ls -lt'
alias lh='ls -lh'

# ═══ SEGURANÇA ═══
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# ═══ REDE ═══
alias myip='curl -s ifconfig.me && echo'
alias ports='doas netstat -tlnp 2>/dev/null || doas ss -tlnp'`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>alias nome='comando'</code> — atalho de digitação</li>
          <li><code>alias</code> (sem argumentos) — lista todos</li>
          <li><code>unalias nome</code> — remove</li>
          <li>Funções shell para lógica com argumentos e condicionais</li>
          <li>Defina em <code>~/.profile</code> (ash), <code>~/.bashrc</code> ou <code>~/.zshrc</code></li>
          <li>Os aliases Alpine (up, add, rst, rcup) são os que mais economizam tempo</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}