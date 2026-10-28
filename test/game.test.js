import test from 'node:test';
import assert from 'node:assert/strict';
import { addMonth, answerQuestion, createGame, getProgress, isSpecialDate, nextQuestion } from '../src/game.js';
import { finalMemories, questions } from '../src/content.js';

test('the date accepts both keyboard formats and rejects other dates', () => {
  for (const value of ['28/02', '2802', ' 28/02 ']) assert.equal(isSpecialDate(value), true);
  for (const value of ['', '28/03', '28022026', '2/802', '28/02abc']) assert.equal(isSpecialDate(value), false);
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
  const first = answerQuestion(createGame(8), questions[0], 0);
  const repeated = answerQuestion(first.game, questions[0], 0);
  assert.equal(repeated.result, 'ignored');
  assert.equal(getProgress(repeated.game), 11.5);
});

test('Daniel and Cristiane are independently accepted on question seven', () => {
  const question = questions[6];
  for (const accepted of [0, 2]) assert.equal(answerQuestion(createGame(8), question, accepted).result, 'correct');
  for (const rejected of [1, 3]) assert.equal(answerQuestion(createGame(8), question, rejected).result, 'incorrect');
});

test('the complete journey stops at 92 then needs exactly eight individual clicks', () => {
  let game = createGame(questions.length);
  assert.deepEqual(addMonth(game), game);
  for (const question of questions) {
    game = answerQuestion(game, question, question.correct[0]).game;
    game = nextQuestion(game);
  }
  assert.equal(game.stage, 'months');
  assert.equal(getProgress(game), 92);
  for (let count = 1; count <= 8; count++) {
    game = addMonth(game);
    assert.equal(getProgress(game), 92 + count);
    assert.equal(game.stage, count === 8 ? 'final' : 'months');
  }
  assert.deepEqual(addMonth(game), game);
  assert.equal(finalMemories.length, 8);
});
