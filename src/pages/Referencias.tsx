import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências"
      subtitle="Links oficiais, documentação, comunidades e recursos para continuar aprendendo Alpine Linux."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <p>
        O aprendizado não termina aqui. Esta página reúne os melhores recursos
        oficiais e da comunidade para você se aprofundar no Alpine Linux.
      </p>

      <h2>Documentação Oficial</h2>
      <CodeBlock
        code={`📘 Wiki Alpine Linux
   https://wiki.alpinelinux.org/
   A documentação oficial de referência. Tutoriais, how-tos, configs.

📦 Repositório de pacotes (busca web)
   https://pkgs.alpinelinux.org/
   Busque pacotes, veja versões, dependências e arquivos.

🐛 Bug Tracker
   https://gitlab.alpinelinux.org/alpine/aports/-/issues
   Reporte bugs, acompanhe issues dos pacotes.

🔒 Alertas de Segurança
   https://security.alpinelinux.org/
   Vulnerabilidades e patches de segurança.

📋 GitLab (aports — código fonte dos pacotes)
   https://gitlab.alpinelinux.org/alpine/aports
   APKBUILDs de todos os pacotes oficiais.`}
      />

      <h2>Manuais e Guias</h2>
      <CodeBlock
        code={`📖 Alpine User Handbook (oficial)
   https://docs.alpinelinux.org/user-handbook/

📖 Debian Administrator's Handbook (capítulos sobre Linux em geral)
   https://debian-handbook.info/

📖 Linux Command Line (William Shotts)
   https://linuxcommand.org/
   Referência completa de shell scripting e comandos Unix.

📖 Guia Alpine Linux no GitHub (mikeroyal)
   https://github.com/mikeroyal/Alpine-Linux-Guide
   Coleção de dicas e configurações rápidas.`}
      />

      <h2>Comunidade</h2>
      <CodeBlock
        code={`💬 IRC (Libera.Chat)
   #alpine-linux       — suporte geral
   #alpine-devel       — desenvolvimento

📧 Listas de Email
   https://lists.alpinelinux.org/
   alpine-user, alpine-devel, alpine-announce

🐦 Mastodon / Fediverso
   @alpinelinux@fosstodon.org

🌐 Reddit
   r/AlpineLinux

📦 Docker Hub — Imagens Oficiais
   https://hub.docker.com/_/alpine
   A imagem base mais popular do mundo.`}
      />

      <h2>Ferramentas Recomendadas</h2>
      <CodeBlock
        code={`🖥️  Terminal:   Alacritty, Kitty, ou o próprio console
✏️  Editor:     Neovim (nvim) com kickstart.nvim
📊 Monitor:    Netdata, htop, btop
📦 Containers: Docker + docker-compose
🔐 VPN:        WireGuard
📁 Backup:     Restic
📜 Shell:      Bash ou Zsh com oh-my-zsh`}
      />

      <h2>Este Curso</h2>
      <CodeBlock
        code={`🏔️  Curso de Alpine Linux 3.24 — do zero ao domínio
   Autor: Wallyson
   Licença: Material educativo de uso livre
   Código-fonte: https://github.com/wallysondevs/alpine-book
   Acesse online: https://goldmatador.cyou

   📊 63 lições em 14 módulos
   📝 Conteúdo prático em Português Brasileiro
   🔄 Atualizado para Alpine Linux 3.24`}
      />

      <AlertBox type="success" title="🚀 Parabéns!">
        Você concluiu o curso de Alpine Linux. Da instalação ao hardening,
        dos containers à VPN, você agora tem o conhecimento para administrar
        Alpine Linux com confiança em qualquer cenário — servidores, containers,
        embarcados ou desktop.

        Continue praticando. O Alpine Wiki e a comunidade estão aí para ajudar.
        E lembre-se: <strong>simples, seguro, leve</strong> — esse é o jeito
        Alpine.
      </AlertBox>
    </PageContainer>
  );
}