// Quiz captions are editable drafts. The closing letter preserves the supplied text.
export const couple = {
  from: 'dada',
  to: 'babydoll',
  date: '28/02',
  closingTitle: 'O medidor acaba. A gente continua.',
  closingMessage: `O site é feito com IA mas essa mensagem e o nosso amor não são!

Venho aqui no final pra dizer que te amo muito, e admiro a mulher que vc se tornou: forte, dedicada, trabalhadora, amorosa, prestativa e carinhosa. Muito lindo ver você se esforçando pra ser uma pessoa melhor pra nós dois!

E eu nunca fui tão próximo de alguém como eu sou de você, eu aprendo muito em pontos que nunca refleti em mim mesmo, vc faz me ver coisas em mim que nem eu mesmo conhecia: ter a capacidade de amar mesmo sendo pouco sentimentalista, se importar mais com sua rotina do que a minha, escutar horas de kpop e até gostar de algumas, explorar lugares mesmo não gostando de sair de casa, estudar e entender politica mesmo detestando, e muito mais.

Você me mudou de tantas maneiras que eu nem sei quantificar, e vou continuar mudando pois é isso que significa o amor, colocar uma pessoa acima dos seus desejos, necessidades e prioridades, é rotacionar seu mundo ao redor dela, e termino assim desejando que para todo o sempre eu continue a orbitar ao redor do meu sol mais brilhante.

Te amo baby!

Com amor, dada ♡`,
};

export const questions = [
  {
    id: 'first-message', chapter: 'Só mais uma partida…',
    title: 'Onde começou essa história que trouxe a gente até aqui?',
    options: ['No League of Legends.', 'Em um aplicativo de namoro.', 'Na fila de uma cafeteria.', 'Em uma reunião que poderia ter sido um e-mail.'],
    correct: [0],
    hints: ['Pensa em uma tela de carregamento…', 'Uma dica: era para ser só um jogo.'],
    success: 'De uma partida para uma conversa. De uma conversa para nós.',
    note: 'A primeira mensagem ficou guardada. O resto a gente foi escrevendo junto.',
    photos: ['firstMessage'],
  },
  {
    id: 'botlane', chapter: 'A nossa duo',
    title: 'Qual botlane tem a nossa cara?',
    options: ['Xayah e Rakan.', 'Lucian e Nami.', 'Yunara e Seraphine.', 'Jinx e Thresh.'],
    correct: [2],
    hints: ['Você está pensando no meta ou na nossa duo? 👀', 'Tem uma Seraphine nessa história…'],
    success: 'Essa é a dupla que eu escolho de novo.',
    note: 'Nem toda partida dá vitória. Jogar com você já é a minha parte favorita.',
    photos: ['botlane'],
  },
  {
    id: 'beach-house', chapter: 'Finalmente, pertinho',
    title: 'Qual foi o nosso primeiro cantinho juntos?',
    options: ['Uma cabana nas montanhas.', 'Uma casa de praia.', 'Um cruzeiro.', 'Uma barraca e muita coragem.'],
    correct: [1],
    hints: ['Tinha água por perto. E não era neve.', 'Acho que essa lembrança tem piscina…'],
    success: 'Depois de tanta tela, finalmente você estava ali.',
    note: '28 de fevereiro. O começo oficial da nossa história.',
    photos: ['pool'],
  },
  {
    id: 'flowers', chapter: 'Carinho em forma de presente',
    title: 'Qual destes presentes eu já te dei várias vezes?',
    options: ['Um troféu de melhor suporte.', 'Flores.', 'Um teclado.', 'Um passe vitalício para me carregar no LoL.'],
    correct: [1],
    hints: ['É um presente que combina com esse site inteiro.', 'Tem pétalas nessa resposta. 🌹'],
    success: 'E eu responderia com flores de novo.',
    note: 'Muitas flores. Muitos jeitos de dizer que eu penso em você.',
    photos: ['firstFlowers', 'holdingFlowers', 'thirdFlowers'],
  },
  {
    id: 'picnic', chapter: 'Um date para guardar',
    title: 'Qual destes dates já entrou para a nossa história?',
    options: ['Uma aula de mergulho.', 'Uma corrida de kart.', 'Um piquenique na praça.', 'Uma expedição para ver neve.'],
    correct: [2],
    hints: ['Uma toalha, umas comidinhas…', 'A resposta está bem pertinho da grama.'],
    success: 'Um date simples. Uma lembrança enorme.',
    note: 'Não precisava de muito. A companhia já era a melhor parte.',
    photos: ['picnicPlace', 'picnicFood'],
  },
  {
    id: 'food', chapter: 'Amor com acompanhamento',
    title: 'Se os nossos rolês virassem um álbum, o que teria bastante espaço?',
    options: ['Esportes radicais.', 'Comidas que a gente foi experimentar.', 'Museus de tratores.', 'Trilhas que começam às cinco da manhã.'],
    correct: [1],
    hints: ['Essa pergunta dá até uma fominha…', 'A nossa galeria tem provas. E bastante pizza.'],
    success: 'Nosso relacionamento também tem acompanhamento e sobremesa.',
    note: 'Do gourmet ao lanche de rua. Sempre cabe mais um date com você.',
    photos: ['gourmet', 'burger', 'coffee', 'fries', 'pizza', 'hotdog', 'burgerIcecream', 'breakfast', 'sandwich', 'anotherPizza', 'meat', 'morePizza', 'sausage', 'xis', 'pizzaAgain'],
    layout: 'food',
  },
  {
    id: 'our-people', chapter: 'Gente que faz parte',
    title: 'Quem também fez parte dos nossos rolês e registros?',
    subtitle: 'Pensa nos nossos encontros, na família e nos amigos de Fortaleza.',
    options: ['Daniel.', 'Cristiane, Arthur, Carine.', 'Cabral, Lucas, Ale (CE).', 'Todos acima.'],
    correct: [3],
    hints: ['Sim! Mas tem mais gente que também faz parte.', 'Lembra dos rolês com a família e com os amigos de Fortaleza também.'],
    success: 'Todos eles! Cada um faz parte de um pedacinho da nossa história.',
    note: 'E assim a nossa história foi encontrando outras pessoas queridas.',
    photos: ['daniel', 'family', 'fortalezaFriends'],
  },
  {
    id: 'our-routine', chapter: 'O nosso jeito de estar perto',
    title: 'Mesmo longe, o que virou parte da nossa rotina?',
    options: ['Jogar juntos.', 'Assistir a filmes e séries.', 'Dormir em call.', 'Tudo isso. A gente dá um jeito de ficar junto.'],
    correct: [3],
    hints: ['Sim… mas você está esquecendo um pedacinho.', 'Tem uma resposta que junta tudo o que a gente faz.'],
    success: '226 horas de call. E ainda tem assunto.',
    note: 'babydoll e dada. O nosso jeito de encurtar a distância.',
    photos: ['call'],
  },
];

// These are eight memories, not a month-by-month chronology.
export const finalMemories = ['shopping', 'dogWalk', 'resting', 'necklace', 'pickingFlowers', 'goodbye', 'hug', 'together'];
