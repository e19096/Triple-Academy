const View = require('./view');
const Game = require('./game');

$( () => {

  const $rootEl = $('.ta');

  // $playButton = $("<button>").addClass("play-button").html("Start!");
  // $rootEl.append($playButton);

  const game = new Game();
  const view = new View(game, $rootEl);
  view.setupBoard();
  view.bindEvents();
});
