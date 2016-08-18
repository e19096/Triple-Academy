/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const View = __webpack_require__(1);
	const Game = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.ta');
	  const game = new Game();
	  const view = new View(game, rootEl);
	  view.setupBoard();
	  view.bindEvents();
	  game.giveCurrentPiece();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const ImgConstants = __webpack_require__(3);

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
	      console.log($(event.currentTarget).attr("data-number"));
	    });
	  }

	  makeMove($cell) {
	    //call game's play move?
	    this.game.playMove($cell);
	  }

	  setupBoard() {
	    const grid = $("<ul>").addClass("grid").addClass("group");

	    for(let i = 0; i < 25; i++) {
	      let $cell = $("<li>").addClass("cell");
	      $cell.attr("data-number", i);
	      // cell.html(i);
	      grid.append($cell);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const ImgConstants = __webpack_require__(3);

	class Game {
	  constructor() {
	    // this.giveCurrentPiece();
	  }

	  playMove($cell) {
	    let currentPiece = $(".current-piece").html();
	    $cell.html(currentPiece);
	    this.adjacentSamePieces($cell);
	    this.giveCurrentPiece();
	  }

	  adjacentSamePieces($cell) {
	    let currentCellNo = $cell.attr("data-number");
	    // console.log(currentCellNo);
	    // console.log($(`.cell[data-number=${currentCellNo - 5}]`).html());
	    // console.log($(`.cell[data-number=${parseInt(currentCellNo) + 5}]`).html());
	    // console.log($(`.cell[data-number=${currentCellNo - 1}]`).html());
	    // console.log($(`.cell[data-number=${parseInt(currentCellNo) + 1}]`).html());

	    let adjacentCount = 0; //to keep track of adjacent same objects
	    //check all adjacent cells to check if same piece
	    if((currentCellNo > 4) && $(`.cell[data-number=${parseInt(currentCellNo) - 5}]`).html() === $cell.html()) { //top
	      adjacentCount++;
	      console.log("top!");
	    }
	    if((currentCellNo < 20) && $(`.cell[data-number=${parseInt(currentCellNo) + 5}]`).html() === $cell.html()) { //bottom
	      adjacentCount++;
	      console.log("bottom!");
	    }
	    if((currentCellNo % 5 !== 0) && $(`.cell[data-number=${parseInt(currentCellNo) - 1}]`).html() === $cell.html()) { //left
	      adjacentCount++;
	      console.log("left!");
	    }
	    if((currentCellNo % 5 !== 4) && $(`.cell[data-number=${parseInt(currentCellNo) + 1}]`).html() === $cell.html()) { //right
	      adjacentCount++;
	      console.log("right!");
	    }
	  }

	  combine() {

	  }

	  giveCurrentPiece() {
	    //pick random piece (from: grass, bush, tree)
	    $(".current-piece").html(`${ImgConstants[Math.floor(Math.random() * (17 - 1) + 1)]}`);
	  }
	}

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

	ImgConstants = {
	  1: '<img src="./images/grass.png" >',
	  2: '<img src="./images/grass.png" >',
	  3: '<img src="./images/grass.png" >',
	  4: '<img src="./images/grass.png" >',
	  5: '<img src="./images/grass.png" >',
	  6: '<img src="./images/grass.png" >',
	  7: '<img src="./images/grass.png" >',
	  8: '<img src="./images/grass.png" >',

	  9: '<img src="./images/bush.png" >',
	  10: '<img src="./images/bush.png" >',
	  11: '<img src="./images/bush.png" >',
	  12: '<img src="./images/bush.png" >',
	  13: '<img src="./images/bush.png" >',

	  14: '<img src="./images/tree.png" >',
	  15: '<img src="./images/tree.png" >',
	  16: '<img src="./images/tree.png" >',

	  17: '<img src="./images/hut.png" >',

	  18: '<img src="./images/house.png" >',

	  19: '<img src="./images/mansion.png" >',

	  20: '<img src="./images/castle.png" >'
	};

	module.exports = ImgConstants;


/***/ }
/******/ ]);