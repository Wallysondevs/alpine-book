import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Historia() {
  return (
    <PageContainer
      title="História do Alpine Linux"
      subtitle="De um fork do LEAF em 2005 à base de milhões de containers: a trajetória da distro minimalista."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. Este capítulo é só leitura — mas já deixe um terminal aberto: no final
        você vai inspecionar a versão do Alpine com comandos de verdade.
      </AlertBox>

      <p>
        O <strong>Alpine Linux</strong> é uma distribuição independente, construída do zero
        em torno de três ideias: <strong>simplicidade</strong>, <strong>segurança</strong> e
        <strong> tamanho mínimo</strong>. Ela nasceu em 2005, criada pelo desenvolvedor
        <strong> Natanael Copa</strong>, e hoje é mais conhecida do que nunca: é a base
        preferida de imagens de container no mundo inteiro.
      </p>

      <h2>1. A origem: um firewall que virou distro</h2>
      <p>
        Em 2005, Natanael Copa partiu do projeto <strong>LEAF</strong>
        (Linux Embedded Appliance Firewall) — uma distro minúscula feita para rodar
        em roteadores e appliances, normalmente num único disquete. O objetivo inicial
        era exatamente esse: um sistema pequeno o bastante para caber em qualquer lugar
        e seguro o bastante para ficar exposto à internet.
      </p>
      <p>
        O primeiro release oficial saiu em <strong>2006/2007</strong>. Desde o início o
        projeto tomou decisões pouco comuns: componentes pequenos e auditáveis, poucas
        dependências e atualizações conservadoras. O nome é uma referência aos Alpes —
        montanhas: picos altos e base enxuta.
      </p>

      <h2>2. As grandes decisões técnicas</h2>
      <p>
        Três escolhas definem o Alpine até hoje — e serão tema de capítulos próprios:
      </p>
      <p>
        <strong>musl libc</strong> — em vez da glibc usada por quase todo mundo, o Alpine
        adotou em 2014 a musl, uma libc leve, de código limpo e licença MIT.
      </p>
      <p>
        <strong>BusyBox</strong> — os utilitários clássicos (ls, cp, grep, ps...) são
        fornecidos pelo BusyBox, um único binário com centenas de "applets". É isso que
        mantém o sistema minúsculo.
      </p>
      <p>
        <strong>OpenRC</strong> — no lugar do systemd, o Alpine usa o OpenRC, um sistema
        de init simples baseado em scripts.
      </p>
      <AlertBox type="info" title="O passado grsecurity">
        Entre as versões 2.x e 3.x o kernel do Alpine vinha com os patches
        <strong> grsecurity/PaX</strong>, famosos pelo hardening agressivo. Quando o
        grsecurity saiu do desenvolvimento público (2017), o Alpine manteve a cultura:
        até hoje todos os pacotes são compilados com proteções (PIE, RELRO, stack protector).
      </AlertBox>

      <h2>3. A linha do tempo</h2>
      <Terminal
        title="linha do tempo — Alpine Linux"
        lines={[
          { type: "comment", text: "# os marcos que importam" },
          { type: "out", text: "2005  fork do LEAF; Natanael Copa inicia o projeto" },
          { type: "out", text: "2006  primeiros releases (série 1.x)" },
          { type: "out", text: "2014  musl vira a libc padrão; chega a série 3.0" },
          { type: "out", text: "2015  Docker populariza imagens FROM alpine (~5 MB)" },
          { type: "out", text: "2017  fim do grsecurity público; hardening continua nos pacotes" },
          { type: "out", text: "2020+ dois releases por ano (~junho e ~dezembro)" },
          { type: "ok", text: "2026  Alpine 3.24 — a versão deste curso" },
        ]}
      />
      <p>
        O ciclo de releases é previsível: <strong>duas versões por ano</strong>, cada uma
        suportada por cerca de dois anos (sempre há dois releases estáveis mantidos,
        mais o <code>edge</code>, a branch de desenvolvimento).
      </p>

      <h2>4. Por que o Alpine explodiu nos containers</h2>
      <p>
        Quando o Docker se popularizou, as imagens oficiais (Ubuntu, Debian, CentOS)
        tinham centenas de megabytes. A imagem <code>alpine</code> tinha cerca de
        <strong> 5 MB</strong> — e trazia o gerenciador de pacotes <code>apk</code> para
        instalar o resto sob demanda. Baixar menos bytes significa deploys mais rápidos
        e menos superfície de ataque. Resultado: o Alpine virou a base de milhões de
        imagens no Docker Hub.
      </p>
      <CodeBlock
        title="O tamanho em números (aproximados)"
        code={`# imagem base de container:
alpine:3.24      ~  8 MB
debian:stable    ~120 MB
ubuntu:26.04     ~ 80 MB

# instalação em disco (sistema completo):
Alpine (sys)     ~150 MB
Ubuntu Server    ~2-4 GB`}
      />

      <h2>5. Quem mantém o Alpine</h2>
      <p>
        O projeto é tocado por uma <strong>equipe central pequena</strong> e uma comunidade
        de mantenedores de pacotes, com contribuição via GitLab (o repositório
        <strong> aports</strong> guarda as receitas de todos os pacotes). Não há uma
        empresa dona — o Alpine é um projeto comunitário independente, sustentado por
        doações e por infraestrutura cedida por patrocinadores (CDN, mirrors, build farm).
      </p>

      <h2>6. Inspecionando um Alpine de verdade</h2>
      <p>
        Se você já tem um Alpine rodando (VM, VPS ou container), estes comandos mostram
        a identidade do sistema:
      </p>
      <CodeBlock
        title="Identidade do sistema"
        code={`# Nome e versão da distro (arquivo padrão dos Linux modernos)
cat /etc/os-release

# Versão curta, direto ao ponto
cat /etc/alpine-release

# Kernel em uso
uname -r

# Qual libc está no sistema (musl, claro)
ldd --version 2>&1 | head -1`}
      />
      <Terminal
        title="wallyson@alpine: ~"
        lines={[
          { type: "cmd", text: "cat /etc/alpine-release" },
          { type: "out", text: "3.24.1" },
          { type: "cmd", text: "uname -r" },
          { type: "out", text: "6.12.34-0-lts" },
          { type: "cmd", text: "cat /etc/os-release | head -3" },
          { type: "out", text: 'NAME="Alpine Linux"' },
          { type: "out", text: "ID=alpine" },
          { type: "out", text: 'VERSION_ID=3.24.1' },
        ]}
      />

      <AlertBox type="success" title="Resumo">
        O Alpine nasceu em 2005 como um sistema mínimo e seguro para appliances, adotou
        musl + BusyBox + OpenRC, e conquistou o mundo dos containers pelo tamanho e pela
        disciplina de segurança. Nos próximos capítulos você entende a filosofia por trás
        dessas escolhas — e depois coloca a mão na massa.
      </AlertBox>
    </PageContainer>
  );
}
