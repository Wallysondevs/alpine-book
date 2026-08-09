import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Usuarios() {
  return (
    <PageContainer
      title="Usuários, Grupos &amp; doas"
      subtitle="adduser, /etc/passwd, grupos, doas/sudo, su — gerencie quem acessa o sistema e com quais poderes."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado com acesso root. O básico de <code>adduser</code> e{" "}
        <code>doas</code> foi coberto nos Primeiros Passos; aqui vamos a fundo.
      </AlertBox>

      <p>
        Usuários são a primeira linha de defesa de qualquer sistema. O Alpine
        gerencia isso com ferramentas minimalistas: o BusyBox traz{" "}
        <code>adduser</code> e <code>addgroup</code>, o <code>doas</code>{" "}
        controla privilégios, e o <code>/etc/passwd</code> continua sendo a
        fonte da verdade.
      </p>

      <h2>1. adduser e addgroup (BusyBox)</h2>
      <p>
        O Alpine usa as versões BusyBox, que são assistentes interativos
        simplificados. Para ferramentas POSIX completas, instale o pacote{" "}
        <code>shadow</code>:
      </p>
      <CodeBlock
        title="adduser/addgroup BusyBox vs shadow"
        code={`# BUSYBOX (padrão Alpine — assistente interativo)
adduser wallyson              # cria usuário, grupo, home, pergunta senha
addgroup devs                 # cria grupo

# SHADOW (ferramentas POSIX tradicionais)
apk add shadow
useradd -m -s /bin/ash wallyson   # -m cria home, -s define shell
groupadd devs
usermod -aG wheel wallyson        # adiciona a grupo secundário
userdel -r wallyson               # remove usuário e home
passwd wallyson                   # troca senha`}
      />

      <Terminal
        title="Criando um usuário completo"
        lines={[
          { type: "cmd", text: "adduser maria" },
          { type: "out", text: "Changing password for maria" },
          { type: "cmd", text: "New password: ********" },
          { type: "cmd", text: "Retype password: ********" },
          { type: "out", text: "passwd: password for maria changed by root" },
          { type: "ok", text: "# Usuário maria (UID 1001), grupo maria, home /home/maria" },
        ]}
      />

      <h2>2. /etc/passwd, /etc/shadow e /etc/group</h2>
      <CodeBlock
        title="Os três arquivos de contas"
        code={`# /etc/passwd — 7 campos separados por :
# nome:senha:UID:GID:GECOS:home:shell
wallyson:x:1000:1000:Wallyson:/home/wallyson:/bin/ash
maria:x:1001:1001:Maria:/home/maria:/bin/ash
nginx:x:100:101:nginx:/var/lib/nginx:/sbin/nologin

# /etc/shadow — senhas hasheadas (só root lê)
wallyson:$6$salt$hash...:19999:0:99999:7:::

# /etc/group — grupos e membros
wheel:x:10:wallyson,maria
devs:x:1002:wallyson
docker:x:101:wallyson`}
      />

      <p>
        <code>/sbin/nologin</code> como shell impede login interativo — ideal
        para usuários de sistema (nginx, postgres, etc.).
      </p>

      <h2>3. Grupos e wheel</h2>
      <CodeBlock
        title="Gerenciando grupos"
        code={`# Criar grupo
addgroup devs

# Adicionar usuário a grupo (com shadow)
apk add shadow
usermod -aG devs wallyson     # -a = append, -G = grupos secundários

# Com BusyBox: editar /etc/group manualmente
# wheel:x:10:wallyson,maria

# Ver grupos de um usuário
groups wallyson
# wallyson : wallyson wheel devs docker

# Grupo wheel = administradores (tradição BSD, adotada pelo Alpine)
# Quem está no wheel pode usar doas/sudo para virar root.`}
      />

      <h2>4. doas: o guardião de privilégios do Alpine</h2>
      <p>
        O <code>doas</code> (dedicated openbsd application subexecutor) é o
        equivalente ao sudo no Alpine. Mais leve (~25 KB), mais simples e
        com sintaxe de configuração direta:
      </p>
      <CodeBlock
        title="doas — configuração completa"
        code={`# Instalar
apk add doas

# Arquivo de configuração
cat /etc/doas.d/doas.conf

# Sintaxe: permit|deny [opções] usuário as target [cmd]

# Permitir que wallyson execute QUALQUER comando como root
permit persist wallyson as root

# Permitir que o grupo wheel execute qualquer coisa
permit persist :wheel as root

# Permitir comando específico (sem senha)
permit nopass wallyson as root cmd rc-service

# Negar shutdown para todos exceto root
deny :wheel as root cmd shutdown
deny :wheel as root cmd reboot

# persist = lembra a senha por alguns minutos
# nopass  = não pede senha
# keepenv = mantém variáveis de ambiente`}
      />

      <Terminal
        title="doas no dia a dia"
        lines={[
          { type: "cmd", text: "doas apk update" },
          { type: "out", text: "Password:" },
          { type: "cmd", text: "********" },
          { type: "out", text: "fetch https://dl-cdn.alpinelinux.org/..." },
          { type: "ok", text: "# Senha lembrada por 5 minutos (persist)" },
          { type: "cmd", text: "doas rc-service sshd restart" },
          { type: "ok", text: "# Não pediu senha — ainda dentro da janela persist" },
        ]}
      />

      <h2>5. sudo: a alternativa tradicional</h2>
      <CodeBlock
        title="Instalando e configurando sudo"
        code={`# Instalar
apk add sudo

# Configuração (visudo ou arquivo drop-in)
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/wheel

# Sem senha para o grupo wheel
echo "%wheel ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/wheel

# Uso
sudo apk update
sudo -i            # shell interativo como root
sudo -u postgres psql   # executar como outro usuário`}
      />

      <AlertBox type="warning" title="doas ou sudo? Escolha um.">
        Ter os dois instalados gera confusão. O Alpine recomenda{" "}
        <strong>doas</strong> — é a ferramenta nativa, usada pelo próprio{" "}
        <code>setup-alpine</code>. Se seu fluxo de trabalho depende de scripts
        que usam <code>sudo</code>, instale o sudo. Mas não use os dois.
      </AlertBox>

      <h2>6. su: trocar de usuário</h2>
      <CodeBlock
        title="su — switch user"
        code={`# Virar root (precisa da senha do root)
su -

# Virar outro usuário (precisa da senha DELE)
su - maria

# Executar um comando como outro usuário
su - maria -c "whoami"

# O - (hífen) carrega o ambiente do usuário (login shell).
# Sem o -, você fica no mesmo diretório e PATH.`}
      />

      <h2>7. Boas práticas de segurança</h2>
      <CodeBlock
        title="Checklist de hardening de usuários"
        code={`# 1. Desative o login root via SSH
#    /etc/ssh/sshd_config: PermitRootLogin no

# 2. Use doas/sudo — NUNCA trabalhe como root

# 3. Senha forte e chave SSH
passwd wallyson              # mínimo 8 chars, misturar tipos
ssh-keygen -t ed25519        # chave SSH é mais segura que senha

# 4. Remova usuários inativos
userdel -r usuario-antigo    # shadow
# ou: deluser usuario-antigo  # busybox

# 5. Audite quem pode virar root
grep -E "permit|:wheel" /etc/doas.d/doas.conf
grep wheel /etc/group

# 6. Verifique shells de sistema (não devem ter /bin/ash)
grep -v nologin /etc/passwd | grep -v /bin/ash | grep -v /bin/bash`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>adduser</code> (BusyBox) ou <code>useradd</code> (shadow) para criar</li>
          <li><code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/etc/group</code> são a fonte da verdade</li>
          <li><code>doas</code> é o padrão Alpine — mais leve e mais simples que sudo</li>
          <li><code>wheel</code> é o grupo de administradores (tradição BSD)</li>
          <li><code>su -</code> para trocar de usuário; <code>/sbin/nologin</code> para usuários de sistema</li>
          <li>Nunca trabalhe como root; desative login root no SSH</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}