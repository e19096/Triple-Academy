// const Piece = require('./piece');

const Board = function () {
  this.grid = this.makeGrid();
};

// Board.prototype.isWon = function () {
//
// };

// Board.prototype.grid = function (pos) {
//   return this.grid[pos[0]][pos[1]];
// };

Board.prototype.isFull = function () {
  for(let i = 0; i < 5; i++) {
    for(let j = 0; j < 5; j++) {
      if(this.grid[i][j] === "") {
        return false;
      }
    }
  }

  return true;
};

Board.prototype.makeGrid = function () {
  let grid = [];
  for(let i = 0; i < 5; i++) {
    grid.push([]);
    for(let j = 0; j < 5; j++) {
      grid[i].push("");
    }
  }
  return grid;
};

// Board.prototype.placePiece = function (pos) {
//
// };


module.exports = Board;
