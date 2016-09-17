import './style.scss';

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

  var winner = getWinner(board);

  // WHY WRITE TO DOM ON EVERY MOVE? THIS SHOULD ONLY RUN WHEN getWinner() RETURNS
  const winString = winner === 1 ? "AI Won!" : winner === 0 ? "You Won!" : winner === -1 ? "Tie!" : "";
  document.querySelector('#winner').textContent = winString;

  // SHOULD BE DISPLAYED AFTER WE'VE WON
  document.querySelector('#move').textContent = myMove ? "AI's Move" : "Your move";
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

function updateButtons() {
  board.map((row, index1) => row.map((cell, index2) => {
    const tick = cell == false ? "x" : cell == true ? "o" : "";
    document.querySelector('#c' + index1.toString() + index2.toString()).textContent = tick;
  }))
}

function makeMove() {
  numNodes = 0;
  board = recurseMinimax(board, true)[1];
  //board = minimaxMove(board);

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

[].forEach.call(document.querySelectorAll('button'),
  (e) => e.addEventListener('click', function() {

    var cell = this.getAttribute("id");

    // take cell coordiantes out of DOM string
    var row = parseInt(cell[1]);
    var col = parseInt(cell[2]);

    if (!myMove) {
      board[row][col] = false;
      myMove = true;

      updateMove();
      makeMove();
    }

  }, false)
)

document.querySelector('#restart').addEventListener('click', restartGame, false);

updateMove();

