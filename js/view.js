const ImgConstants = require('./img_constants');
const ImgValueConstants = require('./img_value_constants');

const View = function (game, $el) {
  this.game = game;
  this.$el = $el;
};

View.prototype.bindEvents = function () { //when cell is clicked, check if empty, then send cell to make move
  let that = this;

  let currentImg;
  $(".cell").hover(
    function(event){
      if($(event.currentTarget).html() === ""){

        $(event.currentTarget).html(that.game.currentPiece.imgTag);
        currentImg = undefined;

        let cellNo = parseInt($(event.currentTarget).attr("data-number"));

        let currentVal = that.game.currentPiece.value;
        let adjacents = that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
        while(adjacents.length >= 2) {
          currentVal++;
          that.game.adjacentTop.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-down");
          });
          that.game.adjacentBottom.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-up");
          });
          that.game.adjacentLeft.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-right");
          });
          that.game.adjacentRight.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-left");
          });
          adjacents = that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
        }
      } else {
        currentImg = $(event.currentTarget).html();
      }
    },
    function(event){
      $(event.currentTarget).html(currentImg ? currentImg : "");
      $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left");
    }
  );

  $(".cell").on("click", (event) => {
    let cellNo = parseInt($(event.currentTarget).attr("data-number"));
    if(this.game.board.grid[Math.floor(cellNo / 5)][cellNo % 5] === "") {
      this.makeMove($(event.currentTarget));
    }
    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left");
  });
};

View.prototype.makeMove = function ($cell) {
  //call game's play move?
  this.game.playMove(parseInt(($cell).attr("data-number")));
  //render new board
  let that = this;
  this.game.changed.forEach(function(changedCellNo) {
    $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[Math.floor(changedCellNo / 5)][changedCellNo % 5].imgTag ? that.game.board.grid[Math.floor(changedCellNo / 5)][changedCellNo % 5].imgTag : "");
  });
  //also render new current piece
  $(`.current-piece`).html(this.game.currentPiece.imgTag);

  if(this.game.isOver()) {
    this.$el.addClass("game-over");
    this.$el.append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
    console.log("it's over. seriously.");
  }
};

View.prototype.setupBoard = function () {
  const grid = $("<ul>").addClass("grid").addClass("group");

  for(let i = 0; i < 25; i++) {
    let $cell = $("<li>").addClass("cell");
    $cell.attr("data-number", i);
    // cell.html(i);
    grid.append($cell);
  }

  this.$el.append(grid); //set up the grid for the pieces to be places

  this.game.generateInitialSetup();
  this.game.pieces.forEach(function (piece) {
    $(`.cell[data-number=${piece.cellNo}]`).html(piece.imgTag);
  });

  //make a separate place to hold to current piece to be placed
  this.$el.append($("<div>").addClass("current-piece"));
  $(`.current-piece`).html(this.game.currentPiece.imgTag);
};

module.exports = View;
