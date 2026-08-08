import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Filosofia() {
  return (
    <PageContainer
      title="Filosofia — simples, seguro, leve"
      subtitle="Por que o Alpine escolhe minimalismo e segurança — e o que você ganha com isso."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. Leitura recomendada antes de instalar: entender a filosofia evita
        estranhamento depois (ex: por que não tem bash por padrão?).
      </AlertBox>

      <p>
        Toda distro tem um conjunto de valores que guia cada decisão de empacotamento.
        Os do Alpine aparecem na página oficial quase como um slogan:
        <strong> "Small. Simple. Secure."</strong> — pequeno, simples, seguro. Não é
        marketing: é critério de corte. Se um componente não passa nos três, ele não entra.
      </p>

      <h2>1. Simplicidade: menos peças, menos surpresa</h2>
      <p>
        O Alpine monta o sistema com o mínimo de componentes: <strong>BusyBox</strong> no
        lugar de dezenas de utilitários GNU, <strong>OpenRC</strong> no lugar do systemd,
        <strong>musl</strong> no lugar da glibc, <strong>apk</strong> como gerenciador de
        pacotes. Cada peça é menor, mais fácil de auditar e de entender.
      </p>
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "ls /bin | wc -l" },
          { type: "out", text: "118" },
          { type: "comment", text: "# um Ubuntu típico passa de 600 arquivos só em /bin" },
          { type: "cmd", text: "ls -la /bin/busybox" },
          { type: "out", text: "-rwxr-xr-x    1 root     root      858K Jun 10 08:12 /bin/busybox" },
          { type: "ok", text: "# um binário de ~1 MB substitui centenas de ferramentas" },
        ]}
      />

      <h2>2. Segurança como padrão de fábrica</h2>
      <p>
        Segurança no Alpine não é um capítulo à parte — é o padrão de compilação:
      </p>
      <p>
        <strong>Hardening em todos os pacotes</strong> — tudo é compilado com PIE
        (position-independent executable), RELRO, stack protector e fortify. Isso dificulta
        exploração de falhas de memória.
      </p>
      <p>
        <strong>secfixes público</strong> — o projeto mantém um tracker
        (<code>secfixes.alpinelinux.org</code>) ligando cada CVE à versão do pacote que
        corrige. Dá para auditar com <code>apk audit</code> se o seu sistema tem pendências.
      </p>
      <p>
        <strong>Superfície mínima</strong> — menos software instalado significa menos
        código exposto a ataques. Uma instalação padrão do Alpine tem pouquíssimos pacotes.
      </p>

      <h2>3. Leveza: o sistema que cabe na RAM</h2>
      <p>
        O Alpine pode rodar <strong>inteiro na memória RAM</strong> (modo diskless): o
        sistema ocupa dezenas de MB, o disco vira opcional e a máquina liga em segundos.
        É o modo preferido para roteadores, appliances e sistemas embarcados — e um dos
        capítulos deste curso é só sobre ele.
      </p>
      <CodeBlock
        title="O que 'leve' significa na prática"
        code={`# RAM usada logo após o boot, sem nada rodando:
Alpine diskless    ~ 40-60 MB
Ubuntu Server      ~ 200-400 MB

# Imagem de container:
alpine:3.24        ~ 8 MB comprimida
ubuntu:26.04       ~ 80 MB comprimida

# Tempo de boot em VM pequena:
Alpine             ~ 2-4 segundos`}
      />

      <h2>4. As consequências práticas (o que muda pra você)</h2>
      <p>
        A filosofia cobra um preço: alguns confortos vêm desligados por padrão.
        Entenda desde já o que é proposital:
      </p>
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "comment", text: "# o shell padrão é o ash (BusyBox), não o bash:" },
          { type: "cmd", text: "echo $0" },
          { type: "out", text: "-ash" },
          { type: "comment", text: "# sudo não vem instalado; o padrão é o doas:" },
          { type: "cmd", text: "doas whoami" },
          { type: "out", text: "root" },
          { type: "comment", text: "# man pages não vêm por padrão:" },
          { type: "cmd", text: "man ls" },
          { type: "err", text: "man: ls: No entry for ls in the manual!" },
          { type: "warn", text: "-> resolvido com: doas apk add man-pages (capítulo próprio)" },
        ]}
      />
      <AlertBox type="warning" title="Quem vem do Ubuntu estranha no início">
        Alguns comandos têm menos flags (versões BusyBox), <code>systemctl</code> não
        existe (é <code>rc-service</code>) e nem tudo está no repositório principal.
        Tudo isso é coberto nos capítulos específicos — nada fica sem resposta.
      </AlertBox>

      <h2>5. Quando o Alpine é a escolha certa</h2>
      <p>
        <strong>Containers</strong> — imagens pequenas, builds rápidos, menos CVEs para
        acompanhar. É o caso de uso mais famoso.
      </p>
      <p>
        <strong>Servidores minimalistas</strong> — web, DNS, VPN, firewall: o Alpine
        entrega o serviço com o mínimo de pacotes.
      </p>
      <p>
        <strong>Embarcados e appliances</strong> — diskless mode, initramfs, read-only.
      </p>
      <p>
        <strong>VMs e VPS com pouca RAM</strong> — sobra memória para a aplicação.
      </p>
      <p>
        Para desktop de uso geral (jogos, drivers proprietários, suites completas),
        distros maiores ainda são mais confortáveis — o foco do Alpine é outro.
      </p>

      <h2>6. Verificando a filosofia em números</h2>
      <CodeBlock
        title="Contando o sistema"
        code={`# Quantos pacotes compõem o sistema base:
apk info | wc -l
# Uma instalação nova fica em torno de 40-60 pacotes.

# Quanto o sistema ocupa em disco:
df -h /

# O que está rodando (memória):
free -m`}
      />
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "apk info | wc -l" },
          { type: "out", text: "54" },
          { type: "cmd", text: "free -m | head -2" },
          { type: "out", text: "              total        used        free" },
          { type: "out", text: "Mem:            976          61         869" },
          { type: "ok", text: "# 54 pacotes e ~60 MB de RAM: isso é o Alpine" },
        ]}
      />

      <AlertBox type="success" title="Resumo">
        Simplicidade (menos peças), segurança (hardening + secfixes) e leveza (cabe na
        RAM) explicam todas as escolhas do Alpine — inclusive o que parece "faltar".
        Próximo capítulo: as duas peças que tornam isso possível, musl e BusyBox.
      </AlertBox>
    </PageContainer>
  );
}
