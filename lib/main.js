const View = require('./view');
const Game = require('./game');
const InstructionConstants = require('./constants/instruction_constants');

$( () => {
  const $rootEl = $('.ta');

  $rootEl.append($("<button>").addClass("play-button display").html("Play!"));
  $(".play-button").on("click", () => {
    startGame($rootEl);
  });
  $rootEl.append($("<img>").addClass("demo-gif").attr("src", "./assets/images/demo-small.gif"));
});

let startGame = function($rootEl) {
  $(".container").remove();
  $(".demo-gif").remove();
  $(".play-button").removeClass("display");
  $rootEl.removeClass("game-over");

  let game = new Game();
  let view = new View(game, $rootEl);
  view.setupBoard();
  view.bindEvents();
};
