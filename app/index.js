import './style.scss';
import $ from 'jQuery';

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

$(document).ready(function() {
  $("button").click(function() {
    var cell = $(this).attr("id")
    // take cell coordiantes out of DOM string
    var row = parseInt(cell[1])
    var col = parseInt(cell[2])

    if (!myMove) {
      board[row][col] = false;
      myMove = true;

      updateMove();
      makeMove();
    }
  });
  $("#restart").click(restartGame);
});

function updateMove() {
  updateButtons();

  var winner = getWinner(board);

  // WHY WRITE TO DOM ON EVERY MOVE? THIS SHOULD ONLY RUN WHEN getWinner() RETURNS
  $("#winner").text(winner == 1 ? "AI Won!" : winner == 0 ? "You Won!" : winner == -1 ? "Tie!" : "");
  $("#move").text(myMove ? "AI's Move" : "Your move");
}

function getWinner(board) {
  // all cells occupied
  var allNotNull = true;

  // What? We are doing this once for value=true and once for value=false?
  let vals = [true, false];
  for (var k = 0; k < vals.length; k++) {
    var value = vals[k];

    // Check rows, columns, and diagonals
    // DON'T INITIATE AS TRUE, USE TERNARY
    var diagonalComplete1 = true;
    var diagonalComplete2 = true;

    for (var i = 0; i < 3; i++) {
      // 0-0 , 1-1, 2-2 is diagonal
      if (board[i][i] != value) {
        diagonalComplete1 = false;
      }
      // 2-0, 1-1, 0-2 is diagonal
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
  // MAP OVER CELLS AGAIN
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      $("#c" + i + "" + j).text(board[i][j] == false ? "x" : board[i][j] == true ? "o" : "");
    }
  }
}

function makeMove() {
  numNodes = 0;
  board = recurseMinimax(board, true)[1];
  //board = minimaxMove(board);

  console.log(numNodes);
  myMove = false;
  updateMove();
}

//function minimaxMove(board) {
//  numNodes = 0;
//  return recurseMinimax(board, true)[1];
//}

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
    return [nextVal, nextBoard];
  }
}

updateMove();

