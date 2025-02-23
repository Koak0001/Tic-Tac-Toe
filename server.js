const express = require("express");
const path = require("path");
const { getBestMove, checkWinner } = require("./minimax");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// game state, 9 cells, null means empty.
let board = Array(9).fill(null);

// search depth,  9 = full search.
let searchDepth = 9;


app.get("/newgame", (req, res) => {
    board = Array(9).fill(null);
    const first = req.query.first || "player";
    const difficulty = req.query.difficulty || "hard"; // default
  
    // setting difficulty
    let searchDepth;
    if (difficulty === "easy") searchDepth = 3;
    else if (difficulty === "medium") searchDepth = 6;
    else searchDepth = 9; // hard
  
    let message = "New game started. Your turn.";
    if (first === "computer") {
      const aiMove = getBestMove(board, searchDepth);
      if (aiMove !== undefined) board[aiMove] = "O";
      message = "Computer started. Your turn.";
    }
    res.json({ board, message });
  });
  

// player move endpoint
app.post("/move", (req, res) => {
  const { index } = req.body;
  if (board[index]) {
    return res.json({ board, message: "Invalid move." });
  }

// player move symbol
  board[index] = "X";

 
  let winner = checkWinner(board);
  if (winner) {
    let msg =
      winner === "X"
        ? "You win!"
        : winner === "draw"
        ? "Draw!"
        : "You lose!";
    return res.json({ board, message: msg });
  }

  // get AI move 'O'
  const aiMove = getBestMove(board, searchDepth);
  if (aiMove !== undefined) board[aiMove] = "O";

  winner = checkWinner(board);
  let msg =
    winner === "O"
      ? "You lose!"
      : winner === "draw"
      ? "Draw!"
      : "Your turn.";

  // Ai think delay animation.
  setTimeout(() => {
    res.json({ board, message: msg });
  }, 2000);
});

app.listen(PORT, () => {
  console.log(`Tic-tac-toe server running at http://localhost:${PORT}`);
});
