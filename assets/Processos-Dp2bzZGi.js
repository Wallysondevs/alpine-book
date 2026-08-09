import{j as o,T as a}from"./index-YFyZeUD9.js";import{P as r,A as s,C as e}from"./AlertBox-C2CyWd7R.js";function c(){return o.jsxs(r,{title:"Processos",subtitle:"ps, top, htop, kill, jobs, nohup — controle tudo que está rodando no seu Alpine.",difficulty:"iniciante",timeToRead:"15 min",children:[o.jsxs(s,{type:"info",title:"Pré-requisitos",children:["Terminal aberto. O ",o.jsx("code",{children:"ps"})," do BusyBox já está disponível; o resto instalamos conforme necessário."]}),o.jsxs("p",{children:["Tudo que roda no Linux é um processo — cada comando, cada serviço, cada terminal aberto. Saber listar, priorizar, congelar e matar processos é uma habilidade fundamental. O Alpine usa o ",o.jsx("code",{children:"ps"})," do BusyBox por padrão, mas você pode instalar versões mais completas."]}),o.jsx("h2",{children:"1. ps: listando processos (BusyBox vs procps)"}),o.jsx(a,{title:"ps — versão BusyBox",lines:[{type:"cmd",text:"ps"},{type:"out",text:"PID   USER     TIME  COMMAND"},{type:"out",text:"1234  root      0:00 /sbin/init"},{type:"out",text:"5678  wallyson  0:00 -ash"},{type:"out",text:"9012  wallyson  0:00 ps"},{type:"comment",text:"# ps simples do BusyBox: só processos da sua sessão"}]}),o.jsx(e,{title:"ps completo com procps",code:`# Instalar procps (ps completo, igual ao Debian/Ubuntu)
apk add procps

# Agora você tem as flags clássicas:
ps aux                  # TODOS os processos, formato BSD
ps aux | grep nginx
ps -ef                  # formato Unix (com PPID)
ps -eo pid,ppid,user,cmd  # colunas personalizadas

# Sem instalar nada, use /proc:
ls /proc                # um diretório por PID
cat /proc/1234/cmdline  # comando do processo 1234
cat /proc/1234/status   # estado detalhado`}),o.jsx("h2",{children:"2. top e htop: monitoramento ao vivo"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"top"})," do BusyBox é funcional mas espartano. Para uma experiência completa, instale o ",o.jsx("code",{children:"htop"}),":"]}),o.jsx(e,{title:"top e htop",code:`# top do BusyBox (já vem instalado)
top
# Teclas: q=sair, m=memória, p=CPU

# htop (muito melhor)
apk add htop
htop
# Interface colorida, scroll, F-keys para ações, tree view (F5)

# btop (ainda mais bonito, estilo gamer)
apk add btop
btop
# Gráficos ASCII, temas, monitoramento de rede e disco`}),o.jsx("h2",{children:"3. kill e sinais: controlando processos"}),o.jsx(e,{title:"Enviando sinais para processos",code:`# Matar processo por PID
kill 1234

# Matar com força (SIGKILL = 9)
kill -9 1234

# Sinais comuns:
# SIGTERM (15) = "por favor, encerre" (padrão, permite cleanup)
# SIGKILL (9)  = "encerre AGORA" (kernel força, sem cleanup)
# SIGHUP  (1)  = "recarregue configuração"
# SIGSTOP (19) = pausa o processo
# SIGCONT (18) = continua processo pausado

# Matar por nome
pkill nginx
pkill -9 -f "python app.py"    # -f = match na linha de comando inteira

# Matar tudo de um usuário
pkill -u maria

# Listar todos os sinais
kill -l`}),o.jsx(a,{title:"Matando um processo travado",lines:[{type:"cmd",text:"ps aux | grep runaway"},{type:"out",text:"wallyson 3456 99.0 5.0 123456 78901 ? R 14:00 10:23 runaway"},{type:"comment",text:"# Processo com 99% de CPU — hora de matar."},{type:"cmd",text:"kill 3456"},{type:"comment",text:"# ...5 segundos depois..."},{type:"cmd",text:"ps -p 3456"},{type:"out",text:"3456 wallyson ... runaway  ← ainda rodando"},{type:"cmd",text:"kill -9 3456"},{type:"cmd",text:"ps -p 3456"},{type:"out",text:""},{type:"ok",text:"# SIGKILL sempre funciona (o kernel garante)."}]}),o.jsx("h2",{children:"4. nice e renice: prioridade de CPU"}),o.jsx(e,{title:"Ajustando prioridades",code:`# nice: iniciar com prioridade alterada (-20 a 19, menor = mais prioridade)
nice -n 10 tar -czf backup.tar.gz /home/   # baixa prioridade
nice -n -5 ./servidor-critico              # alta prioridade (precisa root)

# renice: alterar prioridade de processo rodando
renice -n 10 -p 3456       # baixa prioridade do PID 3456
renice -n -5 -u postgres   # aumenta prioridade de todos do usuário postgres

# Ver prioridade (coluna NI no ps)
ps -eo pid,ni,comm | head`}),o.jsx("h2",{children:"5. Jobs em background (no ash do Alpine)"}),o.jsx(e,{title:"Controle de jobs no shell ash",code:`# Iniciar em background
tar -czf backup.tar.gz /home/ &
# [1] 5678  ← job number e PID

# Ver jobs ativos
jobs
# [1] + Running  tar -czf backup.tar.gz /home/

# Trazer de volta para foreground
fg %1

# Pausar (Ctrl+Z) e continuar em background
# Ctrl+Z → Stopped
bg %1        # continua no background

# Desconectar sem matar
nohup ./script-longo.sh > output.log 2>&1 &
# Agora você pode sair do terminal sem matar o script.

# Desconectar um processo que já está rodando:
# Ctrl+Z → bg → disown %1`}),o.jsx("h2",{children:"6. /proc/PID: espiando dentro dos processos"}),o.jsx(e,{title:"Informações detalhadas via /proc",code:`# Para um PID específico:
cat /proc/1234/cmdline       # comando (separado por null bytes)
cat /proc/1234/status        # estado, memória, threads
cat /proc/1234/environ       # variáveis de ambiente
ls -l /proc/1234/fd/         # arquivos abertos (file descriptors)
ls -l /proc/1234/cwd         # diretório de trabalho
cat /proc/1234/maps          # mapa de memória
cat /proc/1234/limits        # limites de recursos
cat /proc/1234/oom_score     # pontuação OOM killer (maior = morre primeiro)

# Estatísticas globais:
cat /proc/loadavg
cat /proc/stat`}),o.jsx(s,{type:"success",title:"Resumo",children:o.jsxs("ol",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"ps"})," BusyBox para o básico; ",o.jsx("code",{children:"apk add procps"})," para o completo"]}),o.jsxs("li",{children:[o.jsx("code",{children:"htop"})," / ",o.jsx("code",{children:"btop"})," para monitoramento interativo"]}),o.jsxs("li",{children:[o.jsx("code",{children:"kill -9 PID"})," como último recurso; prefira ",o.jsx("code",{children:"kill PID"})," (SIGTERM)"]}),o.jsxs("li",{children:[o.jsx("code",{children:"nice -n 10 comando"})," para baixa prioridade"]}),o.jsxs("li",{children:[o.jsx("code",{children:"comando &"})," para background; ",o.jsx("code",{children:"nohup"})," para sobreviver ao logout"]}),o.jsxs("li",{children:[o.jsx("code",{children:"/proc/PID/"})," para inspeção profunda"]})]})})]})}export{c as default};
