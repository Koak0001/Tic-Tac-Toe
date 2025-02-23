document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDiv = document.getElementById('status');
    const newGameButton = document.getElementById('new-game');
  
    // handle player input
    cells.forEach(cell => {
      cell.addEventListener('click', async () => {
        if (cell.innerText !== '') return;
        const index = parseInt(cell.getAttribute('data-index'));
  
        // showing player's move
        cell.innerText = "X";
  
        // show thinking 'animation'
        let dotCount = 0;
        statusDiv.innerText = "Computer is thinking";
        const intervalId = setInterval(() => {
          dotCount = (dotCount + 1) % 4; 
          statusDiv.innerText = "Computer is thinking" + ".".repeat(dotCount);
        }, 500);
  
        
        const response = await fetch('/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index })
        });
        clearInterval(intervalId); 
  
        const data = await response.json();
       
        updateBoard(data.board);
        statusDiv.innerText = data.message;
      });
    });
  

    newGameButton.addEventListener('click', async () => {
      await fetch('/newgame');
      updateBoard(Array(9).fill(null));
      statusDiv.innerText = "Your turn";
    });
  
    function updateBoard(board) {
      cells.forEach(cell => {
        const index = cell.getAttribute('data-index');
        cell.innerText = board[index] ? board[index] : '';
      });
    }
  });
  