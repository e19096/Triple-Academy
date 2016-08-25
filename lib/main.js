const View = require('./view');
const Game = require('./game');

$( () => {
  // $('.title').addClass('cute-bounce');

  const $rootEl = $('.ta');

  // $playButton = $("<button>").addClass("play-button").html("Start!");
  // $rootEl.append($playButton);


  const game = new Game();
  const view = new View(game, $rootEl);
  view.setupBoard();
  view.bindEvents();
});
