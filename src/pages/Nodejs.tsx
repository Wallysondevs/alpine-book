import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Nodejs() {
  return (
    <PageContainer
      title="Node.js no Alpine"
      subtitle="Instale Node.js, npm, pnpm, gerencie versões e otimize para produção."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. Node.js está no repositório community — ative-o se ainda não fez.
      </AlertBox>

      <p>
        Node.js no Alpine é rápido de instalar e tem performance excelente.
        O ecossistema JavaScript funciona perfeitamente — npm, pnpm, yarn —
        e o Alpine é a base favorita para imagens Docker de Node.js.
      </p>

      <h2>1. Instalação</h2>
      <CodeBlock
        code={`# Node.js LTS (recomendado)
apk add nodejs npm

# Versão
node --version
npm --version

# Node.js current (mais recente)
apk add nodejs-current

# Yarn e pnpm
apk add yarn
npm install -g pnpm       # ou corepack enable && corepack prepare pnpm@latest`}
      />

      <h2>2. pnpm: rápido e eficiente</h2>
      <Terminal
        title="pnpm — o gerenciador de pacotes mais rápido"
        lines={[
          { type: "cmd", text: "npm install -g pnpm" },
          { type: "cmd", text: "pnpm create vite meu-app --template react-ts" },
          { type: "out", text: "Scaffolding project..." },
          { type: "cmd", text: "cd meu-app && pnpm install" },
          { type: "out", text: "Packages: +150" },
          { type: "out", text: "Done in 3.2s" },
        ]}
      />

      <h2>3. npm vs pnpm vs yarn</h2>
      <CodeBlock
        code={`# npm  — padrão, vem junto com Node.js
# pnpm — mais rápido, usa links simbólicos (recomendado)
# yarn — alternativa, compatível com npm

# Comandos equivalentes:
npm install    = pnpm install    = yarn
npm run dev    = pnpm dev        = yarn dev
npm add pkg    = pnpm add pkg    = yarn add pkg
npm remove     = pnpm remove     = yarn remove`}
      />

      <h2>4. nvm e fnm: gerenciar versões do Node</h2>
      <CodeBlock
        code={`# fnm (Fast Node Manager) — feito em Rust, rápido
apk add curl
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.profile
fnm install 22          # Node 22 LTS
fnm use 22
node --version

# Alternativa: nvm (mais tradicional)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40/install.sh | bash
nvm install 22
nvm use 22`}
      />

      <h2>5. PM2: gerenciador de processos Node</h2>
      <CodeBlock
        code={`# PM2 mantém seu app rodando, com restart automático
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
pm2 delete meu-app         # remover`}
      />

      <h2>6. Node.js em produção</h2>
      <CodeBlock
        code={`# Boas práticas para produção no Alpine:

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
rc-update add meu-app`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add nodejs npm</code> — instalação</li>
          <li><code>pnpm</code> — gerenciador rápido (instale com npm)</li>
          <li><code>fnm</code> ou <code>nvm</code> — múltiplas versões do Node</li>
          <li><code>pm2</code> — gerenciamento de processos em produção</li>
          <li>OpenRC para serviço persistente</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}