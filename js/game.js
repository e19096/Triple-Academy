const ImgConstants = require('./img_constants');
const ImgValueConstants = require('./img_value_constants');
const Board = require('./board');
const Piece = require('./piece');

function Game() {
  this.board = new Board();
  this.pieces = [];
  this.currentPiece = this.giveCurrentPiece();
  this.changed = [];
}

Game.prototype.playMove = function (clickedCellNo) {
  this.changed = [clickedCellNo];

  let cellPos = [Math.floor(clickedCellNo / 5), clickedCellNo % 5];
  this.board.grid[cellPos[0]][cellPos[1]] = this.currentPiece;

  let adjacentPositions = this.adjacentMatchingPositions(cellPos);
  while(adjacentPositions.length >= 2) {
    console.log("time to combine!");
    let biggerPiece = this.combine(clickedCellNo, adjacentPositions); //combine them

    // $cell.html(newPiece); //render the new piece
    adjacentPositions = this.adjacentMatchingPositions(cellPos, biggerPiece.type); //check that that doesn't need to be combined
  }
  // debugger
    // console.log(this.board.isFull());
    if(this.board.isFull()) {
      console.log("IT'S OVER. STOP PLAYING");
    } else {
      this.currentPiece = this.giveCurrentPiece();
    }
};

Game.prototype.isOver = function () {
  return this.board.isFull();
};

Game.prototype.adjacentMatchingPositions = function (gridPos, pieceType) {
  let row = gridPos[0];
  let col = gridPos[1];

  if(!pieceType) { //pieceType is a string
    pieceType = this.currentPiece.type;
  }

  let adjacents = []; //to keep track of adjacent same objects

  //check all adjacent cells to check if same piece
  let topPos = [row - 1, col];
  let bottomPos = [row + 1, col];
  let leftPos = [row, col - 1];
  let rightPos = [row, col + 1];

  //if not top row
  if((row > 0) && (this.board.grid[topPos[0]][topPos[1]].type === pieceType)) { //top
    // debugger
    adjacents.push(topPos); //adjacents.concat(this.adjacentMatchingPositions(topPos, pieceType, thirdParamToExcludeBottomPosCheck?));
    if((topPos[0] > 0) && (this.board.grid[topPos[0] - 1][topPos[1]].type === pieceType)) { //top
      adjacents.push([topPos[0] - 1, topPos[1]]);
    }
    if(((topPos[1]) % 5 > 0) && (this.board.grid[topPos[0]][topPos[1] - 1].type === pieceType)) { //left
      adjacents.push([topPos[0], topPos[1] - 1]);
    }
    if(((topPos[1]) % 5 < 4) && (this.board.grid[topPos[0]][topPos[1] + 1].type === pieceType)) { //right
      adjacents.push([topPos[0], topPos[1] + 1]);
    }
  }

  //if not bottom row
  if((row < 4) && (this.board.grid[bottomPos[0]][bottomPos[1]].type === pieceType)) { //bottom
    // debugger
    adjacents.push(bottomPos);  //= this.adjacentMatchingPositions(Pos, pieceType);
    if((bottomPos[0] < 4) && (this.board.grid[bottomPos[0] + 1][bottomPos[1]].type === pieceType)) { //bottom
      adjacents.push([bottomPos[0] + 1, bottomPos[1]]);
    }
    if(((bottomPos[1]) % 5 > 0) && (this.board.grid[bottomPos[0]][bottomPos[1] - 1].type === pieceType)) { //left
      adjacents.push([bottomPos[0], bottomPos[1] - 1]);
    }
    if(((bottomPos[1]) % 5 < 4) && (this.board.grid[bottomPos[0]][bottomPos[1] + 1].type === pieceType)) { //right
      adjacents.push([bottomPos[0], bottomPos[1] + 1]);
    }
  }

  //if not left-most col
  if((col % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1]].type === pieceType)) { //left
    // debugger
    adjacents.push(leftPos);  // = this.adjacentMatchingPositions(Pos, pieceType);
    if((leftPos[0] > 0) && (this.board.grid[leftPos[0] - 1][leftPos[1]].type === pieceType)) { //top
      adjacents.push([leftPos[0] - 1, leftPos[1]]);
    }
    if((leftPos[0] < 4) && (this.board.grid[leftPos[0] + 1][leftPos[1]].type === pieceType)) { //bottom
      adjacents.push([leftPos[0] + 1, leftPos[1]]);
    }
    if(((leftPos[1]) % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1] - 1].type === pieceType)) { //left
      adjacents.push([leftPos[0], leftPos[1] - 1]);
    }
  }

  //if not right-most col
  if((col % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1]].type === pieceType)) { //right
    // debugger
    adjacents.push(rightPos);  // = this.adjacentMatchingPositions(Pos, pieceType);
    if((rightPos[0] > 0) && (this.board.grid[rightPos[0] - 1][rightPos[1]].type === pieceType)) { //top
      adjacents.push([rightPos[0] - 1, rightPos[1]]);
    }
    if((rightPos[0] < 4) && (this.board.grid[rightPos[0] + 1][rightPos[1]].type === pieceType)) { //bottom
      adjacents.push([rightPos[0] + 1, rightPos[1]]);
    }
    if(((rightPos[1]) % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1] + 1].type === pieceType)) { //right
      adjacents.push([rightPos[0], rightPos[1] + 1]);
    }
  }

  return adjacents;
};

Game.prototype.combine = function (cellNo, adjacentPositions) {
  let that = this;
  //clear adjacent cells and put bigger piece in cell (or return new piece)
  adjacentPositions.forEach(function (pos) { //clear adjacent cells
    that.board.grid[pos[0]][pos[1]] = "";
    that.changed.push(pos[0] * 5 + pos[1]);
  });
  let newValue = this.board.grid[Math.floor(cellNo / 5)][cellNo % 5].value + 1;
  let biggerPiece = new Piece(ImgValueConstants[newValue].slice(19, -7), cellNo);
  this.board.grid[Math.floor(cellNo / 5)][cellNo % 5] = biggerPiece;

  return biggerPiece;
};

Game.prototype.giveCurrentPiece = function () {
  //pick random piece (from: grass, bush, tree)
  let randomType = ImgConstants[Math.floor(Math.random() * (23 - 1) + 1)];
  let randomCellNo = Math.floor(Math.random() * 25);
  return new Piece(randomType, randomCellNo);
};

Game.prototype.generateInitialSetup = function () {
  //place random pieces (from: grass, bush, tree, hut) in random cells
  //- some number of pieces between 5-7
  let numPieces = Math.floor(Math.random() * (8 - 5) + 5);

  for(let i = 0; i < numPieces; i++) {
    let randomType = ImgConstants[Math.floor(Math.random() * (24 - 1) + 1)];
    let randomCellNo = Math.floor(Math.random() * 25);

    // make sure cell is empty else do it again
    // and also make sure this piece is not adjacent to 2+ of the same piece
    while(this.board.grid[Math.floor(randomCellNo / 5)][randomCellNo % 5] !== "") {
      console.log("oops! there's already something there!");
      randomCellNo = Math.floor(Math.random() * 25);

      // let adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], randomType );
      // while(adjacentPositions.length >= 2) {
      //   console.log("oops! close call. let's combine!"); //ether pick a diff cell here or actually combine...
      //   // randomCellNo = Math.floor(Math.random() * 25);
      //   let biggerPiece = this.combine(randomCellNo, adjacentPositions);
      //   adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], biggerPiece.type );
      // }
    }

    let adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], randomType );
    while(adjacentPositions.length >= 2) {
      console.log("oops! close call. we need to combine! or..."); //ether pick a diff cell here or actually combine...
      randomCellNo = Math.floor(Math.random() * 25);
      // let biggerPiece = this.combine(randomCellNo, adjacentPositions);
      // adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], biggerPiece.type );
      adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], randomType );
    }

      let randomPiece = new Piece(randomType, randomCellNo);
      this.pieces.push(randomPiece);
      this.board.grid[Math.floor(randomCellNo / 5)][randomCellNo % 5] = randomPiece;
    }
};

module.exports = Game;
