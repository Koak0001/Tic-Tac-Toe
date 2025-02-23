const express = require("express");
const path = require("path");
const { getBestMove, checkWinner } = require("./minimax");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// game state, 9 cells, null means empty.
let board = Array(9).fill(null);

app.get("/newgame", (req, res) => {
  board = Array(9).fill(null);
  res.json({ board, message: "New game started. Your turn." });
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
      const msg = winner === "X" ? "You win!" : (winner === "draw" ? "Draw!" : "You lose!");
      return res.json({ board, message: msg });
    }
  
    // get AI move 'O'
    const aiMove = getBestMove(board);
    if (aiMove !== undefined) board[aiMove] = "O";
  
    winner = checkWinner(board);
    const msg = winner 
      ? (winner === "O" ? "You lose!" : (winner === "draw" ? "Draw!" : "You win!"))
      : "Your turn.";
  
    // computer 'think' delay
    setTimeout(() => {
      res.json({ board, message: msg });
    }, 1900);
  });
  

app.listen(PORT, () => {
  console.log(`Tic-tac-toe server running at http://localhost:${PORT}`);
});
