import{j as e,T as r}from"./index-YFyZeUD9.js";import{P as i,A as a,C as o}from"./AlertBox-C2CyWd7R.js";function p(){return e.jsxs(i,{title:"Compressão & Arquivos",subtitle:"tar, gzip, bzip2, xz, zip, unzip — empacote e comprima no Alpine com as ferramentas certas.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Navegação básica e manipulação de arquivos. Os comandos ",e.jsx("code",{children:"tar"})," ","e ",e.jsx("code",{children:"gzip"})," são BusyBox — já estão no sistema."]}),e.jsxs("p",{children:["No Linux, empacotar e comprimir são duas operações separadas. O"," ",e.jsx("code",{children:"tar"})," junta arquivos num só (tape archive). O"," ",e.jsx("code",{children:"gzip"}),"/",e.jsx("code",{children:"bzip2"}),"/",e.jsx("code",{children:"xz"})," comprime. O Alpine traz o tar do BusyBox com suporte a todos os formatos comuns."]}),e.jsx("h2",{children:"1. tar: o empacotador universal"}),e.jsx(o,{title:"tar — operações essenciais",code:`# CRIAR arquivo tar
tar -cf backup.tar diretorio/

# CRIAR e COMPRIMIR (combinações mais usadas)
tar -czf backup.tar.gz diretorio/     # gzip  (rápido, tamanho médio)
tar -cjf backup.tar.bz2 diretorio/    # bzip2 (mais lento, menor)
tar -cJf backup.tar.xz diretorio/     # xz    (lento, o menor)

# EXTRAIR
tar -xf backup.tar.gz
tar -xzf backup.tar.gz -C /destino/   # extrai em diretório específico

# LISTAR conteúdo (sem extrair)
tar -tzf backup.tar.gz
tar -tjf backup.tar.bz2

# As flags:
# c = create   x = extract   t = list
# z = gzip     j = bzip2     J = xz
# f = file     v = verbose   C = change directory`}),e.jsx(r,{title:"Criando e extraindo na prática",lines:[{type:"cmd",text:"tar -czf projetos.tar.gz ~/projetos/"},{type:"cmd",text:"ls -lh projetos.tar.gz"},{type:"out",text:"-rw-r--r-- 1 wallyson wallyson 2.3M ... projetos.tar.gz"},{type:"cmd",text:"tar -tzf projetos.tar.gz | head -5"},{type:"out",text:"projetos/"},{type:"out",text:"projetos/app/"},{type:"out",text:"projetos/app/main.py"},{type:"cmd",text:"tar -xzf projetos.tar.gz -C /tmp/"},{type:"ok",text:"# Extraído em /tmp/projetos/"}]}),e.jsxs("p",{children:["O tar do ",e.jsx("strong",{children:"BusyBox suporta"})," gzip, bzip2 e xz nativamente — você não precisa instalar nada para esses formatos. Só precisa dos pacotes de compressão se for usar as ferramentas separadamente."]}),e.jsx("h2",{children:"2. gzip, bzip2, xz: compressão individual"}),e.jsx(o,{title:"Compressão de arquivos únicos",code:`# gzip — o mais comum (.gz)
gzip arquivo.txt           # comprime (apaga original)
gzip -k arquivo.txt        # comprime MANTENDO original
gunzip arquivo.txt.gz      # descomprime
zcat arquivo.txt.gz        # lê sem descomprimir

# bzip2 — melhor compressão (.bz2)
apk add bzip2
bzip2 arquivo.txt
bunzip2 arquivo.txt.bz2

# xz — compressão máxima (.xz)
apk add xz
xz arquivo.txt
unxz arquivo.txt.xz
xzcat arquivo.txt.xz       # lê sem descomprimir

# Comparação prática (arquivo de log de 100 MB):
# gzip  → 10 MB, 2 segundos
# bzip2 →  7 MB, 8 segundos
# xz    →  5 MB, 25 segundos`}),e.jsx("h2",{children:"3. zip e unzip: compatibilidade multiplataforma"}),e.jsxs("p",{children:["O formato ",e.jsx("code",{children:".zip"})," é universal (Windows, Mac, Linux). Não vem instalado, mas o pacote é minúsculo:"]}),e.jsx(o,{title:"zip e unzip",code:`apk add zip unzip

# Criar zip
zip -r backup.zip diretorio/

# Extrair
unzip backup.zip
unzip backup.zip -d /destino/

# Listar conteúdo
unzip -l backup.zip`}),e.jsx("h2",{children:"4. 7-Zip (7z): compressão extrema"}),e.jsx(o,{title:"7z no Alpine",code:`apk add 7zip

# Criar
7z a backup.7z diretorio/

# Extrair
7z x backup.7z

# Listar
7z l backup.7z

# 7z geralmente produz arquivos MENORES que tar.xz,
# mas é mais lento e menos integrado ao ecossistema Linux.`}),e.jsx("h2",{children:"5. Comparativo e recomendações"}),e.jsx(o,{title:"Quando usar cada formato",code:`# Distribuir software:      tar.gz  (universal no mundo Linux)
# Backup local:             tar.xz  (melhor compressão)
# Enviar para Windows/Mac:  .zip    (eles abrem nativamente)
# Compressão máxima:        7z      (para arquivos enormes)
# Logs e texto puro:        gzip    (rápido, eficiente em texto)
# Binários:                 xz      (melhor compressão em binários)

# Script de backup rápido:
tar -cJf "backup-$(date +%Y%m%d).tar.xz" /home /etc /var/log
# Cria backup com data no nome, compressão xz.`}),e.jsx(a,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"tar -czf"})," (gzip), ",e.jsx("code",{children:"-cjf"})," (bzip2), ",e.jsx("code",{children:"-cJf"})," (xz) para criar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"tar -xzf"})," para extrair; ",e.jsx("code",{children:"-tzf"})," para listar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"gzip"})," é o mais rápido; ",e.jsx("code",{children:"xz"})," o que mais comprime"]}),e.jsxs("li",{children:[e.jsx("code",{children:"zip/unzip"})," para compatibilidade com outros SOs"]}),e.jsx("li",{children:"O BusyBox tar já suporta gzip, bzip2 e xz — zero pacotes extras"})]})})]})}export{p as default};
