import confetti from 'canvas-confetti';
import './styles.css';
import { couple, finalMemories, questions } from './content.js';
import { addMonth, answerQuestion, createGame, getProgress, isSpecialDate, nextQuestion, openLetter } from './game.js';
import { media, mediaUrl } from './media.js';
import { playMemoryOrbit } from './celebration.js';

const app = document.querySelector('#app');
const dialog = document.querySelector('#photo-dialog');
const songs = import.meta.glob('../song/*.{mp3,m4a,ogg,wav}', { eager: true, query: '?url', import: 'default' });
const songSource = songs['../song/Avenged_Sevenfold_-_Gunslinger.mp3'];
const audio = songSource ? new Audio(songSource) : null;
const musicButton = document.querySelector('#music-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let game = null;
let selectedAnswer = null;
let galleryIndex = 0;
let lastPhotoTrigger = null;
let previousProgress = 0;
let orbitPlaying = false;

const rose = `<svg class="rose" viewBox="0 0 100 190" aria-hidden="true"><path d="M52 77C30 120 70 142 42 185M49 133C18 131 18 109 44 121M51 154C76 132 86 142 58 163" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M52 80C18 75 17 43 34 38 22 13 48 9 56 24 76 4 96 28 78 43 100 60 77 83 52 80Z" fill="#e53b61" stroke="currentColor" stroke-width="2"/><path d="M34 38C52 28 79 43 64 59 48 75 29 48 45 42 61 35 72 58 52 65M56 24C42 25 40 33 43 38M78 43C79 65 67 78 52 80" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const heart = '<span aria-hidden="true">♥</span>';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function photo(id, { small = false, newPhoto = false, index = 0 } = {}) {
  const asset = media[id];
  return `<figure class="polaroid ${asset.kind || ''} ${small ? 'small-photo' : ''} ${newPhoto ? 'photo-arrives' : ''}" style="--tilt:${[-4, 3, -2, 4, -3, 2, -2, 3][index % 8]}deg;--photo-index:${index}"><button class="photo-button" data-photo="${id}" aria-label="Ampliar: ${escapeHtml(asset.alt)}"><img src="${mediaUrl(id)}" alt="${escapeHtml(asset.alt)}" loading="${small ? 'lazy' : 'eager'}" /></button><figcaption>${escapeHtml(asset.caption)}</figcaption></figure>`;
}

function meter() {
  const progress = getProgress(game);
  const from = previousProgress;
  previousProgress = progress;
  const display = Number.isInteger(progress) ? progress : progress.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return `<aside class="meter-panel"><div class="meter-heading">O nosso loveômetro ${heart}</div><div class="thermometer" role="progressbar" aria-label="Loveômetro" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div class="thermometer-track"><div class="thermometer-fill" style="--fill:${progress}%;--previous-fill:${from}%"></div><div class="meter-ticks" aria-hidden="true"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div></div><div class="thermometer-bulb">${heart}</div></div><div class="meter-value">${display}<span>%</span></div><p class="meter-description">${game.stage === 'quiz' ? 'Cada lembrança deixa<br>o coração mais cheio.' : game.stage === 'months' ? 'Falta só um pouquinho<br>da nossa história.' : 'Cheio de nós.'}</p><div class="meter-flower">${rose}</div></aside>`;
}

function renderEntry() {
  app.innerHTML = `<section class="entry-screen screen-arrives"><div class="entry-copy"><p class="personal-note">Para a minha baby,</p><h1>Tem uma data<br>que mudou<br><em>tudo.</em></h1><p class="entry-description">De todas as partidas, conversas e caminhos,<br>o meu favorito foi o que me trouxe até você.</p><div class="entry-signature">Com amor, dada <span aria-hidden="true">♡</span></div></div><div class="envelope-scene"><div class="envelope-back"></div><section class="entry-letter"><span class="letter-heart" aria-hidden="true">♡</span><h2>Você lembra<br>do nosso começo?</h2><p>Tem uma data que abre essa história.</p><form id="date-form" novalidate><label for="special-date">Qual é a nossa data?</label><input id="special-date" name="date" type="text" inputmode="numeric" placeholder="DD / MM" maxlength="5" autocomplete="off" aria-describedby="date-feedback" required /><p id="date-feedback" class="date-feedback" role="status">Uma dica: o dia em que tudo ficou oficial.</p><button class="primary-button" type="submit">Abrir nossa história ${heart}</button></form><span class="letter-footnote">oito meses. tanta coisa nossa.</span></section><div class="envelope-front" aria-hidden="true"></div><div class="envelope-rose">${rose}</div><span class="envelope-stamp" aria-hidden="true">feito<br>com<br>amor ♡</span></div></section>`;
  document.querySelector('#date-form').addEventListener('submit', unlock);
  document.querySelector('#special-date').addEventListener('input', (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
    event.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    event.target.removeAttribute('aria-invalid');
  });
}

function unlock(event) {
  event.preventDefault();
  const input = document.querySelector('#special-date');
  if (!isSpecialDate(input.value)) {
    input.setAttribute('aria-invalid', 'true');
    document.querySelector('#date-feedback').textContent = 'Quase… pensa no dia em que a gente se encontrou. ♡';
    input.focus();
    input.animate(reducedMotion.matches ? [] : [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }], { duration: 250 });
    return;
  }
  // Start playback inside the submit gesture, before rendering or awaiting anything.
  playMusic();
  game = createGame(questions.length);
  previousProgress = 0;
  renderQuiz(true);
  document.querySelector('#question-title').focus({ preventScroll: true });
}

function renderQuiz(enter = false) {
  const question = questions[game.questionIndex];
  const hint = game.wrongAttempts ? question.hints[(game.wrongAttempts - 1) % question.hints.length] : '';
  app.innerHTML = `<section class="game-layout ${enter ? 'screen-arrives' : ''}">${meter()}<div class="quiz-workspace"><div class="chapter-line"><span>${escapeHtml(question.chapter)}</span><span class="question-counter">${String(game.questionIndex + 1).padStart(2, '0')} <span>/ ${questions.length}</span></span></div><div class="question-layout"><section class="question-paper"><span class="paper-heart" aria-hidden="true">♡</span><h1 id="question-title" tabindex="-1">${escapeHtml(question.title)}</h1><p class="question-subtitle">${question.subtitle || 'Uma lembrança de cada vez. Sem pressa.'}</p><div class="answers">${question.options.map((option, index) => `<button class="answer-button ${game.answered && question.correct.includes(index) ? 'is-correct' : ''} ${selectedAnswer === index && !game.answered ? 'is-incorrect' : ''}" data-answer="${index}" ${game.answered ? 'disabled' : ''}><span class="answer-letter">${game.answered && question.correct.includes(index) ? '♥' : String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span>${game.answered && selectedAnswer === index ? '<span class="answer-check" aria-label="Resposta certa">✓</span>' : ''}</button>`).join('')}</div><div class="answer-feedback ${game.answered ? 'success-feedback' : ''}" role="status">${game.answered ? `${heart} ${escapeHtml(question.success)}` : escapeHtml(hint)}</div>${game.answered ? `<button class="primary-button next-button" data-next>${game.questionIndex === questions.length - 1 ? 'E o que falta?' : 'Próxima lembrança'} <span aria-hidden="true">→</span></button>` : '<p class="question-footnote">pode tentar de novo quantas vezes quiser ♡</p>'}</section><section class="memory-space ${game.answered ? 'is-revealed' : ''}" aria-label="Lembrança desta pergunta">${game.answered ? renderQuestionMemory(question) : `<div class="memory-envelope"><div class="memory-envelope-icon" aria-hidden="true">♡</div><p>Uma lembrança nossa<br>está guardadinha aqui.</p><span>Acerte para abrir.</span></div>${rose}`}</section></div><div class="chapter-progress" aria-label="${game.completedQuestions} de ${questions.length} perguntas concluídas">${questions.map((_, index) => `<span class="${index < game.completedQuestions ? 'done' : index === game.questionIndex ? 'current' : ''}" aria-hidden="true">♥</span>`).join('')}</div></div></section>`;
}

function renderQuestionMemory(question) {
  if (question.layout === 'food') {
    const active = question.photos[galleryIndex];
    return `<div class="food-gallery">${photo(active, { newPhoto: true })}<div class="gallery-controls"><button data-gallery="-1" aria-label="Foto de comida anterior">←</button><span>${galleryIndex + 1} / ${question.photos.length} dates deliciosos</span><button data-gallery="1" aria-label="Próxima foto de comida">→</button></div></div><p class="memory-note">${escapeHtml(question.note)}</p>`;
  }
  if (question.photos[0] === 'call') {
    return `<div class="call-memory photo-arrives"><div class="call-record"><span>226</span><span>horas em call</span><div>baby <span aria-hidden="true">♡</span> dada</div></div>${photo('call')}<span class="call-exact">226 horas, 33 minutos e 40 segundos.</span></div><p class="memory-note">${escapeHtml(question.note)}</p>`;
  }
  return `<div class="memory-photos count-${question.photos.length}">${question.photos.map((id, index) => photo(id, { small: question.photos.length > 1, newPhoto: true, index })).join('')}</div><p class="memory-note">${escapeHtml(question.note)}</p>`;
}

function celebrate({ big = false, origin } = {}) {
  confetti({ particleCount: big ? 140 : 24, spread: big ? 105 : 48, startVelocity: big ? 44 : 20, gravity: 0.85, scalar: big ? 1.1 : 0.8, colors: ['#b81238', '#f2557d', '#ffc4d5', '#ffffff'], origin: origin || { x: big ? 0.5 : 0.58, y: big ? 0.57 : 0.52 }, disableForReducedMotion: true });
  if (big) {
    const heartShape = confetti.shapeFromPath({ path: 'M 0 10 C -22 -4 -10 -20 0 -10 C 10 -20 22 -4 0 10 Z' });
    confetti({ shapes: [heartShape], particleCount: 44, spread: 150, startVelocity: 36, scalar: 2, colors: ['#b81238', '#f2557d', '#ffc4d5'], origin: { x: 0.5, y: 0.5 }, disableForReducedMotion: true });
  }
}

function renderMonths(enter = false) {
  const complete = game.stage === 'memories-complete';
  app.innerHTML = `<section class="game-layout months-layout ${enter ? 'screen-arrives' : ''}">${meter()}<section class="months-workspace"><p class="personal-note">${complete ? 'Agora está tudo aqui. Cheio de nós.' : 'Ué… ainda falta alguma coisa.'}</p><h1 id="months-title" tabindex="-1">Oito meses.<br><em>Oito pedacinhos de nós.</em></h1><p class="months-description">${complete ? 'Oito lembranças guardadas. E uma carta minha para você.' : 'Cada clique, uma lembrança. Cada lembrança, um pouquinho mais de amor.'}</p><div class="memory-board">${finalMemories.map((id, index) => index < game.months ? photo(id, { small: true, newPhoto: index === game.months - 1, index }) : `<div class="empty-polaroid" aria-label="Lembrança ${index + 1} ainda guardada"><span aria-hidden="true">♡</span><span>${index + 1}</span></div>`).join('')}</div>${complete ? `<div class="completed-memory-actions"><button class="primary-button" data-open-letter>Abrir minha carta ${heart}</button><button class="text-button" data-replay-orbit>Rever nossa órbita</button></div>` : '<button class="love-button" id="add-love" aria-label="Adicionar 1% e revelar a próxima lembrança"><span aria-hidden="true">♥</span><span>Mais um pedacinho</span><span class="love-increment">+1%</span></button>'}<p class="click-counter" role="status">${game.months} de 8 lembranças reveladas</p></section></section>`;
}

async function startOrbitCelebration() {
  if (orbitPlaying || game?.stage !== 'memories-complete') return;
  orbitPlaying = true;
  const replay = document.querySelector('[data-replay-orbit]');
  replay.disabled = true;
  try {
    await playMemoryOrbit(document.querySelector('.memory-board'));
  } catch (error) {
    console.warn('The celebration could not finish; the memory board is still available.', error);
  } finally {
    orbitPlaying = false;
    if (replay.isConnected) {
      replay.disabled = false;
      document.querySelector('[data-open-letter]').focus({ preventScroll: true });
    }
  }
}

function renderFinal() {
  const paragraphs = couple.closingMessage.split('\n\n');
  const letter = paragraphs.map((paragraph, index) => `<p${index === paragraphs.length - 1 ? ' class="final-signature"' : ''}>${escapeHtml(paragraph)}</p>`).join('');
  app.innerHTML = `<section class="final-screen screen-arrives"><div class="final-heading"><div class="hundred">100<span>%</span><span class="hundred-heart" aria-hidden="true">♥</span></div><p class="personal-note">Feliz oito meses, baby.</p><h1 id="final-title" tabindex="-1">${escapeHtml(couple.closingTitle)}</h1></div><div class="letter-stationery"><div class="letter-envelope" aria-hidden="true"><span class="envelope-fold"></span><span class="letter-wax-seal">♥</span></div><article class="final-letter" aria-label="Carta de dada para baby"><header class="letter-heading"><div class="letter-address"><span>De dada,</span><h2>para a minha baby.</h2><p>Três de Maio <span aria-hidden="true">♡</span> Fortaleza</p></div><div class="letter-postage" aria-hidden="true"><span>♥</span><span>8 meses</span></div><div class="letter-postmark" aria-hidden="true"><span>com amor</span><strong>28/10</strong><span>desde 28/02</span></div></header><div class="letter-content">${letter}</div><div class="letter-pressed-rose" aria-hidden="true">${rose}</div></article></div><div class="final-photo-wall">${finalMemories.map((id, index) => photo(id, { small: true, newPhoto: true, index })).join('')}</div><div class="final-actions"><button class="secondary-button" data-celebrate>Mais confetes! ${heart}</button><button class="text-button" data-restart>Rever nossa história</button></div><p class="final-postscript">e que venham todos os próximos capítulos.</p></section>`;
  document.querySelector('#final-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  celebrate({ big: true });
}

app.addEventListener('click', (event) => {
  const answer = event.target.closest('[data-answer]');
  if (answer && game) {
    const index = Number(answer.dataset.answer);
    const attempt = answerQuestion(game, questions[game.questionIndex], index);
    if (attempt.result === 'ignored') return;
    game = attempt.game;
    selectedAnswer = index;
    renderQuiz();
    if (attempt.result === 'correct') {
      celebrate();
      document.querySelector('[data-next]').focus({ preventScroll: true });
    } else {
      const selected = document.querySelector(`[data-answer="${index}"]`);
      selected.focus({ preventScroll: true });
      if (!reducedMotion.matches) selected.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 240 });
    }
    return;
  }
  if (event.target.closest('[data-next]') && game?.answered) {
    game = nextQuestion(game);
    selectedAnswer = null;
    galleryIndex = 0;
    if (game.stage === 'months') {
      renderMonths(true);
      document.querySelector('#months-title').focus({ preventScroll: true });
    } else {
      renderQuiz(true);
      document.querySelector('#question-title').focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0 });
    return;
  }
  const galleryButton = event.target.closest('[data-gallery]');
  if (galleryButton && game?.answered) {
    const photos = questions[game.questionIndex].photos;
    galleryIndex = (galleryIndex + Number(galleryButton.dataset.gallery) + photos.length) % photos.length;
    renderQuiz();
    document.querySelector(`[data-gallery="${galleryButton.dataset.gallery}"]`).focus({ preventScroll: true });
    return;
  }
  if (event.target.closest('#add-love') && game?.stage === 'months') {
    game = addMonth(game);
    renderMonths();
    document.querySelector(game.stage === 'memories-complete' ? '[data-open-letter]' : '#add-love').focus({ preventScroll: true });
    if (game.stage === 'memories-complete') startOrbitCelebration();
    else celebrate();
    return;
  }
  if (event.target.closest('[data-replay-orbit]')) {
    startOrbitCelebration();
    return;
  }
  if (event.target.closest('[data-open-letter]') && game?.stage === 'memories-complete') {
    game = openLetter(game);
    renderFinal();
    return;
  }
  const photoButton = event.target.closest('[data-photo]');
  if (photoButton) {
    const id = photoButton.dataset.photo;
    lastPhotoTrigger = photoButton;
    document.querySelector('#dialog-photo').src = mediaUrl(id);
    document.querySelector('#dialog-photo').alt = media[id].alt;
    document.querySelector('#dialog-caption').textContent = media[id].caption;
    dialog.showModal();
    return;
  }
  if (event.target.closest('[data-celebrate]')) celebrate({ big: true });
  if (event.target.closest('[data-restart]')) {
    game = createGame(questions.length);
    previousProgress = 0;
    selectedAnswer = null;
    galleryIndex = 0;
    renderQuiz(true);
    window.scrollTo({ top: 0 });
    document.querySelector('#question-title').focus({ preventScroll: true });
  }
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => lastPhotoTrigger?.focus({ preventScroll: true }));

function updateMusicControls() {
  const isPlaying = audio && !audio.paused;
  musicButton.setAttribute('aria-pressed', String(Boolean(isPlaying)));
  musicButton.setAttribute('aria-label', `${isPlaying ? 'Pausar' : 'Tocar'} Gunslinger`);
  document.querySelector('#music-status').textContent = isPlaying ? 'Ⅱ' : '▶';
}

function playMusic() {
  if (!audio) return;
  audio.play().then(updateMusicControls).catch(() => {
    // Keep the play control available when browser autoplay policy blocks playback.
    updateMusicControls();
  });
}

if (audio) {
  audio.id = 'background-music';
  audio.hidden = true;
  audio.loop = true;
  audio.volume = 0.3;
  audio.preload = 'auto';
  document.body.append(audio);
  document.querySelector('#music-controls').hidden = false;
  for (const event of ['play', 'pause', 'error']) audio.addEventListener(event, updateMusicControls);
  musicButton.addEventListener('click', () => {
    if (audio.paused) playMusic();
    else audio.pause();
  });
  document.querySelector('#music-volume').addEventListener('input', (event) => { audio.volume = Number(event.target.value); });
}

renderEntry();
