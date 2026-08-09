import{j as e,T as s}from"./index-YFyZeUD9.js";import{P as r,A as a,C as o}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(r,{title:"Teclado & Timezone",subtitle:"Acerte teclado, fuso horário e locale para o sistema falar sua língua.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsx(a,{type:"info",title:"Pré-requisitos",children:"Alpine instalado com acesso root ou doas/sudo. Os comandos deste capítulo são rápidos e não requerem reboot (exceto o keymap em modo permanente)."}),e.jsx("p",{children:"Teclado com mapa errado, relógio em UTC achando que você está em Londres, programas reclamando de locale. Coisas pequenas que irritam todo dia. Em 10 minutos você resolve as três e nunca mais pensa nisso."}),e.jsx("h2",{children:"1. Teclado: setup-keymap"}),e.jsx("p",{children:"O Alpine vem com mapa de teclado US (QWERTY) por padrão. Se seu teclado é ABNT2 (Brasil) ou tem acentos, os caracteres vão sair trocados. O assistente resolve isso em segundos:"}),e.jsx(s,{title:"Configurando o teclado",lines:[{type:"cmd",text:"setup-keymap"},{type:"out",text:`Available keyboard layouts:
  us      US keyboard
  br      Brazilian (ABNT2)
  pt      Portuguese
  de      German
  fr      French
  ...`},{type:"out",text:"Select keyboard layout [us]:"},{type:"cmd",text:"br"},{type:"out",text:"Select variant (press Enter for default):"},{type:"cmd",text:""},{type:"out",text:"* Setting keymap to 'br' ...  [OK]"}]}),e.jsx("p",{children:"O efeito é imediato no console atual. O assistente altera dois arquivos:"}),e.jsx(o,{title:"O que o setup-keymap altera",code:`# /etc/conf.d/keymaps — configuração do teclado no boot
keymap="br"
# (para ABNT2 brasileiro. 'us' para US, 'pt' para português de Portugal)

# A variante (ex: ABNT2) fica em:
# /etc/conf.d/keymaps
keymap="br-abnt2"`}),e.jsxs(a,{type:"warning",title:"Teclado temporário vs permanente",children:["Se você rodar ",e.jsx("code",{children:"setup-keymap"})," no modo live (antes de instalar), a configuração não persiste após reboot. Após a instalação em disco, o serviço ",e.jsx("code",{children:"keymaps"})," do OpenRC aplica automaticamente o que está em ",e.jsx("code",{children:"/etc/conf.d/keymaps"}),"."]}),e.jsx("p",{children:"Para trocar o mapa temporariamente (sem editar arquivos):"}),e.jsx(o,{code:`# Listar mapas disponíveis
ls /usr/share/keymaps/

# Aplicar um mapa na hora (válido até reboot)
loadkeys br-abnt2`}),e.jsx("h2",{children:"2. Fuso horário: setup-timezone"}),e.jsxs("p",{children:["O Alpine armazena o relógio do hardware em UTC (recomendado) e usa um symlink em ",e.jsx("code",{children:"/etc/localtime"})," para saber qual fuso exibir. O assistente faz tudo:"]}),e.jsx(s,{title:"Configurando o fuso horário",lines:[{type:"cmd",text:"setup-timezone"},{type:"out",text:"Which timezone are you in? ('?' for list) [UTC]:"},{type:"cmd",text:"America/Fortaleza"},{type:"out",text:"* Linking /usr/share/zoneinfo/America/Fortaleza to /etc/localtime"},{type:"out",text:"* Updating /etc/timezone"},{type:"ok",text:"# Pronto! O relógio agora mostra a hora local."}]}),e.jsx("p",{children:"Se você não souber o nome exato do seu fuso, o assistente lista tudo:"}),e.jsx(o,{code:`# Descobrir fusos disponíveis
setup-timezone -l        # lista todos
setup-timezone -l | grep -i america   # filtra por continente

# Fusos brasileiros comuns:
# America/Sao_Paulo    (Brasília, -3)
# America/Fortaleza    (Nordeste, -3)
# America/Manaus       (Amazonas, -4)
# America/Cuiaba       (Mato Grosso, -4)`}),e.jsx(a,{type:"info",title:"UTC no hardware, local no sistema",children:"A convenção Linux é manter o relógio da máquina em UTC e usar o timezone só para exibição. Isso evita confusão com horário de verão e dual-boot. O Alpine segue essa convenção por padrão — não mude a menos que tenha um motivo forte."}),e.jsx("h2",{children:"3. tzdata: o pacote por trás"}),e.jsxs("p",{children:["Os fusos horários vêm do pacote ",e.jsx("code",{children:"tzdata"}),", instalado por padrão. Ele coloca os arquivos de definição em"," ",e.jsx("code",{children:"/usr/share/zoneinfo/"}),", organizados por continente/cidade:"]}),e.jsx(o,{title:"Explorando os arquivos de timezone",code:`# O que o tzdata instalou
apk info -L tzdata | head -20
# /usr/share/zoneinfo/
# /usr/share/zoneinfo/America/
# /usr/share/zoneinfo/America/Sao_Paulo
# /usr/share/zoneinfo/America/Fortaleza
# ...

# Ver o symlink atual
ls -l /etc/localtime
# /etc/localtime -> /usr/share/zoneinfo/America/Fortaleza

# Ver o timezone configurado
cat /etc/timezone
# America/Fortaleza`}),e.jsx("h2",{children:"4. Acertar data e hora"}),e.jsx("p",{children:"Se o relógio estiver errado depois de configurar o timezone, acerte manualmente ou sincronize com a rede:"}),e.jsx("h3",{children:"4.1 Manual — date e hwclock"}),e.jsx(o,{title:"Ajuste manual do relógio",code:`# Ver data/hora atual
date
# Sun Aug  9 14:00:00 -03 2026

# Ajustar data/hora (formato: MMDDHHmmAAAA)
date 080914002026     # 09/Ago 14:00 2026

# Gravar a hora do sistema no relógio do hardware
hwclock --systohc`}),e.jsx("h3",{children:"4.2 Automático — chronyd (NTP)"}),e.jsx("p",{children:"Muito mais prático: instalar o chrony e deixar a sincronização automática com servidores NTP. Se você seguiu o capítulo Primeiros Passos, já deve estar rodando:"}),e.jsx(o,{title:"Verificar a sincronização NTP",code:`# Status da sincronização
chronyc tracking

# Fontes de tempo que o chrony está consultando
chronyc sources -v

# Forçar sincronização imediata
chronyc makestep`}),e.jsx(a,{type:"info",title:"Precisão importa?",children:"Para servidores e bancos de dados, relógio correto é fundamental — tokens JWT expiram, certificados TLS são validados, backups têm timestamp. O chrony consome ~2 MB de RAM e resolve isso para sempre."}),e.jsx("h2",{children:"5. Locale: o Alpine e a musl"}),e.jsxs("p",{children:["Aqui o Alpine ",e.jsx("strong",{children:"é diferente"})," de Debian, Ubuntu e derivados. Eles usam a glibc, que tem suporte completo a locales (centenas de arquivos de tradução, formatação regional, collation). O Alpine usa a musl, que é minimalista e por padrão trabalha com ",e.jsx("code",{children:"LANG=C"})," (ou"," ",e.jsx("code",{children:"POSIX"}),")."]}),e.jsx(o,{title:"O estado padrão do locale no Alpine",code:`# Ver o locale atual
echo $LANG
# C  (ou vazio — equivalente a C/POSIX)

# Tentar listar locales (não funciona sem musl-locales)
locale -a
# locale: not found  (o Alpine nem tem o comando por padrão)`}),e.jsxs("p",{children:[e.jsx("code",{children:"LANG=C"})," significa: ordenação binária (A-Z, a-z separados), sem traduções de mensagens, datas em inglês, ponto decimal (não vírgula). Para a maioria dos servidores, isso é perfeitamente aceitável — e até desejável (scripts quebram menos)."]}),e.jsx("h3",{children:"5.1 Quando você PRECISA de locales"}),e.jsx("p",{children:"Se algum programa reclama de locale ou você quer mensagens em português:"}),e.jsx(o,{title:"Instalando suporte a locales na musl",code:`# 1. Instalar o pacote de locales
apk add musl-locales

# 2. Agora o comando locale existe
locale -a | head -10
# C
# C.utf8
# POSIX
# pt_BR
# pt_BR.utf8
# ...

# 3. Definir para português brasileiro UTF-8
export LANG=pt_BR.UTF-8

# 4. Testar
date
# dom 09 ago 2026 14:00:00 -03`}),e.jsxs("p",{children:["Para tornar permanente, adicione ao seu ",e.jsx("code",{children:"~/.profile"}),":"]}),e.jsx(o,{title:"~/.profile — locale permanente",code:`# Adicione no final do ~/.profile
export LANG=pt_BR.UTF-8
export LC_ALL=pt_BR.UTF-8`}),e.jsxs(a,{type:"warning",title:"musl-locales: use com moderação",children:["O pacote ",e.jsx("code",{children:"musl-locales"})," adiciona ~10 MB de dados de locale. Não é necessário para a maioria dos servidores — o padrão"," ",e.jsx("code",{children:"LANG=C"})," funciona bem com bancos de dados, servidores web e aplicações em containers. Só instale se um programa específico exigir ou se você realmente quiser o terminal em português."]}),e.jsx("h2",{children:"6. Tudo junto: script de localização inicial"}),e.jsx("p",{children:"Se você está configurando várias máquinas ou quer um atalho, aqui está um script que faz tudo de uma vez com os valores brasileiros:"}),e.jsx(o,{title:"localizacao-br.sh — configure teclado, timezone e locale",code:`#!/bin/sh
# Script de localização para Alpine Linux — Brasil

echo "==> Configurando teclado ABNT2..."
setup-keymap br abnt2

echo "==> Configurando timezone America/Fortaleza..."
setup-timezone -z America/Fortaleza

echo "==> Instalando e ativando chrony (NTP)..."
apk add -q chrony 2>/dev/null
rc-update add chronyd 2>/dev/null
rc-service chronyd start 2>/dev/null

echo "==> (Opcional) Instalando locales em português..."
apk add -q musl-locales 2>/dev/null
echo 'export LANG=pt_BR.UTF-8' >> /etc/profile

echo "==> Pronto! Confira:"
echo -n "  Data: "; date
echo -n "  Keymap: "; cat /etc/conf.d/keymaps 2>/dev/null || echo "N/A"
echo -n "  Timezone: "; readlink /etc/localtime`}),e.jsxs(a,{type:"success",title:"Resumo",children:["Três ajustes que custam 10 minutos e duram a vida toda do sistema:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Teclado:"})," ",e.jsx("code",{children:"setup-keymap"})," → escolha"," ",e.jsx("code",{children:"br"})," (ABNT2)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Timezone:"})," ",e.jsx("code",{children:"setup-timezone"})," → escolha seu fuso (ex: ",e.jsx("code",{children:"America/Fortaleza"}),")"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Locale:"})," opcional — ",e.jsx("code",{children:"apk add musl-locales"})," ","e ",e.jsx("code",{children:"export LANG=pt_BR.UTF-8"})]})]}),"O Alpine é minimalista também nisso: o padrão C é suficiente para a maioria dos casos; os assistentes resolvem o resto em segundos."]})]})}export{n as default};
