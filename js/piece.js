const ImgValueConstants = require('./img_value_constants');

const Piece = function (type, cellNo) {
  this.type = type;
  this.cellNo = cellNo;
  this.value = ImgValueConstants[type];
  this.imgTag = ImgValueConstants[this.value];
  this.pos = [Math.floor(cellNo / 5), cellNo % 5]; //[row, col]
  // debugger
};

// Piece.prototype.render = function () {
//   return this.imgTag; //or call this getImg()
// };

Piece.prototype.combine = function () {

};

module.exports = Piece;
