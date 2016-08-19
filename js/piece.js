const ImgValueConstants = require('./img_value_constants');

const Piece = function (type, cellNo) {
  this.type = type;
  this.cellNo = cellNo;
  this.value = ImgValueConstants[type];
  this.imgTag = ImgValueConstants[this.value];
  this.pos = [Math.floor(cellNo / 5), cellNo % 5]; //[row, col]
  // debugger
};

Piece.prototype.render = function () {
  return this.imgTag; //or call this getImg()
};

// Piece.prototype.adjacentMatches = function () {
//   let adjacents = []; //to keep track of adjacent same objects
//   let row = this.pos[0];
//   let col = this.pos[1];
//
//   //check all adjacent cells to check if same piece
//   let topPos = [row - 1, col];
//   let bottomPos = [row + 1, col];
//   let leftPos = [row, col - 1];
//   let rightPos = [row, col + 1];
//
//   //top row
//   if((row > 0) && $(`.cell[data-number=${topCellNo}]`).html() === $cell.html()) { //top
//     adjacents.push($(`.cell[data-number=${topCellNo}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${this.pos - 5}]`), adjacentCount + 1);
//     if(((topCellNo) > 4) && $(`.cell[data-number=${topCellNo - 5}]`).html() === $cell.html()) { //top
//       adjacents.push($(`.cell[data-number=${topCellNo - 5}]`));
//     }
//     if(((topCellNo) % 5 !== 0) && $(`.cell[data-number=${topCellNo - 1}]`).html() === $cell.html()) { //left
//       adjacents.push($(`.cell[data-number=${topCellNo - 1}]`));
//     }
//     if(((topCellNo) % 5 !== 4) && $(`.cell[data-number=${topCellNo + 1}]`).html() === $cell.html()) { //right
//       adjacents.push($(`.cell[data-number=${topCellNo + 1}]`));
//     }
//   }
//
//     //bottom row
//     if((this.pos < 20) && $(`.cell[data-number=${bottomCellNo}]`).html() === $cell.html()) { //bottom
//       adjacents.push($(`.cell[data-number=${bottomCellNo}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${parseInt(this.pos) + 5}]`), adjacentCount + 1);
//       if((bottomCellNo < 20) && $(`.cell[data-number=${bottomCellNo + 5}]`).html() === $cell.html()) { //bottom
//         adjacents.push($(`.cell[data-number=${bottomCellNo + 5}]`));
//       }
//       if((bottomCellNo % 5 !== 0) && $(`.cell[data-number=${bottomCellNo - 1}]`).html() === $cell.html()) { //left
//         adjacents.push($(`.cell[data-number=${bottomCellNo - 1}]`));
//       }
//       if((bottomCellNo % 5 !== 4) && $(`.cell[data-number=${bottomCellNo + 1}]`).html() === $cell.html()) { //right
//         adjacents.push($(`.cell[data-number=${bottomCellNo + 1}]`));
//       }
//     }
//     if((this.pos % 5 !== 0) && $(`.cell[data-number=${leftCellNo}]`).html() === $cell.html()) { //left
//       adjacents.push($(`.cell[data-number=${leftCellNo}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(this.pos) - 1}]`), adjacentCount + 1);
//       if((leftCellNo > 4) && $(`.cell[data-number=${leftCellNo - 5}]`).html() === $cell.html()) { //top
//         adjacents.push($(`.cell[data-number=${leftCellNo - 5}]`));
//       }
//       if((leftCellNo < 20) && $(`.cell[data-number=${leftCellNo + 5}]`).html() === $cell.html()) { //bottom
//         adjacents.push($(`.cell[data-number=${leftCellNo + 5}]`));
//       }
//       if((leftCellNo % 5 !== 0) && $(`.cell[data-number=${leftCellNo - 1}]`).html() === $cell.html()) { //left
//         adjacents.push($(`.cell[data-number=${leftCellNo - 1}]`));
//       }
//     }
//     if((this.pos % 5 !== 4) && $(`.cell[data-number=${rightCellNo}]`).html() === $cell.html()) { //right
//       adjacents.push($(`.cell[data-number=${rightCellNo}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(this.pos) + 1}]`), adjacentCount + 1);
//       if((rightCellNo > 4) && $(`.cell[data-number=${rightCellNo - 5}]`).html() === $cell.html()) { //top
//         adjacents.push($(`.cell[data-number=${rightCellNo - 5}]`));
//       }
//       if((rightCellNo < 20) && $(`.cell[data-number=${rightCellNo + 5}]`).html() === $cell.html()) { //bottom
//         adjacents.push($(`.cell[data-number=${rightCellNo + 5}]`));
//       }
//       if((rightCellNo % 5 !== 4) && $(`.cell[data-number=${rightCellNo + 1}]`).html() === $cell.html()) { //right
//         adjacents.push($(`.cell[data-number=${rightCellNo + 1}]`));
//       }
//     }
//
//     return adjacents;
//
// };

Piece.prototype.combine = function () {

};

module.exports = Piece;
