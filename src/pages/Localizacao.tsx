import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Localizacao() {
  return (
    <PageContainer
      title="Teclado & Timezone"
      subtitle="Acerte teclado, fuso horário e locale para o sistema falar sua língua."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado com acesso root ou doas/sudo. Os comandos deste capítulo
        são rápidos e não requerem reboot (exceto o keymap em modo permanente).
      </AlertBox>

      <p>
        Teclado com mapa errado, relógio em UTC achando que você está em Londres,
        programas reclamando de locale. Coisas pequenas que irritam todo dia. Em
        10 minutos você resolve as três e nunca mais pensa nisso.
      </p>

      {/* ===== SEÇÃO 1 ===== */}
      <h2>1. Teclado: setup-keymap</h2>
      <p>
        O Alpine vem com mapa de teclado US (QWERTY) por padrão. Se seu teclado é
        ABNT2 (Brasil) ou tem acentos, os caracteres vão sair trocados. O
        assistente resolve isso em segundos:
      </p>

      <Terminal
        title="Configurando o teclado"
        lines={[
          { type: "in", text: "setup-keymap" },
          {
            type: "out",
            text: "Available keyboard layouts:\n  us      US keyboard\n  br      Brazilian (ABNT2)\n  pt      Portuguese\n  de      German\n  fr      French\n  ...",
          },
          { type: "out", text: "Select keyboard layout [us]:" },
          { type: "in", text: "br" },
          {
            type: "out",
            text: "Select variant (press Enter for default):",
          },
          { type: "in", text: "" },
          {
            type: "out",
            text: "* Setting keymap to 'br' ...  [OK]",
          },
        ]}
      />

      <p>
        O efeito é imediato no console atual. O assistente altera dois arquivos:
      </p>
      <CodeBlock
        title="O que o setup-keymap altera"
        code={`# /etc/conf.d/keymaps — configuração do teclado no boot
keymap="br"
# (para ABNT2 brasileiro. 'us' para US, 'pt' para português de Portugal)

# A variante (ex: ABNT2) fica em:
# /etc/conf.d/keymaps
keymap="br-abnt2"`}
      />

      <AlertBox type="warning" title="Teclado temporário vs permanente">
        Se você rodar <code>setup-keymap</code> no modo live (antes de instalar),
        a configuração não persiste após reboot. Após a instalação em disco, o
        serviço <code>keymaps</code> do OpenRC aplica automaticamente o que está
        em <code>/etc/conf.d/keymaps</code>.
      </AlertBox>

      <p>
        Para trocar o mapa temporariamente (sem editar arquivos):
      </p>
      <CodeBlock
        code={`# Listar mapas disponíveis
ls /usr/share/keymaps/

# Aplicar um mapa na hora (válido até reboot)
loadkeys br-abnt2`}
      />

      {/* ===== SEÇÃO 2 ===== */}
      <h2>2. Fuso horário: setup-timezone</h2>
      <p>
        O Alpine armazena o relógio do hardware em UTC (recomendado) e usa um
        symlink em <code>/etc/localtime</code> para saber qual fuso exibir. O
        assistente faz tudo:
      </p>

      <Terminal
        title="Configurando o fuso horário"
        lines={[
          { type: "in", text: "setup-timezone" },
          {
            type: "out",
            text: "Which timezone are you in? ('?' for list) [UTC]:",
          },
          { type: "in", text: "America/Fortaleza" },
          {
            type: "out",
            text:
              "* Linking /usr/share/zoneinfo/America/Fortaleza to /etc/localtime",
          },
          { type: "out", text: "* Updating /etc/timezone" },
          { type: "ok", text: "# Pronto! O relógio agora mostra a hora local." },
        ]}
      />

      <p>
        Se você não souber o nome exato do seu fuso, o assistente lista tudo:
      </p>
      <CodeBlock
        code={`# Descobrir fusos disponíveis
setup-timezone -l        # lista todos
setup-timezone -l | grep -i america   # filtra por continente

# Fusos brasileiros comuns:
# America/Sao_Paulo    (Brasília, -3)
# America/Fortaleza    (Nordeste, -3)
# America/Manaus       (Amazonas, -4)
# America/Cuiaba       (Mato Grosso, -4)`}
      />

      <AlertBox type="info" title="UTC no hardware, local no sistema">
        A convenção Linux é manter o relógio da máquina em UTC e usar o timezone
        só para exibição. Isso evita confusão com horário de verão e dual-boot.
        O Alpine segue essa convenção por padrão — não mude a menos que tenha um
        motivo forte.
      </AlertBox>

      {/* ===== SEÇÃO 3 ===== */}
      <h2>3. tzdata: o pacote por trás</h2>
      <p>
        Os fusos horários vêm do pacote <code>tzdata</code>, instalado por padrão.
        Ele coloca os arquivos de definição em{" "}
        <code>/usr/share/zoneinfo/</code>, organizados por continente/cidade:
      </p>
      <CodeBlock
        title="Explorando os arquivos de timezone"
        code={`# O que o tzdata instalou
apk info -L tzdata | head -20
# /usr/share/zoneinfo/
# /usr/share/zoneinfo/America/
# /usr/share/zoneinfo/America/Sao_Paulo
# /usr/share/zoneinfo/America/Fortaleza
# ...

# Ver o symlink atual
ls -l /etc/localtime
# /etc/localtime -> /usr/share/zoneinfo/America/Fortaleza

# Ver o timezone configurado
cat /etc/timezone
# America/Fortaleza`}
      />

      {/* ===== SEÇÃO 4 ===== */}
      <h2>4. Acertar data e hora</h2>
      <p>
        Se o relógio estiver errado depois de configurar o timezone, acerte
        manualmente ou sincronize com a rede:
      </p>

      <h3>4.1 Manual — date e hwclock</h3>
      <CodeBlock
        title="Ajuste manual do relógio"
        code={`# Ver data/hora atual
date
# Sun Aug  9 14:00:00 -03 2026

# Ajustar data/hora (formato: MMDDHHmmAAAA)
date 080914002026     # 09/Ago 14:00 2026

# Gravar a hora do sistema no relógio do hardware
hwclock --systohc`}
      />

      <h3>4.2 Automático — chronyd (NTP)</h3>
      <p>
        Muito mais prático: instalar o chrony e deixar a sincronização automática
        com servidores NTP. Se você seguiu o capítulo Primeiros Passos, já deve
        estar rodando:
      </p>
      <CodeBlock
        title="Verificar a sincronização NTP"
        code={`# Status da sincronização
chronyc tracking

# Fontes de tempo que o chrony está consultando
chronyc sources -v

# Forçar sincronização imediata
chronyc makestep`}
      />

      <AlertBox type="info" title="Precisão importa?">
        Para servidores e bancos de dados, relógio correto é fundamental — tokens
        JWT expiram, certificados TLS são validados, backups têm timestamp. O
        chrony consome ~2 MB de RAM e resolve isso para sempre.
      </AlertBox>

      {/* ===== SEÇÃO 5 ===== */}
      <h2>5. Locale: o Alpine e a musl</h2>
      <p>
        Aqui o Alpine <strong>é diferente</strong> de Debian, Ubuntu e derivados.
        Eles usam a glibc, que tem suporte completo a locales (centenas de arquivos
        de tradução, formatação regional, collation). O Alpine usa a musl, que é
        minimalista e por padrão trabalha com <code>LANG=C</code> (ou{" "}
        <code>POSIX</code>).
      </p>

      <CodeBlock
        title="O estado padrão do locale no Alpine"
        code={`# Ver o locale atual
echo $LANG
# C  (ou vazio — equivalente a C/POSIX)

# Tentar listar locales (não funciona sem musl-locales)
locale -a
# locale: not found  (o Alpine nem tem o comando por padrão)`}
      />

      <p>
        <code>LANG=C</code> significa: ordenação binária (A-Z, a-z separados),
        sem traduções de mensagens, datas em inglês, ponto decimal (não vírgula).
        Para a maioria dos servidores, isso é perfeitamente aceitável — e até
        desejável (scripts quebram menos).
      </p>

      <h3>5.1 Quando você PRECISA de locales</h3>
      <p>
        Se algum programa reclama de locale ou você quer mensagens em português:
      </p>
      <CodeBlock
        title="Instalando suporte a locales na musl"
        code={`# 1. Instalar o pacote de locales
apk add musl-locales

# 2. Agora o comando locale existe
locale -a | head -10
# C
# C.utf8
# POSIX
# pt_BR
# pt_BR.utf8
# ...

# 3. Definir para português brasileiro UTF-8
export LANG=pt_BR.UTF-8

# 4. Testar
date
# dom 09 ago 2026 14:00:00 -03`}
      />

      <p>
        Para tornar permanente, adicione ao seu <code>~/.profile</code>:
      </p>
      <CodeBlock
        title="~/.profile — locale permanente"
        code={`# Adicione no final do ~/.profile
export LANG=pt_BR.UTF-8
export LC_ALL=pt_BR.UTF-8`}
      />

      <AlertBox type="warning" title="musl-locales: use com moderação">
        O pacote <code>musl-locales</code> adiciona ~10 MB de dados de locale.
        Não é necessário para a maioria dos servidores — o padrão{" "}
        <code>LANG=C</code> funciona bem com bancos de dados, servidores web e
        aplicações em containers. Só instale se um programa específico exigir ou
        se você realmente quiser o terminal em português.
      </AlertBox>

      {/* ===== SEÇÃO 6 ===== */}
      <h2>6. Tudo junto: script de localização inicial</h2>
      <p>
        Se você está configurando várias máquinas ou quer um atalho, aqui está um
        script que faz tudo de uma vez com os valores brasileiros:
      </p>
      <CodeBlock
        title="localizacao-br.sh — configure teclado, timezone e locale"
        code={`#!/bin/sh
# Script de localização para Alpine Linux — Brasil

echo "==> Configurando teclado ABNT2..."
setup-keymap br abnt2

echo "==> Configurando timezone America/Fortaleza..."
setup-timezone -z America/Fortaleza

echo "==> Instalando e ativando chrony (NTP)..."
apk add -q chrony 2>/dev/null
rc-update add chronyd 2>/dev/null
rc-service chronyd start 2>/dev/null

echo "==> (Opcional) Instalando locales em português..."
apk add -q musl-locales 2>/dev/null
echo 'export LANG=pt_BR.UTF-8' >> /etc/profile

echo "==> Pronto! Confira:"
echo -n "  Data: "; date
echo -n "  Keymap: "; cat /etc/conf.d/keymaps 2>/dev/null || echo "N/A"
echo -n "  Timezone: "; readlink /etc/localtime`}
      />

      <AlertBox type="success" title="Resumo">
        Três ajustes que custam 10 minutos e duram a vida toda do sistema:
        <ol>
          <li>
            <strong>Teclado:</strong> <code>setup-keymap</code> → escolha{" "}
            <code>br</code> (ABNT2)
          </li>
          <li>
            <strong>Timezone:</strong> <code>setup-timezone</code> → escolha seu
            fuso (ex: <code>America/Fortaleza</code>)
          </li>
          <li>
            <strong>Locale:</strong> opcional — <code>apk add musl-locales</code>{" "}
            e <code>export LANG=pt_BR.UTF-8</code>
          </li>
        </ol>
        O Alpine é minimalista também nisso: o padrão C é suficiente para a
        maioria dos casos; os assistentes resolvem o resto em segundos.
      </AlertBox>
    </PageContainer>
  );
}