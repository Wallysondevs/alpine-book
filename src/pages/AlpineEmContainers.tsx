import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function AlpineEmContainers() {
  return (
    <PageContainer
      title="Alpine como Imagem Base"
      subtitle="Por que alpine:3.x é a base favorita, Dockerfiles eficientes, musl vs glibc e melhores práticas."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Conceitos básicos de Docker (Dockerfile, build, run). O capítulo
        anterior cobre o essencial.
      </AlertBox>

      <p>
        A imagem <code>alpine</code> é a mais baixada do Docker Hub — com razão.
        Uma imagem base de ~5 MB que contém um Linux funcional com gerenciador
        de pacotes. Mas usar Alpine como base tem truques que evitam dores de
        cabeça.
      </p>

      <h2>1. Por que Alpine?</h2>
      <CodeBlock
        code={`# Comparação de tamanhos (aproximado):
alpine:3.24        ~5 MB     ← a menor Linux funcional
debian:bookworm-slim  ~75 MB
ubuntu:24.04           ~80 MB
node:22-alpine         ~120 MB   (Node.js + Alpine)
node:22-slim           ~250 MB   (Node.js + Debian slim)

# Vantagens:
# - Menor = download mais rápido, menos superfície de ataque
# - apk é incrivelmente rápido (instalação em ms)
# - musl + BusyBox = runtime mínimo`}
      />

      <h2>2. FROM alpine: o Dockerfile canônico</h2>
      <CodeBlock
        title="Dockerfile eficiente com Alpine"
        code={`FROM alpine:3.24

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
CMD ["python3", "main.py"]`}
      />

      <h2>3. apk add --no-cache e --virtual</h2>
      <CodeBlock
        code={`# --no-cache: não guarda cache do apk na imagem
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
apk add --no-cache --no-progress curl`}
      />

      <h2>4. musl vs glibc: o elefante na sala</h2>
      <p>
        A maior fonte de problemas com Alpine em containers é a diferença entre
        musl e glibc:
      </p>
      <CodeBlock
        code={`# Problema 1: Python wheels pré-compilados (glibc)
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
# RUN echo "hosts: files dns" > /etc/nsswitch.conf`}
      />

      <h2>5. Multi-stage builds com Alpine</h2>
      <CodeBlock
        code={`# Exemplo: aplicação Go
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

# Resultado: imagem final de ~10 MB (só Alpine + binário Go)`}
      />

      <h2>6. Tags e versões</h2>
      <CodeBlock
        code={`# SEMPRE use uma tag específica — nunca :latest
FROM alpine:3.24          # ✅ versão fixa
FROM alpine:3              # ✅ aponta para 3.24 (hoje)
FROM alpine:latest         # ❌ muda a cada release
FROM alpine:edge           # ⚠️  rolling, pode quebrar

# Conferir versão dentro do container
docker run alpine:3.24 cat /etc/alpine-release
# 3.24.0`}
      />

      <h2>7. Checklist de Dockerfile Alpine</h2>
      <CodeBlock
        code={`# ✅ Melhores práticas:
[ ] FROM alpine:3.24 (versão fixa)
[ ] apk add --no-cache (sem cache na imagem)
[ ] --virtual .build-deps (remove após build)
[ ] adduser -D (não rode como root)
[ ] COPY --chown (arquivos com dono correto)
[ ] HEALTHCHECK (saúde do container)
[ ] Multi-stage para linguagens compiladas

# Exemplo completo com HEALTHCHECK:
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost:8080/health || exit 1`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>Alpine como base: imagens 10-20x menores que Debian/Ubuntu</li>
          <li><code>apk add --no-cache</code> sempre em Dockerfiles</li>
          <li><code>--virtual .build-deps</code> para dependências temporárias</li>
          <li>musl ≠ glibc: compile, não use binários pré-compilados para glibc</li>
          <li>Multi-stage builds: compile em Alpine, entregue só o binário</li>
          <li>Sempre fixe a versão: <code>FROM alpine:3.24</code></li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}