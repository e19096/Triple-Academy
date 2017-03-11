const FrequencyConstants = require('./constants/frequency_constants');
const ImgValueConstants = require('./constants/img_value_constants');
const Board = require('./board');
const Piece = require('./piece');
const Bear = require('./bear');

const DIRECTIONS = {
  'top': [-1, 0],
  'bottom': [1, 0],
  'left': [0, -1],
  'right': [0, 1]
};

function Game() {
  this.board = new Board();
  this.pieces = [];
  this.currentPiece = this.giveCurrentPiece();
  this.changed = [];
  this.oldBears = [];
  this.newBears = [];

  this.won = false;

  this.adjacentsObj = { top: [],
                        bottom: [],
                        left: [],
                        right: [] };

  this.bears = [];

  this.score = 0;
  this.holdPiece = undefined;
}

Game.prototype.getPiece = function (hoverCellPos) {
  return this.board.grid[hoverCellPos[0]][hoverCellPos[1]];
};

Game.prototype.bearsExist = function () {
  return (this.bears.length > 0);
};

Game.prototype.playMove = function (clickedCellPos) {
  this.changed = [clickedCellPos];
  this.oldBears = [];
  this.newBears = [];
  this.updateGrid(clickedCellPos, this.currentPiece);

  if(this.currentPiece instanceof Bear) {
    this.bears.push(this.currentPiece);
    this.score += 100;
  } else {
    this.score += this.currentPiece.value;

    this.setAdjacentMatchingPositions(clickedCellPos);
    while(this.multAdjacentsExist()) {
      let biggerPiece = this.combine(clickedCellPos); //combine them
      this.score += biggerPiece.value;

      if(biggerPiece.value === 6) { //mansion to win
        this.won = true;
      }

      this.setAdjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
    }
  }

  if(!this.isOver()) {
    this.currentPiece = this.giveCurrentPiece();
  }
};

Game.prototype.updateGrid = function (pos, piece) {
  this.board.grid[pos[0]][pos[1]] = piece;
  piece.pos = pos;
};

Game.prototype.isOver = function () {
  return this.board.isFull();
};

Game.prototype.getAdjacentEmptys = function (pos) {
  let row = pos[0];
  let col = pos[1];

  let emptys = [];

  for(let dir in DIRECTIONS) {
    let newPos = [row + DIRECTIONS[dir][0], col + DIRECTIONS[dir][1]];
    if(this.board.isValidGridPos(newPos) && this.board.grid[newPos[0]][newPos[1]] === "") {
      emptys.push(newPos);
    }
  }

  return emptys;
};


Game.prototype.walkBears = function (updateBears) {
  //iterate through bears
  this.bears.forEach( (bear) => {
    let empties = this.getAdjacentEmptys(bear.pos);
    if(empties.length > 0) {
      this.board.grid[bear.pos[0]][bear.pos[1]] = "";
      this.oldBears.push(bear.pos);
      let newBearPos = bear.walk(empties);
      this.updateGrid(newBearPos, bear);
      this.newBears.push(newBearPos);
    }
  });

  updateBears();
};

Game.prototype.emptyAdjacentsObj = function () {
  this.adjacentsObj = { top: [],
                        bottom: [],
                        left: [],
                        right: [] };
};

Game.prototype.multAdjacentsExist = function () {
  if( this.adjacentsObj.top.length +
      this.adjacentsObj.bottom.length +
      this.adjacentsObj.left.length +
      this.adjacentsObj.right.length >= 2 ) {
        return true;
  }
  return false;
};

Game.prototype.setAdjacentMatchingPositions = function (gridPos, pieceValue, reset) {

  this.emptyAdjacentsObj(); //empty the arrays

  let currentRow = gridPos[0];
  let currentCol = gridPos[1];

  if(!pieceValue) { //pieceValue is a string
    pieceValue = this.currentPiece.value;
  }

  let board = this.board;

  let isMatching = (pos) => {
    if(board.isValidGridPos(pos)) {
      return board.grid[pos[0]][pos[1]].value === pieceValue;
    } else {
      return false;
    }
  };

  let storePos = (directions, pos) => {
    if(!Array.isArray(directions)) { directions = [directions]; }
    directions.forEach( (dir) => {
      this.adjacentsObj[dir].push(pos);
    });
  };

  for(let dir in DIRECTIONS) {
    let pos = [currentRow + DIRECTIONS[dir][0], currentCol + DIRECTIONS[dir][1]];
    if(isMatching(pos)) {
      storePos(dir, pos);
      for(let dir2 in DIRECTIONS) {
        let pos2 = [pos[0] + DIRECTIONS[dir2][0], pos[1] + DIRECTIONS[dir2][1]];
        if(!(pos2[0] === currentRow && pos2[1] === currentCol) && isMatching(pos2)) {
          storePos([dir, dir2], pos2);
        }
      }
    }
  }
};

Game.prototype.combine = function (cellPos, adjacentPositions) {
  let grid = this.board.grid;
  for(let direction in this.adjacentsObj) {
    this.adjacentsObj[direction].forEach( (pos) => {
      grid[pos[0]][pos[1]] = "";
      this.changed.push(pos);
    });
  }

  let newValue = grid[cellPos[0]][cellPos[1]].value + 1;
  let biggerPiece = new Piece(ImgValueConstants[newValue].slice(26, -7), cellPos);
  grid[cellPos[0]][cellPos[1]] = biggerPiece;

  return biggerPiece;
};


Game.prototype.giveCurrentPiece = function () {
  //pick random piece (from: grass, bush, tree, hut, bear)
  let randomType = FrequencyConstants[Math.floor(Math.random() * (70) + 1)];
  let randomCellNo = Math.floor(Math.random() * 25);

  if(randomType === "bear") {
    return new Bear();
  } else {
    return new Piece(randomType);
  }
};

Game.prototype.generateInitialSetup = function () {
  //place random pieces (from: grass, bush, tree, hut) in random cells
  //- some number of pieces between 5-7
  let numPieces = Math.floor(Math.random() * (8 - 5) + 5);

  for(let i = 0; i < numPieces; i++) {
    let randomType = FrequencyConstants[Math.floor(Math.random() * (65) + 1)];

    let randomCellNo = Math.floor(Math.random() * 25);
    let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

    // make sure cell is empty else do it again
    // and also make sure this piece is not adjacent to 2+ of the same piece
    while(this.board.grid[pos[0]][pos[1]] !== "") {
      randomCellNo = Math.floor(Math.random() * 25);
      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
    }

    this.setAdjacentMatchingPositions(pos, ImgValueConstants[randomType]);
    while(this.multAdjacentsExist()) {
      randomCellNo = Math.floor(Math.random() * 25);
      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
      this.setAdjacentMatchingPositions(pos, ImgValueConstants[randomType]);
    }

    let randomPiece = new Piece(randomType, pos);
    this.pieces.push(randomPiece);
    this.board.grid[pos[0]][pos[1]] = randomPiece;
  }
};

Game.prototype.swapHoldPiece = function (updateView) {
  if(this.holdPiece) {
    let temp = this.holdPiece;
    this.holdPiece = this.currentPiece;
    this.currentPiece = temp;
  } else {
    this.holdPiece = this.currentPiece;
    this.currentPiece = this.giveCurrentPiece();
  }

  updateView();
};

module.exports = Game;
