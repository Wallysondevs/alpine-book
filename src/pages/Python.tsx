import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Python() {
  return (
    <PageContainer
      title="Python no Alpine"
      subtitle="Instale Python, venv, pip, gerencie versões e evite armadilhas comuns com wheels e musl."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. Python 3 está no repositório main — instalação básica em 5 segundos.
      </AlertBox>

      <p>
        Python funciona perfeitamente no Alpine, mas tem uma particularidade
        importante: muitos pacotes no PyPI distribuem <em>wheels</em> pré-compilados
        para glibc. No Alpine (musl), eles não funcionam e precisam ser compilados.
        Vamos ver como lidar com isso.
      </p>

      <h2>1. Instalação</h2>
      <CodeBlock
        code={`# Python 3 + pip
apk add python3 py3-pip

# Versão
python3 --version
# Python 3.12.x

# Pacotes extras comuns
apk add python3-dev       # headers (para compilar extensões)
apk add py3-virtualenv    # virtualenv (se preferir ao venv)`}
      />

      <h2>2. venv: ambientes isolados</h2>
      <Terminal
        lines={[
          { type: "cmd", text: "python3 -m venv .venv" },
          { type: "cmd", text: "source .venv/bin/activate" },
          { type: "out", text: "(.venv)" },
          { type: "cmd", text: "pip install fastapi uvicorn" },
          { type: "out", text: "Collecting fastapi..." },
          { type: "out", text: "Installing collected packages: ..." },
          { type: "ok", text: "# Instalado apenas no venv, sem poluir o sistema." },
          { type: "cmd", text: "deactivate" },
        ]}
      />

      <h2>3. O problema wheels + musl</h2>
      <CodeBlock
        code={`# Exemplo: pandas (depende de numpy, que tem extensão C)
pip install pandas
# Se falhar com erro de compilação, instale as dependências:

apk add gcc musl-dev python3-dev

# Agora o pip compila as extensões localmente:
pip install pandas   # ✅ compila com musl

# Para projetos complexos, crie um script de setup:
apk add --no-cache --virtual .build-deps \\
    gcc musl-dev python3-dev \\
    && pip install -r requirements.txt \\
    && apk del .build-deps`}
      />

      <h2>4. pipx: ferramentas Python isoladas</h2>
      <CodeBlock
        code={`# pipx instala apps Python com venvs automáticos
apk add pipx
pipx ensurepath

# Instalar ferramentas globais
pipx install ansible
pipx install poetry
pipx install black
pipx install ruff

# Cada ferramenta ganha seu próprio venv — sem conflitos.
pipx list`}
      />

      <h2>5. Gerenciar versões do Python</h2>
      <CodeBlock
        code={`# Instalar múltiplas versões
apk search python3
# python3 (3.12), python3.11, python3.10

apk add python3.11

# Usar versão específica
python3.11 --version

# pyenv (para versões que não existem no apk)
# ⚠️  pyenv compila Python do zero — precisa de build-base:
apk add build-base readline-dev zlib-dev bzip2-dev \\
    sqlite-dev openssl-dev libffi-dev
curl https://pyenv.run | bash`}
      />

      <h2>6. FastAPI "hello world" no Alpine</h2>
      <CodeBlock
        code={`# Criar app mínimo
mkdir app && cd app
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn

cat > main.py << 'EOF'
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Alpine + FastAPI 🏔️"}
EOF

# Rodar
uvicorn main:app --host 0.0.0.0 --port 8080

# Serviço OpenRC:
# Crie /etc/init.d/myapp e configure para rodar o uvicorn`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add python3 py3-pip python3-dev</code></li>
          <li><code>python3 -m venv .venv</code> — isole cada projeto</li>
          <li><code>gcc musl-dev python3-dev</code> para pacotes com extensão C</li>
          <li><code>pipx install ferramenta</code> — apps Python isolados</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}