const ImgConstants = require('./constants/img_constants');
const ImgValueConstants = require('./constants/img_value_constants');
const Board = require('./board');
const Piece = require('./piece');
const Bear = require('./bear');

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

      if(biggerPiece.value === 6) {
        console.log("YOU WIN!!!!!!!! YAAAAAYYYYYYY");
        this.won = true;
      }

      this.setAdjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
    }
  }

  if(this.isOver()) {
    console.log("IT'S OVER. STOP PLAYING");
  } else {
    this.currentPiece = this.giveCurrentPiece();
  }

  // this.walkBears();
};

Game.prototype.updateGrid = function (pos, piece) {
  // debugger
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

  let topPos = [row - 1, col];
  let bottomPos = [row + 1, col];
  let leftPos = [row, col - 1];
  let rightPos = [row, col + 1];

  if((row > 0) && this.board.grid[topPos[0]][topPos[1]] === "") {
    emptys.push(topPos);
  }
  if((row < 4) && this.board.grid[bottomPos[0]][bottomPos[1]] === "") {
    emptys.push(bottomPos);
  }
  if((col % 5 > 0) && this.board.grid[leftPos[0]][leftPos[1]] === "") {
    emptys.push(leftPos);
  }
  if((col % 5 < 4) && this.board.grid[rightPos[0]][rightPos[1]] === "") {
    emptys.push(rightPos);
  }

  return emptys;
};


Game.prototype.walkBears = function (updateBears) {
  let that = this;
  //iterate through bears
  this.bears.forEach(function (bear) {
    let empties = that.getAdjacentEmptys(bear.pos);
    if(empties.length > 0) {
      that.board.grid[bear.pos[0]][bear.pos[1]] = "";
      that.oldBears.push(bear.pos);
      let newBearPos = bear.walk(empties);
      that.updateGrid(newBearPos, bear);
      that.newBears.push(newBearPos);
    }
  });

  // console.log(this.oldBears);
  // console.log(this.newBears);
  // console.log(this.bears);
  // console.log(this.board.grid);
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

  let row = gridPos[0];
  let col = gridPos[1];

  if(!pieceValue) { //pieceValue is a string
    pieceValue = this.currentPiece.value;
  }

  let topPos = [row - 1, col];    //check all adjacent cells to check if same piece
  let bottomPos = [row + 1, col];
  let leftPos = [row, col - 1];
  let rightPos = [row, col + 1];

  //if not top row
  if((row > 0) && (this.board.grid[topPos[0]][topPos[1]].value === pieceValue)) { //top
    this.adjacentsObj.top.push(topPos);
    if((topPos[0] > 0) && (this.board.grid[topPos[0] - 1][topPos[1]].value === pieceValue)) { //top
      this.adjacentsObj.top.push([topPos[0] - 1, topPos[1]]);
    }
    if(((topPos[1]) % 5 > 0) && (this.board.grid[topPos[0]][topPos[1] - 1].value === pieceValue)) { //left
      this.adjacentsObj.top.push([topPos[0], topPos[1] - 1]);
      this.adjacentsObj.left.push([topPos[0], topPos[1] - 1]);
    }
    if(((topPos[1]) % 5 < 4) && (this.board.grid[topPos[0]][topPos[1] + 1].value === pieceValue)) { //right
      this.adjacentsObj.top.push([topPos[0], topPos[1] + 1]);
      this.adjacentsObj.right.push([topPos[0], topPos[1] + 1]);
    }
  }

  //if not bottom row
  if((row < 4) && (this.board.grid[bottomPos[0]][bottomPos[1]].value === pieceValue)) { //bottom
    this.adjacentsObj.bottom.push(bottomPos);
    if((bottomPos[0] < 4) && (this.board.grid[bottomPos[0] + 1][bottomPos[1]].value === pieceValue)) { //bottom
      this.adjacentsObj.bottom.push([bottomPos[0] + 1, bottomPos[1]]);
    }
    if(((bottomPos[1]) % 5 > 0) && (this.board.grid[bottomPos[0]][bottomPos[1] - 1].value === pieceValue)) { //left
      this.adjacentsObj.bottom.push([bottomPos[0], bottomPos[1] - 1]);
      this.adjacentsObj.left.push([bottomPos[0], bottomPos[1] - 1]);
    }
    if(((bottomPos[1]) % 5 < 4) && (this.board.grid[bottomPos[0]][bottomPos[1] + 1].value === pieceValue)) { //right
      this.adjacentsObj.bottom.push([bottomPos[0], bottomPos[1] + 1]);
      this.adjacentsObj.right.push([bottomPos[0], bottomPos[1] + 1]);
    }
  }

  //if not left-most col
  if((col % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1]].value === pieceValue)) { //left
    this.adjacentsObj.left.push(leftPos);
    if((leftPos[0] > 0) && (this.board.grid[leftPos[0] - 1][leftPos[1]].value === pieceValue)) { //top
      this.adjacentsObj.left.push([leftPos[0] - 1, leftPos[1]]);
      this.adjacentsObj.top.push([leftPos[0] - 1, leftPos[1]]);
    }
    if((leftPos[0] < 4) && (this.board.grid[leftPos[0] + 1][leftPos[1]].value === pieceValue)) { //bottom
      this.adjacentsObj.left.push([leftPos[0] + 1, leftPos[1]]);
      this.adjacentsObj.bottom.push([leftPos[0] + 1, leftPos[1]]);
    }
    if(((leftPos[1]) % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1] - 1].value === pieceValue)) { //left
      this.adjacentsObj.left.push([leftPos[0], leftPos[1] - 1]);
    }
  }

  //if not right-most col
  if((col % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1]].value === pieceValue)) { //right
    this.adjacentsObj.right.push(rightPos);
    if((rightPos[0] > 0) && (this.board.grid[rightPos[0] - 1][rightPos[1]].value === pieceValue)) { //top
      this.adjacentsObj.right.push([rightPos[0] - 1, rightPos[1]]);
      this.adjacentsObj.top.push([rightPos[0] - 1, rightPos[1]]);
    }
    if((rightPos[0] < 4) && (this.board.grid[rightPos[0] + 1][rightPos[1]].value === pieceValue)) { //bottom
      this.adjacentsObj.right.push([rightPos[0] + 1, rightPos[1]]);
      this.adjacentsObj.bottom.push([rightPos[0] + 1, rightPos[1]]);
    }
    if(((rightPos[1]) % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1] + 1].value === pieceValue)) { //right
      this.adjacentsObj.right.push([rightPos[0], rightPos[1] + 1]);
    }
  }
};


Game.prototype.combine = function (cellPos, adjacentPositions) {
  let that = this;

  for(let direction in this.adjacentsObj) {
    that.adjacentsObj[direction].forEach(function (pos) {
      that.board.grid[pos[0]][pos[1]] = "";
      that.changed.push(pos);
    });
  }

  let newValue = this.board.grid[cellPos[0]][cellPos[1]].value + 1;
  let biggerPiece = new Piece(ImgValueConstants[newValue].slice(26, -7), cellPos);
  this.board.grid[cellPos[0]][cellPos[1]] = biggerPiece;

  return biggerPiece;
};


Game.prototype.giveCurrentPiece = function () {
  //pick random piece (from: grass, bush, tree, hut, bear)
  let randomType = ImgConstants[Math.floor(Math.random() * (55 - 1) + 1)];

  let randomCellNo = Math.floor(Math.random() * 25);
  // let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

  if(randomType === "bear") {
    return new Bear();//pos);
  } else {
    return new Piece(randomType);//, pos);
  }
};

Game.prototype.generateInitialSetup = function () {
  //place random pieces (from: grass, bush, tree, hut) in random cells
  //- some number of pieces between 5-7
  let numPieces = Math.floor(Math.random() * (8 - 5) + 5);

  for(let i = 0; i < numPieces; i++) {
    let randomType = ImgConstants[Math.floor(Math.random() * (52 - 1) + 1)];

    let randomCellNo = Math.floor(Math.random() * 25);
    let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

    // make sure cell is empty else do it again
    // and also make sure this piece is not adjacent to 2+ of the same piece
    while(this.board.grid[pos[0]][pos[1]] !== "") {
      randomCellNo = Math.floor(Math.random() * 25);
      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

      //also check adjacents in here?
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
