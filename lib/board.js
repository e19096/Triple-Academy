
const Board = function () {
  this.grid = this.makeGrid();
};

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

module.exports = Board;
