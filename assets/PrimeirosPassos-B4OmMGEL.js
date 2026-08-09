import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as t,A as s,C as o}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(t,{title:"Primeiros Passos",subtitle:"Usuário, doas, atualização e repositórios: a rotina pós-instalação.",difficulty:"iniciante",timeToRead:"18 min",children:[e.jsxs(s,{type:"info",title:"Pré-requisitos",children:["Alpine instalado em disco (modo ",e.jsx("code",{children:"sys"}),") e acesso root — exatamente o estado em que o capítulo anterior terminou."]}),e.jsx("p",{children:"O sistema está no disco, mas ainda é uma tela preta com root. Agora é hora de transformar isso num ambiente de trabalho: criar seu usuário, garantir que ele pode administrar o sistema, atualizar tudo e deixar os repositórios prontos para instalar qualquer pacote. São 15 minutos e você nunca mais precisa repetir."}),e.jsx("h2",{children:"1. Login e primeiro comando"}),e.jsxs("p",{children:["Depois do reboot, o sistema pede login. Entre como ",e.jsx("code",{children:"root"})," com a senha que você definiu durante o ",e.jsx("code",{children:"setup-alpine"}),". Se estiver num VPS ou VM sem interface gráfica, você verá o prompt clássico:"]}),e.jsx(a,{title:"Login após reboot",lines:[{type:"out",text:"Alpine Linux 3.24 (none)"},{type:"out",text:"Kernel 6.12.x on /dev/sda3"},{type:"out",text:""},{type:"out",text:"localhost login: root"},{type:"cmd",text:"Password: ********"},{type:"out",text:"Welcome to Alpine!"},{type:"out",text:"localhost:~#"}]}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"#"})," no final do prompt indica que você é root. O ",e.jsx("code",{children:"~"})," é o diretório ",e.jsx("code",{children:"/root"}),". Vamos verificar rapidamente se está tudo certo:"]}),e.jsx(o,{code:`# Confirmar a versão do Alpine
cat /etc/alpine-release

# Ver uso de disco e memória
df -h /
free -m`}),e.jsx("h2",{children:"2. Atualizar o sistema"}),e.jsxs("p",{children:["A ISO pode ter algumas semanas — a primeira coisa é sincronizar os índices e aplicar todas as atualizações de segurança. O Alpine usa o ",e.jsx("code",{children:"apk"}),", que é extremamente rápido:"]}),e.jsx(a,{title:"Primeira atualização completa",lines:[{type:"cmd",text:"apk update"},{type:"out",text:"fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz"},{type:"out",text:"v3.24-1-g12345678 [https://dl-cdn.alpinelinux.org/alpine/v3.24/main]"},{type:"ok",text:"# índices sincronizados"},{type:"cmd",text:"apk upgrade"},{type:"out",text:"(1/3) Upgrading alpine-base (3.24.1-r0 -> 3.24.2-r0)"},{type:"out",text:"(2/3) Upgrading musl (1.2.5-r2 -> 1.2.5-r3)"},{type:"out",text:"(3/3) Upgrading busybox (1.37.0-r2 -> 1.37.0-r3)"},{type:"out",text:"OK: 3 MiB em 54 pacotes"}]}),e.jsxs(s,{type:"info",title:"update vs upgrade: grave a diferença",children:[e.jsx("code",{children:"apk update"})," baixa os índices (a lista do que existe nos repositórios). ",e.jsx("code",{children:"apk upgrade"})," instala as versões mais recentes dos pacotes que você já tem. Sempre rode ",e.jsx("code",{children:"update"})," antes de instalar ou atualizar qualquer coisa — é o equivalente ao"," ",e.jsx("code",{children:"apt update"})," do Debian."]}),e.jsx("h2",{children:"3. Habilitar o repositório Community"}),e.jsxs("p",{children:["Por padrão, o ",e.jsx("code",{children:"setup-alpine"})," só ativa o repositório"," ",e.jsx("code",{children:"main"}),". Mas metade dos pacotes úteis — Docker, Node.js, Python extra, KVM, ferramentas de desktop — estão no ",e.jsx("strong",{children:"community"}),". Ativar é uma linha:"]}),e.jsx(a,{title:"Habilitando o community",lines:[{type:"cmd",text:"setup-apkrepos"},{type:"out",text:"Selecione o mirror (ou Enter para o padrão):"},{type:"cmd",text:"1  # dl-cdn.alpinelinux.org (CDN global)"},{type:"out",text:`Repositórios ativos:
  main
  community  ← agora aparece aqui!`}]}),e.jsxs("p",{children:["O assistente edita ",e.jsx("code",{children:"/etc/apk/repositories"}),". Você também pode editar manualmente — é um arquivo de texto simples, uma URL por linha:"]}),e.jsx(o,{title:"/etc/apk/repositories — típico após setup-apkrepos",code:`https://dl-cdn.alpinelinux.org/alpine/v3.24/main
https://dl-cdn.alpinelinux.org/alpine/v3.24/community`}),e.jsxs(s,{type:"info",title:"Ver o que mudou",children:["Depois de ativar o community, rode ",e.jsx("code",{children:"apk update"})," de novo. O número de pacotes disponíveis vai de ~3.000 (só main) para mais de 6.000."]}),e.jsx("p",{children:"Não se esqueça de atualizar os índices depois de mexer nos repositórios:"}),e.jsx(o,{code:"apk update  # agora com community ativo"}),e.jsx("h2",{children:"4. Criar seu usuário"}),e.jsxs("p",{children:["Trabalhar como root o tempo todo é perigoso e desnecessário. O Alpine traz o"," ",e.jsx("code",{children:"adduser"})," — um assistente interativo que cria o usuário, o grupo e o home de uma vez:"]}),e.jsx(a,{title:"Criando um usuário normal",lines:[{type:"cmd",text:"adduser wallyson"},{type:"out",text:"Changing password for wallyson"},{type:"cmd",text:"New password: ********"},{type:"cmd",text:"Retype password: ********"},{type:"out",text:"passwd: password for wallyson changed by root"},{type:"ok",text:"# pronto! Home /home/wallyson criado."}]}),e.jsxs("p",{children:["Por trás, o ",e.jsx("code",{children:"adduser"})," faz várias coisas automaticamente:"]}),e.jsx(o,{title:"O que adduser cria",code:`# Tudo isso acontece em uma linha de comando:
# - Cria o usuário wallyson (UID 1000)
# - Cria o grupo wallyson (GID 1000)  
# - Cria /home/wallyson com permissões 700
# - Copia os skeletons de /etc/skel/
# - Define o shell padrão como /bin/ash`}),e.jsx("p",{children:"Para ver os detalhes do que foi criado:"}),e.jsx(o,{code:`# Conferir o usuário
id wallyson
# uid=1000(wallyson) gid=1000(wallyson) groups=1000(wallyson)

# Ver o home
ls -la /home/wallyson`}),e.jsx("h2",{children:"5. Dar poderes de admin: doas (ou sudo)"}),e.jsxs("p",{children:["O Alpine não instala ",e.jsx("code",{children:"sudo"})," por padrão — ele usa o"," ",e.jsx("strong",{children:e.jsx("code",{children:"doas"})}),", uma alternativa mais leve e simples do OpenBSD. O comando é"," ",e.jsx("code",{children:"doas"})," e a configuração é um arquivo de duas linhas:"]}),e.jsx("h3",{children:"Opção recomendada: doas"}),e.jsx(o,{title:"Instalar e configurar doas",code:`# 1. Instalar
apk add doas

# 2. Configurar — permitir que wallyson execute qualquer comando como root
echo "permit persist wallyson as root" > /etc/doas.d/doas.conf

# 3. Testar (logado como wallyson)
doas apk update`}),e.jsxs("p",{children:["A opção ",e.jsx("code",{children:"persist"})," faz o doas lembrar da senha por alguns minutos — você não precisa digitá-la a cada comando. O arquivo de config fica em ",e.jsx("code",{children:"/etc/doas.d/doas.conf"}),", mas você também pode usar"," ",e.jsx("code",{children:"/etc/doas.conf"})," diretamente."]}),e.jsx("h3",{children:"Alternativa: sudo"}),e.jsx("p",{children:"Se você prefere o sudo tradicional (mais familiar, mesma sintaxe do Debian/Ubuntu):"}),e.jsx(o,{title:"Instalar e configurar sudo",code:`# 1. Instalar
apk add sudo

# 2. Adicionar wallyson ao grupo wheel
adduser wallyson wheel

# 3. Permitir grupo wheel sem senha (ou com senha)
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/wheel`}),e.jsxs(s,{type:"warning",title:"doas ou sudo?",children:["Ambos funcionam igual. O ",e.jsx("strong",{children:"doas"})," pesa ~25 KB, é mais simples e é a escolha nativa do Alpine no ",e.jsx("code",{children:"setup-alpine"}),". O"," ",e.jsx("strong",{children:"sudo"})," pesa alguns MB mas tem documentação mais farta e é o que a maioria já conhece. ",e.jsx("strong",{children:"Escolha um"})," — não use os dois."]}),e.jsx("h2",{children:"6. Hostname e /etc/hosts"}),e.jsxs("p",{children:["Se você pulou o hostname durante o ",e.jsx("code",{children:"setup-alpine"})," ou quer trocar:"]}),e.jsx(o,{title:"Definindo o hostname",code:`# 1. Trocar o hostname
echo "alpine-server" > /etc/hostname
hostname -F /etc/hostname

# 2. Ajustar /etc/hosts (evita warnings em vários programas)
echo "127.0.0.1   alpine-server alpine-server.localdomain" >> /etc/hosts

# 3. Conferir
hostname
# alpine-server`}),e.jsxs("p",{children:["Sem o ",e.jsx("code",{children:"/etc/hosts"})," correto, programas como sudo, PostgreSQL e ferramentas de rede podem exibir warnings ou demorar para iniciar — o sistema tenta resolver o próprio nome e não encontra."]}),e.jsx("h2",{children:"7. SSH: acesso remoto seguro"}),e.jsxs("p",{children:["Se você ativou o SSH durante o ",e.jsx("code",{children:"setup-alpine"}),", o servidor OpenSSH já está rodando. Se não ativou, instalar é rápido:"]}),e.jsx(o,{title:"Instalar e ativar o SSH",code:`# 1. Instalar o OpenSSH
apk add openssh

# 2. Iniciar o serviço AGORA
rc-service sshd start

# 3. Adicionar ao boot (inicia automaticamente no próximo reboot)
rc-update add sshd

# 4. Conferir se está ouvindo na porta 22
rc-service sshd status
# * status: started`}),e.jsx("p",{children:"Agora você pode acessar o Alpine remotamente:"}),e.jsx(a,{title:"Conectando via SSH",lines:[{type:"cmd",text:"ssh wallyson@192.168.1.100"},{type:"out",text:"The authenticity of host '192.168.1.100 (...)' can't be established."},{type:"out",text:"ED25519 key fingerprint is SHA256:..."},{type:"out",text:"Are you sure you want to continue connecting?"},{type:"cmd",text:"yes"},{type:"cmd",text:"wallyson@192.168.1.100's password: ********"},{type:"out",text:"Welcome to Alpine Linux 3.24"},{type:"out",text:"alpine-server:~$"}]}),e.jsxs(s,{type:"info",title:"Segurança básica de SSH",children:["Considere duas medidas simples agora mesmo:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Desative o login root por SSH:"})," edite"," ",e.jsx("code",{children:"/etc/ssh/sshd_config"}),", mude"," ",e.jsx("code",{children:"#PermitRootLogin prohibit-password"})," para"," ",e.jsx("code",{children:"PermitRootLogin no"})," e reinicie com"," ",e.jsx("code",{children:"rc-service sshd restart"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use chaves SSH em vez de senha:"})," gere com"," ",e.jsx("code",{children:"ssh-keygen -t ed25519"})," na sua máquina local e copie a pública com ",e.jsx("code",{children:"ssh-copy-id wallyson@ip"}),". Depois desative senhas: ",e.jsx("code",{children:"PasswordAuthentication no"})," no sshd_config."]})]})]}),e.jsx("h2",{children:"8. OpenRC: controle de serviços em 30 segundos"}),e.jsxs("p",{children:["O Alpine não usa systemd. Ele usa o ",e.jsx("strong",{children:"OpenRC"}),", um sistema de init simples e previsível. Os comandos essenciais cabem num post-it:"]}),e.jsx(o,{title:"OpenRC — comandos essenciais",code:`# VER serviços
rc-status                # lista serviços e seus estados
rc-service sshd status   # status de um serviço específico

# INICIAR / PARAR / REINICIAR
rc-service sshd start
rc-service sshd stop
rc-service sshd restart

# BOOT (iniciar automaticamente)
rc-update add sshd       # adiciona ao runlevel padrão
rc-update del sshd       # remove do boot
rc-update show           # lista o que está configurado para boot`}),e.jsxs("p",{children:["Tudo no OpenRC é script shell em ",e.jsx("code",{children:"/etc/init.d/"}),". Você pode ler qualquer um deles — são scripts limpos de ~50 linhas que chamam o daemon com as opções certas. Transparência total."]}),e.jsxs(s,{type:"info",title:"Serviços que você provavelmente vai querer no boot",children:[e.jsx("code",{children:"sshd"}),", ",e.jsx("code",{children:"chronyd"})," (NTP, relógio correto),"," ",e.jsx("code",{children:"crond"})," (tarefas agendadas). Todos seguem o mesmo padrão:"," ",e.jsx("code",{children:"apk add <pacote> && rc-update add <serviço>"}),"."]}),e.jsx("h2",{children:"9. Serviços úteis para ativar agora"}),e.jsx("p",{children:"Dois serviços que fazem diferença no dia a dia e custam zero:"}),e.jsx("h3",{children:"chronyd — manter o relógio correto"}),e.jsx("p",{children:"Sem NTP, o relógio do sistema deriva minutos por mês. O Alpine traz o chrony, mais leve que o ntpd clássico:"}),e.jsx(o,{code:`apk add chrony
rc-update add chronyd
rc-service chronyd start

# Conferir se está sincronizando
chronyc tracking`}),e.jsx("h3",{children:"crond — tarefas agendadas"}),e.jsx("p",{children:"O cron é essencial para logrotate, backups automáticos, renew de certificados. O Alpine usa o dcron, um cron minúsculo e compatível:"}),e.jsx(o,{code:`apk add dcron
rc-update add dcron
rc-service dcron start

# Agendar tarefas (como root)
crontab -e
# Exemplo: toda madrugada às 3h, atualizar o sistema
# 0 3 * * * apk update && apk upgrade -q`}),e.jsx("h2",{children:"10. Primeiro reboot e checklist"}),e.jsx("p",{children:"Antes de seguir para os próximos capítulos, reinicie e confirme que tudo volta sozinho:"}),e.jsx(a,{title:"Reboot e verificação",lines:[{type:"cmd",text:"reboot"},{type:"out",text:"Connection to 192.168.1.100 closed."},{type:"out",text:""},{type:"out",text:"# ...30 segundos depois, logue novamente..."},{type:"out",text:""},{type:"cmd",text:"ssh wallyson@192.168.1.100"},{type:"cmd",text:`# — funciona? ✓
# — hostname correto? ✓
# — apk update funciona? ✓`},{type:"cmd",text:"rc-status       # sshd, chronyd, crond → tudo 'started'? ✓"},{type:"ok",text:"# Sistema pronto para os próximos capítulos!"}]}),e.jsxs(s,{type:"success",title:"Checklist final",children:["Confira cada item antes de avançar:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk update && apk upgrade"})," não mostra erros"]}),e.jsxs("li",{children:[e.jsx("code",{children:"/etc/apk/repositories"})," contém main e community"]}),e.jsxs("li",{children:["Seu usuário existe e consegue ",e.jsx("code",{children:"doas apk update"})," (ou sudo)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"hostname"})," retorna o nome que você escolheu"]}),e.jsx("li",{children:"SSH funciona de outra máquina e o root NÃO faz login por SSH"}),e.jsxs("li",{children:[e.jsx("code",{children:"rc-status"})," mostra sshd, chronyd (e outros) como started"]}),e.jsx("li",{children:"Após reboot, tudo acima continua funcionando"})]})]})]})}export{n as default};
