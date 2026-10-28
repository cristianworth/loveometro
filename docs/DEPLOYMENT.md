# Publicação e mídias

## Estado atual e acesso

- Código: [repositório privado no GitHub](https://github.com/cristianworth/loveometro), branch `master`.
- LIVE previsto: [https://cristianworth.github.io/loveometro/](https://cristianworth.github.io/loveometro/).
- A ativação do Pages e a execução da publicação aguardam confirmação de que o site e suas mídias podem ficar acessíveis publicamente.
- O pacote de mídias foi preparado em `.local/site-media.tar.gz`, mas ainda não foi enviado ao GitHub. A criação da release privada `site-media` e o envio do pacote também aguardam autorização.
- O workflow é manual: nenhum push publica o site automaticamente.

Para usar Pages a partir deste repositório privado, a conta precisa de um plano compatível, como GitHub Pro. Essa disponibilidade ainda precisa ser confirmada na ativação. Consulte a [documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## O que vai para cada lugar

| Conteúdo | Destino |
| --- | --- |
| Código, testes e documentação | Histórico do repositório privado. |
| Fotos e prints originais | `imagens/` e backup pessoal; excluídos do Git e do pacote. |
| Fotos WebP preparadas e MP3 | Pacote `site-media.tar.gz` na release privada `site-media`. |
| HTML, CSS, JavaScript, fotos preparadas e áudio do build | Artefato temporário do Actions e, após publicação autorizada, GitHub Pages. |
| Credenciais | Gerenciador de credenciais local e `GITHUB_TOKEN` do Actions; nunca nos arquivos do projeto. |

## Preparar ou atualizar as mídias

Execute no checkout que possui os originais e o MP3:

```sh
npm ci
npm run prepare:media
npm run package:media
```

O pacote gerado em `.local/site-media.tar.gz` inclui somente os arquivos exigidos pelo site: as imagens WebP declaradas em `src/media.js` e `song/Avenged_Sevenfold_-_Gunslinger.mp3`. O comando exige `tar`, disponível no Windows atual e no runner Ubuntu do Actions. Originais, arquivos avulsos, credenciais e vídeos não entram no pacote.

Após autorizar o envio, crie uma release privada com a tag `site-media` na [página de releases do repositório](https://github.com/cristianworth/loveometro/releases) e envie o pacote como asset. Quando substituir fotos ou música, substitua esse asset antes da próxima execução de publicação. O workflow usa sempre o arquivo com o nome `site-media.tar.gz` dessa release.

Com GitHub CLI instalado e autenticado, o envio de uma atualização pode ser feito assim:

```sh
gh release upload site-media .local/site-media.tar.gz --clobber --repo cristianworth/loveometro
```

Esse comando substitui o pacote na release privada; não publica o site.

## Restaurar o projeto em outro computador

Depois de clonar o repositório privado e instalar as dependências, baixe `site-media.tar.gz` da release e extraia na raiz do projeto. Com GitHub CLI:

```sh
gh release download site-media --pattern site-media.tar.gz --dir .local --repo cristianworth/loveometro
tar -xzf .local/site-media.tar.gz
npm run check:media
npm run dev
```

Essa restauração permite executar e construir o site. Para gerar novas cópias com `prepare:media`, também é necessário restaurar os originais de `imagens/` a partir do backup pessoal.

## Publicar após confirmar o acesso público

1. Habilite GitHub Pages em **Settings → Pages**, usando **GitHub Actions** como fonte. Preserve o repositório privado.
2. Confirme que a release privada `site-media` contém o pacote atualizado.
3. Em **Actions → Publish Loveometro → Run workflow**, escolha `master` e execute.
4. Acompanhe os jobs `build` e `deploy`. Só considere publicado depois que o job de deploy terminar com sucesso.
5. Abra a URL retornada pelo deploy e confira entrada, fotos, áudio, órbita e carta. Atualize o estado do LIVE no README com o endereço confirmado.

O workflow tem permissões de leitura do código, das mídias e da configuração do Pages no build. O job de deploy recebe somente `pages: write` e `id-token: write`, necessários à publicação. Os artefatos do build ficam retidos por um dia. A configuração `base: './'` mantém os caminhos dos assets relativos ao diretório do site.

## Conferências do LIVE

- Uma data errada mantém a abertura; `28/02` inicia o questionário e tenta tocar a música.
- Respostas erradas permitem nova tentativa e não pontuam; cada pergunta certa pontua uma única vez.
- A pergunta 7 exige “Todos acima” e mostra as três fotos.
- Oito cliques levam de 92% a 100%, mantendo todas as oito lembranças após a órbita.
- Repetir a órbita, encerrá-la com o botão ou Esc e abrir a carta funcionam com a música em andamento.
- A mensagem da carta permanece exatamente como foi fornecida.

## Caso a publicação falhe

Se o Pages não estiver disponível no plano da conta, preserve o repositório privado e escolha uma hospedagem compatível antes de alterar a visibilidade. Se faltar mídia, atualize o pacote da release e execute novamente o workflow. Uma execução com falha não deve ser apresentada como LIVE concluído.
