# SPEC — alpine-book ("Curso de Alpine Linux 3.24 — do zero ao domínio")

Este documento é a fonte de verdade para construir o alpine-book, um curso
interativo em pt-BR baseado no ubuntu-book (mesmo framework: React 19 + Vite 7 +
Tailwind 4 + wouter + componentes próprios).

## 1. Visão geral

- SPA com hash-routing (`useHashLocation`), capítulos lazy-loaded em `src/pages/`.
- `src/lib/course.ts` define MODULES (espelha a Sidebar): trilha, anterior/próxima, progresso.
- `src/lib/levels.ts` mapeia rota → nível (`iniciante | intermediario | avancado`).
- Progresso salvo em localStorage com chave **`alpine-curso-progresso`**.
- Idioma: **pt-BR**, tom didático e direto (como o ubuntu-book).

## 2. Branding (substitui Ubuntu)

- Título do site: **"Curso de Alpine Linux 3.24 — do zero ao domínio"**
- Subtítulo/hero: curso completo do Alpine Linux — a distro minimalista,
  segura e ultraleve por trás de milhões de containers.
- Cor primária: azul Alpine `#0D597F` (dark) / hover `#1176A6`; acento claro `#69B1E8`.
  Ajustar tokens `--primary` etc. em `src/index.css` (tema dark-first como o original).
- Logo: criar `src/components/ui/AlpineLogo.tsx` (SVG: montanha/estilização do
  logo do Alpine — dois picos em azul sobre fundo `#0D597F` em círculo).
  Substituir TODOS os usos de `UbuntuLogo` (Sidebar, Header, Home) e apagar `UbuntuLogo.tsx`.
- `index.html`: título, meta description, favicon; remover referência a opengraph.jpg.
- `public/favicon.svg`: montanha azul Alpine.
- Terminal demo da Home: usar `apk upgrade` / saída típica do apk (não apt).
- NOVIDADES da Home: fatos do Alpine 3.24 (jun/2026): COSMIC desktop no community,
  instalador aprimorado, kernel Linux 6.x LTS, musl 1.2.x, BusyBox 1.37, OpenRC 0.6x,
  apk com suporte a repositórios com zstd, etc. (6 cards, estilo das do ubuntu-book).
- README.md: reescrever para o alpine-book.

## 3. API de componentes (USAR EXATAMENTE ASSIM)

```tsx
import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function NomePagina() {
  return (
    <PageContainer
      title="Título do capítulo"
      subtitle="Uma ou duas frases explicando o capítulo."
      difficulty="iniciante"           // iniciante | intermediario | avancado
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisitos"> ... texto com <code>...</code> ... </AlertBox>
      <h2>Seção numerada</h2>
      <p>Texto explicativo com <strong>destaques</strong> e <code>comandos inline</code>.</p>
      <CodeBlock title="Título do bloco" code={`# comandos com MUITOS comentários
sudo apk add nginx`} />
      <p>Na prática:</p>
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "doas apk add nginx" },
          { type: "out", text: "fetch https://dl-cdn.alpinelinux.org/alpine/v3.24/main/x86_64/APKINDEX.tar.gz" },
          { type: "ok", text: "OK: 42 MiB in 120 packages" },
          { type: "err", text: "ERROR: unable to select packages:" },
          { type: "warn", text: "-> dica de como resolver" },
          { type: "comment", text: "# comentário explicativo" },
        ]}
      />
    </PageContainer>
  );
}
```

- `AlertBox type`: `info | warning | danger | success`.
- `Terminal` line types: `cmd | out | ok | err | warn | comment`.
- Prompt padrão dos terminais: `wallyson@alpine: ~` (root: `alpine:~#` quando aula usar root).
- `CodeBlock` aceita `language`, `title`, `user/host/cwd`; bash é o padrão.
- Página de exemplo completa: **`docs/EXEMPLO-PAGINA.tsx`** (é a página APT do
  ubuntu-book, preservada só como referência de estilo — NÃO importar).

## 4. Guia de estilo de conteúdo

1. Cada página: 180–350 linhas TSX. Estrutura: AlertBox de pré-requisitos →
   introdução em `<p>` → 4 a 8 seções `<h2>` numeradas → intercalar
   `<p>` explicativo + `CodeBlock` comentado + `Terminal` com saída realista
   (incluindo 1 erro comum e como resolver) → `AlertBox` de avisos onde fizer sentido.
2. TODO comando em CodeBlock vem com comentário explicando flags (mesmo padrão do exemplo).
3. Alpine é BusyBox por padrão: quando um comando difere do GNU (find, ps, top,
   tar, gzip...), citar a diferença ou o pacote equivalente (procps, findutils,
   coreutils, grep, sed, gawk, tar, gzip, shadow, util-linux...).
4. Alpine usa **doas** em vez de sudo por padrão (sudo é instalável). Usar `doas`
   nos exemplos, com nota na primeira ocorrência (página Usuarios).
5. Comandos de pacotes: `apk add|del|search|info|fix|upgrade`, cache em
   `/var/cache/apk`, repositórios em `/etc/apk/repositories`.
6. Serviços: OpenRC (`rc-service X start|stop|restart`, `rc-update add X default`,
   `rc-status`), NUNCA systemctl.
7. Rede: `/etc/network/interfaces` + `ifup/ifdown` (nada de netplan/NetworkManager
   por padrão); firewall `awall`.
8. Exemplos de saída de terminal em pt-BR quando o Ubuntu traduziria, mas saída
   real de ferramentas (apk, OpenRC) é em inglês — manter inglês nessas saídas.
9. Dificuldade e timeToRead: seguir a tabela de páginas (seção 5).
10. Nada de conteúdo Ubuntu/Canonical/snap/PPA — tudo Alpine.
11. `<h2>` em português, diretos ("1. Instalando pacotes").

## 5. Tabela de páginas (63)

Formato: arquivo | rota | label (sidebar/curso) | nível | tempo | tópicos obrigatórios.

### Módulo: Introdução
- `Historia.tsx` | /historia | História do Alpine Linux | iniciante | 12 min |
  origem LEAF (2005), Natanael Copa, fork por segurança/simplicidade, marcos
  (1.0 em 2007, 2.x, 3.x), adoção massiva em containers/Docker, governança hoje.
- `Filosofia.tsx` | /filosofia | Filosofia: simples, seguro, leve | iniciante | 12 min |
  simplicidade, segurança como padrão, tamanho mínimo (instalação ~150MB, container ~5MB),
  "small enough to run from RAM", comparação de tamanho vs Ubuntu/Debian, casos de uso.
- `MuslBusyBox.tsx` | /musl-busybox | musl libc & BusyBox | iniciante | 18 min |
  o que é libc, glibc vs musl (licença MIT, tamanho, correção/standards), o que é
  BusyBox ("canivete suíço": 300+ applets num binário), implicações práticas
  (flags diferentes, sem --help longo, applets), `busybox --list`, compatibilidade.

### Módulo: Instalação & Setup
- `Instalacao.tsx` | /instalacao | Guia de Instalação | iniciante | 25 min |
  ISOs (standard, extended, virt, netboot), baixar/verificar checksum, boot em VM,
  login root sem senha no live, `setup-alpine` passo a passo (teclado, hostname,
  interface, wifi?, timezone, proxy, mirror, sshd, disco: sys/diskless/data),
  particionamento (setup-disk), reboot, instalação em VPS/cloud (genéricamente).
- `PrimeirosPassos.tsx` | /primeiros-passos | Primeiros Passos | iniciante | 18 min |
  login, criar usuário (`adduser`), habilitar doas/sudo, `apk update && apk upgrade`,
  habilitar comunidade em `/etc/apk/repositories` (`setup-apkrepos`), hostname,
  SSH básico, `rc-service` visão rápida.
- `Localizacao.tsx` | /localizacao | Teclado & Timezone | iniciante | 10 min |
  `setup-keymap`, `/etc/conf.d/keymaps`, timezone com `tzdata` e
  `/etc/localtime` (setup-timezone), date/hwclock, locale (musl não usa glibc
  locales por padrão; LANG=C, pacote musl-locales).

### Módulo: Gerenciamento de Pacotes
- `Apk.tsx` | /apk | apk (Completo) | iniciante | 25 min |
  filosofia do apk (rápido, estático, simples), add/del/search/info/upgrade/fix,
  `apk update` vs `apk upgrade`, cache (`/var/cache/apk`, `apk cache clean`),
  `apk info -L/-R/-W/-s`, `apk search -v`, world (`/etc/apk/world`),
  version pinning (`apk add pkg=1.2.3-r0`), hold (`apk fix`, `apk add --no-scripts`?),
  erros comuns (NOT FOUND, conflicts, bad signature).
- `Repositorios.tsx` | /repositorios | Repositórios & Branches | intermediario | 18 min |
  `/etc/apk/repositories`, main vs community vs testing, v3.24 vs edge,
  `setup-apkrepos`, adicionar community/testing com cuidado, mirrors
  (`setup-apkcache`, dl-cdn), assinaturas (apk verify, alpine-devel keys em
  /etc/apk/keys), riscos de misturar branches.
- `BinariosTerceiros.tsx` | /binarios-terceiros | Software fora dos repositórios | intermediario | 15 min |
  binários estáticos (musl!), instalar binários pré-compilados (cuidado com glibc),
  pip/cargo/npm/go install, compilar localmente (build-base), Flatpak NÃO existe
  oficialmente; alternativas; onde achar software (pkgs.alpinelinux.org).
- `Abuild.tsx` | /abuild | Criando pacotes (aports & abuild) | avancado | 25 min |
  estrutura do aports, APKBUILD (pkgname/pkgver/source/build/package), `abuild-keygen`,
  `newapkbuild`, `abuild -r`, repo local (`apk add -X repo`), subpackages,
  enviar MR para o aports (visão geral).

### Módulo: Sistema de Arquivos
- `SistemaArquivos.tsx` | /sistema-arquivos | Hierarquia & BusyBox | iniciante | 15 min |
  FHS adaptado, /bin /sbin symlink para usr/bin (usrmerge no Alpine), /etc,
  /var, /tmp (tmpfs), overlay em diskless, onde ficam configs (`/etc/conf.d`),
  `apk audit` (arquivos modificados!), diferenças vs Debian.
- `Navegacao.tsx` | /navegacao | Navegação | iniciante | 12 min |
  pwd/cd/ls (flags BusyBox), find/busybox find vs findutils, which/whereis,
  caminhos absolutos/relativos, ~, -, estrutura de diretórios na prática.
- `ManipulacaoArquivos.tsx` | /manipulacao-arquivos | Manipulação | iniciante | 15 min |
  cp/mv/rm/mkdir/touch/ln (hard vs soft), diferenças BusyBox vs GNU,
  `apk add coreutils` quando precisar de flags GNU.
- `Visualizacao.tsx` | /visualizacao | Visualização | iniciante | 12 min |
  cat/head/tail (-f)/less/more/grep (busybox grep vs pacote grep), strings,
  file (pacote), hexdump.
- `Permissoes.tsx` | /permissoes | Permissões | intermediario | 18 min |
  rwx, chown/chmod/chgrp, umask, suid/sgid/sticky, ACLs (pacote acl),
  `apk audit` para verificar integridade, usuários de sistema no Alpine.
- `Disco.tsx` | /disco | Discos e Partições | iniciante | 18 min |
  lsblk, df/du (busybox), fdisk/sfdisk/cfdisk (pacotes), partições MBR/GPT,
  mkfs.ext4/xfs/btrfs, mount/umount manual, montagem no boot (fstab), UUIDs (blkid).
- `Fstab.tsx` | /fstab | fstab (Montagem Automática) | intermediario | 15 min |
  /etc/fstab no Alpine, opções (noatime, ro), UUID, mount -a, erros comuns,
  swap em arquivo/partição (swapon, /etc/conf.d/swap?).
- `Compressao.tsx` | /compressao | Compressão | iniciante | 12 min |
  busybox gzip/bzip2/xz/zstd (pacotes), tar busybox vs tar GNU, .tar.gz/.tar.xz,
  zip/unzip (pacotes), exemplos de backup rápido.
- `LVM.tsx` | /lvm | LVM Avançado | avancado | 20 min |
  lvm2 no Alpine, pvcreate/vgcreate/lvcreate, mkfs, montar, estender,
  nota: initramfs features do Alpine (mkinitfs com lvm feature).

### Módulo: Init & Boot
- `OpenRC.tsx` | /openrc | OpenRC (Serviços) | intermediario | 25 min |
  filosofia OpenRC vs systemd, rc-service/rc-update/rc-status, runlevels
  (boot, default, shutdown, sysinit), /etc/init.d scripts (depend use/net),
  /etc/conf.d, habilitar serviço no boot, logs de serviço, cgroups? (visão),
  exemplos: sshd, crond, networking, local.
- `Boot.tsx` | /boot | Boot & Bootloader | avancado | 20 min |
  sequência de boot no Alpine (kernel + initramfs mkinitfs), bootloader
  (GRUB em BIOS/UEFI, syslinux/extlinux em diskless/virt), /etc/mkinitfs/mkinitfs.conf
  (features), update-kernel, kernel-lts vs kernel, parâmetros de kernel,
  console de emergência.
- `Logs.tsx` | /logs | Logs (syslog) | intermediario | 15 min |
  SEM journald: busybox syslogd por padrão, /var/log/messages, syslog-ng
  (pacote, rotação com logrotate), logs do OpenRC (`rc-service X log`? /var/log/),
  dmesg, como centralizar/rotacionar.
- `Hardware.tsx` | /hardware | Informações de Hardware | iniciante | 12 min |
  lspci/lsusb (pciutils/usbutils), dmesg, /proc, /sys, free, uptime,
  detectando disco/rede, módulos de kernel (modprobe/modinfo, /etc/mkinitfs/features).

### Módulo: Administração do Sistema
- `Usuarios.tsx` | /usuarios | Usuários, Grupos & doas | intermediario | 20 min |
  adduser/addgroup BusyBox vs shadow (apk add shadow para useradd), /etc/passwd,
  **doas** (padrão no Alpine): /etc/doas.d/doas.conf, `permit persist`, instalar
  sudo como alternativa, su, wheel, boas práticas.
- `Processos.tsx` | /processos | Processos | iniciante | 15 min |
  ps BusyBox vs procps (`apk add procps`), top/htop, kill/pkill, nice,
  sinais, /proc/PID, nohup/&, background jobs no ash.
- `Monitoracao.tsx` | /monitoracao | Monitoramento | intermediario | 15 min |
  free, vmstat, iostat (pacote sysstat? verificar: sysstat existe no community),
  top/htop/btop, df/du, nethogs/iftop?, monitoramento leve para Alpine (netdata?).
- `Cron.tsx` | /cron | Cron (Agendamento) | intermediario | 15 min |
  busybox crond vs cronie (pacote), rc-update add crond, crontab -e,
  /etc/periodic/ (hourly daily weekly monthly — estilo Alpine!), anacron? não,
  exemplos de jobs, logs do cron.

### Módulo: Terminal & Shell
- `ShellAsh.tsx` | /shell-ash | Shell BusyBox (ash) | iniciante | 18 min |
  ash é o shell padrão (não bash!), diferenças vs bash (sem arrays associativos,
  sem [[ ]] em parte, PS1), history? (busybox ash tem history limitado),
  `/etc/profile`, `~/.profile`, instalar bash/zsh e trocar shell padrão (chsh + shadow).
- `BashZsh.tsx` | /bash-zsh | Bash & Zsh | iniciante | 12 min |
  `apk add bash zsh`, chsh -s, .bashrc/.zshrc no Alpine, oh-my-zsh (git clone),
  completions (bash-completion, zsh-completions).
- `VariaveisAmbiente.tsx` | /variaveis-ambiente | Variáveis de Ambiente | iniciante | 12 min |
  export, PATH, env, /etc/profile, /etc/profile.d/, ~/.profile, env no OpenRC
  (/etc/conf.d), variáveis comuns.
- `Aliases.tsx` | /aliases | Aliases e Funções | iniciante | 10 min |
  alias/unalias, funções no ash/bash, onde definir (~/.profile), exemplos úteis.
- `ManPages.tsx` | /man-pages | Documentação (man) | iniciante | 10 min |
  man NÃO vem por padrão! `apk add man-pages mandoc-apropos`, man/whatis/apropos,
  --help, wiki.alpinelinux.org, docs dos pacotes (`apk info -d`).
- `Redirecionamento.tsx` | /redirecionamento | Redirecionamento | intermediario | 15 min |
  >, >>, 2>, &>, pipe, tee, xargs (busybox), /dev/null, here-docs no ash.
- `Scripts.tsx` | /scripts | Scripts de Shell | intermediario | 20 min |
  shebang `#!/bin/sh` no Alpine (ash), variáveis, if/for/while POSIX,
  case, funções, set -eu, exemplos reais (backup, healthcheck de serviço),
  diferenças bash-only que quebram no ash.
- `Avancado.tsx` | /avancado | Comandos Avançados | avancado | 25 min |
  sed/awk/grep GNU (apk add sed gawk grep), xargs avançado, cut/sort/uniq,
  one-liners poderosos, diff/patch, screen/tmux (pacotes).

### Módulo: Redes
- `Redes.tsx` | /redes | Fundamentos de Rede | intermediario | 18 min |
  ip (busybox iproute2 parcial vs pacote iproute2), ifconfig (net-tools),
  ss/netstat, ping/traceroute, conceitos (IP/máscara/gateway/DNS), hostname.
- `Interfaces.tsx` | /interfaces | Config de Rede (interfaces) | intermediario | 20 min |
  /etc/network/interfaces no Alpine (formato), dhcp vs estático, ifup/ifdown,
  `rc-service networking restart`, bonding/bridging/vlan (sub-receitas no interfaces),
  wifi com wpa_supplicant, resolv.conf, resolvconf.
- `Awall.tsx` | /awall | Firewall (awall) | intermediario | 20 min |
  awall (Alpine Wall): conceitos, /etc/awall/optional, `awall enable web ssh`,
  `awall translate`, iptables/nftables por baixo, abrir portas, exemplo servidor web.
- `Ssh.tsx` | /ssh | SSH | intermediario | 20 min |
  openssh-server: setup-sshd no setup-alpine, rc-update add sshd, chaves
  (ssh-keygen, authorized_keys), hardening (PasswordAuthentication no, porta),
  scp/rsync over ssh, ssh config.
- `Dns.tsx` | /dns | DNS | intermediario | 15 min |
  /etc/resolv.conf, resolvconf, dig/nslookup (bind-tools), host, dnsmasq
  como cache local, unbound (resolver completo no Alpine), testando DNS.
- `Vpn.tsx` | /vpn | VPN (WireGuard) | intermediario | 20 min |
  wireguard-tools no Alpine, wg-quick (pacote), módulo de kernel,
  /etc/wireguard/wg0.conf, OpenRC service wg-quick, exemplo ponto-a-ponto,
  nota sobre openvpn (pacote).

### Módulo: Containers & Virtualização
- `Docker.tsx` | /docker | Docker | intermediario | 22 min |
  `apk add docker docker-cli-compose`, grupo docker? (addgroup user docker),
  rc-update add docker, cgroups no Alpine, hello-world, imagens, volumes,
  rede, compose (docker-cli-compose plugin), docker sem systemd.
- `AlpineEmContainers.tsx` | /alpine-em-containers | Alpine como imagem base | intermediario | 20 min |
  por que alpine:3.x é a base favorita (~5-8MB), FROM alpine em Dockerfile,
  apk add dentro do container, musl vs glibc em imagens (problemas com wheels
  Python, binários pré-compilados), multi-stage builds, -slim vs alpine,
  versões (3.24, edge), melhores práticas (no-cache, --no-progress).
- `Kvm.tsx` | /kvm | KVM (QEMU) | avancado | 20 min |
  qemu-system no Alpine, módulos kvm, libvirt? (não empacotada da mesma forma;
  usar qemu direto + libvirt se disponível no community), qemu-system-x86_64,
  imagens qcow2, rede tap/bridge com OpenRC, virt-manager nota.

### Módulo: Servidores
- `Nginx.tsx` | /nginx | Nginx | intermediario | 20 min |
  apk add nginx, layout de config no Alpine (/etc/nginx/http.d/ e conf.d/),
  rc-update add nginx, server blocks, sites estáticos, reverse proxy, TLS
  com acmesh (acme.sh é popular no Alpine), logs.
- `Php.tsx` | /php | PHP-FPM | intermediario | 18 min |
  apk add php84 php84-fpm php84-* (versões no 3.24), php-fpm com OpenRC,
  socket unix, nginx + php-fpm, composer, extensões comuns (pdo_mysql, etc).
- `Mariadb.tsx` | /mariadb | MariaDB | intermediario | 18 min |
  apk add mariadb mariadb-client, setup: mariadb-install-db (mariadb-setup?),
  usuário root do mysql ≠ root do sistema no Alpine, rc-update, criar usuário/db,
  backup mysqldump, socket /run/mysqld.
- `Postgresql.tsx` | /postgresql | PostgreSQL | intermediario | 18 min |
  apk add postgresql17, initdb como usuário postgres (criar usuário),
  /var/lib/postgresql, rc-update add postgresql, psql, criar db/usuário,
  pg_hba.conf, backup pg_dump.

### Módulo: Desenvolvimento
- `BuildBase.tsx` | /build-base | Compilação & build-base | intermediario | 18 min |
  meta-pacote build-base (gcc, make, musl-dev, libc-dev...), compilar C hello,
  `-dev` packages (headers), pkgconf, cmake/meson (pacotes), por que musl
  quebra binários glibc, static linking (`gcc -static`).
- `Python.tsx` | /python | Python | intermediario | 15 min |
  python3 no Alpine, pip (py3-pip), venv (py3-virtualenv? python3 -m venv precisa
  python3-dev?), wheels sem binário = compilação (por isso existe pacote py3-*),
  gcompat? nota, exemplos: instalar requests via apk vs pip.
- `Nodejs.tsx` | /nodejs | Node.js | intermediario | 15 min |
  nodejs/npm no Alpine (versão do 3.24), apk add nodejs npm, npx,
  binários nativos (node-gyp precisa build-base/python3), alternativas
  (nodejs LTS versions no repositório), pnpm via npm i -g.
- `Git.tsx` | /git | Git | iniciante | 20 min |
  apk add git, config, init/clone/add/commit/push, branches, merge básico,
  chaves ssh para GitHub, .gitignore, git no dia a dia.
- `Vim.tsx` | /vim | Vim & Neovim | iniciante | 15 min |
  vim por padrão? (Alpine tem busybox vi!), `apk add vim neovim`,
  modos, comandos essenciais, .vimrc mínimo, alternative: nano.

### Módulo: Segurança
- `Seguranca.tsx` | /seguranca | Segurança Básica | avancado | 20 min |
  panorama: doas, ssh hardening, awall, atualizações (`apk upgrade`),
  unattended? (não há padrão; script cron), usuários mínimos, serviços
  mínimos (filosofia Alpine), `apk audit`, `secfixes` (tracker do Alpine).
- `Hardening.tsx` | /hardening | Hardening & Auditoria | avancado | 22 min |
  história grsecurity (removida do kernel em 2017, legado), hardened malloc
  (pacote hardened-malloc?), PIE/RELRO/ASLR/stack protector no Alpine
  (todos os pacotes compilados com hardening), `apk audit --system`,
  checksums de pacotes (`apk audit --backup`?), sysctl hardening, kernel options.
- `Luks.tsx` | /luks | LUKS (Criptografia de Disco) | avancado | 20 min |
  cryptsetup no Alpine, criar volume LUKS, abrir/fechar (cryptsetup luksOpen),
  montar, /etc/conf.d/dmcrypt + /etc/crypttab? (Alpine usa /etc/conf.d/dmcrypt
  com dmcrypt init), nota sobre diskless/encrypted root (avançado).
- `Gpg.tsx` | /gpg | GPG (Chaves) | intermediario | 15 min |
  gnupg no Alpine, gerar chave, listar, assinar/verificar arquivos,
  verificar ISO do Alpine na prática (alpine-devel@lists... chave),
  exportar/importar.

### Módulo: Modos Especiais & Manutenção
- `Diskless.tsx` | /diskless | Diskless Mode (roda na RAM) | avancado | 22 min |
  modos de instalação do Alpine: sys / diskless / data, como funciona diskless
  (sistema inteiro em RAM, apk overlay), `lbu commit` / lbu package,
  /etc/lbu/lbu.conf, backups de config em diskless, casos de uso (roteadores,
  appliances, ephemeral), setup-disk para data disk.
- `Atualizacoes.tsx` | /atualizacoes | Atualizações & Release Upgrade | intermediario | 18 min |
  atualização normal (`apk update && apk upgrade`), upgrades de release
  (3.23 → 3.24): editar /etc/apk/repositories, `apk upgrade --available`,
  `setup-disk -u`? (upgrade de sistema em sys mode), recriar initramfs
  (update-kernel), notas de compatibilidade, testar em snapshot/backup antes.
- `Backup.tsx` | /backup | Backup | intermediario | 15 min |
  filosofia: configs em /etc + dados, tar (busybox), rsync (pacote),
  lbu para configs (diskless), backup para remoto (rsync/scp, rclone pacote),
  restauração, exemplos de script de backup com cron.

### Módulo: Extras
- `Glossario.tsx` | /glossario | Glossário | iniciante | 10 min |
  termos: apk, aports, abuild, musl, BusyBox, applet, OpenRC, runlevel,
  awall, lbu, diskless mode, edge, branch, overlay, world, doas, mkinitfs,
  secfixes (ordem alfabética, formato igual ao do ubuntu-book).
- `Troubleshooting.tsx` | /troubleshooting | Troubleshooting | intermediario | 18 min |
  erros comuns: "unable to select packages", conflicts main/community,
  bad signature (apk update), serviço não sobe (rc-service X -v, logs),
  rede sem DHCP, DNS falhando, disco cheio (`df -h`, apk cache clean),
  kernel panic/initramfs, como perguntar (wiki, Matrix, mailing list).
- `Referencias.tsx` | /referencias | Referências | iniciante | 8 min |
  wiki.alpinelinux.org, alpinelinux.org, pkgs.alpinelinux.org,
  secdb/secfixes, aports no GitLab, Matrix/IRC/mailing lists,
  livros/manuais, comunidades BR.

## 6. Fatos técnicos âncora (não inventar contra isto)

- Alpine 3.24 (jun/2026): kernel LTS 6.x, BusyBox 1.37.x, musl 1.2.x, OpenRC, apk.
- Pacote `sudo` existe mas o padrão do instalador é doas? — na verdade o
  setup-alpine cria root com senha e o usuário escolhe; exemplos usam `doas`
  (pacote doas) com nota. Se usar sudo, citar `apk add sudo`.
- `apk add X` exige root (doas/sudo ou root direto).
- Repositório padrão: `https://dl-cdn.alpinelinux.org/alpine/v3.24/main` e `/community`.
- O Alpine NÃO usa systemd, netplan, snap, apt, dpkg, journalctl — nunca citar
  como ferramenta do Alpine (apenas em comparações "diferente do Ubuntu...").
- Desktop: Alpine 3.24 adicionou COSMIC ao community; XFCE/GNOME/KDE existem,
  mas o foco do curso é servidor/minimal (citar de passagem).

## 7. Arquivos a gerar/reformular no scaffold

- `src/App.tsx` — novas rotas (todas as 63 páginas + Home + NotFound), lazy imports.
- `src/lib/course.ts` — MODULES conforme seção 5; KEY = "alpine-curso-progresso".
- `src/lib/levels.ts` — gerar a partir das difficulties da tabela (pode manter o
  formato "ARQUIVO GERADO" com comentário).
- `src/components/layout/Sidebar.tsx` — NAVIGATION igual aos módulos/labels,
  ícones lucide adequados, AlpineLogo, sem referências a Ubuntu.
- `src/components/layout/Header.tsx` — título/branding Alpine.
- `src/components/layout/CommandPalette.tsx` — conferir se lê de course.ts (se
  tiver dados próprios, atualizar).
- `src/pages/Home.tsx` — hero Alpine, NOVIDADES 3.24, demo com apk, ícones dos módulos novos.
- `src/index.css` — cores primárias Alpine (manter estrutura de tokens).
- `index.html`, `public/favicon.svg`, `README.md`.
- Apagar páginas antigas do ubuntu-book (todas de `src/pages/`), preservando
  `not-found.tsx` (atualizar textos) e copiando `Apt.tsx` para `docs/EXEMPLO-PAGINA.tsx` antes.
- Criar stubs compiláveis de TODAS as 63 páginas (só PageContainer + título) para
  o build passar antes do conteúdo chegar.
- `.github/workflows/` — ajustar nomes (verificar.yml/publicar.yml): trocar
  referências "ubuntu-book" por "alpine-book" se houver.
- `package.json` — name: "alpine-book".

## 8. Build & deploy

- `pnpm install && pnpm build` (Vite; saída em `dist/`).
- O deploy na VPS serve o build na RAIZ de goldmatador.cyou (`/var/www/alpine-book`).
- Nada de base path (base `/`), igual ao mint-book.
