# Nosso Loveômetro

Um presente de Cristian para Nara: nove perguntas, lembranças de vocês e um coração que chega aos 100% para celebrar nove meses de namoro. Experiência pensada para PC, com vermelho, rosa, branco, polaroides, rosas e confetes.

**LIVE:** [cristianworth.github.io/loveometro](https://cristianworth.github.io/loveometro/).

**Repositório:** [cristianworth/loveometro](https://github.com/cristianworth/loveometro), temporariamente público para permitir GitHub Pages no plano atual. Depois da comemoração, volte o repositório para privado para ocultar o código e desligar o LIVE.

## A experiência

1. A data `28/01` abre a história e inicia **Gunslinger**, do Avenged Sevenfold. A música fica em loop, com controles de pausa e volume.
2. Cada pergunta certa revela fotos e aumenta o loveômetro. Respostas erradas dão dicas e permitem tentar novamente.
3. As nove perguntas completam **91%**. A pergunta 7 é sobre o melhor motorista; as duas últimas mantêm respostas que reúnem todas as alternativas. A pergunta 8 aceita **“Todos acima”** e revela as três fotos dos encontros com amigos e família.
4. Nove cliques revelam mais nove lembranças e acrescentam **1% por clique**.
5. Aos **100%**, as fotos orbitam um coração luminoso e retornam ao mural. A sequência dura cerca de 5,6 segundos e pode ser repetida ou encerrada antes.
6. **“Abrir minha carta”** exibe a mensagem pessoal, preservada conforme o texto fornecido. A tela final também permite **“Rever nossa órbita”**, sem reiniciar o questionário.

As nove fotos finais representam lembranças do relacionamento, sem atribuir cada imagem a um mês específico. As imagens reveladas podem ser ampliadas; a pergunta das comidas tem uma galeria própria. A animação respeita a preferência por movimento reduzido.

## Executar no computador

Requisitos: Node.js 24, npm e as mídias locais. O código usa HTML, CSS, JavaScript, Vite e `canvas-confetti`.

```sh
npm ci
npm run prepare:media
npm run dev
```

Abra a URL `Local` exibida pelo Vite. A entrada aceita `28/01` ou `2801`.

As mídias ficam nos caminhos abaixo e não acompanham um clone do código:

- `imagens/`: fotos e prints originais, incluindo as pastas `comida/`, `flores/` e `8marks/`.
- `public/media/`: cópias WebP geradas por `prepare:media`, sem modificar os originais.
- `song/Avenged_Sevenfold_-_Gunslinger.mp3`: música usada durante a experiência.

O pacote de mídias da [release `site-media`](https://github.com/cristianworth/loveometro/releases/tag/site-media) permite restaurar o site em outro computador sem precisar dos originais. Veja [Publicação e mídias](docs/DEPLOYMENT.md).

## Onde editar

| Arquivo | Responsabilidade |
| --- | --- |
| [src/content.js](src/content.js) | Perguntas, alternativas, dicas, ordem das nove lembranças e carta. |
| [src/media.js](src/media.js) | Caminhos dos originais, legendas e descrições das imagens. |
| [src/game.js](src/game.js) | Pontuação, avanço entre etapas e abertura da carta. |
| [src/main.js](src/main.js) | Telas, eventos, galeria, fotos ampliadas e música. |
| [src/celebration.js](src/celebration.js) | Órbita das fotos, coração luminoso e retorno ao mural. |
| [src/styles.css](src/styles.css) | Aparência e animações do site. |

Ao trocar fotos, atualize os caminhos em `src/media.js` e execute `npm run prepare:media`. As alterações de texto na carta devem ser intencionais; as quebras de parágrafo atuais servem apenas à leitura.

## Verificar e gerar a versão final

```sh
npm run check:media
npm test
npm run build
npm run preview
```

O resultado fica em `dist/`. `preview` serve para conferir esse build localmente.

Os testes cobrem a data, respostas erradas, pontuação sem duplicidade, a pergunta 8, os 91% + nove cliques e a abertura da carta somente depois de todas as lembranças. Na conferência prática, teste também o áudio, a galeria, a ampliação das fotos, a nona foto e a repetição/saída da órbita.

## Publicação

O workflow [Publish Loveometro](.github/workflows/pages.yml) é **manual**. Fazer push atualiza o código, mas não publica nem altera o acesso ao site automaticamente.

A publicação usa o pacote de mídias da release `site-media`, separado do histórico Git. O workflow restaura as mídias, confere os arquivos, executa os testes e gera o site antes de publicar. Os originais permanecem somente no computador e no backup pessoal. A visibilidade do pacote acompanha a do repositório.

Consulte [Publicação e mídias](docs/DEPLOYMENT.md) para preparar o pacote, atualizar os arquivos e publicar.

## Privacidade

- O repositório está temporariamente público por autorização do proprietário: código, carta, histórico e pacote de publicação podem ser acessados enquanto essa visibilidade estiver ativa.
- Fotos e áudio ficam fora do histórico do código, mas suas cópias de publicação estão no LIVE e no pacote da release. Dependências, builds locais e temporários também ficam fora do Git.
- **Ao voltar o repositório para privado no GitHub Free, o Pages é automaticamente despublicado.** Somente tirar o LIVE do ar não torna o repositório privado; para ocultar o projeto do perfil público, altere também a visibilidade.
- A data inicial faz parte da brincadeira e **não é autenticação**. `noindex` pede exclusão dos buscadores, mas não protege o conteúdo.
- O build contém as fotos preparadas e o áudio. Regras de `.gitignore` não restringem o acesso aos arquivos que forem publicados nem concedem licença de redistribuição da música.

Mantenha um backup separado das mídias: o histórico do código não substitui esse backup. A versão inicial do projeto permanece `0.1.0`.
