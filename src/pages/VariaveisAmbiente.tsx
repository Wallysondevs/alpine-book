import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function VariaveisAmbiente() {
  return (
    <PageContainer
      title="Variáveis de Ambiente"
      subtitle="export, PATH, env, /etc/profile — o que são, onde definir e como o Alpine as carrega."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Terminal aberto. Conceito básico de shell. Tudo aqui funciona no ash,
        bash e zsh — use o que preferir.
      </AlertBox>

      <p>
        Variáveis de ambiente são o sistema de configuração mais antigo e
        universal do Unix. Todo programa as lê. Saber onde e como defini-las
        evita aquela frustração de "funciona no terminal mas não no cron" ou
        "funciona com meu usuário mas não com root".
      </p>

      <h2>1. Ver, definir e exportar</h2>
      <Terminal
        lines={[
          { type: "cmd", text: "env" },
          { type: "out", text: "PATH=/usr/local/bin:/usr/bin:/bin" },
          { type: "out", text: "HOME=/home/wallyson" },
          { type: "out", text: "USER=wallyson" },
          { type: "out", text: "SHELL=/bin/ash" },
          { type: "out", text: "LANG=C.UTF-8" },
          { type: "out", text: "EDITOR=nvim" },
          { type: "comment", text: "# env lista todas as variáveis do ambiente atual." },
        ]}
      />

      <CodeBlock
        code={`# Variável LOCAL (só nesta sessão)
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
LANG=pt_BR.UTF-8 date`}
      />

      <h2>2. PATH: a variável mais importante</h2>
      <p>
        O <code>PATH</code> é a lista de diretórios onde o shell procura
        comandos. A ordem importa — o primeiro match vence:
      </p>
      <CodeBlock
        code={`# PATH padrão do Alpine
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Adicionar diretório ao PATH
export PATH="$HOME/.local/bin:$PATH"
export PATH="$PATH:/opt/meu-app/bin"

# Tornar permanente (adicione ao ~/.profile):
echo 'export PATH="$HOME/.local/bin:$HOME/bin:$PATH"' >> ~/.profile

# Ver onde um comando está
which python3
# /usr/bin/python3`}
      />

      <h2>3. /etc/profile, /etc/profile.d/ e ~/.profile</h2>
      <p>
        O Alpine carrega variáveis de ambiente destes arquivos, nesta ordem:
      </p>
      <CodeBlock
        code={`# 1. /etc/profile — GLOBAL (primeiro a carregar)
cat /etc/profile
# export PATH=...
# LANG=C.UTF-8
# CHARSET=UTF-8

# 2. /etc/profile.d/*.sh — scripts drop-in (carregados em loop)
ls /etc/profile.d/

# 3. ~/.profile — PESSOAL (último, sobrescreve os anteriores)

# ⚠️  O ash NÃO lê .bashrc, .bash_profile, .zshrc`}
      />

      <AlertBox type="info" title="/etc/profile.d/ para sysadmins">
        Ao instalar um software que precisa de variáveis globais, coloque um
        script em <code>/etc/profile.d/</code>. Exemplo:{" "}
        <code>/etc/profile.d/jdk.sh</code> com{" "}
        <code>export JAVA_HOME=/usr/lib/jvm/java-17-openjdk</code>.
      </AlertBox>

      <h2>4. Variáveis no OpenRC (/etc/conf.d/)</h2>
      <p>
        Serviços gerenciados pelo OpenRC não herdam o ambiente do seu shell.
        Eles leem variáveis de <code>/etc/conf.d/&lt;serviço&gt;</code>:
      </p>
      <CodeBlock
        code={`# Exemplo: /etc/conf.d/nginx
# NGINX_OPTS="-c /etc/nginx/nginx.conf"

# Exemplo: /etc/conf.d/myapp (serviço customizado)
# export DATABASE_URL="postgresql://localhost/myapp"
# export LOG_LEVEL="info"`}
      />

      <h2>5. Variáveis úteis no dia a dia</h2>
      <CodeBlock
        code={`EDITOR=nvim           # editor padrão (git commit, crontab -e)
PAGER=less              # paginador padrão
LANG=C.UTF-8            # locale do sistema
TZ=America/Fortaleza    # timezone
HISTSIZE=1000           # tamanho do histórico
MANPATH=/usr/share/man  # onde estão as man pages

# Definir no ~/.profile:
echo 'export EDITOR=nvim' >> ~/.profile
echo 'export PAGER=less' >> ~/.profile`}
      />

      <h2>6. Debug: quando a variável "some"</h2>
      <CodeBlock
        code={`# "Eu defini mas não funciona no cron"
# → cron tem PATH mínimo. Use caminhos absolutos.

# "Funciona no meu shell mas não no script"
# → Você definiu sem export? A variável é local ao shell.

# "Funciona como root mas não como usuário"
# → root e usuários têm ambientes diferentes.
#   Compare: env (como usuário) vs doas env

# "Defini no /etc/profile mas não aparece"
# → Re-logou? /etc/profile só carrega no login.
#   Para testar: source /etc/profile`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>export VAR=valor</code> — define para esta sessão e processos filhos</li>
          <li><code>~/.profile</code> — configurações pessoais (carrega no login)</li>
          <li><code>/etc/profile.d/</code> — scripts globais drop-in</li>
          <li><code>/etc/conf.d/</code> — variáveis de serviços OpenRC</li>
          <li><code>env</code> / <code>printenv</code> — listar</li>
          <li>Cron e serviços NÃO herdam seu ambiente — configure explicitamente</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}