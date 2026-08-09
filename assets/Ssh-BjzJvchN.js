import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as i,A as o,C as s}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(i,{title:"SSH — Acesso Remoto Seguro",subtitle:"OpenSSH no Alpine: instalação, chaves, hardening, scp/rsync e configuração avançada.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Alpine com rede. O SSH básico foi coberto nos Primeiros Passos; aqui vamos a fundo em segurança e configuração avançada."}),e.jsx("p",{children:"SSH é como você acessa servidores Linux. O Alpine traz o OpenSSH completo, mas com padrões minimalistas. Este capítulo cobre da instalação ao hardening, incluindo chaves, túneis e automação."}),e.jsx("h2",{children:"1. Instalação e serviço"}),e.jsx(s,{code:`# Instalar e ativar
apk add openssh
rc-update add sshd
rc-service sshd start

# O setup-alpine já oferece ativar o SSH.
# Se você pulou, os comandos acima resolvem.`}),e.jsx("h2",{children:"2. Chaves SSH (o jeito certo)"}),e.jsx(a,{title:"Gerando e copiando chaves",lines:[{type:"comment",text:"# NA SUA MÁQUINA LOCAL:"},{type:"cmd",text:'ssh-keygen -t ed25519 -C "wallyson@alpine"'},{type:"out",text:"Generating public/private ed25519 key pair."},{type:"out",text:"Your identification: ~/.ssh/id_ed25519"},{type:"out",text:"Your public key: ~/.ssh/id_ed25519.pub"},{type:"cmd",text:"ssh-copy-id wallyson@192.168.1.100"},{type:"comment",text:"# Copia a chave pública para o servidor"}]}),e.jsx(s,{code:`# Sem ssh-copy-id (copiar manualmente)
cat ~/.ssh/id_ed25519.pub | ssh wallyson@servidor \\
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Permissões corretas (NO SERVIDOR)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Testar login sem senha
ssh wallyson@192.168.1.100
# Conectou direto? ✅`}),e.jsx("h2",{children:"3. Hardening: travar o SSH"}),e.jsx(s,{title:"/etc/ssh/sshd_config — hardening essencial",code:`# ═══ MEDIDAS ESSENCIAIS ═══

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
rc-service sshd restart`}),e.jsxs(o,{type:"warning",title:"Teste antes de fechar a sessão!",children:["Depois de mudar ",e.jsx("code",{children:"PasswordAuthentication no"})," ou a porta, mantenha uma sessão SSH aberta e ",e.jsx("strong",{children:"teste uma nova conexão"})," ","antes de fechar. Se travar algo, você ainda tem a sessão antiga para corrigir."]}),e.jsx("h2",{children:"4. ~/.ssh/config: configuração do cliente"}),e.jsx(s,{code:`# NA SUA MÁQUINA LOCAL: ~/.ssh/config
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
ssh producao    # conecta com as configs certas`}),e.jsx("h2",{children:"5. SCP e Rsync: transferindo arquivos"}),e.jsx(s,{code:`# SCP — cópia simples (usa SSH por baixo)
scp arquivo.txt alpine:/tmp/           # local → remoto
scp alpine:/etc/hosts ./               # remoto → local
scp -r diretorio/ alpine:/backup/       # recursivo

# RSYNC — sincronização inteligente (só transfere diferenças)
apk add rsync
rsync -avz ./projeto/ alpine:/opt/app/  # sincroniza diretório
rsync -avz --delete ./site/ alpine:/var/www/  # espelha (remove extras)

# Rsync com porta customizada
rsync -avz -e "ssh -p 2222" ./dados/ alpine:/backup/`}),e.jsx("h2",{children:"6. Túneis SSH"}),e.jsx(s,{code:`# Túnel LOCAL: porta local → servidor remoto
# Acessar banco remoto como se fosse local
ssh -L 5432:localhost:5432 alpine
# Agora localhost:5432 na sua máquina → PostgreSQL no servidor

# Túnel REVERSO: servidor expõe porta para você
# Acessar serviço local do servidor na sua máquina
ssh -R 8080:localhost:80 alpine
# Agora localhost:8080 no servidor → porta 80 da sua máquina

# Jump host (servidor ponte)
ssh -J alpine producao
# Conecta em "producao" passando por "alpine"`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"ssh-keygen -t ed25519"})," — gere chaves"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ssh-copy-id"})," — copie para o servidor"]}),e.jsxs("li",{children:[e.jsx("code",{children:"PermitRootLogin no"})," + ",e.jsx("code",{children:"PasswordAuthentication no"})," — hardening"]}),e.jsxs("li",{children:[e.jsx("code",{children:"~/.ssh/config"})," — atalhos para hosts frequentes"]}),e.jsxs("li",{children:[e.jsx("code",{children:"scp/rsync"})," — transferência de arquivos"]}),e.jsxs("li",{children:["Túneis ",e.jsx("code",{children:"-L"})," (local), ",e.jsx("code",{children:"-R"})," (reverso), ",e.jsx("code",{children:"-J"})," (jump)"]})]})})]})}export{t as default};
