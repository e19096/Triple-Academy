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
    let adjacentCount = 0; //to keep track of adjacent same objects
    //check all adjacent cells to check if same piece
    if($(`.cell[data-number=${$cell.attr("data-number") - 5}]`).html() === $cell.html()) { //top
      adjacentCount++;
      console.log("top!");
    }
    if($(`.cell[data-number=${$cell.attr("data-number") + 5}]`).html() === $cell.html()) { //bottom
      adjacentCount++;
      console.log("bottom!");

    }
    if($(`.cell[data-number=${$cell.attr("data-number") - 1}]`).html() === $cell.html()) { //left
      adjacentCount++;
      console.log("left!");
    }
    if($(`.cell[data-number=${$cell.attr("data-number") + 1}]`).html() === $cell.html()) { //right
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
