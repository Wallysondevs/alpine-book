import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as o,A as p,C as n}from"./AlertBox-C2CyWd7R.js";function i(){return e.jsxs(o,{title:"Node.js no Alpine",subtitle:"Instale Node.js, npm, pnpm, gerencie versões e otimize para produção.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx(p,{type:"info",title:"Pré-requisitos",children:"Nenhum. Node.js está no repositório community — ative-o se ainda não fez."}),e.jsx("p",{children:"Node.js no Alpine é rápido de instalar e tem performance excelente. O ecossistema JavaScript funciona perfeitamente — npm, pnpm, yarn — e o Alpine é a base favorita para imagens Docker de Node.js."}),e.jsx("h2",{children:"1. Instalação"}),e.jsx(n,{code:`# Node.js LTS (recomendado)
apk add nodejs npm

# Versão
node --version
npm --version

# Node.js current (mais recente)
apk add nodejs-current

# Yarn e pnpm
apk add yarn
npm install -g pnpm       # ou corepack enable && corepack prepare pnpm@latest`}),e.jsx("h2",{children:"2. pnpm: rápido e eficiente"}),e.jsx(a,{title:"pnpm — o gerenciador de pacotes mais rápido",lines:[{type:"cmd",text:"npm install -g pnpm"},{type:"cmd",text:"pnpm create vite meu-app --template react-ts"},{type:"out",text:"Scaffolding project..."},{type:"cmd",text:"cd meu-app && pnpm install"},{type:"out",text:"Packages: +150"},{type:"out",text:"Done in 3.2s"}]}),e.jsx("h2",{children:"3. npm vs pnpm vs yarn"}),e.jsx(n,{code:`# npm  — padrão, vem junto com Node.js
# pnpm — mais rápido, usa links simbólicos (recomendado)
# yarn — alternativa, compatível com npm

# Comandos equivalentes:
npm install    = pnpm install    = yarn
npm run dev    = pnpm dev        = yarn dev
npm add pkg    = pnpm add pkg    = yarn add pkg
npm remove     = pnpm remove     = yarn remove`}),e.jsx("h2",{children:"4. nvm e fnm: gerenciar versões do Node"}),e.jsx(n,{code:`# fnm (Fast Node Manager) — feito em Rust, rápido
apk add curl
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.profile
fnm install 22          # Node 22 LTS
fnm use 22
node --version

# Alternativa: nvm (mais tradicional)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40/install.sh | bash
nvm install 22
nvm use 22`}),e.jsx("h2",{children:"5. PM2: gerenciador de processos Node"}),e.jsx(n,{code:`# PM2 mantém seu app rodando, com restart automático
npm install -g pm2

# Iniciar app
pm2 start app.js --name meu-app

# Configurar boot automático
pm2 startup
pm2 save

# Comandos PM2
pm2 list                   # status dos apps
pm2 logs meu-app           # logs em tempo real
pm2 restart meu-app        # reiniciar
pm2 stop meu-app           # parar
pm2 delete meu-app         # remover`}),e.jsx("h2",{children:"6. Node.js em produção"}),e.jsx(n,{code:`# Boas práticas para produção no Alpine:

# 1. Use --production (sem devDependencies)
npm ci --production

# 2. Limpe cache do npm
npm cache clean --force

# 3. Serviço OpenRC para app Node
cat > /etc/init.d/meu-app << 'EOF'
#!/sbin/openrc-run
description="Meu App Node.js"
command="/usr/bin/node"
command_args="/opt/meu-app/app.js"
command_user="node"
pidfile="/run/meu-app.pid"
EOF
chmod +x /etc/init.d/meu-app
rc-update add meu-app`}),e.jsx(p,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add nodejs npm"})," — instalação"]}),e.jsxs("li",{children:[e.jsx("code",{children:"pnpm"})," — gerenciador rápido (instale com npm)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"fnm"})," ou ",e.jsx("code",{children:"nvm"})," — múltiplas versões do Node"]}),e.jsxs("li",{children:[e.jsx("code",{children:"pm2"})," — gerenciamento de processos em produção"]}),e.jsx("li",{children:"OpenRC para serviço persistente"})]})})]})}export{i as default};
