import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Gpg() {
  return (
    <PageContainer
      title="GPG — Criptografia de Chaves"
      subtitle="Gere chaves, criptografe arquivos, assine commits e gerencie sua identidade criptográfica."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. GPG é útil mesmo em desktop — não só em servidores.
      </AlertBox>

      <p>
        GPG (GNU Privacy Guard) é o padrão open source para criptografia
        assimétrica. Com ele você criptografa arquivos, assina digitalmente,
        autentica-se em serviços e protege comunicações.
      </p>

      <h2>1. Instalação e primeiras chaves</h2>
      <CodeBlock
        code={`# Instalar GPG completo
apk add gnupg

# Gerar par de chaves
gpg --full-generate-key
# Tipo: RSA and RSA (padrão)
# Tamanho: 4096
# Validade: 2y (2 anos)
# Nome: Wallyson
# Email: wallyson@email.com
# Passphrase: ****** (NÃO ESQUEÇA!)`}
      />

      <h2>2. Comandos essenciais</h2>
      <CodeBlock
        code={`# Listar chaves
gpg --list-keys              # chaves públicas
gpg --list-secret-keys       # chaves privadas

# Exportar chave pública (para compartilhar)
gpg --armor --export wallyson@email.com > chave-publica.asc

# Importar chave de outra pessoa
gpg --import chave-amigo.asc

# Criptografar arquivo
gpg --encrypt --recipient amigo@email.com arquivo.txt
# Cria: arquivo.txt.gpg (só o amigo consegue abrir)

# Descriptografar
gpg --decrypt arquivo.txt.gpg > arquivo.txt

# Assinar arquivo
gpg --sign arquivo.txt
# Cria: arquivo.txt.gpg (assinado com SUA chave privada)`}
      />

      <h2>3. Git + GPG: commits assinados</h2>
      <CodeBlock
        code={`# Configurar Git para assinar commits
git config --global user.signingkey SUA-KEY-ID
git config --global commit.gpgsign true

# Key ID (últimos 16 caracteres do fingerprint)
gpg --list-secret-keys --keyid-format LONG
# sec   rsa4096/ABCD1234EFGH5678  ← isso é a Key ID

# Commitar com assinatura
git commit -S -m "commit assinado"

# Exportar chave para GitHub
gpg --armor --export SUA-KEY-ID
# Cole em: GitHub → Settings → SSH and GPG keys → New GPG key`}
      />

      <h2>4. Criptografia simétrica (senha)</h2>
      <CodeBlock
        code={`# Criptografar com senha (sem chave pública/privada)
gpg --symmetric arquivo.txt
# Digite a senha duas vezes
# Cria: arquivo.txt.gpg

# Descriptografar
gpg --decrypt arquivo.txt.gpg
# Digite a senha

# Vantagem: simples. Desvantagem: precisa compartilhar a senha.`}
      />

      <h2>5. Backup e segurança</h2>
      <CodeBlock
        code={`# Backup da chave privada (MUITO IMPORTANTE!)
gpg --armor --export-secret-keys wallyson@email.com > chave-privada.asc
# Guarde em local SEGURO (USB offline, cofre).
# Se perder, nunca mais descriptografa os arquivos.

# Backup de TODAS as chaves
gpg --armor --export-secret-keys > todas-chaves-privadas.asc
gpg --armor --export > todas-chaves-publicas.asc

# Revogar chave (se comprometida)
gpg --gen-revoke SUA-KEY-ID > revogacao.asc
# Guarde a revogação em local seguro.
# Se perder a chave E a revogação, não tem como revogar.`}
      />

      <h2>6. Servidores de chaves</h2>
      <CodeBlock
        code={`# Enviar chave pública para servidor
gpg --keyserver keys.openpgp.org --send-keys SUA-KEY-ID

# Buscar chave de alguém
gpg --keyserver keys.openpgp.org --search-keys email@dominio.com

# Atualizar chaves conhecidas
gpg --refresh-keys`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add gnupg && gpg --full-generate-key</code></li>
          <li><code>gpg --encrypt</code> / <code>--decrypt</code> para arquivos</li>
          <li><code>gpg --sign</code> para assinar; <code>--symmetric</code> com senha</li>
          <li>Git: <code>commit.gpgsign true</code> + key no GitHub</li>
          <li>BACKUP da chave privada e da revogação — sem eles é perda permanente</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}