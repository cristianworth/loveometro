export const anniversaryMonths = 9;
export const quizProgress = 100 - anniversaryMonths;

export function isSpecialDate(value) {
  return /^28\/?01$/.test(String(value).trim());
}

export function createGame(totalQuestions) {
  if (!Number.isInteger(totalQuestions) || totalQuestions < 1) throw new RangeError('At least one question is required.');
  return { totalQuestions, completedQuestions: 0, questionIndex: 0, answered: false, wrongAttempts: 0, months: 0, stage: 'quiz' };
}

export function getProgress(game) {
  return quizProgress * game.completedQuestions / game.totalQuestions + game.months;
}

export function answerQuestion(game, question, optionIndex) {
  if (game.stage !== 'quiz' || game.answered || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return { game, result: 'ignored' };
  if (!question.correct.includes(optionIndex)) return { game: { ...game, wrongAttempts: game.wrongAttempts + 1 }, result: 'incorrect' };
  return { game: { ...game, completedQuestions: game.completedQuestions + 1, answered: true }, result: 'correct' };
}

export function nextQuestion(game) {
  if (game.stage !== 'quiz' || !game.answered) return game;
  if (game.completedQuestions === game.totalQuestions) return { ...game, stage: 'months' };
  return { ...game, questionIndex: game.questionIndex + 1, answered: false, wrongAttempts: 0 };
}

export function addMonth(game) {
  if (game.stage !== 'months') return game;
  const months = Math.min(anniversaryMonths, game.months + 1);
  return { ...game, months, stage: months === anniversaryMonths ? 'memories-complete' : 'months' };
}

export function openLetter(game) {
  if (game.stage !== 'memories-complete') return game;
  return { ...game, stage: 'final' };
}
