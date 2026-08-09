import{j as e}from"./index-YFyZeUD9.js";import{P as i,A as s,C as o}from"./AlertBox-C2CyWd7R.js";function t(){return e.jsxs(i,{title:"Scripts de Shell no Alpine",subtitle:"Escreva scripts compatíveis com ash: shebang, variáveis, if/for/while, case, funções e set -eu.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Conforto com terminal, variáveis e redirecionamento. Conhecimento básico de qualquer linguagem de script ajuda."}),e.jsxs("p",{children:["Scripts shell são a cola que mantém sistemas Unix unidos há 50 anos. No Alpine, você escreve scripts para o ",e.jsx("strong",{children:"ash"})," — o que significa seguir o padrão POSIX, sem firulas do bash. A vantagem: o script roda em qualquer Linux, BSD e macOS."]}),e.jsx("h2",{children:"1. Estrutura básica: shebang e primeiros passos"}),e.jsx(o,{code:`#!/bin/sh
# Sempre comece com #!/bin/sh — compatível com ash, bash, dash, zsh.
# NUNCA use #!/bin/bash em scripts para Alpine (bash pode não existir).

# Primeiro script: hello.sh
#!/bin/sh
echo "Olá, Alpine!"

# Tornar executável e rodar
chmod +x hello.sh
./hello.sh`}),e.jsx("h2",{children:"2. Variáveis e argumentos"}),e.jsx(o,{code:`#!/bin/sh
# Variáveis (sem espaço ao redor do =)
nome="Wallyson"
echo "Olá, $nome"

# Argumentos de linha de comando
echo "Script: $0"         # nome do script
echo "Primeiro arg: $1"   # ./script.sh foo bar → foo
echo "Todos os args: $*"  # foo bar
echo "Número de args: $#"  # 2

# Shift: descarta o primeiro argumento
shift
echo "Agora $1 é: $1"     # bar (foo foi descartado)

# Valores padrão (se variável não definida)
echo {""$"}{"{"}VAR:-padrao{"}""}     # se VAR não existe, usa "padrao"
echo {""$"}{"{"}VAR:=padrao{"}""}     # atribui "padrao" se VAR não existe`}),e.jsx("h2",{children:"3. if/else e testes [ ]"}),e.jsx(o,{code:`#!/bin/sh
# Testes POSIX — use [ ] com espaços DENTRO!

# Testes de arquivo
[ -f /etc/hosts ] && echo "é um arquivo"
[ -d /etc ] && echo "é um diretório"
[ -x /bin/ls ] && echo "é executável"
[ -s arquivo.txt ] || echo "está vazio"

# Testes de string
[ "$a" = "$b" ]      # igual
[ "$a" != "$b" ]     # diferente
[ -z "$var" ]         # está vazia?
[ -n "$var" ]         # não está vazia?

# Testes numéricos
[ "$a" -eq "$b" ]    # igual (equal)
[ "$a" -ne "$b" ]    # diferente (not equal)
[ "$a" -gt "$b" ]    # maior (greater than)
[ "$a" -lt "$b" ]    # menor (less than)

# if/elif/else completo
if [ "$1" = "start" ]; then
    echo "Iniciando..."
elif [ "$1" = "stop" ]; then
    echo "Parando..."
else
    echo "Uso: $0 {start|stop}"
    exit 1
fi

# ⚠️  NÃO use [[ ]] — é bash-only. Use [ ].`}),e.jsx("h2",{children:"4. Loops: for e while"}),e.jsx(o,{code:`#!/bin/sh
# for — iterar sobre lista
for i in um dois tres; do
    echo "Item: $i"
done

# for — iterar sobre arquivos (globbing)
for file in /etc/*.conf; do
    echo "Config: $file"
done

# for — estilo C (funciona no ash!)
for i in $(seq 1 5); do
    echo "Número $i"
done

# while — loop com condição
count=1
while [ $count -le 5 ]; do
    echo "Contagem: $count"
    count=$((count + 1))    # aritmética POSIX
done

# while read — processar linha a linha
cat /etc/passwd | while read line; do
    user=$(echo "$line" | cut -d: -f1)
    echo "Usuário: $user"
done`}),e.jsx("h2",{children:"5. case: múltiplas opções"}),e.jsx(o,{code:`#!/bin/sh
# case — mais limpo que if/elif para múltiplos valores
case "$1" in
    start)
        echo "Iniciando serviço..."
        ;;
    stop)
        echo "Parando serviço..."
        ;;
    restart|reload)
        echo "Reiniciando..."
        ;;
    status)
        echo "Verificando status..."
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac`}),e.jsx("h2",{children:"6. Funções"}),e.jsx(o,{code:`#!/bin/sh
# Função POSIX (sem a palavra 'function' — isso é bash-only)
die() {
    echo "ERRO: $1" >&2
    exit 1
}

# Função com retorno (0=ok, outro=erro)
is_root() {
    [ "$(id -u)" -eq 0 ]
}

# Usar funções
is_root || die "Execute como root"
echo "OK, você é root!"

# Função que captura saída
get_hostname() {
    hostname
}
meu_host=$(get_hostname)
echo "Host: $meu_host"`}),e.jsx("h2",{children:"7. set -eu: scripts à prova de balas"}),e.jsx(o,{code:`#!/bin/sh
set -eu   # SEMPRE use — evita 90% dos bugs

# set -e = para no primeiro erro
# set -u = erro ao usar variável não definida
# set -x = mostra cada comando antes de executar (debug)

# Exemplo sem set -e: o script CONTINUA após erro
rm /arquivo-que-nao-existe   # falha silenciosamente
echo "Continuou..."           # ...e isso roda, com o sistema inconsistente

# Com set -e: o script PARA imediatamente
# Com set -u: $VAR_NAO_DEFINIDA para com erro

# Desativar temporariamente (se espera um erro)
set +e
comando_que_pode_falhar
set -e`}),e.jsx("h2",{children:"8. Diferenças bash que QUEBRAM no ash"}),e.jsx(o,{code:`# ❌ NÃO FUNCIONA NO ASH:
[[ $a == $b ]]              # use [ "$a" = "$b" ]
function nome { ... }       # use nome() { ... } (sem 'function')
{"$"}{"{"}var,,{"}"}                    # lowercase — use tr (echo "$var" | tr A-Z a-z)
{"$"}{"{"}var^^{"}"}                    # uppercase
source script.sh            # use . script.sh
read -p "Prompt" var        # use echo "Prompt"; read var
declare -A arr              # arrays associativos NÃO existem

# ✅ FUNCIONA NO ASH E NO BASH:
[ "$a" = "$b" ]             # teste POSIX
nome() { ... }              # funções POSIX
$((a + b))                  # aritmética
$(comando)                  # substituição de comando
{"$"}{"{"}var:-padrao{"}"}              # valor padrão
set -eu                     # strict mode`}),e.jsx("h2",{children:"9. Exemplos reais"}),e.jsx(o,{title:"Script 1: backup diário",code:`#!/bin/sh
set -eu
BACKUP_DIR="/backup/daily"
DATE=$(date +%Y%m%d)
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/home-$DATE.tar.gz" /home/
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
echo "Backup concluído: $BACKUP_DIR/home-$DATE.tar.gz"`}),e.jsx(o,{title:"Script 2: healthcheck de serviço",code:`#!/bin/sh
set -eu
SERVICE="$1"
if ! rc-service "$SERVICE" status -q 2>/dev/null; then
    echo "[$(date)] $SERVICE está parado! Tentando reiniciar..." >&2
    rc-service "$SERVICE" start
fi`}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"#!/bin/sh"})," — compatível com ash (padrão Alpine)"]}),e.jsxs("li",{children:[e.jsx("code",{children:'[ "$a" = "$b" ]'})," — use [ ] com espaços, não [[ ]]"]}),e.jsxs("li",{children:[e.jsx("code",{children:"for"}),", ",e.jsx("code",{children:"while"}),", ",e.jsx("code",{children:"case"})," — loops e condicionais POSIX"]}),e.jsxs("li",{children:[e.jsx("code",{children:"set -eu"})," — evita que scripts continuem após erros"]}),e.jsxs("li",{children:["Evite sintaxe bash-only: ",e.jsx("code",{children:"function"}),", ",e.jsx("code",{children:"[[ ]]"}),", ",e.jsx("code",{children:"read -p"}),", arrays associativos"]}),e.jsx("li",{children:"Scripts POSIX rodam em qualquer lugar — ash, bash, dash, zsh, BSD"})]})})]})}export{t as default};
