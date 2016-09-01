const Piece = require('./piece');
const Util = require('./util');

const Bear = function (cellPos) {
  Piece.call(this, "bear", cellPos);
};

Util.inherits(Bear, Piece);

Bear.prototype.walk = function (adjacentEmptyPositions) {
  //find adjacent empty spaces... or get them from game?
  //pick a random one to walk to
  let n = Math.floor(Math.random() * (adjacentEmptyPositions.length));
  //update bear's pos and cell No
  this.pos = adjacentEmptyPositions[n];
  //update grid or re turn new pos so game can update grid
  return this.pos;
};

module.exports = Bear;
