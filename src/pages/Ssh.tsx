import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Ssh() {
  return (
    <PageContainer
      title="SSH — Acesso Remoto Seguro"
      subtitle="OpenSSH no Alpine: instalação, chaves, hardening, scp/rsync e configuração avançada."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine com rede. O SSH básico foi coberto nos Primeiros Passos; aqui
        vamos a fundo em segurança e configuração avançada.
      </AlertBox>

      <p>
        SSH é como você acessa servidores Linux. O Alpine traz o OpenSSH
        completo, mas com padrões minimalistas. Este capítulo cobre da
        instalação ao hardening, incluindo chaves, túneis e automação.
      </p>

      <h2>1. Instalação e serviço</h2>
      <CodeBlock
        code={`# Instalar e ativar
apk add openssh
rc-update add sshd
rc-service sshd start

# O setup-alpine já oferece ativar o SSH.
# Se você pulou, os comandos acima resolvem.`}
      />

      <h2>2. Chaves SSH (o jeito certo)</h2>
      <Terminal
        title="Gerando e copiando chaves"
        lines={[
          { type: "comment", text: "# NA SUA MÁQUINA LOCAL:" },
          { type: "cmd", text: "ssh-keygen -t ed25519 -C \"wallyson@alpine\"" },
          { type: "out", text: "Generating public/private ed25519 key pair." },
          { type: "out", text: "Your identification: ~/.ssh/id_ed25519" },
          { type: "out", text: "Your public key: ~/.ssh/id_ed25519.pub" },
          { type: "cmd", text: "ssh-copy-id wallyson@192.168.1.100" },
          { type: "comment", text: "# Copia a chave pública para o servidor" },
        ]}
      />

      <CodeBlock
        code={`# Sem ssh-copy-id (copiar manualmente)
cat ~/.ssh/id_ed25519.pub | ssh wallyson@servidor \\
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Permissões corretas (NO SERVIDOR)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Testar login sem senha
ssh wallyson@192.168.1.100
# Conectou direto? ✅`}
      />

      <h2>3. Hardening: travar o SSH</h2>
      <CodeBlock
        title="/etc/ssh/sshd_config — hardening essencial"
        code={`# ═══ MEDIDAS ESSENCIAIS ═══

# 1. DESATIVAR login root
PermitRootLogin no

# 2. DESATIVAR senha (só chave)
PasswordAuthentication no
PubkeyAuthentication yes

# 3. MUDAR a porta (22 → 2222) — reduz scans automatizados
Port 2222

# 4. LIMITAR usuários
AllowUsers wallyson maria

# 5. DESATIVAR protocolos fracos
Protocol 2

# Depois de editar:
rc-service sshd restart`}
      />

      <AlertBox type="warning" title="Teste antes de fechar a sessão!">
        Depois de mudar <code>PasswordAuthentication no</code> ou a porta,
        mantenha uma sessão SSH aberta e <strong>teste uma nova conexão</strong>{" "}
        antes de fechar. Se travar algo, você ainda tem a sessão antiga para
        corrigir.
      </AlertBox>

      <h2>4. ~/.ssh/config: configuração do cliente</h2>
      <CodeBlock
        code={`# NA SUA MÁQUINA LOCAL: ~/.ssh/config
Host alpine
    HostName 192.168.1.100
    Port 2222
    User wallyson
    IdentityFile ~/.ssh/id_ed25519

Host producao
    HostName 10.0.0.50
    User admin
    IdentityFile ~/.ssh/producao_ed25519

# Agora é só digitar:
ssh alpine      # em vez de ssh -p 2222 wallyson@192.168.1.100
ssh producao    # conecta com as configs certas`}
      />

      <h2>5. SCP e Rsync: transferindo arquivos</h2>
      <CodeBlock
        code={`# SCP — cópia simples (usa SSH por baixo)
scp arquivo.txt alpine:/tmp/           # local → remoto
scp alpine:/etc/hosts ./               # remoto → local
scp -r diretorio/ alpine:/backup/       # recursivo

# RSYNC — sincronização inteligente (só transfere diferenças)
apk add rsync
rsync -avz ./projeto/ alpine:/opt/app/  # sincroniza diretório
rsync -avz --delete ./site/ alpine:/var/www/  # espelha (remove extras)

# Rsync com porta customizada
rsync -avz -e "ssh -p 2222" ./dados/ alpine:/backup/`}
      />

      <h2>6. Túneis SSH</h2>
      <CodeBlock
        code={`# Túnel LOCAL: porta local → servidor remoto
# Acessar banco remoto como se fosse local
ssh -L 5432:localhost:5432 alpine
# Agora localhost:5432 na sua máquina → PostgreSQL no servidor

# Túnel REVERSO: servidor expõe porta para você
# Acessar serviço local do servidor na sua máquina
ssh -R 8080:localhost:80 alpine
# Agora localhost:8080 no servidor → porta 80 da sua máquina

# Jump host (servidor ponte)
ssh -J alpine producao
# Conecta em "producao" passando por "alpine"`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>ssh-keygen -t ed25519</code> — gere chaves</li>
          <li><code>ssh-copy-id</code> — copie para o servidor</li>
          <li><code>PermitRootLogin no</code> + <code>PasswordAuthentication no</code> — hardening</li>
          <li><code>~/.ssh/config</code> — atalhos para hosts frequentes</li>
          <li><code>scp/rsync</code> — transferência de arquivos</li>
          <li>Túneis <code>-L</code> (local), <code>-R</code> (reverso), <code>-J</code> (jump)</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}