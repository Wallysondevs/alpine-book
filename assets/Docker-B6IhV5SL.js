import{j as e,T as a}from"./index-YFyZeUD9.js";import{P as s,A as r,C as o}from"./AlertBox-C2CyWd7R.js";function d(){return e.jsxs(s,{title:"Docker no Alpine",subtitle:"Instalação, serviço, imagens, volumes, rede e Docker Compose — tudo sem systemd.",difficulty:"intermediario",timeToRead:"22 min",children:[e.jsx(r,{type:"info",title:"Pré-requisitos",children:"Alpine instalado com pelo menos 2 GB de espaço livre. Docker funciona perfeitamente no Alpine — afinal, a imagem oficial alpine é a mais usada no Docker Hub."}),e.jsx("p",{children:"Docker e Alpine são feitos um para o outro. O Alpine é a imagem base mais popular do Docker Hub (~5 MB), e o Docker roda nativamente no Alpine sem systemd — usando o OpenRC para gerenciar o daemon."}),e.jsx("h2",{children:"1. Instalação"}),e.jsx(o,{code:`# Instalar Docker e Docker Compose
apk add docker docker-cli-compose

# Adicionar seu usuário ao grupo docker
addgroup wallyson docker

# Iniciar e habilitar no boot
rc-update add docker boot
rc-service docker start

# Verificar
docker info
docker version

# ⚠️  Re-login necessário para o grupo docker fazer efeito.
#     Ou use: newgrp docker (nesta sessão)`}),e.jsx("h2",{children:"2. Hello World e primeiros containers"}),e.jsx(a,{title:"Primeiro container",lines:[{type:"cmd",text:"docker run hello-world"},{type:"out",text:"Unable to find image 'hello-world:latest' locally"},{type:"out",text:"latest: Pulling from library/hello-world"},{type:"out",text:"Hello from Docker!"},{type:"out",text:"This message shows that your installation is working."},{type:"ok",text:"# Docker funcionando!"}]}),e.jsx(o,{code:`# Container Alpine interativo
docker run -it alpine:latest sh

# Dentro do container:
apk add curl
curl ifconfig.me
exit

# Container em background
docker run -d --name meu-nginx -p 8080:80 nginx:alpine
curl localhost:8080    # deve mostrar HTML do Nginx

# Ver containers
docker ps               # rodando
docker ps -a            # todos (inclui parados)`}),e.jsx("h2",{children:"3. Imagens"}),e.jsx(o,{code:`# Buscar imagens
docker search nginx

# Baixar
docker pull nginx:alpine          # tag alpine (menor)
docker pull nginx:latest          # tag latest (Debian, maior)

# Listar imagens locais
docker images

# Tamanho das imagens
docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}"

# Remover imagens não usadas
docker image prune -a
docker rmi nginx:alpine           # remove uma específica

# Dockerfile mínimo
cat > Dockerfile << 'EOF'
FROM alpine:latest
RUN apk add --no-cache curl
CMD ["curl", "--version"]
EOF
docker build -t meu-curl .
docker run meu-curl`}),e.jsx("h2",{children:"4. Volumes e dados persistentes"}),e.jsx(o,{code:`# Volume nomeado
docker volume create dados
docker run -v dados:/data alpine touch /data/teste

# Bind mount (diretório do host)
docker run -v /home/wallyson/projeto:/app -w /app alpine ls

# Inspecionar volume
docker volume inspect dados
# "Mountpoint": "/var/lib/docker/volumes/dados/_data"

# Backup de volume
docker run --rm -v dados:/origem -v {"$"}(pwd):/destino \\
  alpine tar -czf /destino/backup.tar.gz -C /origem .`}),e.jsx("h2",{children:"5. Redes Docker"}),e.jsx(o,{code:`# Listar redes
docker network ls

# Criar rede personalizada
docker network create minha-rede

# Container na rede personalizada
docker run -d --name db --network minha-rede \\
  -e POSTGRES_PASSWORD=secret postgres:alpine

docker run --rm --network minha-rede alpine \\
  ping db    # resolve pelo nome do container!

# Expor porta para o host
docker run -d -p 8080:80 --name web nginx:alpine
# host:8080 → container:80`}),e.jsx("h2",{children:"6. Docker Compose"}),e.jsx(o,{title:"docker-compose.yml",code:`services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    restart: unless-stopped

  db:
    image: postgres:alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}),e.jsx(o,{code:`# Comandos Compose
docker compose up -d          # inicia em background
docker compose ps              # status dos serviços
docker compose logs -f         # logs em tempo real
docker compose down            # para e remove
docker compose down -v         # remove também volumes
docker compose restart web     # reinicia um serviço`}),e.jsx("h2",{children:"7. Docker sem systemd"}),e.jsx("p",{children:"O Alpine usa OpenRC para gerenciar o daemon Docker — sem systemd. A única diferença prática é o comando de serviço:"}),e.jsx(o,{code:`# Em vez de systemctl:
rc-service docker start
rc-service docker stop
rc-service docker status
rc-update add docker boot

# Logs do daemon
cat /var/log/docker.log    # se configurado
dmesg | grep docker

# cgroups no Alpine
# Docker precisa de cgroups v1 ou v2. O Alpine 3.24 usa cgroups v2.
mount | grep cgroup         # confirme
# cgroup2 on /sys/fs/cgroup type cgroup2`}),e.jsx(r,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add docker docker-cli-compose"})," — instala tudo"]}),e.jsxs("li",{children:[e.jsx("code",{children:"addgroup usuario docker"})," — acesso sem root"]}),e.jsxs("li",{children:[e.jsx("code",{children:"docker run -it alpine sh"})," — container interativo"]}),e.jsxs("li",{children:[e.jsx("code",{children:"docker compose up -d"})," — multi-serviço"]}),e.jsx("li",{children:"Volumes para dados, redes para comunicação entre containers"}),e.jsx("li",{children:"OpenRC gerencia o daemon — sem systemd necessário"})]})})]})}export{d as default};
