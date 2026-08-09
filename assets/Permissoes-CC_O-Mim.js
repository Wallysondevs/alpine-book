import{j as o,T as s}from"./index-YFyZeUD9.js";import{P as i,A as r,C as e}from"./AlertBox-C2CyWd7R.js";function d(){return o.jsxs(i,{title:"Permissões",subtitle:"rwx, chmod, chown, umask, suid/sgid/sticky, ACLs — controle total sobre quem acessa o quê no Alpine.",difficulty:"intermediario",timeToRead:"18 min",children:[o.jsxs(r,{type:"info",title:"Pré-requisitos",children:["Conforto com ",o.jsx("code",{children:"ls -l"})," e navegação básica. Este capítulo vai fundo no modelo de permissões Unix — comum a todos os Linux, com notas específicas do Alpine."]}),o.jsxs("p",{children:["O modelo de permissões Unix tem 50 anos e ainda é o alicerce da segurança em qualquer Linux. No Alpine, ele é aplicado de forma mais estrita: menos serviços rodam como root, e o ",o.jsx("code",{children:"doas"})," é mais restritivo que o sudo tradicional. Entender permissões é entender segurança."]}),o.jsx("h2",{children:"1. Lendo permissões: o ls -l decodificado"}),o.jsx(s,{title:"Dissecando o ls -l",lines:[{type:"cmd",text:"ls -l /etc/apk/world"},{type:"out",text:"-rw-r--r-- 1 root root 123 Aug 9 14:00 /etc/apk/world"},{type:"comment",text:"│└─┬─┘└─┬─┘ │ └─┬┘ └─┬┘"},{type:"comment",text:"│  │    │   │   │    └── grupo"},{type:"comment",text:"│  │    │   │   └── dono"},{type:"comment",text:"│  │    │   └── links"},{type:"comment",text:"│  │    └── outros (r--)"},{type:"comment",text:"│  └── grupo (r--)"},{type:"comment",text:"└── tipo (-) + dono (rw-)"}]}),o.jsx(e,{title:"Os bits de permissão",code:`r = read    (4)     ler o conteúdo
w = write   (2)     modificar o conteúdo
x = execute (1)     executar (arquivo) ou acessar (diretório)

# Três grupos:
# dono (u)  |  grupo (g)  |  outros (o)

# Exemplos:
-rw-------   (600)  dono lê e escreve; ninguém mais
-rwxr-xr-x   (755)  dono tudo; grupo e outros lêem e executam
-rw-r--r--   (644)  dono lê+escreve; grupo e outros só lêem
drwx------   (700)  diretório acessível só pelo dono`}),o.jsx("h2",{children:"2. chmod: mudando permissões"}),o.jsx(e,{title:"chmod — modo simbólico e octal",code:`# Modo SIMBÓLICO (mais legível para iniciantes)
chmod +x script.sh           # adiciona execução para todos
chmod -x script.sh           # remove execução de todos
chmod u+x script.sh          # execução só para o dono (user)
chmod g+w arquivo.txt        # grupo ganha escrita
chmod o-rwx arquivo.txt      # remove tudo dos outros
chmod a+r arquivo.txt        # todos (all) ganham leitura

# Modo OCTAL (mais rápido para quem já decorou)
chmod 755 script.sh          # rwxr-xr-x
chmod 644 config.txt         # rw-r--r--
chmod 600 chave.pem          # rw-------
chmod 700 ~/.ssh             # rwx------
chmod -R 755 diretorio/      # recursivo (cuidado!)`}),o.jsx("h2",{children:"3. chown e chgrp: dono e grupo"}),o.jsx(e,{title:"Mudando propriedade",code:`# chown — mudar dono (e opcionalmente grupo)
chown wallyson arquivo.txt           # muda o dono
chown wallyson:www-data arquivo.txt  # muda dono E grupo
chown -R wallyson:wheel diretorio/   # recursivo

# chgrp — mudar só o grupo
chgrp www-data /var/www/html/
chgrp -R wheel scripts/

# Ver dono e grupo
ls -l arquivo.txt
stat arquivo.txt       # mais detalhes (inode, timestamps)`}),o.jsx("h2",{children:"4. umask: permissões padrão"}),o.jsxs("p",{children:["A ",o.jsx("code",{children:"umask"})," define as permissões que arquivos e diretórios novos"," ",o.jsx("strong",{children:"não"})," terão:"]}),o.jsx(e,{title:"umask — a máscara de criação",code:`# Ver a umask atual
umask
# 0022  → arquivos: 644 (666 - 022), diretórios: 755 (777 - 022)

# Mudar a umask (válido só nesta sessão)
umask 0077   # arquivos: 600, diretórios: 700 — modo paranoico
umask 0002   # arquivos: 664, diretórios: 775 — modo compartilhado

# Tornar permanente: adicione ao ~/.profile
echo "umask 0077" >> ~/.profile`}),o.jsx("h2",{children:"5. Bits especiais: suid, sgid, sticky"}),o.jsx(e,{title:"Os três bits especiais",code:`# SUID (4---) — executa com privilégios do DONO
# Exemplo: /usr/bin/doas precisa ser SUID root para funcionar
ls -l /usr/bin/doas
# -rwsr-xr-x 1 root root ...   ← 's' no lugar do 'x' do dono

# SGID (2---) — executa com privilégios do GRUPO
# Em diretórios: arquivos novos herdam o grupo do diretório
chmod g+s /shared/
ls -ld /shared/
# drwxr-sr-x ...   ← 's' no lugar do 'x' do grupo

# STICKY (1---) — só o dono pode apagar (útil em /tmp)
ls -ld /tmp
# drwxrwxrwt ...   ← 't' no lugar do 'x' dos outros
# Sem sticky, qualquer um poderia apagar arquivos de outros em /tmp`}),o.jsx("h2",{children:"6. ACLs: controle fino"}),o.jsx("p",{children:"As permissões Unix tradicionais só permitem um dono e um grupo. Para dar acesso a múltiplos usuários/grupos, use ACLs:"}),o.jsx(e,{title:"ACLs — permissões granulares",code:`# Instalar suporte a ACLs (pacote minúsculo)
apk add acl

# Ver ACLs de um arquivo
getfacl arquivo.txt

# Dar permissão de leitura a um usuário específico
setfacl -m u:www-data:r arquivo.txt

# Dar permissão de leitura+escrita a um grupo adicional
setfacl -m g:devs:rw arquivo.txt

# Remover uma ACL específica
setfacl -x u:www-data arquivo.txt

# Aplicar recursivamente
setfacl -R -m g:devs:rwx diretorio/

# O ls -l mostra '+' quando há ACLs:
# -rw-rw----+ 1 wallyson wallyson ...   ← '+' indica ACL`}),o.jsx(s,{title:"Verificando ACLs",lines:[{type:"cmd",text:"getfacl /shared/projeto"},{type:"out",text:"# file: /shared/projeto"},{type:"out",text:"# owner: wallyson"},{type:"out",text:"# group: devs"},{type:"out",text:"user::rwx"},{type:"out",text:"group::r-x"},{type:"out",text:"group:qa:r--"},{type:"out",text:"mask::rwx"},{type:"out",text:"other::---"}]}),o.jsx("h2",{children:"7. Permissões no Alpine: notas específicas"}),o.jsx(e,{title:"Particularidades do Alpine",code:`# 1. doas é SUID root (não sudo)
ls -l /usr/bin/doas
# -rwsr-xr-x 1 root root ...

# 2. Usuários de sistema no Alpine
#    Serviços rodam com usuários próprios (nginx, postgres, ...)
#    NÃO use root para serviços — o Alpine é estrito nisso.
grep nginx /etc/passwd
# nginx:x:100:101:nginx:/var/lib/nginx:/sbin/nologin

# 3. apk audit verifica permissões também
apk audit --backup  # mostra arquivos modificados (inclui permissões)

# 4. /etc/apk/protected_paths.d/ — arquivos protegidos
#    O apk NÃO sobrescreve arquivos listados aqui durante upgrade.
ls /etc/apk/protected_paths.d/`}),o.jsx(r,{type:"success",title:"Resumo",children:o.jsxs("ol",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"ls -l"})," mostra permissões: tipo + rwx para dono, grupo, outros"]}),o.jsxs("li",{children:[o.jsx("code",{children:"chmod 755"})," (octal) ou ",o.jsx("code",{children:"chmod +x"})," (simbólico)"]}),o.jsxs("li",{children:[o.jsx("code",{children:"chown user:group"})," muda propriedade"]}),o.jsxs("li",{children:[o.jsx("code",{children:"umask"})," define permissões de novos arquivos"]}),o.jsx("li",{children:"SUID/SGID/Sticky para casos especiais"}),o.jsxs("li",{children:["ACLs (",o.jsx("code",{children:"apk add acl"}),") para controle fino"]}),o.jsxs("li",{children:["Alpine é estrito: não rode serviço como root, use ",o.jsx("code",{children:"doas"})]})]})})]})}export{d as default};
