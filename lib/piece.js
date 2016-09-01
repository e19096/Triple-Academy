const ImgValueConstants = require('./constants/img_value_constants');

const Piece = function (type, cellPos) {
  this.type = type;

  this.pos = cellPos;

  this.value = ImgValueConstants[type];

  this.imgTag = ImgValueConstants[this.value];
};

Piece.prototype.getCellNo = function () {
  return this.pos[0] * 5 + this.pos[1];
};

module.exports = Piece;
