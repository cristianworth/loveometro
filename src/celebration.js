import confetti from 'canvas-confetti';

const duration = 5600;
const colors = ['#b81238', '#f2557d', '#ffc4d5', '#ffffff'];

export async function playMemoryOrbit(board) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!board?.isConnected || motionPreference.matches) return;

  const memories = [...board.querySelectorAll('.polaroid')];
  if (memories.length !== 8) return;
  await Promise.allSettled(memories.map((memory) => memory.querySelector('img').decode()));
  if (!board.isConnected || motionPreference.matches) return;

  // Capture the settled mural so the flying photos return to their real positions.
  memories.forEach((memory) => memory.getAnimations().forEach((animation) => animation.finish()));
  const origins = memories.map((memory) => memory.getBoundingClientRect());
  const previousFocus = document.activeElement;
  const overlay = document.createElement('dialog');
  overlay.className = 'orbit-dialog';
  overlay.setAttribute('aria-labelledby', 'orbit-title');
  overlay.setAttribute('aria-describedby', 'orbit-description');
  overlay.innerHTML = `<div class="orbit-heading"><p>Feliz oito meses, baby.</p><h2 id="orbit-title">Você é o meu sol.</h2></div><div class="orbit-stage" aria-hidden="true"><div class="orbit-ring orbit-ring-one"></div><div class="orbit-ring orbit-ring-two"></div><div class="orbit-core"><div class="orbit-corona"></div><svg class="orbit-heart" viewBox="0 0 100 94"><defs><linearGradient id="orbit-heart-light" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#ffffff"/><stop offset=".42" stop-color="#ffd5df"/><stop offset="1" stop-color="#f2557d"/></linearGradient></defs><path d="M50 88 10 49C-15 22 20-10 50 20 80-10 115 22 90 49Z" fill="url(#orbit-heart-light)"/></svg><strong>100<span>%</span></strong></div><div class="orbit-stars">${Array.from({ length: 14 }, (_, index) => `<span style="--star:${index};left:${[11, 87, 22, 74, 7, 93, 35, 62, 17, 81, 43, 57, 28, 69][index]}%;top:${[15, 18, 73, 80, 50, 49, 7, 92, 89, 9, 48, 39, 37, 62][index]}%">${index % 3 ? '✦' : '♡'}</span>`).join('')}</div></div><div class="orbit-footer"><p id="orbit-description">Oito lembranças no nosso pequeno universo.</p><button type="button" class="orbit-return">Voltar às lembranças <span aria-hidden="true">♡</span></button></div><canvas class="orbit-confetti" aria-hidden="true"></canvas>`;

  const stage = overlay.querySelector('.orbit-stage');
  const cards = memories.map((memory) => {
    const card = document.createElement('figure');
    card.className = 'orbit-photo';
    const image = document.createElement('img');
    image.src = memory.querySelector('img').currentSrc || memory.querySelector('img').src;
    image.alt = '';
    card.append(image);
    stage.append(card);
    return card;
  });

  const animations = [];
  const burst = confetti.create(overlay.querySelector('canvas'), { resize: true, disableForReducedMotion: true });
  let dismiss;
  const dismissed = new Promise((resolve) => { dismiss = resolve; });
  const onPreferenceChange = () => { if (motionPreference.matches) dismiss(); };
  overlay.querySelector('.orbit-return').addEventListener('click', () => dismiss());
  overlay.addEventListener('cancel', (event) => { event.preventDefault(); dismiss(); });

  document.body.append(overlay);
  document.body.classList.add('is-celebrating');

  try {
    overlay.showModal();
    motionPreference.addEventListener('change', onPreferenceChange);
    window.addEventListener('resize', dismiss, { once: true });
    const bounds = stage.getBoundingClientRect();
    const width = Math.min(145, bounds.width * .17, bounds.height * .26);
    const height = width * 1.23;
    const radiusX = Math.max(0, (bounds.width - width) / 2 - 36);
    const radiusY = Math.max(0, (bounds.height - height) / 2 - 13);

    cards.forEach((card, index) => {
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;
      const origin = origins[index];
      const tilt = memories[index].style.getPropertyValue('--tilt') || '0deg';
      const home = `translate(${origin.left + origin.width / 2 - bounds.left - width / 2}px, ${origin.top + origin.height / 2 - bounds.top - height / 2}px) rotate(${tilt}) scale(${origin.width / width})`;
      const frames = [{ transform: home, opacity: 0, offset: 0 }];
      for (let step = 0; step <= 48; step++) {
        const angle = -Math.PI / 2 + index * Math.PI / 4 + step / 48 * Math.PI * 2;
        const x = bounds.width / 2 + Math.cos(angle) * radiusX - width / 2;
        const y = bounds.height / 2 + Math.sin(angle) * radiusY - height / 2;
        const scale = .86 + .12 * (Math.sin(angle) + 1) / 2;
        frames.push({ transform: `translate(${x}px, ${y}px) rotate(${Math.cos(angle) * 7}deg) scale(${scale})`, opacity: 1, offset: .14 + step / 48 * .66 });
      }
      frames.push({ ...frames.at(-1), offset: .86 }, { transform: home, opacity: 0, offset: 1 });
      animations.push(card.animate(frames, { duration, easing: 'linear', fill: 'both' }));
    });

    const heading = overlay.querySelector('.orbit-heading');
    const core = overlay.querySelector('.orbit-core');
    const footer = overlay.querySelector('.orbit-footer');
    for (const element of [heading, core, footer]) {
      animations.push(element.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .83 }, { opacity: 0, offset: 1 }], { duration, fill: 'both' }));
    }
    animations.push(overlay.animate([{ backgroundColor: '#560f2a00', offset: 0 }, { backgroundColor: '#560f2a', offset: .12 }, { backgroundColor: '#560f2a', offset: .85 }, { backgroundColor: '#560f2a00', offset: 1 }], { duration, fill: 'both' }));
    burst({ particleCount: 110, spread: 110, startVelocity: 38, gravity: .8, colors, origin: { x: .5, y: .5 }, scalar: .95 });

    await Promise.race([Promise.all(animations.map((animation) => animation.finished.catch(() => {}))), dismissed]);
  } finally {
    animations.forEach((animation) => animation.cancel());
    burst.reset();
    motionPreference.removeEventListener('change', onPreferenceChange);
    window.removeEventListener('resize', dismiss);
    overlay.close();
    overlay.remove();
    document.body.classList.remove('is-celebrating');
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }
}
