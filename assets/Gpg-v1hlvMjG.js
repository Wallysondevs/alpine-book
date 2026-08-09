import{j as e}from"./index-YFyZeUD9.js";import{P as s,A as r,C as a}from"./AlertBox-C2CyWd7R.js";function c(){return e.jsxs(s,{title:"GPG — Criptografia de Chaves",subtitle:"Gere chaves, criptografe arquivos, assine commits e gerencie sua identidade criptográfica.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx(r,{type:"info",title:"Pré-requisitos",children:"Nenhum. GPG é útil mesmo em desktop — não só em servidores."}),e.jsx("p",{children:"GPG (GNU Privacy Guard) é o padrão open source para criptografia assimétrica. Com ele você criptografa arquivos, assina digitalmente, autentica-se em serviços e protege comunicações."}),e.jsx("h2",{children:"1. Instalação e primeiras chaves"}),e.jsx(a,{code:`# Instalar GPG completo
apk add gnupg

# Gerar par de chaves
gpg --full-generate-key
# Tipo: RSA and RSA (padrão)
# Tamanho: 4096
# Validade: 2y (2 anos)
# Nome: Wallyson
# Email: wallyson@email.com
# Passphrase: ****** (NÃO ESQUEÇA!)`}),e.jsx("h2",{children:"2. Comandos essenciais"}),e.jsx(a,{code:`# Listar chaves
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
# Cria: arquivo.txt.gpg (assinado com SUA chave privada)`}),e.jsx("h2",{children:"3. Git + GPG: commits assinados"}),e.jsx(a,{code:`# Configurar Git para assinar commits
git config --global user.signingkey SUA-KEY-ID
git config --global commit.gpgsign true

# Key ID (últimos 16 caracteres do fingerprint)
gpg --list-secret-keys --keyid-format LONG
# sec   rsa4096/ABCD1234EFGH5678  ← isso é a Key ID

# Commitar com assinatura
git commit -S -m "commit assinado"

# Exportar chave para GitHub
gpg --armor --export SUA-KEY-ID
# Cole em: GitHub → Settings → SSH and GPG keys → New GPG key`}),e.jsx("h2",{children:"4. Criptografia simétrica (senha)"}),e.jsx(a,{code:`# Criptografar com senha (sem chave pública/privada)
gpg --symmetric arquivo.txt
# Digite a senha duas vezes
# Cria: arquivo.txt.gpg

# Descriptografar
gpg --decrypt arquivo.txt.gpg
# Digite a senha

# Vantagem: simples. Desvantagem: precisa compartilhar a senha.`}),e.jsx("h2",{children:"5. Backup e segurança"}),e.jsx(a,{code:`# Backup da chave privada (MUITO IMPORTANTE!)
gpg --armor --export-secret-keys wallyson@email.com > chave-privada.asc
# Guarde em local SEGURO (USB offline, cofre).
# Se perder, nunca mais descriptografa os arquivos.

# Backup de TODAS as chaves
gpg --armor --export-secret-keys > todas-chaves-privadas.asc
gpg --armor --export > todas-chaves-publicas.asc

# Revogar chave (se comprometida)
gpg --gen-revoke SUA-KEY-ID > revogacao.asc
# Guarde a revogação em local seguro.
# Se perder a chave E a revogação, não tem como revogar.`}),e.jsx("h2",{children:"6. Servidores de chaves"}),e.jsx(a,{code:`# Enviar chave pública para servidor
gpg --keyserver keys.openpgp.org --send-keys SUA-KEY-ID

# Buscar chave de alguém
gpg --keyserver keys.openpgp.org --search-keys email@dominio.com

# Atualizar chaves conhecidas
gpg --refresh-keys`}),e.jsx(r,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsx("li",{children:e.jsx("code",{children:"apk add gnupg && gpg --full-generate-key"})}),e.jsxs("li",{children:[e.jsx("code",{children:"gpg --encrypt"})," / ",e.jsx("code",{children:"--decrypt"})," para arquivos"]}),e.jsxs("li",{children:[e.jsx("code",{children:"gpg --sign"})," para assinar; ",e.jsx("code",{children:"--symmetric"})," com senha"]}),e.jsxs("li",{children:["Git: ",e.jsx("code",{children:"commit.gpgsign true"})," + key no GitHub"]}),e.jsx("li",{children:"BACKUP da chave privada e da revogação — sem eles é perda permanente"})]})})]})}export{c as default};
