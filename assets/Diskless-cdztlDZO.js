import{j as e}from"./index-YFyZeUD9.js";import{P as s,A as o,C as a}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(s,{title:"Diskless Mode — Alpine na RAM",subtitle:"Rode o Alpine inteiro na RAM: modo sem disco, overlay filesystem, perfeito para embarcados e kiosks.",difficulty:"avancado",timeToRead:"15 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Alpine instalado em mídia removível (USB, SD) ou via PXE. O modo diskless é um dos modos de instalação oferecidos pelo setup-alpine."}),e.jsxs("p",{children:["O modo ",e.jsx("strong",{children:"diskless"})," (ou ",e.jsx("em",{children:"data"}),") é a feature mais única do Alpine: o sistema base roda inteiro na RAM a partir de uma imagem squashfs, e apenas modificações são gravadas em disco. O resultado é um sistema que sobrevive a cortes de energia e desgaste zero em flash."]}),e.jsx("h2",{children:"1. Como funciona"}),e.jsx(a,{code:`# O boot no modo diskless:
# 1. Bootloader carrega kernel + initramfs
# 2. Initramfs carrega os .apk da mídia para a RAM
# 3. Sistema base roda de uma imagem squashfs na RAM (read-only)
# 4. Overlay fs: camada superior read-write grava modificações

# Tipos de armazenamento:
# NONE     → tudo na RAM, perde tudo no reboot
# DATA     → /var e /etc salvos em partição (ext4/xfs)
# LBU      → Alpine Local Backup: salva alterações em .apkovl

# Vantagens:
# - Imune a corrupção de disco (sistema base é read-only)
# - Desgaste zero em flash (SD card, USB, SSD industrial)
# - Estado limpo a cada reboot (ou persistente, você escolhe)`}),e.jsx("h2",{children:"2. Instalação em modo diskless"}),e.jsx(a,{code:`# Durante o setup-alpine:
# Ao chegar na pergunta "Which disk(s) would you like to use?"
# Responda: none    ← modo diskless puro (tudo na RAM)
#      ou: sda1    ← modo data (salva alterações no disco)

# Com lbu (Local Backup), suas configs viram um .apkovl:
lbu commit -d         # salva alterações no disco
lbu status             # mostra o que mudou desde o último commit
lbu list               # lista arquivos no backup
lbu package -v         # cria um .apkovl manualmente`}),e.jsx("h2",{children:"3. Casos de uso"}),e.jsx(a,{code:`# Roteador/firewall (nunca corrompe, reboot resolve)
# Kiosk/POS (boot limpo toda vez, sem persistência)
# Embarcado (SD card dura anos sem desgaste)
# Laboratório (cada reboot = estado limpo)
# Recuperação (live USB que nunca estraga)

# Exemplo: servidor DHCP diskless
# Instala Alpine no USB, configura dhcpd, commit com lbu.
# Se der problema, reboot = estado limpo + config restaurada.`}),e.jsx("h2",{children:"4. Diferenças vs modo sys (instalação normal)"}),e.jsx(a,{code:`# Modo SYS (instalação em disco):
# - Sistema em partição ext4/xfs
# - apk upgrade altera o sistema permanentemente
# - Corrupção de disco pode quebrar o boot
# - Como Ubuntu/Debian

# Modo DISKLESS:
# - Sistema em squashfs na RAM
# - apk upgrade dura só até o reboot (a menos que faça lbu commit)
# - Corrupção de disco não afeta o sistema base
# - Único do Alpine`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:"Diskless = sistema base em RAM via squashfs"}),e.jsxs("li",{children:["Modo ",e.jsx("strong",{children:"none"}),": tudo volátil; ",e.jsx("strong",{children:"data"}),": persistência parcial"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lbu commit"})," salva alterações; ",e.jsx("code",{children:"lbu status"})," verifica"]}),e.jsx("li",{children:"Ideal para embarcados, kiosks, roteadores e recovery"})]})})]})}export{d as default};
