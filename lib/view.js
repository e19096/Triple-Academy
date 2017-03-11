const ImgValueConstants = require('./constants/img_value_constants');
const InstructionConstants = require('./constants/instruction_constants');
const Bear = require('./bear');

const View = function (game, $el) {
  this.game = game;
  this.$el = $el;
};

View.prototype.bindEvents = function() { //when cell is clicked, check if empty, then send cell to make move
  let clear = false;

  $(".cell").hover(
    function(event) {
      let cellNo = parseInt($(event.currentTarget).attr("data-number"));
      let cellPos = [Math.floor(cellNo / 5), cellNo % 5];

      if($(event.currentTarget).html() === ""){

        $(event.currentTarget).addClass("zoom");
        $(event.currentTarget).html(this.game.currentPiece.imgTag);

        let currentVal = this.game.currentPiece.value;
        this.game.setAdjacentMatchingPositions(cellPos, currentVal);
        while(!(this.game.currentPiece instanceof Bear) && this.game.multAdjacentsExist()) {
          currentVal++;
          for(let dir in this.game.adjacentsObj) {
            this.game.adjacentsObj[dir].forEach( (pos) => {
              $(`.cell[data-number=${pos[0] * 5 + pos[1]}]`).addClass(`${dir}-bounce`);
            });
          }
          this.game.setAdjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
        }
        clear = true;
      } else {
        clear = false;
        //display the instructions for this piece from instruction constants
        let hoverPiece = this.game.getPiece(cellPos);
        $(".instructions").html(InstructionConstants[hoverPiece.type]);
      }
    }.bind(this),
    function(event){
      if(clear) {
        $(event.currentTarget).html("");
      }
      $(".cell").removeClass("top-bounce bottom-bounce left-bounce right-bounce");
      $(".instructions").empty().append($("<div>").html("Hover over an object for instructions!"));
    }
  );

  $(".cell").on("click", (event) => {
    let cellNo = parseInt($(event.currentTarget).attr("data-number"));
    let cellPos = [Math.floor(cellNo/5), cellNo % 5];
    if(this.game.board.grid[cellPos[0]][cellPos[1]] === "") {
      this.makeMove($(event.currentTarget));
    }
    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left zoom");
  });

  $(".hold").on("click", (event) => {
    this.game.swapHoldPiece( () => {
      $(`.current-piece`).html("next:" + this.game.currentPiece.imgTag);
      $(`.hold`).html("hold:" + this.game.holdPiece.imgTag);
    });
  });
};

View.prototype.unbind = function (actions) {
  if(actions.includes("click")) {
    $(".cell").off("click");
    $(".hold").off("click");
  }
  if(actions.includes("hover")) {
    $(".cell").off("mouseenter mouseleave");
  }
};

View.prototype.makeMove = function ($cell) {
    let cellNo = parseInt(($cell).attr("data-number"));
    let cellPos = [Math.floor(cellNo / 5), cellNo % 5];

    this.game.playMove(cellPos);
    //then render new board
    this.game.changed.forEach( (changedPos) => {
      let changedCellNo = changedPos[0] * 5 + changedPos[1];
      $(`.cell[data-number=${changedCellNo}]`).html(this.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? this.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
    });

    //also render new current piece
    $(`.score`).html("score:<p>" + this.game.score + "</p>");
    $(`.current-piece`).html("next:" + this.game.currentPiece.imgTag);
    $(`.hold`).html("hold:<p>" + (this.game.holdPiece ? this.game.holdPiece.imgTag : "") + "</p>");

    if(this.game.won) {
      this.unbind(["click", "hover"]);
      this.$el.addClass("game-won");
      console.log("you did it, really. good work.");
      $(".cell").html(ImgValueConstants[7]);
      $(".current-piece").html("<p>YAY!!!</p>");
    } else if(this.game.isOver()) {
      this.unbind(["click", "hover"]);
      this.$el.addClass("game-over");
      $(".container").append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
      $(".play-button").addClass("display").html("Play again!");
      $(".instructions-button").remove();
      console.log("it's over. seriously.");
    } else {
      if(this.game.bearsExist()) {
        this.game.walkBears(this.updateBears.bind(this));
      }
    }
};

View.prototype.updateBears = function () {
  this.unbind(["click"]); //don't allow clicks while bears are walking!

  this.game.oldBears.forEach( (changedPos, i) => {
    let changedCellNo = changedPos[0] * 5 + changedPos[1];
    $(`.cell[data-number=${changedCellNo}]`).addClass(`${this.movementClass(i)}`);
    $(`.cell[data-number=${changedCellNo}]`).off('hover');
    //use index no to index into newbears to see what direction they are moving in
  });
  this.game.newBears.forEach( (changedPos) => {
    let changedCellNo = changedPos[0] * 5 + changedPos[1];
    $(`.cell[data-number=${changedCellNo}]`).off('hover');
  });

  //add class to bears to bounce
  this.bearTimeout = setTimeout( () => {
    let bearArr = this.game.newBears.concat(this.game.oldBears);
    bearArr.forEach( (changedPos) => {
      let changedCellNo = changedPos[0] * 5 + changedPos[1];
      $(`.cell[data-number=${changedCellNo}]`).html(this.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? this.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
    });
    $('.cell').removeClass("toLeft toRight toUp toDown zoom");

    this.bindEvents();
    clearTimeout(this.bearTimeout);
  }, 800);
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

View.prototype.addInstructions = function () {
  let showInstructions = () => {
    this.$el.append($("<div>").addClass("instructions-modal display"));
    $(".instructions-modal").append($("<div>").addClass("outer-modal close-button"));
    $(".instructions-modal").append($("<div>").addClass("inner-modal"));

    let instrStr = `Place pieces next to each other to build bigger pieces.</br>Match 3 ${ImgValueConstants[5]}'s to win!</br></br>`;
    for (let piece in InstructionConstants) {
      instrStr += InstructionConstants[piece];
    }
    $(".inner-modal").html(instrStr);

    $(".inner-modal").append($("<div>").addClass("close-button").html("&times"));
    $(".close-button").on("click", () => { hideInstructions(); });
  };

  let hideInstructions = function () {
    $(".instructions-modal").remove();
  };

  this.$el.append($("<button>").addClass("instructions-button").html("Instructions"));
  $(".instructions-button").on("click", () => {
    showInstructions();
  });
};

View.prototype.setupBoard = function () {
  this.addInstructions();

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
  $(".instructions").append($("<div>").html("Hover over an object for instructions!"));
};

module.exports = View;
