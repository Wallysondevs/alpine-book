import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function PrimeirosPassos() {
  return (
    <PageContainer
      title="Primeiros Passos"
      subtitle="Usuário, doas, atualização e repositórios: a rotina pós-instalação."
      difficulty="iniciante"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado em disco (modo <code>sys</code>) e acesso root —
        exatamente o estado em que o capítulo anterior terminou.
      </AlertBox>

      <p>
        O sistema está no disco, mas ainda é uma tela preta com root. Agora é hora
        de transformar isso num ambiente de trabalho: criar seu usuário, garantir
        que ele pode administrar o sistema, atualizar tudo e deixar os repositórios
        prontos para instalar qualquer pacote. São 15 minutos e você nunca mais
        precisa repetir.
      </p>

      {/* ===== SEÇÃO 1 ===== */}
      <h2>1. Login e primeiro comando</h2>
      <p>
        Depois do reboot, o sistema pede login. Entre como <code>root</code> com a
        senha que você definiu durante o <code>setup-alpine</code>. Se estiver num
        VPS ou VM sem interface gráfica, você verá o prompt clássico:
      </p>
      <Terminal
        title="Login após reboot"
        lines={[
          { type: "out", text: "Alpine Linux 3.24 (none)" },
          { type: "out", text: "Kernel 6.12.x on /dev/sda3" },
          { type: "out", text: "" },
          { type: "out", text: "localhost login: root" },
          { type: "cmd", text: "Password: ********" },
          { type: "out", text: "Welcome to Alpine!" },
          { type: "out", text: "localhost:~#" },
        ]}
      />
      <p>
        O <code>#</code> no final do prompt indica que você é root. O <code>~</code> é
        o diretório <code>/root</code>. Vamos verificar rapidamente se está tudo certo:
      </p>
      <CodeBlock
        code={`# Confirmar a versão do Alpine
cat /etc/alpine-release

# Ver uso de disco e memória
df -h /
free -m`}
      />

      {/* ===== SEÇÃO 2 ===== */}
      <h2>2. Atualizar o sistema</h2>
      <p>
        A ISO pode ter algumas semanas — a primeira coisa é sincronizar os índices
        e aplicar todas as atualizações de segurança. O Alpine usa o <code>apk</code>,
        que é extremamente rápido:
      </p>
      <Terminal
        title="Primeira atualização completa"
        lines={[
          { type: "in", text: "apk update" },
          {
            type: "out",
            text: "fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz",
          },
          {
            type: "out",
            text: "v3.24-1-g12345678 [https://dl-cdn.alpinelinux.org/alpine/v3.24/main]",
          },
          { type: "ok", text: "# índices sincronizados" },
          { type: "in", text: "apk upgrade" },
          {
            type: "out",
            text: "(1/3) Upgrading alpine-base (3.24.1-r0 -> 3.24.2-r0)",
          },
          {
            type: "out",
            text: "(2/3) Upgrading musl (1.2.5-r2 -> 1.2.5-r3)",
          },
          { type: "out", text: "(3/3) Upgrading busybox (1.37.0-r2 -> 1.37.0-r3)" },
          { type: "out", text: "OK: 3 MiB em 54 pacotes" },
        ]}
      />
      <AlertBox type="info" title="update vs upgrade: grave a diferença">
        <code>apk update</code> baixa os índices (a lista do que existe nos
        repositórios). <code>apk upgrade</code> instala as versões mais recentes
        dos pacotes que você já tem. Sempre rode <code>update</code> antes de
        instalar ou atualizar qualquer coisa — é o equivalente ao{" "}
        <code>apt update</code> do Debian.
      </AlertBox>

      {/* ===== SEÇÃO 3 ===== */}
      <h2>3. Habilitar o repositório Community</h2>
      <p>
        Por padrão, o <code>setup-alpine</code> só ativa o repositório{" "}
        <code>main</code>. Mas metade dos pacotes úteis — Docker, Node.js, Python
        extra, KVM, ferramentas de desktop — estão no <strong>community</strong>.
        Ativar é uma linha:
      </p>
      <Terminal
        title="Habilitando o community"
        lines={[
          { type: "in", text: "setup-apkrepos" },
          { type: "out", text: "Selecione o mirror (ou Enter para o padrão):" },
          { type: "in", text: "1  # dl-cdn.alpinelinux.org (CDN global)" },
          {
            type: "out",
            text:
              "Repositórios ativos:\n  main\n  community  ← agora aparece aqui!",
          },
        ]}
      />

      <p>
        O assistente edita <code>/etc/apk/repositories</code>. Você também pode
        editar manualmente — é um arquivo de texto simples, uma URL por linha:
      </p>
      <CodeBlock
        title="/etc/apk/repositories — típico após setup-apkrepos"
        code={`https://dl-cdn.alpinelinux.org/alpine/v3.24/main
https://dl-cdn.alpinelinux.org/alpine/v3.24/community`}
      />

      <AlertBox type="info" title="Ver o que mudou">
        Depois de ativar o community, rode <code>apk update</code> de novo. O número
        de pacotes disponíveis vai de ~3.000 (só main) para mais de 6.000.
      </AlertBox>

      <p>
        Não se esqueça de atualizar os índices depois de mexer nos repositórios:
      </p>
      <CodeBlock
        code={`apk update  # agora com community ativo`}
      />

      {/* ===== SEÇÃO 4 ===== */}
      <h2>4. Criar seu usuário</h2>
      <p>
        Trabalhar como root o tempo todo é perigoso e desnecessário. O Alpine traz o{" "}
        <code>adduser</code> — um assistente interativo que cria o usuário, o grupo
        e o home de uma vez:
      </p>
      <Terminal
        title="Criando um usuário normal"
        lines={[
          { type: "in", text: "adduser wallyson" },
          { type: "out", text: "Changing password for wallyson" },
          { type: "in", text: "New password: ********" },
          { type: "in", text: "Retype password: ********" },
          { type: "out", text: "passwd: password for wallyson changed by root" },
          { type: "ok", text: "# pronto! Home /home/wallyson criado." },
        ]}
      />

      <p>
        Por trás, o <code>adduser</code> faz várias coisas automaticamente:
      </p>
      <CodeBlock
        title="O que adduser cria"
        code={`# Tudo isso acontece em uma linha de comando:
# - Cria o usuário wallyson (UID 1000)
# - Cria o grupo wallyson (GID 1000)  
# - Cria /home/wallyson com permissões 700
# - Copia os skeletons de /etc/skel/
# - Define o shell padrão como /bin/ash`}
      />

      <p>
        Para ver os detalhes do que foi criado:
      </p>
      <CodeBlock
        code={`# Conferir o usuário
id wallyson
# uid=1000(wallyson) gid=1000(wallyson) groups=1000(wallyson)

# Ver o home
ls -la /home/wallyson`}
      />

      {/* ===== SEÇÃO 5 ===== */}
      <h2>5. Dar poderes de admin: doas (ou sudo)</h2>
      <p>
        O Alpine não instala <code>sudo</code> por padrão — ele usa o{" "}
        <strong>
          <code>doas</code>
        </strong>
        , uma alternativa mais leve e simples do OpenBSD. O comando é{" "}
        <code>doas</code> e a configuração é um arquivo de duas linhas:
      </p>

      <h3>Opção recomendada: doas</h3>
      <CodeBlock
        title="Instalar e configurar doas"
        code={`# 1. Instalar
apk add doas

# 2. Configurar — permitir que wallyson execute qualquer comando como root
echo "permit persist wallyson as root" > /etc/doas.d/doas.conf

# 3. Testar (logado como wallyson)
doas apk update`}
      />

      <p>
        A opção <code>persist</code> faz o doas lembrar da senha por alguns
        minutos — você não precisa digitá-la a cada comando. O arquivo de config
        fica em <code>/etc/doas.d/doas.conf</code>, mas você também pode usar{" "}
        <code>/etc/doas.conf</code> diretamente.
      </p>

      <h3>Alternativa: sudo</h3>
      <p>Se você prefere o sudo tradicional (mais familiar, mesma sintaxe do Debian/Ubuntu):</p>
      <CodeBlock
        title="Instalar e configurar sudo"
        code={`# 1. Instalar
apk add sudo

# 2. Adicionar wallyson ao grupo wheel
adduser wallyson wheel

# 3. Permitir grupo wheel sem senha (ou com senha)
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/wheel`}
      />

      <AlertBox type="warning" title="doas ou sudo?">
        Ambos funcionam igual. O <strong>doas</strong> pesa ~25 KB, é mais simples
        e é a escolha nativa do Alpine no <code>setup-alpine</code>. O{" "}
        <strong>sudo</strong> pesa alguns MB mas tem documentação mais farta e é o
        que a maioria já conhece. <strong>Escolha um</strong> — não use os dois.
      </AlertBox>

      {/* ===== SEÇÃO 6 ===== */}
      <h2>6. Hostname e /etc/hosts</h2>
      <p>
        Se você pulou o hostname durante o <code>setup-alpine</code> ou quer trocar:
      </p>
      <CodeBlock
        title="Definindo o hostname"
        code={`# 1. Trocar o hostname
echo "alpine-server" > /etc/hostname
hostname -F /etc/hostname

# 2. Ajustar /etc/hosts (evita warnings em vários programas)
echo "127.0.0.1   alpine-server alpine-server.localdomain" >> /etc/hosts

# 3. Conferir
hostname
# alpine-server`}
      />

      <p>
        Sem o <code>/etc/hosts</code> correto, programas como sudo, PostgreSQL e
        ferramentas de rede podem exibir warnings ou demorar para iniciar — o
        sistema tenta resolver o próprio nome e não encontra.
      </p>

      {/* ===== SEÇÃO 7 ===== */}
      <h2>7. SSH: acesso remoto seguro</h2>
      <p>
        Se você ativou o SSH durante o <code>setup-alpine</code>, o servidor
        OpenSSH já está rodando. Se não ativou, instalar é rápido:
      </p>
      <CodeBlock
        title="Instalar e ativar o SSH"
        code={`# 1. Instalar o OpenSSH
apk add openssh

# 2. Iniciar o serviço AGORA
rc-service sshd start

# 3. Adicionar ao boot (inicia automaticamente no próximo reboot)
rc-update add sshd

# 4. Conferir se está ouvindo na porta 22
rc-service sshd status
# * status: started`}
      />

      <p>
        Agora você pode acessar o Alpine remotamente:
      </p>
      <Terminal
        title="Conectando via SSH"
        lines={[
          { type: "in", text: "ssh wallyson@192.168.1.100" },
          {
            type: "out",
            text:
              "The authenticity of host '192.168.1.100 (...)' can't be established.",
          },
          { type: "out", text: "ED25519 key fingerprint is SHA256:..." },
          { type: "out", text: "Are you sure you want to continue connecting?" },
          { type: "in", text: "yes" },
          { type: "in", text: "wallyson@192.168.1.100's password: ********" },
          { type: "out", text: "Welcome to Alpine Linux 3.24" },
          { type: "out", text: "alpine-server:~$" },
        ]}
      />

      <AlertBox type="info" title="Segurança básica de SSH">
        Considere duas medidas simples agora mesmo:
        <ol>
          <li>
            <strong>Desative o login root por SSH:</strong> edite{" "}
            <code>/etc/ssh/sshd_config</code>, mude{" "}
            <code>#PermitRootLogin prohibit-password</code> para{" "}
            <code>PermitRootLogin no</code> e reinicie com{" "}
            <code>rc-service sshd restart</code>.
          </li>
          <li>
            <strong>Use chaves SSH em vez de senha:</strong> gere com{" "}
            <code>ssh-keygen -t ed25519</code> na sua máquina local e copie a
            pública com <code>ssh-copy-id wallyson@ip</code>. Depois desative
            senhas: <code>PasswordAuthentication no</code> no sshd_config.
          </li>
        </ol>
      </AlertBox>

      {/* ===== SEÇÃO 8 ===== */}
      <h2>8. OpenRC: controle de serviços em 30 segundos</h2>
      <p>
        O Alpine não usa systemd. Ele usa o <strong>OpenRC</strong>, um sistema de
        init simples e previsível. Os comandos essenciais cabem num post-it:
      </p>
      <CodeBlock
        title="OpenRC — comandos essenciais"
        code={`# VER serviços
rc-status                # lista serviços e seus estados
rc-service sshd status   # status de um serviço específico

# INICIAR / PARAR / REINICIAR
rc-service sshd start
rc-service sshd stop
rc-service sshd restart

# BOOT (iniciar automaticamente)
rc-update add sshd       # adiciona ao runlevel padrão
rc-update del sshd       # remove do boot
rc-update show           # lista o que está configurado para boot`}
      />

      <p>
        Tudo no OpenRC é script shell em <code>/etc/init.d/</code>. Você pode
        ler qualquer um deles — são scripts limpos de ~50 linhas que chamam o
        daemon com as opções certas. Transparência total.
      </p>

      <AlertBox type="info" title="Serviços que você provavelmente vai querer no boot">
        <code>sshd</code>, <code>chronyd</code> (NTP, relógio correto),{" "}
        <code>crond</code> (tarefas agendadas). Todos seguem o mesmo padrão:{" "}
        <code>apk add &lt;pacote&gt; &amp;&amp; rc-update add &lt;serviço&gt;</code>.
      </AlertBox>

      {/* ===== SEÇÃO 9 ===== */}
      <h2>9. Serviços úteis para ativar agora</h2>
      <p>
        Dois serviços que fazem diferença no dia a dia e custam zero:
      </p>

      <h3>chronyd — manter o relógio correto</h3>
      <p>
        Sem NTP, o relógio do sistema deriva minutos por mês. O Alpine traz o
        chrony, mais leve que o ntpd clássico:
      </p>
      <CodeBlock
        code={`apk add chrony
rc-update add chronyd
rc-service chronyd start

# Conferir se está sincronizando
chronyc tracking`}
      />

      <h3>crond — tarefas agendadas</h3>
      <p>
        O cron é essencial para logrotate, backups automáticos, renew de
        certificados. O Alpine usa o dcron, um cron minúsculo e compatível:
      </p>
      <CodeBlock
        code={`apk add dcron
rc-update add dcron
rc-service dcron start

# Agendar tarefas (como root)
crontab -e
# Exemplo: toda madrugada às 3h, atualizar o sistema
# 0 3 * * * apk update && apk upgrade -q`}
      />

      {/* ===== SEÇÃO 10 ===== */}
      <h2>10. Primeiro reboot e checklist</h2>
      <p>
        Antes de seguir para os próximos capítulos, reinicie e confirme que tudo
        volta sozinho:
      </p>
      <Terminal
        title="Reboot e verificação"
        lines={[
          { type: "in", text: "reboot" },
          { type: "out", text: "Connection to 192.168.1.100 closed." },
          { type: "out", text: "" },
          {
            type: "out",
            text: "# ...30 segundos depois, logue novamente...",
          },
          { type: "out", text: "" },
          { type: "in", text: "ssh wallyson@192.168.1.100" },
          {
            type: "in",
            text:
              "# — funciona? ✓\n# — hostname correto? ✓\n# — apk update funciona? ✓",
          },
          {
            type: "in",
            text:
              "rc-status       # sshd, chronyd, crond → tudo 'started'? ✓",
          },
          {
            type: "ok",
            text: "# Sistema pronto para os próximos capítulos!",
          },
        ]}
      />

      <AlertBox type="success" title="Checklist final">
        Confira cada item antes de avançar:
        <ol>
          <li>
            <code>apk update && apk upgrade</code> não mostra erros
          </li>
          <li>
            <code>/etc/apk/repositories</code> contém main e community
          </li>
          <li>
            Seu usuário existe e consegue <code>doas apk update</code> (ou sudo)
          </li>
          <li>
            <code>hostname</code> retorna o nome que você escolheu
          </li>
          <li>
            SSH funciona de outra máquina e o root NÃO faz login por SSH
          </li>
          <li>
            <code>rc-status</code> mostra sshd, chronyd (e outros) como started
          </li>
          <li>
            Após reboot, tudo acima continua funcionando
          </li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}