import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Diskless() {
  return (
    <PageContainer
      title="Diskless Mode — Alpine na RAM"
      subtitle="Rode o Alpine inteiro na RAM: modo sem disco, overlay filesystem, perfeito para embarcados e kiosks."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Alpine instalado em mídia removível (USB, SD) ou via PXE. O modo
        diskless é um dos modos de instalação oferecidos pelo setup-alpine.
      </AlertBox>

      <p>
        O modo <strong>diskless</strong> (ou <em>data</em>) é a feature mais
        única do Alpine: o sistema base roda inteiro na RAM a partir de uma
        imagem squashfs, e apenas modificações são gravadas em disco. O resultado
        é um sistema que sobrevive a cortes de energia e desgaste zero em flash.
      </p>

      <h2>1. Como funciona</h2>
      <CodeBlock
        code={`# O boot no modo diskless:
# 1. Bootloader carrega kernel + initramfs
# 2. Initramfs carrega os .apk da mídia para a RAM
# 3. Sistema base roda de uma imagem squashfs na RAM (read-only)
# 4. Overlay fs: camada superior read-write grava modificações

# Tipos de armazenamento:
# NONE     → tudo na RAM, perde tudo no reboot
# DATA     → /var e /etc salvos em partição (ext4/xfs)
# LBU      → Alpine Local Backup: salva alterações em .apkovl

# Vantagens:
# - Imune a corrupção de disco (sistema base é read-only)
# - Desgaste zero em flash (SD card, USB, SSD industrial)
# - Estado limpo a cada reboot (ou persistente, você escolhe)`}
      />

      <h2>2. Instalação em modo diskless</h2>
      <CodeBlock
        code={`# Durante o setup-alpine:
# Ao chegar na pergunta "Which disk(s) would you like to use?"
# Responda: none    ← modo diskless puro (tudo na RAM)
#      ou: sda1    ← modo data (salva alterações no disco)

# Com lbu (Local Backup), suas configs viram um .apkovl:
lbu commit -d         # salva alterações no disco
lbu status             # mostra o que mudou desde o último commit
lbu list               # lista arquivos no backup
lbu package -v         # cria um .apkovl manualmente`}
      />

      <h2>3. Casos de uso</h2>
      <CodeBlock
        code={`# Roteador/firewall (nunca corrompe, reboot resolve)
# Kiosk/POS (boot limpo toda vez, sem persistência)
# Embarcado (SD card dura anos sem desgaste)
# Laboratório (cada reboot = estado limpo)
# Recuperação (live USB que nunca estraga)

# Exemplo: servidor DHCP diskless
# Instala Alpine no USB, configura dhcpd, commit com lbu.
# Se der problema, reboot = estado limpo + config restaurada.`}
      />

      <h2>4. Diferenças vs modo sys (instalação normal)</h2>
      <CodeBlock
        code={`# Modo SYS (instalação em disco):
# - Sistema em partição ext4/xfs
# - apk upgrade altera o sistema permanentemente
# - Corrupção de disco pode quebrar o boot
# - Como Ubuntu/Debian

# Modo DISKLESS:
# - Sistema em squashfs na RAM
# - apk upgrade dura só até o reboot (a menos que faça lbu commit)
# - Corrupção de disco não afeta o sistema base
# - Único do Alpine`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li>Diskless = sistema base em RAM via squashfs</li>
          <li>Modo <strong>none</strong>: tudo volátil; <strong>data</strong>: persistência parcial</li>
          <li><code>lbu commit</code> salva alterações; <code>lbu status</code> verifica</li>
          <li>Ideal para embarcados, kiosks, roteadores e recovery</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}