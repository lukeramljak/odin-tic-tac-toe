function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const getCell = (row, column) => board[row][column];

  const placeToken = (row, column, player) => {
    getCell(row, column).addToken(player);
  };

  return {
    rows,
    columns,
    getBoard,
    getCell,
    placeToken,
  };
}

function Cell() {
  let value = '';

  const addToken = (player) => (value = player);

  const getValue = () => value;

  const isAvailable = () => value === '';

  return {
    addToken,
    getValue,
    isAvailable,
  };
}

function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two',
) {
  const board = GameBoard();

  const players = [
    {
      name: playerOneName,
      token: 'X',
    },
    {
      name: playerTwoName,
      token: 'O',
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    if (board.getCell(row, column).isAvailable()) {
      board.placeToken(row, column, getActivePlayer().token);
      switchPlayerTurn();
    }
  };

  const allEqualRows = (arr) => {
    return arr.every((cell) => cell.getValue() === arr[0].getValue());
  };

  const allEqual = (arr) => {
    return arr.every((element) => element === arr[0]);
  };

  const checkRowsForWinner = () => {
    const boardRows = board.getBoard();
    for (let i = 0; i < board.rows; i++) {
      if (allEqualRows(boardRows[i])) {
        return boardRows[i][0].getValue();
      }
    }
    return null;
  };

  const checkColumnsForWinner = () => {
    const boardRows = board.getBoard();

    for (let col = 0; col < board.columns; col++) {
      const column = [];
      for (let row = 0; row < board.rows; row++) {
        column.push(boardRows[row][col].getValue());
      }

      if (allEqual(column)) {
        return column[0];
      }
    }

    return null;
  };

  const checkDiagonalForWinner = () => {
    const boardRows = board.getBoard();

    // top left to bottom right
    const diagonal1 = [];
    for (let i = 0; i < board.rows; i++) {
      diagonal1.push(boardRows[i][i].getValue());
    }

    // top right to bottom left
    let j = board.rows - 1;
    const diagonal2 = [];
    for (let i = 0; i < board.rows; i++) {
      diagonal2.push(boardRows[i][j].getValue());
      j--;
    }

    if (allEqual(diagonal1)) {
      return diagonal1[0];
    }

    if (allEqual(diagonal2)) {
      return diagonal2[0];
    }

    return null;
  };

  const boardIsFull = () => {
    const boardRows = board.getBoard();
    for (let i = 0; i < board.rows; i++) {
      for (let j = 0; j < board.columns; j++) {
        if (boardRows[i][j].getValue() === '') {
          return false;
        }
      }
    }
    return true;
  };

  const checkGameWinner = () => {
    const rowWinner = checkRowsForWinner();
    const columnWinner = checkColumnsForWinner();
    const diagonalWinner = checkDiagonalForWinner();

    if (rowWinner || columnWinner || diagonalWinner) {
      const winnerToken = rowWinner || columnWinner || diagonalWinner;
      const winner = players.find((player) => player.token === winnerToken);
      return winner;
    }

    return null;
  };

  return {
    playRound,
    getActivePlayer,
    checkGameWinner,
    getBoard: board.getBoard,
    boardIsFull,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.getElementById('turn');
  const boardDiv = document.getElementById('board');

  const updateScreen = () => {
    boardDiv.textContent = '';

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add(
          'cell',
          'w-24',
          'h-24',
          'border',
          'border-slate-700',
          'bg-slate-800',
          'rounded',
          'cursor-pointer',
          'hover:bg-slate-700',
        );
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });

    const winner = game.checkGameWinner();
    if (winner || game.boardIsFull()) {
      if (winner) {
        playerTurnDiv.textContent = `${winner.name} wins!`;
        playerTurnDiv.classList.add('bg-green-600', 'text-gray-900');
      } else {
        playerTurnDiv.textContent = `It's a draw!`;
        playerTurnDiv.classList.add('bg-rose-500', 'text-gray-900');
      }
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell) => {
        cell.classList.add('pointer-events-none');
      });
    }
  };

  const container = document.getElementById('container');
  const restartBtn = document.createElement('button');
  restartBtn.classList.add(
    'bg-blue-500',
    'hover:bg-blue-700',
    'text-white',
    'font-bold',
    'py-2',
    'px-4',
    'rounded',
  );
  restartBtn.textContent = 'Restart';
  container.appendChild(restartBtn);

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();
}

ScreenController();
