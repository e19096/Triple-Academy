const View = require('./view');
const Game = require('./game');

const Piece = require('./piece');

$( () => {
  const rootEl = $('.ta');
  const game = new Game();
  const view = new View(game, rootEl);
  view.setupBoard();
  view.bindEvents();


  game.giveCurrentPiece();
  // game.board.makeGrid();
});
