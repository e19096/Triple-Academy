const ImgConstants = require('./img_constants');

class Game {
  constructor() {
    // this.giveCurrentPiece();
  }

  playMove($cell) {
    let currentPiece = $(".current-piece").html();
    $cell.html(currentPiece);
    this.giveCurrentPiece();
  }

  needToCombine() {

  }

  combine() {

  }

  giveCurrentPiece() {
    //pick random piece (from: grass, bush, tree)
    $(".current-piece").html(`${ImgConstants[Math.floor(Math.random() * (17 - 1) + 1)]}`);
  }
}

module.exports = Game;
