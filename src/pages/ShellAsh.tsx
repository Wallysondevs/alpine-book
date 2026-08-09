import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function ShellAsh() {
  return (
    <PageContainer
      title="Shell BusyBox — ash"
      subtitle="O shell padrão do Alpine não é bash — é ash. Entenda as diferenças, o PS1, o history e como trocar para bash/zsh."
      difficulty="iniciante"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado e terminal aberto. Você já está usando ash — só não
        sabia. Vamos descobrir juntos.
      </AlertBox>

      <p>
        No Alpine, quando você abre um terminal, não é o bash que responde. É o{" "}
        <strong>ash</strong> (Almquist Shell), implementado pelo BusyBox. Ele
        é enxuto, compatível com POSIX e serve perfeitamente para administração
        de sistemas. Mas tem diferenças importantes se você vem do bash.
      </p>

      <h2>1. Confirmando que você está no ash</h2>
      <Terminal
        lines={[
          { type: "cmd", text: "echo $0" },
          { type: "out", text: "ash" },
          { type: "cmd", text: "echo $SHELL" },
          { type: "out", text: "/bin/ash" },
          { type: "cmd", text: "readlink /bin/sh" },
          { type: "out", text: "busybox" },
          { type: "comment", text: "# /bin/sh é um symlink para o busybox, que executa o applet ash." },
        ]}
      />

      <h2>2. ash vs bash: o que muda na prática</h2>
      <CodeBlock
        title="Diferenças essenciais entre ash e bash"
        code={`Funcionalidade           bash                    ash (Alpine)
─────────────────────    ────────────────────    ──────────────────
Arrays associativos      declare -A arr=([a]=1)  ❌ NÃO existe
[[ ]] (testes estendidos) [[ {"$"}a == {"$"}b ]]         ❌ Use [ ] com POSIX
{"$"}{"{"}var:offset:length{"}"}     expansão de string     ✅ Funciona
{"$"}RANDOM                  número aleatório        ❌ Use awk ou /dev/urandom
read -p "Prompt" var     prompt no read          ❌ Use echo + read
history                  ilimitado, busca Ctrl+R ❌ Limitado (~256 linhas)
PS1 com cores            \\[\\e[32m\\] etc.       ✅ Funciona com escape codes
source                   source ~/.profile       . ~/.profile (source = .)`}
      />

      <h2>3. PS1: personalizando o prompt</h2>
      <p>
        O prompt padrão do ash é <code>$</code> (usuário) ou <code>#</code>{" "}
        (root). Você pode personalizá-lo com a variável <code>PS1</code>:
      </p>
      <CodeBlock
        title="Personalizando o PS1"
        code={`# Prompt padrão Alpine
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
echo "PS1='\\u@\\h:\\w \\$ '" >> ~/.profile`}
      />

      <h2>4. History: o básico que funciona</h2>
      <p>
        O ash do BusyBox tem history limitado comparado ao bash. Veja o que
        funciona:
      </p>
      <CodeBlock
        title="History no ash"
        code={`# Ver histórico
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
# Veja a dica abaixo para configurar isso.`}
      />

      <AlertBox type="info" title="Salvar histórico automaticamente no ash">
        Adicione ao <code>~/.profile</code>:{" "}
        <code>export HISTFILE=~/.ash_history</code> e{" "}
        <code>trap 'history -a' EXIT</code>. Isso salva o histórico ao sair
        do shell. Não é perfeito como o bash, mas resolve.
      </AlertBox>

      <h2>5. /etc/profile e ~/.profile</h2>
      <p>
        O ash carrega configurações destes arquivos no login:
      </p>
      <CodeBlock
        title="Arquivos de inicialização do ash"
        code={`# 1. /etc/profile — configuração GLOBAL (root edita)
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
. ~/.profile`}
      />

      <p>
        <strong>Atenção:</strong> o ash NÃO lê <code>~/.bashrc</code>,{" "}
        <code>~/.bash_profile</code> ou <code>~/.zshrc</code>. Só o{" "}
        <code>/etc/profile</code> e o <code>~/.profile</code>.
      </p>

      <h2>6. Trocar para bash ou zsh</h2>
      <p>
        Se as limitações do ash incomodam, trocar de shell são dois comandos:
      </p>
      <CodeBlock
        title="Instalando e trocando o shell padrão"
        code={`# Instalar bash
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
zsh    # inicia um subshell zsh`}
      />

      <h2>7. Dicas para scripts no ash</h2>
      <CodeBlock
        title="Escrevendo scripts compatíveis com ash"
        code={`#!/bin/sh
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
#    É o melhor dos dois mundos: escreva POSIX, rode em qualquer lugar.`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>O Alpine usa <strong>ash</strong> (BusyBox) — não bash</li>
          <li>Funciona bem para administração; diferenças aparecem em scripts complexos</li>
          <li><code>PS1</code> customiza o prompt; <code>~/.profile</code> carrega configs</li>
          <li>History é limitado (sem Ctrl+R); use <code>trap</code> para salvar</li>
          <li>Quer bash? <code>apk add bash && chsh -s /bin/bash</code></li>
          <li>Scripts: use <code>#!/bin/sh</code> e POSIX — roda em qualquer lugar</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}