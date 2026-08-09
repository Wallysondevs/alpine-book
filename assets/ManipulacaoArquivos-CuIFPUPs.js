import{j as e,T as i}from"./index-YFyZeUD9.js";import{P as s,A as r,C as o}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(s,{title:"Manipulação de Arquivos",subtitle:"cp, mv, rm, mkdir, touch, ln — criar, copiar, mover e linkar arquivos com as versões BusyBox (e quando chamar o coreutils).",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsxs(r,{type:"info",title:"Pré-requisitos",children:["Navegação básica no terminal (",e.jsx("code",{children:"cd"}),", ",e.jsx("code",{children:"ls"}),", ",e.jsx("code",{children:"pwd"}),"). Todos os comandos deste capítulo são applets BusyBox — funcionam em qualquer Alpine recém-instalado."]}),e.jsx("p",{children:"Criar, copiar, mover, renomear, apagar, linkar. Essas seis operações são 80% do que você faz no terminal. O BusyBox implementa todas, mas com algumas limitações em relação às versões GNU. Aqui está o guia definitivo para o Alpine."}),e.jsx("h2",{children:"1. mkdir: criando diretórios"}),e.jsx(o,{title:"mkdir",code:`mkdir projetos           # cria um diretório
mkdir -p a/b/c/d          # cria a hierarquia inteira de uma vez
mkdir -m 700 seguro       # cria com permissões específicas
mkdir dir1 dir2 dir3      # cria vários de uma vez`}),e.jsx("h2",{children:"2. touch: criando arquivos vazios"}),e.jsx(i,{lines:[{type:"cmd",text:"touch arquivo.txt"},{type:"out",text:""},{type:"cmd",text:"ls -l arquivo.txt"},{type:"out",text:"-rw-r--r-- 1 wallyson wallyson 0 Aug 9 14:00 arquivo.txt"},{type:"comment",text:"# touch também atualiza a data de modificação de arquivos existentes"}]}),e.jsx("h2",{children:"3. cp: copiando"}),e.jsx(o,{title:"cp — cópia de arquivos e diretórios",code:`cp orig.txt copia.txt         # copiar arquivo
cp -r dir1/ dir2/              # copiar diretório (RECURSIVO — essencial!)
cp -a dir1/ dir2/              # cópia preservando permissões e timestamps
cp -i orig.txt copia.txt       # pergunta antes de sobrescrever
cp -v *.txt /backup/           # verbose (mostra o que está copiando)
cp -u orig.txt /backup/        # copia só se for mais novo (update)

# ⚠️  No BusyBox, cp NÃO tem --preserve. Use cp -a ou instale coreutils.
# ⚠️  cp -r basta para diretórios (não precisa de -R como no GNU).`}),e.jsx("h2",{children:"4. mv: movendo e renomeando"}),e.jsx("p",{children:"No Linux, renomear e mover são a mesma operação:"}),e.jsx(o,{title:"mv — mover e renomear",code:`mv velho.txt novo.txt        # renomear arquivo
mv antigo/ novo/              # renomear diretório
mv arquivo.txt /destino/      # mover para outro diretório
mv -i orig.txt /destino/      # pergunta antes de sobrescrever
mv *.log /var/log/archive/    # mover múltiplos arquivos`}),e.jsx("h2",{children:"5. rm: removendo"}),e.jsxs(r,{type:"danger",title:"rm não tem lixeira",children:["O que você apaga com ",e.jsx("code",{children:"rm"})," ",e.jsx("strong",{children:"some para sempre"}),". Não há undelete. Em caso de dúvida, use ",e.jsx("code",{children:"mv"})," para uma pasta de lixo e apague depois."]}),e.jsx(o,{title:"rm — remoção de arquivos e diretórios",code:`rm arquivo.txt               # remove um arquivo
rm -f arquivo.txt             # força (não pergunta, ignora se não existe)
rm -r diretorio/              # remove diretório e TODO o conteúdo
rm -rf diretorio/             # combinação perigosa: força + recursivo
rm -i *.log                   # pergunta antes de cada arquivo
rm -v *.tmp                   # verbose

# ⚠️  NUNCA rode: rm -rf /    (vai apagar o sistema inteiro)
# ⚠️  NUNCA rode: rm -rf .*   (.* inclui .. que sobe diretórios)`}),e.jsx("h2",{children:"6. ln: links simbólicos e hard links"}),e.jsx("p",{children:"Links são atalhos no sistema de arquivos. O Alpine usa links extensivamente:"}),e.jsx(o,{title:"ln — criando links",code:`# Link SIMBÓLICO (symlink) — atalho que aponta para um caminho
ln -s /usr/bin/python3 /usr/bin/python
# /usr/bin/python → /usr/bin/python3
# Se o alvo sumir, o link quebra (dangling symlink).

# Link FÍSICO (hard link) — nome alternativo para o MESMO inode
ln /usr/bin/busybox /usr/local/bin/busybox
# Agora /usr/bin/busybox e /usr/local/bin/busybox são o mesmo arquivo.
# Apagar um não afeta o outro. Só funciona dentro da mesma partição.

# Ver links
ls -l /usr/bin/python         # symlink: mostra seta e destino
ls -li /usr/bin/busybox       # hard link: mesmo número de inode`}),e.jsx(i,{title:"Identificando symlinks vs hard links",lines:[{type:"cmd",text:"ls -l /bin"},{type:"out",text:"lrwxrwxrwx ... /bin -> usr/bin"},{type:"comment",text:"# 'l' no início = symlink. A seta -> mostra o destino."},{type:"cmd",text:"ls -li /usr/bin/busybox /bin/busybox"},{type:"out",text:"123456 -rwxr-xr-x 2 root root ... /bin/busybox"},{type:"out",text:"123456 -rwxr-xr-x 2 root root ... /usr/bin/busybox"},{type:"comment",text:"# Mesmo inode (123456) = hard link. Contador de links = 2."}]}),e.jsx("h2",{children:"7. BusyBox vs GNU: quando chamar o coreutils"}),e.jsx("p",{children:"As versões BusyBox resolvem 90% do dia a dia. Mas há situações em que você sente falta das flags GNU:"}),e.jsx(o,{title:"Quando instalar coreutils (apk add coreutils)",code:`# Situações que pedem GNU coreutils:

cp --preserve=timestamps    # BusyBox: use cp -a
cp --parents                # recriar hierarquia de diretórios
mv --backup                 # criar backup antes de sobrescrever
rm --one-file-system        # não atravessar partições
rm -d                       # remover diretório VAZIO (sem -r)

# Instalar:
apk add coreutils
# Os binários GNU ficam em /usr/bin/ e têm precedência sobre o BusyBox.
# O BusyBox continua lá — você pode chamar explicitamente com:
busybox cp ...`}),e.jsxs(r,{type:"info",title:"Regra prática",children:["Se um comando não tem a flag que você espera, tente:"," ",e.jsx("code",{children:"apk add coreutils"}),". São ~2 MB e trazem as versões GNU completas de cp, mv, rm, ls, cat, echo, date, sort, wc, etc. Vale a pena em servidores onde você vai fazer scripts complexos."]}),e.jsx(r,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"mkdir -p"})," e ",e.jsx("code",{children:"touch"})," criam; ",e.jsx("code",{children:"cp -r"})," e ",e.jsx("code",{children:"mv"})," replicam"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rm -rf"})," é perigoso — use com cuidado redobrado"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ln -s"})," (symlink) é amplamente usado no Alpine"]}),e.jsxs("li",{children:["Hard links (",e.jsx("code",{children:"ln"})," sem -s) são raros mas importantes (BusyBox!)"]}),e.jsxs("li",{children:["Precisa de flags GNU? ",e.jsx("code",{children:"apk add coreutils"})]})]})})]})}export{n as default};
