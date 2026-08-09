import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as r,A as o,C as s}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(r,{title:"Usuários, Grupos & doas",subtitle:"adduser, /etc/passwd, grupos, doas/sudo, su — gerencie quem acessa o sistema e com quais poderes.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Alpine instalado com acesso root. O básico de ",e.jsx("code",{children:"adduser"})," e"," ",e.jsx("code",{children:"doas"})," foi coberto nos Primeiros Passos; aqui vamos a fundo."]}),e.jsxs("p",{children:["Usuários são a primeira linha de defesa de qualquer sistema. O Alpine gerencia isso com ferramentas minimalistas: o BusyBox traz"," ",e.jsx("code",{children:"adduser"})," e ",e.jsx("code",{children:"addgroup"}),", o ",e.jsx("code",{children:"doas"})," ","controla privilégios, e o ",e.jsx("code",{children:"/etc/passwd"})," continua sendo a fonte da verdade."]}),e.jsx("h2",{children:"1. adduser e addgroup (BusyBox)"}),e.jsxs("p",{children:["O Alpine usa as versões BusyBox, que são assistentes interativos simplificados. Para ferramentas POSIX completas, instale o pacote"," ",e.jsx("code",{children:"shadow"}),":"]}),e.jsx(s,{title:"adduser/addgroup BusyBox vs shadow",code:`# BUSYBOX (padrão Alpine — assistente interativo)
adduser wallyson              # cria usuário, grupo, home, pergunta senha
addgroup devs                 # cria grupo

# SHADOW (ferramentas POSIX tradicionais)
apk add shadow
useradd -m -s /bin/ash wallyson   # -m cria home, -s define shell
groupadd devs
usermod -aG wheel wallyson        # adiciona a grupo secundário
userdel -r wallyson               # remove usuário e home
passwd wallyson                   # troca senha`}),e.jsx(a,{title:"Criando um usuário completo",lines:[{type:"cmd",text:"adduser maria"},{type:"out",text:"Changing password for maria"},{type:"cmd",text:"New password: ********"},{type:"cmd",text:"Retype password: ********"},{type:"out",text:"passwd: password for maria changed by root"},{type:"ok",text:"# Usuário maria (UID 1001), grupo maria, home /home/maria"}]}),e.jsx("h2",{children:"2. /etc/passwd, /etc/shadow e /etc/group"}),e.jsx(s,{title:"Os três arquivos de contas",code:`# /etc/passwd — 7 campos separados por :
# nome:senha:UID:GID:GECOS:home:shell
wallyson:x:1000:1000:Wallyson:/home/wallyson:/bin/ash
maria:x:1001:1001:Maria:/home/maria:/bin/ash
nginx:x:100:101:nginx:/var/lib/nginx:/sbin/nologin

# /etc/shadow — senhas hasheadas (só root lê)
wallyson:$6$salt$hash...:19999:0:99999:7:::

# /etc/group — grupos e membros
wheel:x:10:wallyson,maria
devs:x:1002:wallyson
docker:x:101:wallyson`}),e.jsxs("p",{children:[e.jsx("code",{children:"/sbin/nologin"})," como shell impede login interativo — ideal para usuários de sistema (nginx, postgres, etc.)."]}),e.jsx("h2",{children:"3. Grupos e wheel"}),e.jsx(s,{title:"Gerenciando grupos",code:`# Criar grupo
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
# Quem está no wheel pode usar doas/sudo para virar root.`}),e.jsx("h2",{children:"4. doas: o guardião de privilégios do Alpine"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"doas"})," (dedicated openbsd application subexecutor) é o equivalente ao sudo no Alpine. Mais leve (~25 KB), mais simples e com sintaxe de configuração direta:"]}),e.jsx(s,{title:"doas — configuração completa",code:`# Instalar
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
# keepenv = mantém variáveis de ambiente`}),e.jsx(a,{title:"doas no dia a dia",lines:[{type:"cmd",text:"doas apk update"},{type:"out",text:"Password:"},{type:"cmd",text:"********"},{type:"out",text:"fetch https://dl-cdn.alpinelinux.org/..."},{type:"ok",text:"# Senha lembrada por 5 minutos (persist)"},{type:"cmd",text:"doas rc-service sshd restart"},{type:"ok",text:"# Não pediu senha — ainda dentro da janela persist"}]}),e.jsx("h2",{children:"5. sudo: a alternativa tradicional"}),e.jsx(s,{title:"Instalando e configurando sudo",code:`# Instalar
apk add sudo

# Configuração (visudo ou arquivo drop-in)
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/wheel

# Sem senha para o grupo wheel
echo "%wheel ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/wheel

# Uso
sudo apk update
sudo -i            # shell interativo como root
sudo -u postgres psql   # executar como outro usuário`}),e.jsxs(o,{type:"warning",title:"doas ou sudo? Escolha um.",children:["Ter os dois instalados gera confusão. O Alpine recomenda"," ",e.jsx("strong",{children:"doas"})," — é a ferramenta nativa, usada pelo próprio"," ",e.jsx("code",{children:"setup-alpine"}),". Se seu fluxo de trabalho depende de scripts que usam ",e.jsx("code",{children:"sudo"}),", instale o sudo. Mas não use os dois."]}),e.jsx("h2",{children:"6. su: trocar de usuário"}),e.jsx(s,{title:"su — switch user",code:`# Virar root (precisa da senha do root)
su -

# Virar outro usuário (precisa da senha DELE)
su - maria

# Executar um comando como outro usuário
su - maria -c "whoami"

# O - (hífen) carrega o ambiente do usuário (login shell).
# Sem o -, você fica no mesmo diretório e PATH.`}),e.jsx("h2",{children:"7. Boas práticas de segurança"}),e.jsx(s,{title:"Checklist de hardening de usuários",code:`# 1. Desative o login root via SSH
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
grep -v nologin /etc/passwd | grep -v /bin/ash | grep -v /bin/bash`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"adduser"})," (BusyBox) ou ",e.jsx("code",{children:"useradd"})," (shadow) para criar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/etc/passwd"}),", ",e.jsx("code",{children:"/etc/shadow"}),", ",e.jsx("code",{children:"/etc/group"})," são a fonte da verdade"]}),e.jsxs("li",{children:[e.jsx("code",{children:"doas"})," é o padrão Alpine — mais leve e mais simples que sudo"]}),e.jsxs("li",{children:[e.jsx("code",{children:"wheel"})," é o grupo de administradores (tradição BSD)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"su -"})," para trocar de usuário; ",e.jsx("code",{children:"/sbin/nologin"})," para usuários de sistema"]}),e.jsx("li",{children:"Nunca trabalhe como root; desative login root no SSH"})]})})]})}export{t as default};
