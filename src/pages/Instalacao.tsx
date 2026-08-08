import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Instalacao() {
  return (
    <PageContainer
      title="Guia de Instalação"
      subtitle="Da ISO ao sistema no disco: setup-alpine passo a passo, sem mistério."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Uma máquina virtual (VirtualBox, GNOME Boxes, UTM, Proxmox...) ou um VPS.
        Pelo menos 512 MB de RAM e 2 GB de disco são mais que suficientes para começar.
      </AlertBox>

      <p>
        Instalar o Alpine é diferente das distros desktop: não há instalador gráfico.
        Você dá boot na ISO, loga como <code>root</code> e roda
        <strong> <code>setup-alpine</code></strong> — um assistente de perguntas diretas.
        Em 10 minutos o sistema está no disco.
      </p>

      <h2>1. Escolhendo e baixando a ISO</h2>
      <p>
        A página <code>alpinelinux.org/downloads</code> oferece quatro sabores:
      </p>
      <CodeBlock
        title="Sabores da ISO (arquitetura x86_64)"
        code={`standard   ~250 MB  a ISO comum: instala com pacotes locais + rede
extended   ~600 MB  mais pacotes offline (útil sem internet no alvo)
virt       ~ 60 MB  mínima, feita para máquinas virtuais
netboot    ~ 60 MB  baixa tudo da rede durante a instalação

# Para este curso: standard ou virt.`}
      />
      <p>
        Depois de baixar, confira a integridade com o checksum publicado junto:
      </p>
      <CodeBlock
        title="Verificando a ISO"
        code={`# Baixa a lista de somas SHA256 oficial
wget https://alpinelinux.org/releases/x86_64/3.24.1/SHA256SUMS

# Confere a ISO (o nome deve aparecer com OK)
sha256sum -c SHA256SUMS 2>/dev/null | grep standard
# alpine-standard-3.24.1-x86_64.iso: OK`}
      />

      <h2>2. Boot e primeiro login</h2>
      <p>
        Dê boot na ISO. O menu do bootloader permite ajustar opções de kernel
        (raramente necessário). Em poucos segundos aparece o prompt:
      </p>
      <Terminal
        title="console do live"
        lines={[
          { type: "out", text: "Welcome to Alpine Linux 3.24" },
          { type: "out", text: "Kernel 6.12.34-0-lts on an x86_64 (tty1)" },
          { type: "out", text: "" },
          { type: "out", text: "localhost login: root" },
          { type: "ok", text: "# sem senha: no live o root loga direto" },
        ]}
      />

      <h2>3. O assistente setup-alpine</h2>
      <p>
        Logado como root, rode o assistente. Ele pergunta tudo em sequência — veja como
        responder cada etapa:
      </p>
      <Terminal
        title="wallyson@alpine: ~ (instalação)"
        lines={[
          { type: "cmd", text: "setup-alpine" },
          { type: "out", text: "Select keyboard layout: [none] br-abnt2   # seu teclado" },
          { type: "out", text: "Enter system hostname: alpine" },
          { type: "out", text: "Which one do you want to initialize? eth0" },
          { type: "out", text: "Ip address for eth0? dhcp                  # ou estático" },
          { type: "out", text: "Do you want to do any manual network configuration? no" },
          { type: "out", text: "New password: ********                     # senha do root" },
          { type: "out", text: "Which timezone are you in? America/Fortaleza" },
          { type: "out", text: "HTTP/FTP proxy URL? none" },
          { type: "out", text: "Enter mirror number [f/e/c]: f             # f = mais rápido" },
          { type: "out", text: "Which SSH server? openssh" },
          { type: "out", text: "Which disk(s) would you like to use? /dev/vda" },
          { type: "out", text: "How would you like to use it? sys          # instala no disco" },
          { type: "out", text: "WARNING: Erase the above disk(s) and continue? y" },
          { type: "ok", text: "Installation is complete. Please reboot." },
        ]}
      />
      <p>
        As escolhas que mais geram dúvida:
      </p>
      <p>
        <strong>Timezone</strong> — use o formato <code>Região/Cidade</code>, por exemplo
        <code> America/Fortaleza</code>, <code>America/Sao_Paulo</code>.
      </p>
      <p>
        <strong>Mirror</strong> — <code>f</code> testa os mirrors e escolhe o mais rápido
        (geralmente <code>dl-cdn.alpinelinux.org</code> ou um mirror do seu país).
      </p>
      <p>
        <strong>Modo do disco</strong> — <code>sys</code> instala normalmente no disco
        (o que queremos agora). <code>data</code> usa o disco só para dados e roda da RAM.
        <code> diskless</code> roda tudo na RAM — assunto de capítulo avançado.
      </p>

      <h2>4. Particionamento automático</h2>
      <p>
        No modo <code>sys</code>, o <code>setup-disk</code> (invocado pelo assistente)
        cria automaticamente as partições e instala o bootloader:
      </p>
      <CodeBlock
        title="O que ele cria (BIOS ou UEFI)"
        code={`# BIOS tradicional:
/dev/vda1  /boot     (kernel + initramfs)
/dev/vda2  /         (sistema)
/dev/vda3  swap      (opcional, se houver RAM pequena)

# UEFI:
/dev/vda1  /boot/efi (partição EFI)
/dev/vda2  /boot
/dev/vda3  /
# Bootloader: GRUB (ou syslinux, conforme o caso)`}
      />
      <p>
        Se preferir particionar manualmente (LVM, criptografia), responda
        <code> manual</code> na pergunta do disco — mas para o curso, o automático basta.
      </p>

      <h2>5. Primeiro boot no sistema instalado</h2>
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "reboot" },
          { type: "comment", text: "# remova a ISO da VM; o sistema liga do disco" },
          { type: "out", text: "Welcome to Alpine Linux 3.24" },
          { type: "out", text: "alpine login: root" },
          { type: "out", text: "Password:" },
          { type: "ok", text: "alpine:~#   # agora sim: sistema instalado no disco" },
        ]}
      />
      <CodeBlock
        title="Confirmações rápidas pós-boot"
        code={`# Versão instalada
cat /etc/alpine-release

# Disco em uso (modo sys monta / no disco real)
df -h /

# Serviços ativos no boot
rc-status`}
      />

      <h2>6. Instalando em VPS / nuvem</h2>
      <p>
        Muitos provedores têm imagem Alpine pronta (é comum em planos baratos — a distro
        ocupa pouco). Se o provedor não tiver, duas rotas:
      </p>
      <p>
        <strong>1)</strong> subir a ISO como "custom ISO" e rodar o
        <code>setup-alpine</code> pelo console web, exatamente como acima;
      </p>
      <p>
        <strong>2)</strong> usar as imagens <strong>generic cloud</strong> oficiais
        (qcow2/raw com cloud-init) publicadas em alpinelinux.org — compatíveis com
        OpenStack, Proxmox e similares.
      </p>
      <AlertBox type="danger" title="Backup antes de instalar em máquina física">
        O modo <code>sys</code> <strong>apaga o disco escolhido</strong>. Se for instalar
        num computador com dados, faça backup antes e confira duas vezes qual disco foi
        selecionado (<code>/dev/sda</code>? <code>/dev/nvme0n1</code>?).
      </AlertBox>

      <AlertBox type="success" title="Resumo">
        Baixe a ISO (standard/virt), confira o SHA256, dê boot, logue como root e rode
        <code>setup-alpine</code>: teclado, hostname, rede, senha, timezone, mirror,
        SSH e disco (<code>sys</code>). Reboot e pronto. No próximo capítulo, os
        primeiros ajustes do sistema novo.
      </AlertBox>
    </PageContainer>
  );
}
