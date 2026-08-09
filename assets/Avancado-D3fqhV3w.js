import{j as e,T as o}from"./index-YFyZeUD9.js";import{P as r,A as a,C as s}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(r,{title:"Comandos Avançados",subtitle:"sed, awk, grep GNU, cut, sort, uniq, diff, screen/tmux — ferramentas pesadas que valem cada byte.",difficulty:"avancado",timeToRead:"25 min",children:[e.jsx(a,{type:"info",title:"Pré-requisitos",children:"Domínio de pipes, redirecionamentos e scripts shell. As ferramentas GNU (sed, awk, grep) precisam ser instaladas — as versões BusyBox são limitadas."}),e.jsx("p",{children:"O BusyBox resolve 90% do dia a dia. Para os 10% restantes — parsing complexo, transformações de texto, sessões persistentes — você instala as versões GNU completas. Este capítulo mostra quando e como usar cada uma."}),e.jsx("h2",{children:"1. sed: editor de stream"}),e.jsx(s,{code:`# Instalar a versão GNU (BusyBox sed é muito limitado)
apk add sed

# SUBSTITUIÇÃO (o uso mais comum)
sed 's/antigo/novo/' arquivo.txt           # primeira ocorrência por linha
sed 's/antigo/novo/g' arquivo.txt           # TODAS as ocorrências
sed 's/antigo/novo/gi' arquivo.txt          # case-insensitive

# DELETAR linhas
sed '3d' arquivo.txt           # deleta linha 3
sed '5,10d' arquivo.txt        # deleta linhas 5 a 10
sed '/^$/d' arquivo.txt        # deleta linhas vazias

# IMPRIMIR linhas específicas
sed -n '5p' arquivo.txt        # só linha 5
sed -n '10,20p' arquivo.txt    # linhas 10 a 20

# MODIFICAR IN-PLACE (-i)
sed -i 's/erro/error/g' *.log          # edita todos os .log
sed -i.bak 's/porta 22/porta 2222/' sshd_config  # com backup

# ENDEREÇAMENTO
sed '/^#/d' config.txt         # deleta comentários
sed '/^$/d' config.txt          # deleta linhas vazias
sed '/DEBUG/,/END/d' app.log   # deleta blocos entre padrões`}),e.jsx("h2",{children:"2. awk: processador de texto"}),e.jsx(s,{code:`# Instalar GNU awk
apk add gawk

# IMPRIMIR COLUNAS (o uso mais comum)
awk '{print $1}' arquivo.txt           # primeira coluna
awk '{print $1, $3}' arquivo.txt       # colunas 1 e 3
awk '{print $NF}' arquivo.txt          # ÚLTIMA coluna (NF = Number of Fields)
awk -F: '{print $1, $7}' /etc/passwd   # delimitador : (usuário e shell)

# FILTRAR por condição
awk '$3 > 1000' dados.txt              # terceira coluna > 1000
awk '/error/' app.log                   # linhas com "error"
awk '$1 == "root"' /etc/passwd          # primeira coluna é "root"

# SOMAR e CONTAR
awk '{sum += $1} END {print sum}' numeros.txt    # soma da coluna 1
awk '{count++} END {print count}' arquivo.txt    # conta linhas

# EXEMPLO PRÁTICO: uso de disco por usuário
du -s /home/* | awk '{printf "%-20s %s\\n", $2, $1}' | sort -k2 -rn`}),e.jsx(o,{title:"awk no dia a dia",lines:[{type:"cmd",text:"df -h | awk '$5 > 50 {print $1, $5}'"},{type:"out",text:"/dev/sda3 67%"},{type:"comment",text:"# Mostra partições com mais de 50% de uso."},{type:"cmd",text:"apk info | awk '{print length, $0}' | sort -rn | head -5"},{type:"out",text:"34 linux-firmware-nvidia"},{type:"out",text:"29 linux-firmware-amdgpu"},{type:"comment",text:"# Pacotes com nomes mais longos instalados."}]}),e.jsx("h2",{children:"3. grep GNU: busca com poder total"}),e.jsx(s,{code:`# Instalar GNU grep (BusyBox grep não tem -P, -A, -B, -C)
apk add grep

# Regex Perl (-P) — muito mais poderoso
grep -P '\\d{3}-\\d{4}' arquivo.txt     # padrão 123-4567
grep -P '(?<=user=)\\w+' log.txt        # lookbehind

# Contexto ao redor do match
grep -A 3 "error" app.log     # 3 linhas DEPOIS
grep -B 3 "error" app.log     # 3 linhas ANTES
grep -C 3 "error" app.log     # 3 linhas de contexto

# Inverter match (mostrar o que NÃO casa)
grep -v "^#" config.txt        # remove comentários
grep -v "^$" config.txt        # remove linhas vazias

# Contar, colorir, recursivo
grep -c "error" app.log        # conta ocorrências
grep --color "error" app.log   # destaca em cor
grep -rn "TODO" ~/projetos/    # busca recursiva com número de linha`}),e.jsx("h2",{children:"4. cut, sort, uniq: o trio de formatação"}),e.jsx(s,{code:`# CUT — extrair colunas de texto delimitado
cut -d: -f1,7 /etc/passwd                # delimitador : campos 1 e 7
cut -c1-10 arquivo.txt                    # primeiros 10 caracteres
echo "a,b,c,d" | cut -d, -f2-3           # campos 2 e 3 → "b,c"

# SORT — ordenar
sort arquivo.txt                           # ordem alfabética
sort -n numeros.txt                        # ordem numérica
sort -rn numeros.txt                       # numérica reversa (maior primeiro)
sort -t: -k3 -n /etc/passwd               # ordena pelo UID (campo 3, numérico)
sort -u arquivo.txt                        # único (remove duplicados)

# UNIQ — remover/contar duplicados (precisa de sort antes!)
sort dados.txt | uniq                      # remove duplicados
sort dados.txt | uniq -c                   # conta ocorrências
sort dados.txt | uniq -d                   # mostra SÓ duplicados
sort dados.txt | uniq -u                   # mostra SÓ únicos`}),e.jsx(o,{title:"cut + sort + uniq na prática",lines:[{type:"cmd",text:"cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn"},{type:"out",text:"  3 /bin/ash"},{type:"out",text:"  2 /sbin/nologin"},{type:"out",text:"  1 /bin/bash"},{type:"comment",text:"# Distribuição de shells no sistema."}]}),e.jsx("h2",{children:"5. diff e patch: comparando arquivos"}),e.jsx(s,{code:`# diff — comparar dois arquivos
diff original.txt modificado.txt

# diff unificado (-u, mais legível)
diff -u original.txt modificado.txt

# Comparar diretórios
diff -r dir1/ dir2/

# Gerar patch
diff -u original.txt modificado.txt > correcao.patch

# Aplicar patch
patch original.txt < correcao.patch
# ou
patch -p1 < correcao.patch`}),e.jsx("h2",{children:"6. screen e tmux: sessões persistentes"}),e.jsx("p",{children:"Precisa desconectar do SSH sem matar o processo? Screen e tmux mantêm a sessão viva:"}),e.jsx(s,{code:`# SCREEN (mais simples, mais leve)
apk add screen

screen                    # inicia nova sessão
screen -S backup          # sessão com nome "backup"

# Dentro do screen:
# Ctrl+A, D  → desconectar (a sessão continua rodando)

screen -ls                # lista sessões
screen -r                 # reconectar à última
screen -r backup          # reconectar a "backup"

# TMUX (mais moderno, panes, scripts)
apk add tmux

tmux                      # inicia nova sessão
tmux new -s dev           # sessão chamada "dev"

# Dentro do tmux:
# Ctrl+B, D  → desconectar
# Ctrl+B, %  → dividir vertical
# Ctrl+B, "  → dividir horizontal
# Ctrl+B, setas → navegar entre panes

tmux ls                   # lista sessões
tmux attach -t dev        # reconectar a "dev"`}),e.jsx("h2",{children:"7. One-liners poderosos"}),e.jsx(s,{code:`# Top 10 diretórios por tamanho
du -sh /* 2>/dev/null | sort -rh | head -10

# Top 5 processos por memória
ps aux --sort=-%mem | head -6

# Arquivos modificados nas últimas 24h
find /home -type f -mtime -1

# Substituir texto em múltiplos arquivos
sed -i 's/http:/https:/g' *.conf

# Contar linhas de código por linguagem
find . -name "*.tsx" | xargs wc -l | tail -1

# IPs únicos acessando o servidor (nginx)
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# Matar todos os processos de um usuário
pkill -u usuario-problematico`}),e.jsx(a,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"sed"})," — substituição em lote, delete de linhas, edição in-place"]}),e.jsxs("li",{children:[e.jsx("code",{children:"awk"})," — colunas, somas, filtros, relatórios"]}),e.jsxs("li",{children:[e.jsx("code",{children:"grep -P"})," — regex Perl, contexto (-A/-B/-C)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"cut | sort | uniq"})," — pipeline clássico de análise"]}),e.jsxs("li",{children:[e.jsx("code",{children:"diff/patch"})," — comparar e aplicar mudanças"]}),e.jsxs("li",{children:[e.jsx("code",{children:"screen/tmux"})," — sessões persistentes (indispensável em SSH)"]}),e.jsxs("li",{children:["Sempre instale as versões GNU: ",e.jsx("code",{children:"sed"}),", ",e.jsx("code",{children:"gawk"}),", ",e.jsx("code",{children:"grep"})]})]})})]})}export{d as default};
