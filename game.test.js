const GameController = require('./game');

test('Player X wins in a row', () => {
  const game = GameController();
  game.playRound(0, 0); // Player X
  game.playRound(1, 0); // Player O
  game.playRound(0, 1); // Player X
  game.playRound(1, 1); // Player O
  game.playRound(0, 2); // Player X
  expect(game.checkOverallWinner()).toEqual({ name: 'Player One', token: 'X' });
});

test('Player O wins in a column', () => {
  const game = GameController('Player One', 'Player Two');
  game.playRound(0, 0); // Player X
  game.playRound(0, 1); // Player O
  game.playRound(1, 0); // Player X
  game.playRound(1, 1); // Player O
  game.playRound(2, 2); // Player X
  game.playRound(2, 1); // Player O
  expect(game.checkOverallWinner()).toEqual({ name: 'Player Two', token: 'O' });
});

test('Player X wins diagonally', () => {
  const game = GameController();
  game.playRound(0, 0); // Player X
  game.playRound(0, 1); // Player O
  game.playRound(1, 1); // Player X
  game.playRound(1, 2); // Player O
  game.playRound(2, 2); // Player X
  expect(game.checkOverallWinner()).toEqual({ name: 'Player One', token: 'X' });
});

test('Player O wins diagonally', () => {
  const game = GameController('Player One', 'Player Two');
  game.playRound(0, 1); // Player X
  game.playRound(0, 0); // Player O
  game.playRound(1, 0); // Player X
  game.playRound(1, 1); // Player O
  game.playRound(2, 0); // Player X
  game.playRound(2, 2); // Player O
  expect(game.checkOverallWinner()).toEqual({ name: 'Player Two', token: 'O' });
});

test('Game ends in a draw', () => {
  const game = GameController('Player One', 'Player Two');
  game.playRound(0, 0); // Player X
  game.playRound(1, 1); // Player O
  game.playRound(2, 0); // Player X
  game.playRound(1, 0); // Player O
  game.playRound(1, 2); // Player X
  game.playRound(0, 1); // Player O
  game.playRound(2, 1); // Player X
  game.playRound(2, 2); // Player O
  game.playRound(0, 2); // Player X
  expect(game.checkOverallWinner()).toBeNull();
});
