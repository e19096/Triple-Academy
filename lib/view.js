const ImgValueConstants = require('./constants/img_value_constants');
const InstructionConstants = require('./constants/instruction_constants');
const Bear = require('./bear');

const View = function (game, $el) {
  this.game = game;
  this.$el = $el;
};

View.prototype.bindEvents = function () { //when cell is clicked, check if empty, then send cell to make move
  let that = this;

  let clear = false;

  $(".cell").hover(
    function(event){
      let cellNo = parseInt($(event.currentTarget).attr("data-number"));
      let cellPos = [Math.floor(cellNo / 5), cellNo % 5];
      if($(event.currentTarget).html() === ""){

        $(event.currentTarget).addClass("zoom");
        $(event.currentTarget).html(that.game.currentPiece.imgTag);

        let currentVal = that.game.currentPiece.value;
        that.game.setAdjacentMatchingPositions(cellPos, currentVal);
        while(!(that.game.currentPiece instanceof Bear) && that.game.multAdjacentsExist()) {
          currentVal++;
          that.game.adjacentsObj.top.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-down");
          });
          that.game.adjacentsObj.bottom.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-up");
          });
          that.game.adjacentsObj.left.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-right");
          });
          that.game.adjacentsObj.right.forEach(function (adjacentPos) {
            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-left");
          });
          that.game.setAdjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
        }
        clear = true;
      } else {
        clear = false;
        //display the instructions for this piece from instruction constants
        let hoverPiece = that.game.getPiece(cellPos);
        $(".instructions").html(InstructionConstants[hoverPiece.type]);
      }
    },
    function(event){
      if(clear) {
        $(event.currentTarget).html("");
      }

      $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left");
      $(".instructions").html("Hover over an object for instructions!");
    }
  );

  $(".cell").on("click", (event) => {
    let cellNo = parseInt($(event.currentTarget).attr("data-number"));
    let cellPos = [Math.floor(cellNo/5), cellNo % 5];
    if(this.game.board.grid[cellPos[0]][cellPos[1]] === "") {
      this.makeMove($(event.currentTarget));
      // $(event.currentTarget).addClass("has-piece");
    }
    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left zoom");
  });

  $(".hold").on("click", (event) => {
    this.game.swapHoldPiece(function() {
      $(`.current-piece`).html("next:" + that.game.currentPiece.imgTag);
      $(`.hold`).html("hold:" + that.game.holdPiece.imgTag);
    });
  });
};

View.prototype.unbindClick = function () {
  $(".cell").off("click");
  $(".hold").off("click");
  $(".cell").off("mouseenter mouseleave");
};

View.prototype.makeMove = function ($cell) {

    let cellNo = parseInt(($cell).attr("data-number"));
    let cellPos = [Math.floor(cellNo / 5), cellNo % 5];

    this.game.playMove(cellPos);
    //then render new board
    let that = this;
    this.game.changed.forEach(function(changedPos) {
      // debugger
      let changedCellNo = changedPos[0] * 5 + changedPos[1];
      $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
    });

    //also render new current piece
    $(`.score`).html("score:<p>" + this.game.score + "</p>");
    $(`.current-piece`).html("next:" + this.game.currentPiece.imgTag);
    $(`.hold`).html("hold:<p>" + (this.game.holdPiece ? this.game.holdPiece.imgTag : "") + "</p>");

    if(this.game.won) {
      this.unbindClick();
      this.$el.addClass("game-won");
      console.log("you did it, really. good work.");
      $(".cell").html(ImgValueConstants[7]);
      $(".current-piece").html("<p>EXPECTED BEHAVIOR!!!</p>");

    } else if(this.game.isOver()) {
      this.unbindClick();
      this.$el.addClass("game-over");
      $(".container").append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
      console.log("it's over. seriously.");
    } else {
      if(this.game.bearsExist()) {
        this.game.walkBears(this.updateBears.bind(that));
      }
    }
};

//set a timeout before rendering new bears
//add a class to all of the bears
//css transition
View.prototype.updateBears = function () {
  this.unbindClick(); //don't allow clicks while bears are walking!
  let that = this;

  this.game.oldBears.forEach(function (changedPos, i) {
    let changedCellNo = changedPos[0] * 5 + changedPos[1];
    $(`.cell[data-number=${changedCellNo}]`).addClass(`${that.movementClass(i)}`);
    $(`.cell[data-number=${changedCellNo}]`).off('hover');

    //use index no to index into newbears to see what direction they are moving in
  });
  this.game.newBears.forEach(function (changedPos) {
    let changedCellNo = changedPos[0] * 5 + changedPos[1];
    // $(`.cell[data-number=${changedCellNo}]`).off('click');
    $(`.cell[data-number=${changedCellNo}]`).off('hover');
  });

  //add class to bears to bounce
  this.bearTimeout = setTimeout(function() {
    let bearArr = that.game.newBears.concat(that.game.oldBears);
    bearArr.forEach(function(changedPos) {
      let changedCellNo = changedPos[0] * 5 + changedPos[1];
      $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
    });
    $('.cell').removeClass("toLeft toRight toUp toDown zoom");
    // that.bindEvents();

    that.bindEvents();
    clearTimeout(that.bearTimeout);
  }, 800);

  //clear timeout
};

View.prototype.movementClass = function (idx) {
  let oldRow = this.game.oldBears[idx][0];
  let oldCol = this.game.oldBears[idx][1];

  let newRow = this.game.newBears[idx][0];
  let newCol = this.game.newBears[idx][1];

  if(oldRow === newRow) {
    if(oldCol - 1 === newCol) {
      return "toLeft";
    } else {
      return "toRight";
    }
  } else { //same col
    if(oldRow - 1 === newRow) {
      return "toUp";
    } else {
      return "toDown";
    }
  }
};

View.prototype.setupBoard = function () {
  const $container = $("<div>").addClass("container");

  const grid = $("<ul>").addClass("grid").addClass("group");

  for(let i = 0; i < 25; i++) {
    let $cell = $("<li>").addClass("cell");
    $cell.attr("data-number", i);
    grid.append($cell);
  }

  this.$el.append($container);
  $container.append(grid); //set up the grid for the pieces to be places

  this.game.generateInitialSetup();
  this.game.pieces.forEach(function (piece) {
    $(`.cell[data-number=${piece.getCellNo()}]`).html(piece.imgTag);
  });

  $container.append($("<div>").addClass("score"));
  $(`.score`).html("score:<p>" + this.game.score + "</p>");

  //make a separate place to hold to current piece to be placed
  $container.append($("<div>").addClass("current-piece"));
  $(`.current-piece`).html("next:" + this.game.currentPiece.imgTag);

  $container.append($("<div>").addClass("hold"));
  $(`.hold`).html("hold:<p>" + (this.game.holdPiece ? this.game.holdPiece.imgTag : "") + "</p>");

  $container.append($("<div>").addClass("instructions"));
  $(".instructions").html("Hover over an object for instructions!");

  this.$el.append($("<div>").addClass("instructions-box"));
  for(let i = 0; i < 6; i++) {
    $(".instructions-box").append($("<p>").html());
  }
};

module.exports = View;
