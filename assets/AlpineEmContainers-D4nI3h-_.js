import{j as e}from"./index-YFyZeUD9.js";import{P as i,A as o,C as a}from"./AlertBox-C2CyWd7R.js";function l(){return e.jsxs(i,{title:"Alpine como Imagem Base",subtitle:"Por que alpine:3.x é a base favorita, Dockerfiles eficientes, musl vs glibc e melhores práticas.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Conceitos básicos de Docker (Dockerfile, build, run). O capítulo anterior cobre o essencial."}),e.jsxs("p",{children:["A imagem ",e.jsx("code",{children:"alpine"})," é a mais baixada do Docker Hub — com razão. Uma imagem base de ~5 MB que contém um Linux funcional com gerenciador de pacotes. Mas usar Alpine como base tem truques que evitam dores de cabeça."]}),e.jsx("h2",{children:"1. Por que Alpine?"}),e.jsx(a,{code:`# Comparação de tamanhos (aproximado):
alpine:3.24        ~5 MB     ← a menor Linux funcional
debian:bookworm-slim  ~75 MB
ubuntu:24.04           ~80 MB
node:22-alpine         ~120 MB   (Node.js + Alpine)
node:22-slim           ~250 MB   (Node.js + Debian slim)

# Vantagens:
# - Menor = download mais rápido, menos superfície de ataque
# - apk é incrivelmente rápido (instalação em ms)
# - musl + BusyBox = runtime mínimo`}),e.jsx("h2",{children:"2. FROM alpine: o Dockerfile canônico"}),e.jsx(a,{title:"Dockerfile eficiente com Alpine",code:`FROM alpine:3.24

# Metadados (opcional, boa prática)
LABEL maintainer="wallyson@email.com"

# Instalar dependências em UMA camada
RUN apk add --no-cache \\
    python3 \\
    py3-pip \\
    curl

# --no-cache evita armazenar o cache do apk na imagem

# Criar usuário não-root (segurança)
RUN adduser -D appuser
USER appuser
WORKDIR /home/appuser

# Copiar aplicação
COPY --chown=appuser:appuser app/ .

# Expor porta
EXPOSE 8080

# Comando
CMD ["python3", "main.py"]`}),e.jsx("h2",{children:"3. apk add --no-cache e --virtual"}),e.jsx(a,{code:`# --no-cache: não guarda cache do apk na imagem
# Use SEMPRE em Dockerfiles. Reduz a imagem final.
apk add --no-cache nginx

# --virtual: dependências de build que você remove depois
FROM alpine:3.24
RUN apk add --no-cache --virtual .build-deps \\
    gcc musl-dev make \\
    && make \\
    && apk del .build-deps
# A imagem final NÃO tem gcc, musl-dev, make — só o binário compilado.

# --no-progress: suprime barras de progresso (logs mais limpos)
apk add --no-cache --no-progress curl`}),e.jsx("h2",{children:"4. musl vs glibc: o elefante na sala"}),e.jsx("p",{children:"A maior fonte de problemas com Alpine em containers é a diferença entre musl e glibc:"}),e.jsx(a,{code:`# Problema 1: Python wheels pré-compilados (glibc)
# Muitos pacotes Python no PyPI têm wheels para glibc, não musl.
# Solução: instalar dependências de compilação
FROM alpine:3.24
RUN apk add --no-cache --virtual .build-deps \\
    gcc musl-dev python3-dev \\
    && pip install pandas numpy \\
    && apk del .build-deps
# Agora o pip COMPILA as extensões, em vez de usar wheels glibc.

# Problema 2: Binários pré-compilados
# Binários Linux compilados para glibc NÃO rodam no Alpine.
# Solução: busque binários estáticos ou compile no Alpine.

# Problema 3: DNS em containers Alpine
# musl faz consultas DNS diferentes da glibc.
# Se tiver problemas com DNS, use:
# RUN echo "hosts: files dns" > /etc/nsswitch.conf`}),e.jsx("h2",{children:"5. Multi-stage builds com Alpine"}),e.jsx(a,{code:`# Exemplo: aplicação Go
# Stage 1: build
FROM golang:alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /app/server .

# Stage 2: runtime (só o binário)
FROM alpine:3.24
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/server /usr/local/bin/server
USER 1000
EXPOSE 8080
CMD ["server"]

# Resultado: imagem final de ~10 MB (só Alpine + binário Go)`}),e.jsx("h2",{children:"6. Tags e versões"}),e.jsx(a,{code:`# SEMPRE use uma tag específica — nunca :latest
FROM alpine:3.24          # ✅ versão fixa
FROM alpine:3              # ✅ aponta para 3.24 (hoje)
FROM alpine:latest         # ❌ muda a cada release
FROM alpine:edge           # ⚠️  rolling, pode quebrar

# Conferir versão dentro do container
docker run alpine:3.24 cat /etc/alpine-release
# 3.24.0`}),e.jsx("h2",{children:"7. Checklist de Dockerfile Alpine"}),e.jsx(a,{code:`# ✅ Melhores práticas:
[ ] FROM alpine:3.24 (versão fixa)
[ ] apk add --no-cache (sem cache na imagem)
[ ] --virtual .build-deps (remove após build)
[ ] adduser -D (não rode como root)
[ ] COPY --chown (arquivos com dono correto)
[ ] HEALTHCHECK (saúde do container)
[ ] Multi-stage para linguagens compiladas

# Exemplo completo com HEALTHCHECK:
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost:8080/health || exit 1`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:"Alpine como base: imagens 10-20x menores que Debian/Ubuntu"}),e.jsxs("li",{children:[e.jsx("code",{children:"apk add --no-cache"})," sempre em Dockerfiles"]}),e.jsxs("li",{children:[e.jsx("code",{children:"--virtual .build-deps"})," para dependências temporárias"]}),e.jsx("li",{children:"musl ≠ glibc: compile, não use binários pré-compilados para glibc"}),e.jsx("li",{children:"Multi-stage builds: compile em Alpine, entregue só o binário"}),e.jsxs("li",{children:["Sempre fixe a versão: ",e.jsx("code",{children:"FROM alpine:3.24"})]})]})})]})}export{l as default};
