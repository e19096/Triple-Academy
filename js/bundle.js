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
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Game {

	}

	module.exports = Game;


/***/ }
/******/ ]);