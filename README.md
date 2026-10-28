# Nosso Loveômetro

A local desktop-first anniversary experience from dada to babydoll. Built with HTML, CSS, JavaScript, Vite and canvas-confetti.

## Local preview

```sh
npm install
npm run prepare:media
npm run dev
```

Open the Local URL printed by Vite. Enter `28/02` or `2802` to start. An incorrect date keeps the entry screen open. Each completed question contributes an equal share of 92%; the last eight percentage points require eight individual clicks.

The original files stay in `imagens/`. The media preparation script creates smaller, correctly oriented WebP copies in `public/media/`. Neither originals nor generated copies are committed. Keep a separate backup of personal files; cloning this repository alone will not restore them.

## Editable content

- `src/content.js`: questions, accepted answers, hints, final photo order and personal message. The personal message and captions are draft suggestions for review.
- `src/media.js`: original file paths, captions and image descriptions.
- `src/styles.css`: desktop layout and the red, pink and white palette.

Question 7 accepts Daniel or Cristiane independently and reveals both photographs. The eight final photographs represent memories of the relationship, not a factual month-by-month timeline. Clicking any revealed photograph opens a larger view. The 226-hour call screenshot stays close to its original dimensions.

## Music

Place the supplied audio at `song/Avenged_Sevenfold_-_Gunslinger.mp3`. The integration starts it synchronously in the successful date-form submission, loops it through all screens and provides pause/play and volume controls. An incorrect date does not start playback. If the browser blocks playback, the play button remains available. If the file is absent, the rest of the experience works and the controls stay hidden.

The audio is ignored by Git, but Vite includes it in a local production build when present. Publishing this build would also publish its images and audio; ignore rules do not provide access control or a music redistribution license. No publishing workflow is configured yet.

## Verification and build

```sh
npm test
npm run prepare:media
npm run build
npm run preview
```

The automated checks cover date validation, incorrect answers, repeated clicks, both accepted answers on question 7 and the exact 92% + eight clicks journey. Practical review should also cover image reveals, enlarging photos, the food gallery, keyboard navigation and music controls.

## Privacy and hosting

Everything currently runs locally. The date screen is part of the experience, not authentication. `noindex` requests exclusion from search engines but does not restrict access. Hosting and real access control remain to be chosen before publishing personal media.

## Version control

This initial delivery uses version `0.1.0`. There was no pre-existing version changelog. Personal media, audio, dependencies, temporary previews and generated builds are excluded from the repository.
