const ImgConstants = require('./img_constants');

const View = function (game, $el) {
  this.game = game;
  this.$el = $el;
};

View.prototype.bindEvents = function () { //when cell is clicked, check if empty, then send cell to make move
  $(".cell").on("click", (event) => {
    if($(event.currentTarget).html() === "") {
      this.makeMove($(event.currentTarget));
      // console.log($(event.currentTarget).attr("data-number"));
    }
    // console.log($(event.currentTarget).attr("data-number"));
  });
};

View.prototype.makeMove = function ($cell) {
  //call game's play move?
  this.game.playMove(parseInt(($cell).attr("data-number")));
  //render new board
  let that = this;
  this.game.changed.forEach(function(changedCellNo) {
    $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[Math.floor(changedCellNo / 5)][changedCellNo % 5].imgTag ? that.game.board.grid[Math.floor(changedCellNo / 5)][changedCellNo % 5].imgTag : "");
    // debugger
  });
  //also render new current piece
  $(`.current-piece`).html(this.game.currentPiece.imgTag);
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
