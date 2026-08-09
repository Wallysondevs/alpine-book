import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Php() {
  return (
    <PageContainer
      title="PHP-FPM no Alpine"
      subtitle="Instale PHP 8, configure pools FPM, conecte ao Nginx e otimize para produção."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nginx instalado e funcionando (capítulo anterior). PHP 8 está no
        repositório community do Alpine 3.24.
      </AlertBox>

      <p>
        PHP no Alpine é enxuto e rápido. O stack clássico Nginx + PHP-FPM
        funciona perfeitamente — instalação em 2 comandos, configuração
        familiar e performance excelente graças ao musl.
      </p>

      <h2>1. Instalação</h2>
      <CodeBlock
        code={`# PHP 8 + FPM + extensões essenciais
apk add php82 php82-fpm \\
    php82-mysqli php82-pgsql php82-pdo_mysql php82-pdo_pgsql \\
    php82-json php82-mbstring php82-openssl php82-curl \\
    php82-gd php82-xml php82-session php82-tokenizer

# Conferir versão
php82 -v
# PHP 8.2.x (cli)`}
      />

      <h2>2. Configurar PHP-FPM</h2>
      <CodeBlock
        code={`# Config do pool www (padrão)
# /etc/php82/php-fpm.d/www.conf

# Usuário que roda o PHP (deve ser o mesmo do Nginx)
user = nginx
group = nginx

# Socket Unix (mais rápido que TCP, mesma máquina)
listen = /var/run/php-fpm.sock
listen.owner = nginx
listen.group = nginx
listen.mode = 0660

# Processos (ajuste conforme RAM disponível)
pm = dynamic
pm.max_children = 10
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6`}
      />

      <h2>3. Conectar Nginx ao PHP-FPM</h2>
      <CodeBlock
        title="/etc/nginx/http.d/meusite.conf (com PHP)"
        code={`server {
    listen 80;
    server_name meusite.com;
    root /var/www/meusite;
    index index.php index.html;

    # Arquivos PHP → encaminhar para FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}`}
      />

      <h2>4. Iniciar e testar</h2>
      <Terminal
        lines={[
          { type: "cmd", text: "rc-update add php-fpm82" },
          { type: "cmd", text: "rc-service php-fpm82 start" },
          { type: "ok", text: "* Starting php-fpm82 ... [ OK ]" },
          { type: "cmd", text: "echo '<?php phpinfo(); ?>' > /var/www/meusite/info.php" },
          { type: "cmd", text: "curl -s localhost/info.php | head -5" },
          { type: "out", text: "<!DOCTYPE html>..." },
          { type: "ok", text: "# PHP funcionando!" },
        ]}
      />

      <h2>5. Otimizações para produção</h2>
      <CodeBlock
        code={`# /etc/php82/php.ini — ajustes de produção

# Desabilitar funções perigosas
disable_functions = exec,passthru,shell_exec,system,proc_open,popen

# Limitar upload
upload_max_filesize = 10M
post_max_size = 12M

# Performance
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 10000

# Ocultar versão
expose_php = Off

# Log de erros (separado do output)
display_errors = Off
log_errors = On
error_log = /var/log/php82/error.log

# Aplicar:
rc-service php-fpm82 reload`}
      />

      <h2>6. PHP-FPM com múltiplos pools</h2>
      <CodeBlock
        code={`# Para isolar sites: um pool por site
# Copie www.conf para cada site:
cp /etc/php82/php-fpm.d/www.conf /etc/php82/php-fpm.d/site2.conf

# Em cada arquivo, mude:
[site2]                        # nome único
user = nginx
group = nginx
listen = /var/run/php-fpm-site2.sock  # socket único

# No Nginx, aponte para o socket correto:
fastcgi_pass unix:/var/run/php-fpm-site2.sock;`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add php82 php82-fpm ...</code> — instalação</li>
          <li><code>/etc/php82/php-fpm.d/www.conf</code> — pool FPM</li>
          <li><code>fastcgi_pass unix:/var/run/php-fpm.sock</code> — Nginx</li>
          <li><code>opcache.enable=1</code> — performance de produção</li>
          <li>Múltiplos pools para isolar sites</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}