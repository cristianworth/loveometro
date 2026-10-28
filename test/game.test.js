import test from 'node:test';
import assert from 'node:assert/strict';
import { addMonth, answerQuestion, createGame, getProgress, isSpecialDate, nextQuestion, openLetter } from '../src/game.js';
import { finalMemories, questions } from '../src/content.js';

test('the date accepts both keyboard formats and rejects other dates', () => {
  for (const value of ['28/01', '2801', ' 28/01 ']) assert.equal(isSpecialDate(value), true);
  for (const value of ['', '28/02', '28/03', '28012026', '2/801', '28/01abc']) assert.equal(isSpecialDate(value), false);
});

test('incorrect answers neither award progress nor unlock the next question', () => {
  const initial = createGame(questions.length);
  const attempt = answerQuestion(initial, questions[0], 1);
  assert.equal(attempt.result, 'incorrect');
  assert.equal(getProgress(attempt.game), 0);
  assert.equal(attempt.game.wrongAttempts, 1);
  assert.deepEqual(nextQuestion(attempt.game), attempt.game);
});

test('an accepted answer awards progress only once, including double clicks', () => {
  const first = answerQuestion(createGame(questions.length), questions[0], 0);
  const repeated = answerQuestion(first.game, questions[0], 0);
  assert.equal(repeated.result, 'ignored');
  assert.equal(getProgress(repeated.game), 91 / 9);
});

test('question eight requires all three groups and reveals all three memories', () => {
  const question = questions[7];
  assert.equal(answerQuestion(createGame(questions.length), question, 3).result, 'correct');
  for (const rejected of [0, 1, 2]) assert.equal(answerQuestion(createGame(questions.length), question, rejected).result, 'incorrect');
  assert.deepEqual(question.photos, ['daniel', 'family', 'fortalezaFriends']);
});

test('the driver question follows food and keeps both inclusive answers last', () => {
  assert.equal(questions.length, 9);
  assert.deepEqual(questions.slice(5).map((question) => question.id), ['food', 'best-driver', 'our-people', 'our-routine']);
  const driver = questions[6];
  assert.equal(driver.options[driver.correct[0]], 'Cristian.');
  assert.deepEqual(driver.photos, ['driving']);
  for (const question of questions.slice(-2)) assert.deepEqual(question.correct, [3]);
  assert.equal(questions.find((question) => question.id === 'picnic').photos.length, 4);
});

test('the complete journey stops at 91 then needs exactly nine individual clicks', () => {
  let game = createGame(questions.length);
  assert.deepEqual(addMonth(game), game);
  for (const question of questions) {
    game = answerQuestion(game, question, question.correct[0]).game;
    game = nextQuestion(game);
  }
  assert.equal(game.stage, 'months');
  assert.equal(getProgress(game), 91);
  for (let count = 1; count <= 9; count++) {
    game = addMonth(game);
    assert.equal(getProgress(game), 91 + count);
    assert.equal(game.stage, count === 9 ? 'memories-complete' : 'months');
  }
  assert.deepEqual(addMonth(game), game);
  assert.equal(finalMemories.length, 9);
  assert.equal(game.months, finalMemories.length);
  assert.equal(openLetter(game).stage, 'final');
  assert.equal(getProgress(openLetter(game)), 100);
});

test('the letter cannot open before all nine memories have been revealed', () => {
  const quiz = createGame(questions.length);
  assert.deepEqual(openLetter(quiz), quiz);
  const incomplete = { ...quiz, stage: 'months', completedQuestions: questions.length, months: 8 };
  assert.deepEqual(openLetter(incomplete), incomplete);
});
