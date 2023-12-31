const Player = (token) => {
  this.token = token;

  const getToken = () => {
    return token;
  };

  return { getToken };
};

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const setCell = (index, token) => {
    if (index > board.length) return;
    board[index] = token;
  };

  const getCell = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { setCell, getCell, reset };
})();

const displayController = (() => {
  const cellElements = document.querySelectorAll('.cell');
  const messageElement = document.getElementById('message');
  const restartButton = document.getElementById('restartBtn');

  cellElements.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      if (gameController.getIsOver() || e.target.textContent !== '') return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameBoard();
    });
  });

  restartButton.addEventListener('click', () => {
    gameBoard.reset();
    gameController.reset();
    updateGameBoard();
    messageElement.classList.remove('text-rose-500', 'text-green-500');
    setMessageElement("Player X's turn");
  });

  const updateGameBoard = () => {
    for (let i = 0; i < cellElements.length; i++) {
      cellElements[i].textContent = gameBoard.getCell(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === 'Draw') {
      setMessageElement("It's a draw!");
      messageElement.classList.add('text-rose-500');
    } else {
      setMessageElement(`Player ${winner} wins!`);
      messageElement.classList.add('text-green-500');
    }
    console.log(messageElement.classList);
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
  const playerX = Player('X');
  const playerO = Player('O');
  let round = 1;
  let isOver = false;

  const playRound = (cellIndex) => {
    gameBoard.setCell(cellIndex, getCurrentPlayer());
    if (checkWinner(cellIndex)) {
      displayController.setResultMessage(getCurrentPlayer());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage('Draw');
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(`Player ${getCurrentPlayer()}'s turn`);
  };

  const getCurrentPlayer = () => {
    return round % 2 === 1 ? playerX.getToken() : playerO.getToken();
  };

  const checkWinner = (cellIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(cellIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getCell(index) === getCurrentPlayer(),
        ),
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };
})();
