import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Nginx() {
  return (
    <PageContainer
      title="Nginx — Servidor Web &amp; Proxy Reverso"
      subtitle="Instale, configure virtual hosts, HTTPS com Let's Encrypt e proxy reverso no Alpine."
      difficulty="intermediario"
      timeToRead="22 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine com rede, DNS apontando para o servidor (se for usar domínio real).
        Portas 80 e 443 liberadas no firewall.
      </AlertBox>

      <p>
        Nginx é o servidor web mais usado do mundo — e roda perfeitamente no
        Alpine. A instalação é um comando. A configuração é o mesmo nginx.conf
        de qualquer distro, mas com o toque Alpine: serviço OpenRC, paths limpos
        e nada de systemd.
      </p>

      <h2>1. Instalação e primeiros passos</h2>
      <Terminal
        title="Instalando e iniciando Nginx"
        lines={[
          { type: "cmd", text: "apk add nginx" },
          { type: "out", text: "OK: 2 MiB em 60 pacotes" },
          { type: "cmd", text: "rc-update add nginx" },
          { type: "cmd", text: "rc-service nginx start" },
          { type: "ok", text: "* Starting nginx ... [ OK ]" },
          { type: "cmd", text: "curl localhost" },
          { type: "out", text: "<html><body><h1>Welcome to nginx!</h1></body></html>" },
        ]}
      />

      <h2>2. Estrutura de diretórios</h2>
      <CodeBlock
        code={`# Configuração principal
/etc/nginx/nginx.conf

# Virtual hosts (sites)
/etc/nginx/http.d/         ← coloque seus .conf aqui

# Raiz padrão
/var/www/localhost/htdocs/   ← index.html vai aqui

# Logs
/var/log/nginx/access.log
/var/log/nginx/error.log`}
      />

      <h2>3. Virtual host básico</h2>
      <CodeBlock
        title="/etc/nginx/http.d/meusite.conf"
        code={`server {
    listen 80;
    server_name meusite.com www.meusite.com;

    root /var/www/meusite;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Logs separados por site
    access_log /var/log/nginx/meusite-access.log;
    error_log  /var/log/nginx/meusite-error.log;
}`}
      />

      <Terminal
        title="Aplicando e testando config"
        lines={[
          { type: "cmd", text: "mkdir -p /var/www/meusite" },
          { type: "cmd", text: "echo 'Hello from Alpine Nginx!' > /var/www/meusite/index.html" },
          { type: "cmd", text: "nginx -t" },
          { type: "out", text: "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok" },
          { type: "out", text: "nginx: configuration file /etc/nginx/nginx.conf test is successful" },
          { type: "cmd", text: "rc-service nginx reload" },
          { type: "ok", text: "# Recarregou sem derrubar conexões ativas." },
        ]}
      />

      <h2>4. HTTPS com Let's Encrypt (acme.sh)</h2>
      <CodeBlock
        code={`# Instalar acme.sh (mais leve que certbot, perfeito para Alpine)
apk add curl openssl
curl https://get.acme.sh | sh

# Emitir certificado (método webroot)
acme.sh --issue -d meusite.com -d www.meusite.com \\
  -w /var/www/meusite

# Instalar certificado
mkdir -p /etc/nginx/ssl
acme.sh --install-cert -d meusite.com \\
  --key-file       /etc/nginx/ssl/meusite.key \\
  --fullchain-file /etc/nginx/ssl/meusite.crt \\
  --reloadcmd      "rc-service nginx reload"`}
      />

      <CodeBlock
        title="Virtual host com HTTPS"
        code={`server {
    listen 443 ssl http2;
    server_name meusite.com;

    ssl_certificate     /etc/nginx/ssl/meusite.crt;
    ssl_certificate_key /etc/nginx/ssl/meusite.key;

    root /var/www/meusite;
    index index.html;
}

# Redirecionar HTTP → HTTPS
server {
    listen 80;
    server_name meusite.com;
    return 301 https://$host$request_uri;
}`}
      />

      <h2>5. Proxy reverso</h2>
      <CodeBlock
        title="Nginx como proxy para app Node/Python/Go na porta 3000"
        code={`server {
    listen 80;
    server_name api.meusite.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}
      />

      <h2>6. Rate limiting e segurança</h2>
      <CodeBlock
        code={`# Rate limit: 10 requisições/segundo por IP
http {
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

    server {
        location /login/ {
            limit_req zone=mylimit burst=20 nodelay;
        }
    }
}

# Ocultar versão do Nginx
http {
    server_tokens off;
}

# Timeout para conexões lentas
http {
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
}`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add nginx && rc-update add nginx</code> — instalação</li>
          <li><code>/etc/nginx/http.d/*.conf</code> — virtual hosts</li>
          <li><code>nginx -t && rc-service nginx reload</code> — testar e aplicar</li>
          <li>acme.sh para HTTPS com Let's Encrypt</li>
          <li><code>proxy_pass</code> para proxy reverso de apps backend</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}