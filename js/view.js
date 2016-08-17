class View {
  constructor(game, $el) {
    this.game = game;
    this.$el = $el;
  }

  bindEvents() { //when cell is clicked, check if empty, then send cell to make move
    $(".cell").on("click", (event) => {
      if($(event.currentTarget).html() === "") {
        // console.log($(event.currentTarget).data("number"));
        this.makeMove($(event.currentTarget));
      }
      // console.log($(event.currentTarget).html());
    });
  }

  makeMove($cell) {
    //put the value in the current piece div into this cell
    let current = $(".current-piece").data("piece");
    $cell.html(current);
    // $cell.html("idk");
  }

  setupBoard() {
    const grid = $("<ul>").addClass("grid").addClass("group");

    for(let i = 0; i < 25; i++) {
      let cell = $("<li>").addClass("cell");
      cell.data("number", i);
      // cell.html(i);
      grid.append(cell);
    }

    this.$el.append(grid); //set up the grid for the pieces to be places

    this.$el.append($("<div>").addClass("current-piece"));//make a separate place to hold to current piece to be placed

    //place random pieces on board
  }
}

module.exports = View;
