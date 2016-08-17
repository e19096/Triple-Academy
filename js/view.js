const ImgConstants = require('./img_constants');

class View {
  constructor(game, $el) {
    this.game = game;
    this.$el = $el;
  }

  bindEvents() { //when cell is clicked, check if empty, then send cell to make move
    $(".cell").on("click", (event) => {
      if($(event.currentTarget).html() === "") {
        this.makeMove($(event.currentTarget));
        // console.log($(event.currentTarget).attr("data-number"));
      }
      // console.log($(event.currentTarget).html());
    });
  }

  makeMove($cell) {
    //call game's play move?
    this.game.playMove($cell);
  }

  setupBoard() {
    const grid = $("<ul>").addClass("grid").addClass("group");

    for(let i = 0; i < 25; i++) {
      let cell = $("<li>").addClass("cell");
      cell.attr("data-number", i);
      cell.html(i);
      grid.append(cell);
    }

    this.$el.append(grid); //set up the grid for the pieces to be places

    //make a separate place to hold to current piece to be placed
    this.$el.append($("<div>").addClass("current-piece"));

    //place random pieces (from: grass, bush, tree, hut) in random cells
    //- some number of pieces between 5-7
    let numPieces = Math.floor(Math.random() * (8 - 5) + 5);

    for(let i = 0; i < numPieces; i++) {
      let randomCellNo = Math.floor(Math.random() * 25);
      // make sure cell is empty else do it again
      while($(`.cell[data-number=${randomCellNo}]`).html()) {
        randomCellNo = Math.floor(Math.random() * 25);
      }

      let randomPiece = `${ImgConstants[Math.floor(Math.random() * (18 - 1) + 1)]}`;
      $(`.cell[data-number=${randomCellNo}]`).html(randomPiece);
    }
  }
}

module.exports = View;
