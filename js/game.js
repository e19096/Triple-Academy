const ImgConstants = require('./img_constants');

class Game {
  constructor() {
    // this.giveCurrentPiece();
  }

  playMove($cell) {
    let currentPiece = $(".current-piece").html();
    $cell.html(currentPiece);
    this.adjacentSamePieces($cell);
    this.giveCurrentPiece();
  }

  adjacentSamePieces($cell) {
    let currentCellNo = $cell.attr("data-number");
    // console.log(currentCellNo);
    // console.log($(`.cell[data-number=${currentCellNo - 5}]`).html());
    // console.log($(`.cell[data-number=${parseInt(currentCellNo) + 5}]`).html());
    // console.log($(`.cell[data-number=${currentCellNo - 1}]`).html());
    // console.log($(`.cell[data-number=${parseInt(currentCellNo) + 1}]`).html());

    let adjacentCount = 0; //to keep track of adjacent same objects
    //check all adjacent cells to check if same piece
    if((currentCellNo > 4) && $(`.cell[data-number=${parseInt(currentCellNo) - 5}]`).html() === $cell.html()) { //top
      adjacentCount++;
      console.log("top!");
    }
    if((currentCellNo < 20) && $(`.cell[data-number=${parseInt(currentCellNo) + 5}]`).html() === $cell.html()) { //bottom
      adjacentCount++;
      console.log("bottom!");
    }
    if((currentCellNo % 5 !== 0) && $(`.cell[data-number=${parseInt(currentCellNo) - 1}]`).html() === $cell.html()) { //left
      adjacentCount++;
      console.log("left!");
    }
    if((currentCellNo % 5 !== 4) && $(`.cell[data-number=${parseInt(currentCellNo) + 1}]`).html() === $cell.html()) { //right
      adjacentCount++;
      console.log("right!");
    }
  }

  combine() {

  }

  giveCurrentPiece() {
    //pick random piece (from: grass, bush, tree)
    $(".current-piece").html(`${ImgConstants[Math.floor(Math.random() * (17 - 1) + 1)]}`);
  }
}

module.exports = Game;
