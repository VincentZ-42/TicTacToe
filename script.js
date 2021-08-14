"use strict"; 
// All undecalred variables can not be used
// Good to use this when writing secure javascript code


// This is use of factory functions to build an object
const Player = (name, sign, moves) => {
  this.name = name;     // Name of Player
  this.sign = sign;     // X or O
  this.moves = moves;   // array of where they placed sign

  const getSign = () => { return sign; };
  const setSign = (newSign) => { sign = newSign; };

  const getName = () => { return name; };
  const setName = (newName) => { name = newName };
  
  const getMoves = () => { return moves; };
  const addMove = (index) => { moves.push(index) };
  const clearMoves = () => { moves = []; };

  return { getSign, setSign, getName, setName, getMoves, addMove, clearMoves };
}

// This is use of Module pattern
// functions that are wrapped and then immediately called upon
// The gameboard object has functions to set or get information about..
//..where each player's sign are 
const gameBoard = (() => {
  const board = Array(9);

  const setCell = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
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

// Module that controls the game logic
const gameController = (() => {
  const playerX = Player('1', 'X', []);
  const playerO = Player('2', 'O', []);
  let turn = 1;
  let gameOver = false;

  const isOver = () => { return gameOver; };
  
  const getCurrentPlayerSign = () => {
    return turn % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const getCurrentPlayerName = () => {
    return turn % 2 === 1 ? playerX.getName() : playerO.getName();
  }

  const addMovetoPlayer = (turn, index) => {
    if (turn % 2 == 0) {
      playerO.addMove(index);
    } else {
      playerX.addMove(index);
    }
  }

  const reset = () => { 
    turn = 1;
    gameOver = false;
    playerX.clearMoves();
    playerO.clearMoves();
  }; 

  const checkWinner = (cellIndex) => {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],    // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8],    // Vertical
      [0, 4, 8], [2, 4, 6]                // Diagonal
    ]

    return winConditions
      .filter((combination) => combination.includes(cellIndex))
      .some((possibleCominbation) => 
        possibleCominbation.every(
          (index) => gameBoard.getCell(index) === getCurrentPlayerSign()
        )
      );
  };

  // Logic that controls turn and check winner
  const playRound = (index) => {
    gameBoard.setCell(index, getCurrentPlayerSign());
    if (checkWinner(index)) {
      displayController.setWinnerMessage(getCurrentPlayerName());
      gameOver = true;
      return;
    }
    if (turn === 9) {
      displayController.setWinnerMessage('draw');
      gameOver = true;
      return;
    }
    addMovetoPlayer(turn, index);
    turn++;
    displayController.setMessage(
      `Player ${getCurrentPlayerName()}'s Turn: ${getCurrentPlayerSign()}`
    );
  };

  return { playRound, isOver, reset };
})();

// Module that controls the output of messages
const displayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const message = document.getElementById('messageboard');
  const restartBtn = document.getElementById('restart-btn');

  // Ultilty Functions 
  const updateGameboard = () => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = gameBoard.getCell(i);
    }
  };

  const setMessage = (msg) => {
    message.textContent = msg;
  };

  const setWinnerMessage = (winner) => {
    if (winner === 'draw') {
      setMessage("It is a draw!");
    } else {
      setMessage(`Player ${winner} has won!`);
    }
  };

  // Event Listeners
  cells.forEach((cell) => cell.addEventListener('click', (e) => {
    if (gameController.isOver() || e.target.textContent !== '') return;
    gameController.playRound(parseInt(e.target.dataset.index));
    updateGameboard();
  }));

  restartBtn.addEventListener('click', (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessage("Player 1's Turn: X");
  });

  return { setMessage, setWinnerMessage };
})();