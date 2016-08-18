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
    if((currentCellNo > 4) && $(`.cell[data-number=${parseInt(currentCellNo) - 5}]`).html() === $cell.html()) { //top
      adjacents.push($(`.cell[data-number=${parseInt(currentCellNo) - 5}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${currentCellNo - 5}]`), adjacentCount + 1);
      // console.log("top!");
      if(((currentCellNo-5) > 4) && $(`.cell[data-number=${parseInt(currentCellNo)-5 - 5}]`).html() === $cell.html()) { //top
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)-5 - 5}]`));
      }
      if(((currentCellNo-5) % 5 !== 0) && $(`.cell[data-number=${parseInt(currentCellNo)-5 - 1}]`).html() === $cell.html()) { //left
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)-5 - 1}]`));
      }
      if(((currentCellNo-5) % 5 !== 4) && $(`.cell[data-number=${parseInt(currentCellNo)-5 + 1}]`).html() === $cell.html()) { //right
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)-5 + 1}]`));
      }
    }
    if((currentCellNo < 20) && $(`.cell[data-number=${parseInt(currentCellNo) + 5}]`).html() === $cell.html()) { //bottom
      // console.log("bottom!");
      adjacents.push($(`.cell[data-number=${parseInt(currentCellNo) + 5}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${parseInt(currentCellNo) + 5}]`), adjacentCount + 1);
      if(((parseInt(currentCellNo)+5) < 20) && $(`.cell[data-number=${parseInt(currentCellNo)+5 + 5}]`).html() === $cell.html()) { //bottom
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)+5 + 5}]`));
      }
      if(((parseInt(currentCellNo)+5) % 5 !== 0) && $(`.cell[data-number=${parseInt(currentCellNo)+5 - 1}]`).html() === $cell.html()) { //left
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)+5 - 1}]`));
      }
      if(((parseInt(currentCellNo)+5) % 5 !== 4) && $(`.cell[data-number=${parseInt(currentCellNo)+5 + 1}]`).html() === $cell.html()) { //right
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)+5 + 1}]`));
      }
    }
    if((currentCellNo % 5 !== 0) && $(`.cell[data-number=${parseInt(currentCellNo) - 1}]`).html() === $cell.html()) { //left
      // console.log("left!");
      adjacents.push($(`.cell[data-number=${parseInt(currentCellNo) - 1}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(currentCellNo) - 1}]`), adjacentCount + 1);
      if(((currentCellNo-1) > 4) && $(`.cell[data-number=${parseInt(currentCellNo)-1 - 5}]`).html() === $cell.html()) { //top
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)-1 - 5}]`));
      }
      if(((currentCellNo-1) < 20) && $(`.cell[data-number=${parseInt(currentCellNo)-1 + 5}]`).html() === $cell.html()) { //bottom
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)-1 + 5}]`));
      }
      if(((currentCellNo-1) % 5 !== 0) && $(`.cell[data-number=${parseInt(currentCellNo)-1 - 1}]`).html() === $cell.html()) { //left
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)-1 - 1}]`));
      }
    }
    if((currentCellNo % 5 !== 4) && $(`.cell[data-number=${parseInt(currentCellNo) + 1}]`).html() === $cell.html()) { //right
      // console.log("right!");
      adjacents.push($(`.cell[data-number=${parseInt(currentCellNo) + 1}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(currentCellNo) + 1}]`), adjacentCount + 1);
      if(((parseInt(currentCellNo)+1) > 4) && $(`.cell[data-number=${parseInt(currentCellNo)+1 - 5}]`).html() === $cell.html()) { //top
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)+1 - 5}]`));
      }
      if(((parseInt(currentCellNo)+1) < 20) && $(`.cell[data-number=${parseInt(currentCellNo)+1 + 5}]`).html() === $cell.html()) { //bottom
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)+1 + 5}]`));
      }
      if(((parseInt(currentCellNo)+1) % 5 !== 4) && $(`.cell[data-number=${parseInt(currentCellNo)+1 + 1}]`).html() === $cell.html()) { //right
        adjacents.push($(`.cell[data-number=${parseInt(currentCellNo)+1 + 1}]`));
      }
    }

    // console.log(`adjacentCount = ${adjacentCount}`);
    return adjacents;
  }

  combine(currentCell) {
    let object = currentCell.html().slice(19, -6);
    // debugger
    // console.log(`combining! currentPiece=${currentPiece}`);
    // console.log(ImgValueConstants[currentPiece]);
    return ImgValueConstants[ImgValueConstants[object]+1];
  }

  giveCurrentPiece() {
    //pick random piece (from: grass, bush, tree)
    $(".current-piece").html(`${ImgConstants[Math.floor(Math.random() * (17 - 1) + 1)]}`);
  }
}

module.exports = Game;
