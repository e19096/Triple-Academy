const ImgConstants = require('./img_constants');
const ImgValueConstants = require('./img_value_constants');

class Game {
  constructor() {
    // this.giveCurrentPiece();
  }

  playMove($cell) {
    let currentPiece = $(".current-piece").html();
    $cell.html(currentPiece);

    let adjacentCells = this.adjacentSamePieces($cell);
    while(adjacentCells.length >= 2) {
      console.log("time to combine!");
      let newPiece = this.combine($cell); //combine them

      adjacentCells.forEach(function (cell) { //clear adjacent cells
        cell.html("");
      });

      $cell.html(newPiece); //render the new piece
      adjacentCells = this.adjacentSamePieces($cell); //check that that doesn't need to be combined
    }
    // this.adjacentSamePieces($cell);
    this.giveCurrentPiece();
  }

  adjacentSamePieces($cell) {
    let currentCellNo = $cell.attr("data-number");
    //for initial board setup
    if($cell.html() === "") {
      return [];
    }

    let adjacents = []; //to keep track of adjacent same objects
    //check all adjacent cells to check if same piece
    let topCellNo = parseInt(currentCellNo) - 5;
    let bottomCellNo = parseInt(currentCellNo) + 5;
    let leftCellNo = parseInt(currentCellNo) - 1;
    let rightCellNo = parseInt(currentCellNo) + 1;

    if((currentCellNo > 4) && $(`.cell[data-number=${topCellNo}]`).html() === $cell.html()) { //top
      adjacents.push($(`.cell[data-number=${topCellNo}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${currentCellNo - 5}]`), adjacentCount + 1);
      if(((topCellNo) > 4) && $(`.cell[data-number=${topCellNo - 5}]`).html() === $cell.html()) { //top
        adjacents.push($(`.cell[data-number=${topCellNo - 5}]`));
      }
      if(((topCellNo) % 5 !== 0) && $(`.cell[data-number=${topCellNo - 1}]`).html() === $cell.html()) { //left
        adjacents.push($(`.cell[data-number=${topCellNo - 1}]`));
      }
      if(((topCellNo) % 5 !== 4) && $(`.cell[data-number=${topCellNo + 1}]`).html() === $cell.html()) { //right
        adjacents.push($(`.cell[data-number=${topCellNo + 1}]`));
      }
    }
    if((currentCellNo < 20) && $(`.cell[data-number=${bottomCellNo}]`).html() === $cell.html()) { //bottom
      adjacents.push($(`.cell[data-number=${bottomCellNo}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${parseInt(currentCellNo) + 5}]`), adjacentCount + 1);
      if((bottomCellNo < 20) && $(`.cell[data-number=${bottomCellNo + 5}]`).html() === $cell.html()) { //bottom
        adjacents.push($(`.cell[data-number=${bottomCellNo + 5}]`));
      }
      if((bottomCellNo % 5 !== 0) && $(`.cell[data-number=${bottomCellNo - 1}]`).html() === $cell.html()) { //left
        adjacents.push($(`.cell[data-number=${bottomCellNo - 1}]`));
      }
      if((bottomCellNo % 5 !== 4) && $(`.cell[data-number=${bottomCellNo + 1}]`).html() === $cell.html()) { //right
        adjacents.push($(`.cell[data-number=${bottomCellNo + 1}]`));
      }
    }
    if((currentCellNo % 5 !== 0) && $(`.cell[data-number=${leftCellNo}]`).html() === $cell.html()) { //left
      adjacents.push($(`.cell[data-number=${leftCellNo}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(currentCellNo) - 1}]`), adjacentCount + 1);
      if((leftCellNo > 4) && $(`.cell[data-number=${leftCellNo - 5}]`).html() === $cell.html()) { //top
        adjacents.push($(`.cell[data-number=${leftCellNo - 5}]`));
      }
      if((leftCellNo < 20) && $(`.cell[data-number=${leftCellNo + 5}]`).html() === $cell.html()) { //bottom
        adjacents.push($(`.cell[data-number=${leftCellNo + 5}]`));
      }
      if((leftCellNo % 5 !== 0) && $(`.cell[data-number=${leftCellNo - 1}]`).html() === $cell.html()) { //left
        adjacents.push($(`.cell[data-number=${leftCellNo - 1}]`));
      }
    }
    if((currentCellNo % 5 !== 4) && $(`.cell[data-number=${rightCellNo}]`).html() === $cell.html()) { //right
      adjacents.push($(`.cell[data-number=${rightCellNo}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(currentCellNo) + 1}]`), adjacentCount + 1);
      if((rightCellNo > 4) && $(`.cell[data-number=${rightCellNo - 5}]`).html() === $cell.html()) { //top
        adjacents.push($(`.cell[data-number=${rightCellNo - 5}]`));
      }
      if((rightCellNo < 20) && $(`.cell[data-number=${rightCellNo + 5}]`).html() === $cell.html()) { //bottom
        adjacents.push($(`.cell[data-number=${rightCellNo + 5}]`));
      }
      if((rightCellNo % 5 !== 4) && $(`.cell[data-number=${rightCellNo + 1}]`).html() === $cell.html()) { //right
        adjacents.push($(`.cell[data-number=${rightCellNo + 1}]`));
      }
    }

    return adjacents;
  }

  combine(currentCell) {
    let object = currentCell.html().slice(19, -6);
    return ImgValueConstants[ImgValueConstants[object]+1];
  }

  giveCurrentPiece() {
    //pick random piece (from: grass, bush, tree)
    $(".current-piece").html(`${ImgConstants[Math.floor(Math.random() * (17 - 1) + 1)]}`);
  }
}

module.exports = Game;
