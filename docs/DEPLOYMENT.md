# Publicação e mídias

## Estado atual e acesso

- Código: [repositório temporariamente público no GitHub](https://github.com/cristianworth/loveometro), branch `master`.
- LIVE: [https://cristianworth.github.io/loveometro/](https://cristianworth.github.io/loveometro/).
- A visibilidade pública do código, carta, histórico e pacote de mídias foi autorizada para viabilizar Pages no plano atual.
- O pacote das 39 fotos otimizadas e do MP3 está na [release `site-media`](https://github.com/cristianworth/loveometro/releases/tag/site-media).
- O workflow é manual: nenhum push publica o site automaticamente.

Primeira publicação concluída e conferida em 28/10/2026: [execução do GitHub Actions](https://github.com/cristianworth/loveometro/actions/runs/40767719134). A conferência incluiu os 35 arquivos de imagem, o áudio, o questionário até 100%, a órbita, o mural completo e a carta.

O plano atual exige repositório público para GitHub Pages. Ao terminar a comemoração, volte para privado: isso oculta o repositório de visitantes sem acesso e despublica automaticamente o Pages no GitHub Free. Consulte a [documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## O que vai para cada lugar

| Conteúdo | Destino |
| --- | --- |
| Código, testes e documentação | Histórico do repositório, público enquanto essa visibilidade estiver ativa. |
| Fotos e prints originais | `imagens/` e backup pessoal; excluídos do Git e do pacote. |
| Fotos WebP preparadas e MP3 | Pacote `site-media.tar.gz` na release `site-media`, com a mesma visibilidade do repositório. |
| HTML, CSS, JavaScript, fotos preparadas e áudio do build | Artefato temporário do Actions e GitHub Pages. |
| Credenciais | Gerenciador de credenciais local e `GITHUB_TOKEN` do Actions; nunca nos arquivos do projeto. |

## Preparar ou atualizar as mídias

Execute no checkout que possui os originais e o MP3:

```sh
npm ci
npm run prepare:media
npm run package:media
```

O pacote gerado em `.local/site-media.tar.gz` inclui somente os arquivos exigidos pelo site: as imagens WebP declaradas em `src/media.js` e `song/Avenged_Sevenfold_-_Gunslinger.mp3`. O comando exige `tar`, disponível no Windows atual e no runner Ubuntu do Actions. Originais, arquivos avulsos, credenciais e vídeos não entram no pacote.

O pacote fica como asset da [release `site-media`](https://github.com/cristianworth/loveometro/releases/tag/site-media). Quando substituir fotos ou música, substitua esse asset antes da próxima execução de publicação. O workflow usa sempre o arquivo com o nome `site-media.tar.gz` dessa release. Seu acesso acompanha a visibilidade do repositório.

Com GitHub CLI instalado e autenticado, o envio de uma atualização pode ser feito assim:

```sh
gh release upload site-media .local/site-media.tar.gz --clobber --repo cristianworth/loveometro
```

Esse comando substitui o pacote na release; não executa o workflow de publicação. O novo pacote pode ser baixado por quem tiver acesso à release.

## Restaurar o projeto em outro computador

Depois de clonar o repositório e instalar as dependências, baixe `site-media.tar.gz` da release e extraia na raiz do projeto. Se o repositório já tiver voltado para privado, autentique-se com uma conta autorizada. Com GitHub CLI:

```sh
gh release download site-media --pattern site-media.tar.gz --dir .local --repo cristianworth/loveometro
tar -xzf .local/site-media.tar.gz
npm run check:media
npm run dev
```

Essa restauração permite executar e construir o site. Para gerar novas cópias com `prepare:media`, também é necessário restaurar os originais de `imagens/` a partir do backup pessoal.

## Publicar ou atualizar o LIVE

1. Mantenha a visibilidade pública enquanto quiser o LIVE ativo no plano atual. O Pages usa **GitHub Actions** como fonte em **Settings → Pages**.
2. Confirme que a release `site-media` contém o pacote atualizado.
3. Em **Actions → Publish Loveometro → Run workflow**, escolha `master` e execute.
4. Acompanhe os jobs `build` e `deploy`. Só considere publicado depois que o job de deploy terminar com sucesso.
5. Abra a URL retornada pelo deploy e confira entrada, fotos, áudio, órbita e carta. Atualize o estado do LIVE no README com o endereço confirmado.

O workflow tem permissões de leitura do código, das mídias e da configuração do Pages no build. O job de deploy recebe somente `pages: write` e `id-token: write`, necessários à publicação. Os artefatos do build ficam retidos por um dia. A configuração `base: './'` mantém os caminhos dos assets relativos ao diretório do site.

## Conferências do LIVE

- Uma data errada mantém a abertura; `28/01` inicia o questionário e tenta tocar a música.
- Respostas erradas permitem nova tentativa e não pontuam; cada pergunta certa pontua uma única vez.
- A pergunta 8 exige “Todos acima” e mostra as três fotos.
- Nove cliques levam de 91% a 100%, mantendo todas as nove lembranças após a órbita.
- Repetir a órbita no mural ou na tela da carta, encerrá-la com o botão ou Esc e abrir a carta funcionam com a música em andamento.
- A mensagem da carta permanece exatamente como foi fornecida.

## Caso a publicação falhe

Se o repositório tiver voltado para privado, o plano atual não permitirá republicar: será necessário autorizar novamente o acesso público ou escolher um plano/hospedagem compatível. Se faltar mídia, atualize o pacote da release e execute novamente o workflow. Uma execução com falha não deve ser apresentada como LIVE concluído.

## Tirar o LIVE do ar

Para encerrar a comemoração e ocultar também o projeto do perfil público, abra **Settings → General → Danger Zone → Change repository visibility** e volte o repositório para **privado**. No GitHub Free, o Pages é automaticamente despublicado com essa alteração. Confira o acesso ao repositório e ao LIVE sem estar autenticado. Não é necessário apagar o código.

Se quiser apenas desligar o site, em **Settings → Pages** use **Unpublish site**. Isso remove a publicação atual, mas não muda a visibilidade do repositório: se ele continuar público, seu código e histórico continuarão acessíveis.

Como o workflow é manual, fazer push não liga o LIVE novamente. Para republicar, é necessário executar uma nova publicação. Uma página ou mídia que alguém já tenha salvo pode continuar existindo fora do LIVE; isso não exige acesso ao repositório privado.

Referência: [despublicar um site no GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site).
