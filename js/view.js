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

        $(event.currentTarget).addClass("zoom");

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
      // $(event.currentTarget).addClass("has-piece");
    }
    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left zoom");
  });
};

View.prototype.makeMove = function ($cell) {
  //call game's play move?
  let cellNo = parseInt(($cell).attr("data-number"));
  let cellPos = [Math.floor(cellNo / 5), cellNo % 5];
  this.game.playMove(cellPos);
  //render new board
  let that = this;
  this.game.changed.forEach(function(changedPos) {
    let changedCellNo = changedPos[0] * 5 + changedPos[1];
    $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
  });
  //also render new current piece
  $(`.current-piece`).html(this.game.currentPiece.imgTag);

  if(this.game.won) {
    this.$el.addClass("game-won");
    console.log("you did it, really. good work.");
    $(".cell").html(ImgValueConstants[7]);
  } else if(this.game.isOver()) {
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
    $(`.cell[data-number=${piece.getCellNo()}]`).html(piece.imgTag);
  });

  //make a separate place to hold to current piece to be placed
  this.$el.append($("<div>").addClass("current-piece"));
  $(`.current-piece`).html(this.game.currentPiece.imgTag);

  this.$el.append($("<div>").addClass("instructions"));
};

module.exports = View;
