import{j as e,T as i}from"./index-YFyZeUD9.js";import{P as t,A as s,C as a}from"./AlertBox-C2CyWd7R.js";function o(){return e.jsxs(t,{title:"Python no Alpine",subtitle:"Instale Python, venv, pip, gerencie versões e evite armadilhas comuns com wheels e musl.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx(s,{type:"info",title:"Pré-requisitos",children:"Nenhum. Python 3 está no repositório main — instalação básica em 5 segundos."}),e.jsxs("p",{children:["Python funciona perfeitamente no Alpine, mas tem uma particularidade importante: muitos pacotes no PyPI distribuem ",e.jsx("em",{children:"wheels"})," pré-compilados para glibc. No Alpine (musl), eles não funcionam e precisam ser compilados. Vamos ver como lidar com isso."]}),e.jsx("h2",{children:"1. Instalação"}),e.jsx(a,{code:`# Python 3 + pip
apk add python3 py3-pip

# Versão
python3 --version
# Python 3.12.x

# Pacotes extras comuns
apk add python3-dev       # headers (para compilar extensões)
apk add py3-virtualenv    # virtualenv (se preferir ao venv)`}),e.jsx("h2",{children:"2. venv: ambientes isolados"}),e.jsx(i,{lines:[{type:"cmd",text:"python3 -m venv .venv"},{type:"cmd",text:"source .venv/bin/activate"},{type:"out",text:"(.venv)"},{type:"cmd",text:"pip install fastapi uvicorn"},{type:"out",text:"Collecting fastapi..."},{type:"out",text:"Installing collected packages: ..."},{type:"ok",text:"# Instalado apenas no venv, sem poluir o sistema."},{type:"cmd",text:"deactivate"}]}),e.jsx("h2",{children:"3. O problema wheels + musl"}),e.jsx(a,{code:`# Exemplo: pandas (depende de numpy, que tem extensão C)
pip install pandas
# Se falhar com erro de compilação, instale as dependências:

apk add gcc musl-dev python3-dev

# Agora o pip compila as extensões localmente:
pip install pandas   # ✅ compila com musl

# Para projetos complexos, crie um script de setup:
apk add --no-cache --virtual .build-deps \\
    gcc musl-dev python3-dev \\
    && pip install -r requirements.txt \\
    && apk del .build-deps`}),e.jsx("h2",{children:"4. pipx: ferramentas Python isoladas"}),e.jsx(a,{code:`# pipx instala apps Python com venvs automáticos
apk add pipx
pipx ensurepath

# Instalar ferramentas globais
pipx install ansible
pipx install poetry
pipx install black
pipx install ruff

# Cada ferramenta ganha seu próprio venv — sem conflitos.
pipx list`}),e.jsx("h2",{children:"5. Gerenciar versões do Python"}),e.jsx(a,{code:`# Instalar múltiplas versões
apk search python3
# python3 (3.12), python3.11, python3.10

apk add python3.11

# Usar versão específica
python3.11 --version

# pyenv (para versões que não existem no apk)
# ⚠️  pyenv compila Python do zero — precisa de build-base:
apk add build-base readline-dev zlib-dev bzip2-dev \\
    sqlite-dev openssl-dev libffi-dev
curl https://pyenv.run | bash`}),e.jsx("h2",{children:'6. FastAPI "hello world" no Alpine'}),e.jsx(a,{code:`# Criar app mínimo
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
# Crie /etc/init.d/myapp e configure para rodar o uvicorn`}),e.jsx(s,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:e.jsx("code",{children:"apk add python3 py3-pip python3-dev"})}),e.jsxs("li",{children:[e.jsx("code",{children:"python3 -m venv .venv"})," — isole cada projeto"]}),e.jsxs("li",{children:[e.jsx("code",{children:"gcc musl-dev python3-dev"})," para pacotes com extensão C"]}),e.jsxs("li",{children:[e.jsx("code",{children:"pipx install ferramenta"})," — apps Python isolados"]})]})})]})}export{o as default};
