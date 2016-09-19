import './style.scss';

const canvas = document.querySelector('#gameboard');
const gb = canvas.getContext('2d');

const third = 167;
const margin = 30;
const width = 500;
const header = 100;
const height = 600;
const iconCenter = 57;

function drawBoard() {
  //gb.fillStyle = '#3498db';
  //gb.fillRect(0, 0, width, header);

  //gb.fillStyle = '#7f8c8d';
  //gb.fillRect(0, header, third, third);
  //gb.fillStyle = '#bdc3c7';
  //gb.fillRect(third, header, third, third);
  //gb.fillStyle = '#7f8c8d';
  //gb.fillRect(third * 2, header, third, third);

  gb.lineWidth = 10;
  gb.lineCap = "round";
  gb.strokeStyle = '#2c3e50';

  gb.beginPath();
  gb.moveTo(third, header + margin);
  gb.lineTo(third, 600 - margin);
  gb.stroke();

  gb.beginPath();
  gb.moveTo(third * 2, header + margin);
  gb.lineTo(third * 2, height - margin);
  gb.stroke();

  gb.beginPath();
  gb.moveTo(margin, header + third);
  gb.lineTo(width - margin, header + third);
  gb.stroke();

  gb.beginPath();
  gb.moveTo(margin, header + third * 2);
  gb.lineTo(width - margin, header + third * 2);
  gb.stroke();
}

var board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

var myMove = false;

if (myMove) {
  makeMove();
}

function restartGame() {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  myMove = false;
  updateMove();
}

function updateMove() {
  updateButtons();
  const winner = getWinner(board);

  // paint over old message
  gb.fillStyle = '#ffffff';
  gb.fillRect(0, 0, width, header);
  // new message
  gb.font = "50px Helvetica";
  gb.textAlign = 'center';
  gb.fillStyle = "Black";

  if (winner === 1) {
    gb.fillText('You lose', 250, 65);
    canvas.removeEventListener('click', handleClick, false);
  } else if (winner === 0) {
    gb.fillText('You Win', 250, 65);
    canvas.removeEventListener('click', handleClick, false);
  } else if (winner === -1) {
    gb.fillText('Tie', 250, 65);
    canvas.removeEventListener('click', handleClick, false);
  } else if (myMove) {
    gb.fillText('My Move', 250, 65);
  } else {
    gb.fillText('Your Move', 250, 65);
  }
}

function getWinner(board) {
  // all cells occupied
  var allNotNull = true;

  // What? We are doing this once for value=true and once for value=false?
  let vals = [true, false];
  for (var k = 0; k < vals.length; k++) {
    var value = vals[k];

    var diagonalComplete1 = true;
    var diagonalComplete2 = true;

    for (var i = 0; i < 3; i++) {
      if (board[i][i] != value) {
        diagonalComplete1 = false;
      }
      if (board[2 - i][i] != value) {
        diagonalComplete2 = false;
      }
      var rowComplete = true;
      var colComplete = true;
      for (var j = 0; j < 3; j++) {
        // check columns
        if (board[i][j] != value) {
          rowComplete = false;
        }
        // check rows
        if (board[j][i] != value) {
          colComplete = false;
        }
        if (board[i][j] == null) {
          // all cells occupied but no winning combination - tie
          allNotNull = false;
        }
      }
      // CAN'T WE JUST STRAIGHT-UP RETURN IN EACH CASE?
      // why is this in the loop, and the diagonal return isn't?
      if (rowComplete || colComplete) {
        return value ? 1 : 0;
      }
    }

    if (diagonalComplete1 || diagonalComplete2) {
        return value ? 1 : 0;
    }
  }

    if (allNotNull) {
        return -1;
    }
    return null;
}

function drawO(x,y) {
  gb.beginPath();
  gb.lineWidth = 8;
  gb.strokeStyle = '#2ecc71';
  gb.arc(x, y, 50, 0, 2 * Math.PI);
  gb.stroke();
}

function drawX(x,y) {
  gb.beginPath();
  gb.lineWidth = 8;
  gb.lineCap = "round";
  gb.strokeStyle = '#c0392b';
  gb.moveTo(x - 50, y - 50);
  gb.lineTo(x + 50, y + 50);
  gb.moveTo(x + 50, y - 50);
  gb.lineTo(x - 50, y  + 50);
  gb.stroke();
}


function updateButtons() {
  const X0 = margin + iconCenter;
  const X1 = width / 2;
  const X2 = width - margin - iconCenter;
  const Y0 = header + margin + iconCenter;
  const Y1 = header + width / 2;
  const Y2 = header + width - margin - iconCenter;
  board.map((row, index1) => row.map((cell, index2) => {
    if (cell === false) {
      drawX(eval('X' + index2.toString()), eval('Y' + index1.toString()));
    } else if (cell === true) {
      drawO(eval('X' + index2.toString()), eval('Y' + index1.toString()));
    }
  }))
}

function makeMove() {
  numNodes = 0;
  board = recurseMinimax(board, true)[1];

  console.log(numNodes);
  myMove = false;
  updateMove();
}

// IS ZERO BEFORE EVERY MOVE AND GETS USED ONLY BY recursiveMinimax() - WHY DO WE KEEP TRACK OF THIS GLOBALLY WHEN IT'S RESET?
var numNodes = 0;

function recurseMinimax(board, player) {
  numNodes++;
  var winner = getWinner(board);
  if (winner != null) {
    switch(winner) {
      case 1:
        // AI wins
        return [1, board]
      case 0:
        // opponent wins
        return [-1, board]
      case -1:
        // Tie
        return [0, board];
    }
  } else {

    // NEXT STATES !?!
    var nextVal = null;
    var nextBoard = null;

    // MAP OVER CELLS AGAIN
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] == null) {
          board[i][j] = player;
          // RECURSE WITH player=false
          var value = recurseMinimax(board, !player)[0];
          if (
            (player && (nextVal == null || value > nextVal)) ||
            (!player && (nextVal == null || value < nextVal))) {
            // map over the columns and remove the last row for processing
            nextBoard = board.map(function(arr) {
              return arr.slice();
            });
            nextVal = value;
          }
          // change the cell back to null?
          board[i][j] = null;
        }
      }
    }

//  ERROR ABOUT MAXIMUM CALL STACK EXCEEDED?
//  board.map((column) => column.map((cell) => {
//    if (cell == null) {
//      cell = player;
//      var value = recurseMinimax(board, !player)[0];
//      if (
//        (player && (nextVal == null || value > nextVal)) ||
//        (!player && (nextVal == null || value < nextVal))) {
//        // map over the columns and remove the last row for processing
//        nextBoard = board.map((column) => column.slice());
//        nextVal = value;
//      }
//      // change the cell back to null?
//      cell = null;
//    }
//  }))

  return [nextVal, nextBoard];
  }
}

function assignClick(e) {
  const borderWidth = 2;
  const canvasWidth = canvas.offsetWidth - 2 * borderWidth;
  const responsiveThird = canvasWidth / 3;
  const headerHeight = canvasWidth * (header / height);

  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;

  function assignX(x, row) {
    if (x < responsiveThird) {
      return row + '0';
    } else if (x < 2 * responsiveThird) {
      return row + '1';
    } else {
      return row + '2';
    }
  }

  function assignIfAvailable(cell) {
    // check if cell is unoccupied
    if (board[cell[0]][cell[1]] === null) {
      return cell;
    }
  }

  if (y > headerHeight && y < headerHeight + responsiveThird) {
    return assignIfAvailable(assignX(x, '0'))
  } else if (y > headerHeight + responsiveThird && y < headerHeight + 2 * responsiveThird) {
    return assignIfAvailable(assignX(x, '1'))
  } else if (y > headerHeight + responsiveThird * 2) {
    return assignIfAvailable(assignX(x, '2'))
  }
}

function handleClick(e) {
  if (assignClick(e)) {
    const cell = assignClick(e);
    const row = cell[0];
    const col = cell[1];
    if (!myMove) {
      board[row][col] = false;
      myMove = true;

      updateMove();
      makeMove();
    }
  }
}

canvas.addEventListener('click', handleClick, false);
document.querySelector('#restart').addEventListener('click',() => {
  canvas.addEventListener('click', handleClick, false);
  restartGame();
}, false);

drawBoard();
updateMove();

