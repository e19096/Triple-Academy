
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

Board.prototype.isValidGridPos = (pos) => {
  let [row, col] = pos;
  if(row >= 0 && row < 5 &&
     col >= 0 && col < 5) {
    return true;
  } else {
    return false;
  }
};

module.exports = Board;
