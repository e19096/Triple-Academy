const View = require('./view');
const Game = require('./game');

$( () => {
  const $rootEl = $('.ta');

  $rootEl.append($("<button>").addClass("play-button display").html("Play!"));
  $(".play-button").on("click", () => {
    startGame($rootEl);
  });
});

let startGame = function($rootEl) {
  $(".container").remove();
  $(".play-button").removeClass("display");
  $rootEl.removeClass("game-over");

  let game = new Game();
  let view = new View(game, $rootEl);
  view.setupBoard();
  view.bindEvents();
};
