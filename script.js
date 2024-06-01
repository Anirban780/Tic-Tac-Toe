document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const chooseXButton = document.getElementById('chooseX');
    const chooseOButton = document.getElementById('chooseO');
    const chooseMark = document.getElementById('chooseMark');
    const messageBox = document.getElementById('messageBox');
    const strike = document.getElementById("strike");

    let currentPlayer = 'X';
    let playerMark = 'X';
    let computerMark = 'O';
    let board = Array(9).fill(null);
    let gameEnded = false;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    
    function handleClick(event) {
        if (gameEnded) return;

        const index = event.target.getAttribute('data-index');
        if (!board[index] && currentPlayer === playerMark) {
            board[index] = currentPlayer;
            event.target.textContent = currentPlayer;
            
            if (checkWin(currentPlayer)) {
                highlightWinnerCells(winningCombinations.find(combination => combination.every(index => board[index] === currentPlayer)));
                messageBox.textContent = "You Won the Game!";
                messageBox.style.display = 'block';
                checkWinAndPlaySound(currentPlayer);
                gameEnded = true;
            } else if (board.every(cell => cell)) {
                messageBox.textContent = "Draw!";
                messageBox.style.display = 'block';
                gameEnded = true;
            } else {
                currentPlayer = computerMark;
                setTimeout(computerMove, 500);
            }
        }
    }

    function computerMove() {
        if (gameEnded) return;

        let bestMove = minimax(board, computerMark).index;
        board[bestMove] = computerMark;
        cells[bestMove].textContent = computerMark;
        

        if (checkWin(computerMark)) {
            highlightWinnerCells(winningCombinations.find(combination => combination.every(index => board[index] === currentPlayer)));
            messageBox.textContent = "Computer won the game! Game over.";
            messageBox.style.display = 'block';
            checkLossAndPlaySound(currentPlayer);
            gameEnded = true;
        } else if (board.every(cell => cell)) {
            messageBox.textContent = "Draw!";
            messageBox.style.display = 'block';
            gameEnded = true;
        } else {
            currentPlayer = playerMark;
        }
    }

    function minimax(newBoard, player) {
        let availableSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

        if (minimaxcheckWin(newBoard, playerMark)) {
            return { score: -10 };
        } else if (minimaxcheckWin(newBoard, computerMark)) {
            return { score: 10 };
        } else if (availableSpots.length === 0) {
            return { score: 0 };
        }

        let moves = [];
        for (let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = availableSpots[i];
            newBoard[availableSpots[i]] = player;

            if (player === computerMark) {
                let result = minimax(newBoard, playerMark);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, computerMark);
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === computerMark) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWin(player) {
        return winningCombinations.some(combination => combination.every(index => board[index] === player));
    }

    function minimaxcheckWin(board, player){
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]  // Diagonals
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === player)
        );
    }

    function highlightWinnerCells(winningCells) {
        winningCells.forEach(cellIndex => {
          cells[cellIndex].classList.add('winner');
        });
      }


    function resetGame() {
        board.fill(null);
        cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner'); // Remove the 'winner' class
    });
        currentPlayer = playerMark;
        gameEnded = false;
        messageBox.style.display = 'none';
        
    }

    function chooseMarkX() {
        playerMark = 'X';
        computerMark = 'O';
        resetGame();
    }

    function chooseMarkO() {
        playerMark = 'O';
        computerMark = 'X';
        resetGame();

        currentPlayer = computerMark;
        setTimeout(computerMove, 500);
    }

    // Play sound effect when a player wins
function playWinSound() {
    const winSound = document.getElementById('winSound');
    winSound.play();
  }
  
  function playLoseSound() {
    const loseSound = document.getElementById('loseSound');
    loseSound.play();
  }
  
  // Function to check for a win or loss and play sound effect if necessary
  function checkWinAndPlaySound(player) {
    if (checkWin(player)) {
      playWinSound();
      // Add any additional actions you want to perform when a player wins
      console.log(`Player ${player} wins!`);
      gameEnded = true;
    }
  }
  
  // Function to check for a loss and play sound effect if necessary
  function checkLossAndPlaySound(player) {
    if (checkWin(player)) {
      playLoseSound();
      // Add any additional actions you want to perform when a player loses
      console.log(`Player ${player} loses!`);
      gameEnded = true;
    }
  }
  

    game.addEventListener('click', handleClick);
    chooseXButton.addEventListener('click', chooseMarkX);
    chooseOButton.addEventListener('click', chooseMarkO);
    resetButton.addEventListener('click', resetGame);
});
