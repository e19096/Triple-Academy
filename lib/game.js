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

  this.adjacentTop = [];
  this.adjacentBottom = [];
  this.adjacentLeft = [];
  this.adjacentRight = [];

  this.won = false;

  // this.bears = [];
}

Game.prototype.playMove = function (clickedCellPos) {
  this.changed = [clickedCellPos];
  this.updatePos(clickedCellPos, this.currentPiece);

  // if(this.currentPiece instanceof Bear) {
  //   debugger
  //   let adjacentEmptys = this.getAdjacentEmptys(clickedCellPos);
  //   let newPos = this.currentPiece.walk(adjacentEmptys);
  // }

  let adjacentPositions = this.adjacentMatchingPositions(clickedCellPos);
  while(adjacentPositions.length >= 2) {
    // console.log("time to combine!");
    let biggerPiece = this.combine(clickedCellPos, adjacentPositions); //combine them

    if(biggerPiece.value === 6) {
      console.log("YOU WIN!!!!!!!! YAAAAAYYYYYYY");
      this.won = true;
    }

    adjacentPositions = this.adjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
  }

  if(this.isOver()) {
    console.log("IT'S OVER. STOP PLAYING");
  } else {
    this.currentPiece = this.giveCurrentPiece();
  }
};

Game.prototype.updatePos = function (pos, piece) {
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

  if(this.board.grid[topPos[0][topPos[1]]] === "") {
    emptys.push(topPos);
  }
  if(this.board.grid[bottomPos[0][bottomPos[1]]] === "") {
    emptys.push(bottomPos);
  }
  if(this.board.grid[leftPos[0][leftPos[1]]] === "") {
    emptys.push(leftPos);
  }
  if(this.board.grid[rightPos[0][rightPos[1]]] === "") {
    emptys.push(rightPos);
  }

  return emptys;
};

Game.prototype.adjacentMatchingPositions = function (gridPos, pieceValue) {
  //reset the adjacent arrays
  this.adjacentTop = [];
  this.adjacentBottom = [];
  this.adjacentLeft = [];
  this.adjacentRight = [];

  let row = gridPos[0];
  let col = gridPos[1];

  if(!pieceValue) { //pieceValue is a string
    pieceValue = this.currentPiece.value;
  }

  let adjacents = []; //to keep track of adjacent same objects

  //check all adjacent cells to check if same piece
  let topPos = [row - 1, col];
  let bottomPos = [row + 1, col];
  let leftPos = [row, col - 1];
  let rightPos = [row, col + 1];

  let that = this;
  //if not top row
  if((row > 0) && (this.board.grid[topPos[0]][topPos[1]].value === pieceValue)) { //top
    // debugger
    adjacents.push(topPos); //adjacents.concat(this.adjacentMatchingPositions(topPos, pieceValue, thirdParamToExcludeBottomPosCheck?));
    that.adjacentTop.push(topPos);
    if((topPos[0] > 0) && (this.board.grid[topPos[0] - 1][topPos[1]].value === pieceValue)) { //top
      adjacents.push([topPos[0] - 1, topPos[1]]);
      that.adjacentTop.push([topPos[0] - 1, topPos[1]]);
    }
    if(((topPos[1]) % 5 > 0) && (this.board.grid[topPos[0]][topPos[1] - 1].value === pieceValue)) { //left
      adjacents.push([topPos[0], topPos[1] - 1]);
      that.adjacentLeft.push([topPos[0], topPos[1] - 1]);
      that.adjacentTop.push([topPos[0], topPos[1] - 1]);
    }
    if(((topPos[1]) % 5 < 4) && (this.board.grid[topPos[0]][topPos[1] + 1].value === pieceValue)) { //right
      adjacents.push([topPos[0], topPos[1] + 1]);
      that.adjacentRight.push([topPos[0], topPos[1] + 1]);
      that.adjacentTop.push([topPos[0], topPos[1] + 1]);
    }
  }

  //if not bottom row
  if((row < 4) && (this.board.grid[bottomPos[0]][bottomPos[1]].value === pieceValue)) { //bottom
    // debugger
    adjacents.push(bottomPos);  //= this.adjacentMatchingPositions(Pos, pieceValue);
    that.adjacentBottom.push(bottomPos);
    if((bottomPos[0] < 4) && (this.board.grid[bottomPos[0] + 1][bottomPos[1]].value === pieceValue)) { //bottom
      adjacents.push([bottomPos[0] + 1, bottomPos[1]]);
      that.adjacentBottom.push([bottomPos[0] + 1, bottomPos[1]]);
    }
    if(((bottomPos[1]) % 5 > 0) && (this.board.grid[bottomPos[0]][bottomPos[1] - 1].value === pieceValue)) { //left
      adjacents.push([bottomPos[0], bottomPos[1] - 1]);
      that.adjacentLeft.push([bottomPos[0], bottomPos[1] - 1]);
      that.adjacentBottom.push([bottomPos[0], bottomPos[1] - 1]);
    }
    if(((bottomPos[1]) % 5 < 4) && (this.board.grid[bottomPos[0]][bottomPos[1] + 1].value === pieceValue)) { //right
      adjacents.push([bottomPos[0], bottomPos[1] + 1]);
      that.adjacentRight.push([bottomPos[0], bottomPos[1] + 1]);
      that.adjacentBottom.push([bottomPos[0], bottomPos[1] + 1]);
    }
  }

  //if not left-most col
  if((col % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1]].value === pieceValue)) { //left
    // debugger
    adjacents.push(leftPos);  // = this.adjacentMatchingPositions(Pos, pieceValue);
    that.adjacentLeft.push(leftPos);
    if((leftPos[0] > 0) && (this.board.grid[leftPos[0] - 1][leftPos[1]].value === pieceValue)) { //top
      adjacents.push([leftPos[0] - 1, leftPos[1]]);
      that.adjacentTop.push([leftPos[0] - 1, leftPos[1]]);
      that.adjacentLeft.push([leftPos[0] - 1, leftPos[1]]);
    }
    if((leftPos[0] < 4) && (this.board.grid[leftPos[0] + 1][leftPos[1]].value === pieceValue)) { //bottom
      adjacents.push([leftPos[0] + 1, leftPos[1]]);
      that.adjacentBottom.push([leftPos[0] + 1, leftPos[1]]);
      that.adjacentLeft.push([leftPos[0] + 1, leftPos[1]]);
    }
    if(((leftPos[1]) % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1] - 1].value === pieceValue)) { //left
      adjacents.push([leftPos[0], leftPos[1] - 1]);
      that.adjacentLeft.push([leftPos[0], leftPos[1] - 1]);
    }
  }

  //if not right-most col
  if((col % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1]].value === pieceValue)) { //right
    // debugger
    adjacents.push(rightPos);  // = this.adjacentMatchingPositions(Pos, pieceValue);
    that.adjacentRight.push(rightPos);
    if((rightPos[0] > 0) && (this.board.grid[rightPos[0] - 1][rightPos[1]].value === pieceValue)) { //top
      adjacents.push([rightPos[0] - 1, rightPos[1]]);
      that.adjacentTop.push([rightPos[0] - 1, rightPos[1]]);
      that.adjacentRight.push([rightPos[0] - 1, rightPos[1]]);
    }
    if((rightPos[0] < 4) && (this.board.grid[rightPos[0] + 1][rightPos[1]].value === pieceValue)) { //bottom
      adjacents.push([rightPos[0] + 1, rightPos[1]]);
      that.adjacentBottom.push([rightPos[0] + 1, rightPos[1]]);
      that.adjacentRight.push([rightPos[0] + 1, rightPos[1]]);
    }
    if(((rightPos[1]) % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1] + 1].value === pieceValue)) { //right
      adjacents.push([rightPos[0], rightPos[1] + 1]);
      that.adjacentRight.push([rightPos[0], rightPos[1] + 1]);
    }
  }

  return adjacents;
};

Game.prototype.combine = function (cellPos, adjacentPositions) {
  let that = this;
  //clear adjacent cells and put bigger piece in cell (or return new piece)
  adjacentPositions.forEach(function (pos) { //clear adjacent cells
    that.board.grid[pos[0]][pos[1]] = "";
    that.changed.push(pos);
  });
  let newValue = this.board.grid[cellPos[0]][cellPos[1]].value + 1;
  let biggerPiece = new Piece(ImgValueConstants[newValue].slice(19, -8), cellPos);
  this.board.grid[cellPos[0]][cellPos[1]] = biggerPiece;

  return biggerPiece;
};

Game.prototype.giveCurrentPiece = function () {
  //pick random piece (from: grass, bush, tree, hut, bear)
  let randomType = ImgConstants[Math.floor(Math.random() * (52 - 1) + 1)];

  let randomCellNo = Math.floor(Math.random() * 25);
  let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

  // if(randomType === "bear") {
  //   return new Bear(pos);
  // } else {
    return new Piece(randomType, pos);
  // }
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
      // console.log("oops! there's already something there!");
      randomCellNo = Math.floor(Math.random() * 25);
      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

      //also check adjacents in here?
    }

    let adjacentPositions = this.adjacentMatchingPositions(pos, ImgValueConstants[randomType]);
    // console.log(`number of adjacent pos: ${adjacentPositions.length}`);
    while(adjacentPositions.length >= 2) {
      // console.log("oops! close call. we'd need to combine!"); //ether pick a diff cell here or combine
      randomCellNo = Math.floor(Math.random() * 25);
      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
      adjacentPositions = this.adjacentMatchingPositions(pos, ImgValueConstants[randomType]);
    }

      let randomPiece = new Piece(randomType, pos);
      this.pieces.push(randomPiece);
      this.board.grid[pos[0]][pos[1]] = randomPiece;
    }
};

module.exports = Game;
