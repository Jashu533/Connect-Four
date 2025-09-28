const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
let playerRedName = "Red";
let playerYellowName = "Yellow";
let gameStarted = false;

const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
const loginDiv = document.getElementById('login');
const startAgainBtn = document.querySelector('.start-again');

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      playerRedName = document.getElementById("playerRed").value || "Red";
      playerYellowName = document.getElementById("playerYellow").value || "Yellow";
      loginDiv.style.display = "none";
      boardElement.style.display = "";
      statusText.style.display = "";
      startAgainBtn.style.display = "";
      gameStarted = true;
      restartGame();
      startAgainBtn.style.display = "";
    });
  }
  startAgainBtn.addEventListener("click", startAgain);
});

function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  boardElement.innerHTML = '';

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      const disc = document.createElement('div');
      disc.classList.add('disc');

      cell.appendChild(disc);
      boardElement.appendChild(cell);
    }
  }

  boardElement.addEventListener('click', handleMove);
}

function handleMove(e) {
  if (!gameStarted) return;
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  // Place the disc exactly where the user clicked, not from the bottom up
  if (board[row][col]) return; // Already filled

  board[row][col] = currentPlayer;
  updateBoardUI();

  if (checkWinner(row, col)) {
    statusText.textContent = `🎉 ${currentPlayer === 'red' ? playerRedName : playerYellowName} (${capitalize(currentPlayer)}) wins!`;
    boardElement.removeEventListener('click', handleMove);
    return;
  } else if (isDraw()) {
    statusText.textContent = "It's a draw!";
    boardElement.removeEventListener('click', handleMove);
    return;
  }
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  statusText.textContent = `${currentPlayer === 'red' ? playerRedName : playerYellowName}'s (${capitalize(currentPlayer)}) turn`;
}

function updateBoardUI() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;
      const disc = boardElement.children[index].firstChild;
      disc.className = 'disc'; // Reset
      if (board[row][col]) {
        disc.classList.add(board[row][col]);
      }
    }
  }
}

function checkWinner(row, col) {
  const directions = [
    [[0, 1], [0, -1]],    // horizontal
    [[1, 0], [-1, 0]],    // vertical
    [[1, 1], [-1, -1]],   // diagonal /
    [[1, -1], [-1, 1]]    // diagonal \
  ];

  return directions.some(dir => {
    let count = 1;
    for (let [dx, dy] of dir) {
      let r = row + dx;
      let c = col + dy;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        count++;
        r += dx;
        c += dy;
      }
    }
    return count >= 4;
  });
}

function isDraw() {
  return board.every(row => row.every(cell => cell));
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function restartGame() {
  currentPlayer = 'red';
  if (gameStarted) {
    statusText.textContent = `${playerRedName}'s (Red) turn`;
  } else {
    statusText.textContent = `Player Red's turn`;
  }
  createBoard();
}

function startAgain() {
  // Reset everything to initial state
  loginDiv.style.display = "";
  boardElement.style.display = "none";
  statusText.style.display = "none";
  startAgainBtn.style.display = "none";
  gameStarted = false;
  document.getElementById("playerRed").value = "";
  document.getElementById("playerYellow").value = "";
  statusText.textContent = "Player Red's turn";
  createBoard();
}

createBoard();