function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // "X" / "O"
    }
  }
  if (board.every(cell => cell)) return "draw";
  return null;
}

// values for static evaluation (order matches board cells.)
const weights = [3, 2, 3, 2, 4, 2, 3, 2, 3];


function staticEvaluation(board) {
  let score = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "O") score += weights[i];
    else if (board[i] === "X") score -= weights[i];
  }
  return score;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  const winner = checkWinner(board);
  if (winner !== null) {

    if (winner === "O") return 10;
    else if (winner === "X") return -10;
    else return 0; // draw
  }
  // if at max search depth, use static evaluation.
  if (depth === 0) {
    return staticEvaluation(board);
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "O";
        const score = minimax(board, depth - 1, false, alpha, beta);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // pruning branches
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "X";
        const score = minimax(board, depth - 1, true, alpha, beta);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // pruning branches
      }
    }
    return bestScore;
  }
}

function getBestMove(board, depth) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, depth - 1, false, -Infinity, Infinity);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

module.exports = { getBestMove, checkWinner };
