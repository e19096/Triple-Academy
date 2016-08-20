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

	const Piece = __webpack_require__(6);

	$( () => {
	  const rootEl = $('.ta');
	  const game = new Game();
	  const view = new View(game, rootEl);
	  view.setupBoard();
	  view.bindEvents();


	  game.giveCurrentPiece();
	  // game.board.makeGrid();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const ImgConstants = __webpack_require__(3);
	const ImgValueConstants = __webpack_require__(4);

	const View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	};

	View.prototype.bindEvents = function () { //when cell is clicked, check if empty, then send cell to make move
	  let that = this;

	  let currentImg;
	  $(".cell").hover(
	    function(event){
	      if($(event.currentTarget).html() === ""){

	        $(event.currentTarget).addClass("zoom");

	        $(event.currentTarget).html(that.game.currentPiece.imgTag);
	        currentImg = undefined;

	        let cellNo = parseInt($(event.currentTarget).attr("data-number"));

	        let currentVal = that.game.currentPiece.value;
	        let adjacents = that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
	        while(adjacents.length >= 2) {
	          currentVal++;
	          that.game.adjacentTop.forEach(function (adjacentPos) {
	            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-down");
	          });
	          that.game.adjacentBottom.forEach(function (adjacentPos) {
	            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-up");
	          });
	          that.game.adjacentLeft.forEach(function (adjacentPos) {
	            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-right");
	          });
	          that.game.adjacentRight.forEach(function (adjacentPos) {
	            $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-left");
	          });
	          adjacents = that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
	        }
	      } else {
	        currentImg = $(event.currentTarget).html();
	      }
	    },
	    function(event){
	      $(event.currentTarget).html(currentImg ? currentImg : "");
	      $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left");
	    }
	  );

	  $(".cell").on("click", (event) => {
	    let cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    if(this.game.board.grid[Math.floor(cellNo / 5)][cellNo % 5] === "") {
	      this.makeMove($(event.currentTarget));
	      // $(event.currentTarget).addClass("has-piece");
	    }
	    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left zoom");
	  });
	};

	View.prototype.makeMove = function ($cell) {
	  //call game's play move?
	  let cellNo = parseInt(($cell).attr("data-number"));
	  let cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	  this.game.playMove(cellPos);
	  //render new board
	  let that = this;
	  this.game.changed.forEach(function(changedPos) {
	    let changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
	  });
	  //also render new current piece
	  $(`.current-piece`).html(this.game.currentPiece.imgTag);

	  if(this.game.won) {
	    this.$el.addClass("game-won");
	    console.log("you did it, really. good work.");
	    $(".cell").html(ImgValueConstants[7]);
	  } else if(this.game.isOver()) {
	    this.$el.addClass("game-over");
	    this.$el.append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
	    console.log("it's over. seriously.");
	  }
	};

	View.prototype.setupBoard = function () {
	  const grid = $("<ul>").addClass("grid").addClass("group");

	  for(let i = 0; i < 25; i++) {
	    let $cell = $("<li>").addClass("cell");
	    $cell.attr("data-number", i);
	    // cell.html(i);
	    grid.append($cell);
	  }

	  this.$el.append(grid); //set up the grid for the pieces to be places

	  this.game.generateInitialSetup();
	  this.game.pieces.forEach(function (piece) {
	    $(`.cell[data-number=${piece.getCellNo()}]`).html(piece.imgTag);
	  });

	  //make a separate place to hold to current piece to be placed
	  this.$el.append($("<div>").addClass("current-piece"));
	  $(`.current-piece`).html(this.game.currentPiece.imgTag);

	  this.$el.append($("<div>").addClass("instructions"));
	};

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const ImgConstants = __webpack_require__(3);
	const ImgValueConstants = __webpack_require__(4);
	const Board = __webpack_require__(5);
	const Piece = __webpack_require__(6);
	const Bear = __webpack_require__(7);

	function Game() {
	  this.board = new Board();
	  this.pieces = [];
	  this.currentPiece = this.giveCurrentPiece();
	  this.changed = [];

	  this.adjacentTop = [];
	  this.adjacentBottom = [];
	  this.adjacentLeft = [];
	  this.adjacentRight = [];

	  this.won = false;

	  this.bears = [];
	}

	Game.prototype.playMove = function (clickedCellPos) {
	  this.changed = [clickedCellPos];

	  // let cellPos = [Math.floor(clickedCellNo / 5), clickedCellNo % 5];
	  // this.board.grid[clickedCellPos[0]][clickedCellPos[1]] = this.currentPiece;
	  this.updatePos(clickedCellPos, this.currentPiece);

	  let adjacentPositions = this.adjacentMatchingPositions(clickedCellPos);
	  while(adjacentPositions.length >= 2) {
	    console.log("time to combine!");
	    let biggerPiece = this.combine(clickedCellPos, adjacentPositions); //combine them

	    if(biggerPiece.value === 6) {
	      console.log("YOU WIN!!!!!!!! YAAAAAYYYYYYY");
	      this.won = true;
	    }

	    adjacentPositions = this.adjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
	  }

	  if(this.isOver()) {
	    console.log("IT'S OVER. STOP PLAYING");
	  } else {
	    this.currentPiece = this.giveCurrentPiece();
	  }
	};

	Game.prototype.updatePos = function (pos, piece) {
	  this.board.grid[pos[0]][pos[1]] = piece;
	  piece.pos = pos;
	};

	Game.prototype.isOver = function () {
	  return this.board.isFull();
	};

	Game.prototype.getAdjacentEmptys = function (pos) {
	  let row = pos[0];
	  let col = pos[1];

	  let emptys = [];

	  let topPos = [row - 1, col];
	  let bottomPos = [row + 1, col];
	  let leftPos = [row, col - 1];
	  let rightPos = [row, col + 1];


	};

	Game.prototype.adjacentMatchingPositions = function (gridPos, pieceValue) {
	  //reset the adjacent arrays
	  this.adjacentTop = [];
	  this.adjacentBottom = [];
	  this.adjacentLeft = [];
	  this.adjacentRight = [];

	  let row = gridPos[0];
	  let col = gridPos[1];

	  if(!pieceValue) { //pieceValue is a string
	    pieceValue = this.currentPiece.value;
	  }

	  let adjacents = []; //to keep track of adjacent same objects

	  //check all adjacent cells to check if same piece
	  let topPos = [row - 1, col];
	  let bottomPos = [row + 1, col];
	  let leftPos = [row, col - 1];
	  let rightPos = [row, col + 1];

	  let that = this;
	  //if not top row
	  if((row > 0) && (this.board.grid[topPos[0]][topPos[1]].value === pieceValue)) { //top
	    // debugger
	    adjacents.push(topPos); //adjacents.concat(this.adjacentMatchingPositions(topPos, pieceValue, thirdParamToExcludeBottomPosCheck?));
	    that.adjacentTop.push(topPos);
	    if((topPos[0] > 0) && (this.board.grid[topPos[0] - 1][topPos[1]].value === pieceValue)) { //top
	      adjacents.push([topPos[0] - 1, topPos[1]]);
	      that.adjacentTop.push([topPos[0] - 1, topPos[1]]);
	    }
	    if(((topPos[1]) % 5 > 0) && (this.board.grid[topPos[0]][topPos[1] - 1].value === pieceValue)) { //left
	      adjacents.push([topPos[0], topPos[1] - 1]);
	      that.adjacentLeft.push([topPos[0], topPos[1] - 1]);
	      that.adjacentTop.push([topPos[0], topPos[1] - 1]);
	    }
	    if(((topPos[1]) % 5 < 4) && (this.board.grid[topPos[0]][topPos[1] + 1].value === pieceValue)) { //right
	      adjacents.push([topPos[0], topPos[1] + 1]);
	      that.adjacentRight.push([topPos[0], topPos[1] + 1]);
	      that.adjacentTop.push([topPos[0], topPos[1] + 1]);
	    }
	  }

	  //if not bottom row
	  if((row < 4) && (this.board.grid[bottomPos[0]][bottomPos[1]].value === pieceValue)) { //bottom
	    // debugger
	    adjacents.push(bottomPos);  //= this.adjacentMatchingPositions(Pos, pieceValue);
	    that.adjacentBottom.push(bottomPos);
	    if((bottomPos[0] < 4) && (this.board.grid[bottomPos[0] + 1][bottomPos[1]].value === pieceValue)) { //bottom
	      adjacents.push([bottomPos[0] + 1, bottomPos[1]]);
	      that.adjacentBottom.push([bottomPos[0] + 1, bottomPos[1]]);
	    }
	    if(((bottomPos[1]) % 5 > 0) && (this.board.grid[bottomPos[0]][bottomPos[1] - 1].value === pieceValue)) { //left
	      adjacents.push([bottomPos[0], bottomPos[1] - 1]);
	      that.adjacentLeft.push([bottomPos[0], bottomPos[1] - 1]);
	      that.adjacentBottom.push([bottomPos[0], bottomPos[1] - 1]);
	    }
	    if(((bottomPos[1]) % 5 < 4) && (this.board.grid[bottomPos[0]][bottomPos[1] + 1].value === pieceValue)) { //right
	      adjacents.push([bottomPos[0], bottomPos[1] + 1]);
	      that.adjacentRight.push([bottomPos[0], bottomPos[1] + 1]);
	      that.adjacentBottom.push([bottomPos[0], bottomPos[1] + 1]);
	    }
	  }

	  //if not left-most col
	  if((col % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1]].value === pieceValue)) { //left
	    // debugger
	    adjacents.push(leftPos);  // = this.adjacentMatchingPositions(Pos, pieceValue);
	    that.adjacentLeft.push(leftPos);
	    if((leftPos[0] > 0) && (this.board.grid[leftPos[0] - 1][leftPos[1]].value === pieceValue)) { //top
	      adjacents.push([leftPos[0] - 1, leftPos[1]]);
	      that.adjacentTop.push([leftPos[0] - 1, leftPos[1]]);
	      that.adjacentLeft.push([leftPos[0] - 1, leftPos[1]]);
	    }
	    if((leftPos[0] < 4) && (this.board.grid[leftPos[0] + 1][leftPos[1]].value === pieceValue)) { //bottom
	      adjacents.push([leftPos[0] + 1, leftPos[1]]);
	      that.adjacentBottom.push([leftPos[0] + 1, leftPos[1]]);
	      that.adjacentLeft.push([leftPos[0] + 1, leftPos[1]]);
	    }
	    if(((leftPos[1]) % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1] - 1].value === pieceValue)) { //left
	      adjacents.push([leftPos[0], leftPos[1] - 1]);
	      that.adjacentLeft.push([leftPos[0], leftPos[1] - 1]);
	    }
	  }

	  //if not right-most col
	  if((col % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1]].value === pieceValue)) { //right
	    // debugger
	    adjacents.push(rightPos);  // = this.adjacentMatchingPositions(Pos, pieceValue);
	    that.adjacentRight.push(rightPos);
	    if((rightPos[0] > 0) && (this.board.grid[rightPos[0] - 1][rightPos[1]].value === pieceValue)) { //top
	      adjacents.push([rightPos[0] - 1, rightPos[1]]);
	      that.adjacentTop.push([rightPos[0] - 1, rightPos[1]]);
	      that.adjacentRight.push([rightPos[0] - 1, rightPos[1]]);
	    }
	    if((rightPos[0] < 4) && (this.board.grid[rightPos[0] + 1][rightPos[1]].value === pieceValue)) { //bottom
	      adjacents.push([rightPos[0] + 1, rightPos[1]]);
	      that.adjacentBottom.push([rightPos[0] + 1, rightPos[1]]);
	      that.adjacentRight.push([rightPos[0] + 1, rightPos[1]]);
	    }
	    if(((rightPos[1]) % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1] + 1].value === pieceValue)) { //right
	      adjacents.push([rightPos[0], rightPos[1] + 1]);
	      that.adjacentRight.push([rightPos[0], rightPos[1] + 1]);
	    }
	  }

	  return adjacents;
	};

	Game.prototype.combine = function (cellPos, adjacentPositions) {
	  let that = this;
	  //clear adjacent cells and put bigger piece in cell (or return new piece)
	  adjacentPositions.forEach(function (pos) { //clear adjacent cells
	    that.board.grid[pos[0]][pos[1]] = "";
	    that.changed.push(pos);
	  });
	  let newValue = this.board.grid[cellPos[0]][cellPos[1]].value + 1;
	  let biggerPiece = new Piece(ImgValueConstants[newValue].slice(19, -7), cellPos);
	  this.board.grid[cellPos[0]][cellPos[1]] = biggerPiece;

	  return biggerPiece;
	};

	Game.prototype.giveCurrentPiece = function () {
	  //pick random piece (from: grass, bush, tree, hut, bear)
	  let randomType = ImgConstants[Math.floor(Math.random() * (33 - 1) + 1)];

	  let randomCellNo = Math.floor(Math.random() * 25);
	  let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

	  if(randomType === "bear") {
	    return new Bear(pos);
	  } else {
	    return new Piece(randomType, pos);
	  }
	};

	Game.prototype.generateInitialSetup = function () {
	  //place random pieces (from: grass, bush, tree, hut) in random cells
	  //- some number of pieces between 5-7
	  let numPieces = Math.floor(Math.random() * (8 - 5) + 5);

	  for(let i = 0; i < numPieces; i++) {
	    let randomType = ImgConstants[Math.floor(Math.random() * (33 - 1) + 1)];

	    let randomCellNo = Math.floor(Math.random() * 25);
	    let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

	    // make sure cell is empty else do it again
	    // and also make sure this piece is not adjacent to 2+ of the same piece
	    while(this.board.grid[pos[0]][pos[1]] !== "") {
	      console.log("oops! there's already something there!");
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];

	      //also check adjacents in here?
	    }

	    let adjacentPositions = this.adjacentMatchingPositions(pos, ImgValueConstants[randomType]);
	    console.log(`number of adjacent pos: ${adjacentPositions.length}`);
	    while(adjacentPositions.length >= 2) {
	      console.log("oops! close call. we need to combine! or..."); //ether pick a diff cell here or actually combine...
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	      // let biggerPiece = this.combine(randomCellNo, adjacentPositions);
	      // adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], biggerPiece.type );
	      adjacentPositions = this.adjacentMatchingPositions(pos, ImgValueConstants[randomType]);
	    }

	      let randomPiece = new Piece(randomType, pos);
	      this.pieces.push(randomPiece);
	      this.board.grid[pos[0]][pos[1]] = randomPiece;
	    }
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

	//for initial setup (piece randomization)

	ImgConstants = {
	  1:  "grass",//"<img src='./images/grass.png' >",
	  2:  "grass",//"<img src='./images/grass.png' >",
	  3:  "grass",//"<img src='./images/grass.png' >",
	  4:  "grass",//"<img src='./images/grass.png' >",
	  5:  "grass",//"<img src='./images/grass.png' >",
	  6:  "grass",//"<img src='./images/grass.png' >",
	  7:  "grass",//"<img src='./images/grass.png' >",
	  8:  "grass",//"<img src='./images/grass.png' >",
	  9:  "grass",//"<img src='./images/grass.png' >",
	  10: "grass",//"<img src='./images/grass.png' >",
	  11: "grass",//"<img src='./images/grass.png' >",
	  12: "grass",//"<img src='./images/grass.png' >",
	  13: "grass",//"<img src='./images/grass.png' >",
	  14: "grass",//"<img src='./images/grass.png' >",
	  15: "grass",//"<img src='./images/grass.png' >",
	  16: "grass",//"<img src='./images/grass.png' >",
	  17: "grass",//"<img src='./images/grass.png' >",
	  18: "grass",//"<img src='./images/grass.png' >",
	  19: "grass",//"<img src='./images/grass.png' >",
	  20: "grass",//"<img src='./images/grass.png' >",

	  21: "bush",//"<img src='./images/bush.png' >",
	  22: "bush",//"<img src='./images/bush.png' >",
	  23: "bush",//"<img src='./images/bush.png' >",
	  24: "bush",//"<img src='./images/bush.png' >",
	  25: "bush",//"<img src='./images/bush.png' >",
	  26: "bush",//"<img src='./images/bush.png' >",
	  27: "bush",//"<img src='./images/bush.png' >",
	  28: "bush",//"<img src='./images/bush.png' >",

	  29: "tree",//"<img src='./images/tree.png' >",
	  30: "tree",//"<img src='./images/tree.png' >",
	  31: "tree",//"<img src='./images/tree.png' >",

	  32: "hut",//"<img src='./images/hut.png' >",

	  33: "bear"
	};

	module.exports = ImgConstants;


/***/ },
/* 4 */
/***/ function(module, exports) {

	ImgValueConstants = {
	  // "<img src=\"./images/grass.png\" >": 0,
	  // "<img src=\"./images/bush.png\" >": 1,
	  // "<img src=\"./images/tree.png\" >": 2,
	  // "<img src=\"./images/hut.png\" >": 3,
	  // "<img src=\"./images/house.png\" >": 4,
	  // "<img src=\"./images/mansion.png\" >": 5,
	  // "<img src=\"./images/castle.png\" >": 6,

	  "bear"    : 0,
	  "grass"   : 1,
	  "bush"    : 2,
	  "tree"    : 3,
	  "hut"     : 4,
	  "house"   : 5,
	  "mansion" : 6,
	  "aa"      : 7,
	  // "floating_castle": 8,
	  // "aa": 9,

	  0 : "<img src=\"./images/bear.png\" >",
	  1 : "<img src=\"./images/grass.png\" >",
	  2 : "<img src=\"./images/bush.png\" >",
	  3 : "<img src=\"./images/tree.png\" >",
	  4 : "<img src=\"./images/hut.png\" >",
	  5 : "<img src=\"./images/house.png\" >",
	  6 : "<img src=\"./images/mansion.png\" >",
	  7 : "<img src=\"./images/aa.png\" >"
	  // 8 : "<img src='./images/floating_castle.png' >",
	  // 9 : "<img src='./images/aa.png' >"
	};

	module.exports = ImgValueConstants;


/***/ },
/* 5 */
/***/ function(module, exports) {

	// const Piece = require('./piece');

	const Board = function () {
	  this.grid = this.makeGrid();
	};

	// Board.prototype.isWon = function () {
	//
	// };

	// Board.prototype.grid = function (pos) {
	//   return this.grid[pos[0]][pos[1]];
	// };

	Board.prototype.isFull = function () {
	  for(let i = 0; i < 5; i++) {
	    for(let j = 0; j < 5; j++) {
	      if(this.grid[i][j] === "") {
	        return false;
	      }
	    }
	  }

	  return true;
	};

	Board.prototype.makeGrid = function () {
	  grid = [];
	  for(let i = 0; i < 5; i++) {
	    grid.push([]);
	    for(let j = 0; j < 5; j++) {
	      grid[i].push("");
	    }
	  }
	  return grid;
	};

	// Board.prototype.placePiece = function (pos) {
	//
	// };


	module.exports = Board;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const ImgValueConstants = __webpack_require__(4);

	const Piece = function (type, cellPos) {
	  this.type = type;

	  this.pos = cellPos; //[row, col]
	  // this.cellNo = cellPos[0] * 5 + cellPos[1];

	  this.value = ImgValueConstants[type];

	  this.imgTag = ImgValueConstants[this.value];
	  // debugger
	};

	Piece.prototype.getCellNo = function () {
	  return this.pos[0] * 5 + this.pos[1];
	};

	// Piece.prototype.render = function () {
	//   return this.imgTag; //or call this getImg()
	// };

	// Piece.prototype.combine = function () {
	//
	// };

	module.exports = Piece;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Piece = __webpack_require__(6);
	const Util = __webpack_require__(8);

	const Bear = function (cellPos) {
	  Piece.call(this, "bear", cellPos);
	};

	Util.inherits(Bear, Piece);

	Bear.prototype.walk = function (adjacentEmptyPositions) {
	  //find adjacent empty spaces... or get them from game?
	  //pic a random one to walk to
	  let n = Math.floor(Math.random() * (adjacentEmptyPositions.length));
	  //update bear's pos and cell No
	  this.pos = adjacentEmptyPositions[n];
	  //update grid or re turn new pos so game can update grid
	  return this.pos;
	};

	module.exports = Bear;



	//CLICK A CELL

	//check if this.currentPiece is a bear
	if(this.currentPiece instanceof Bear) {
	  //find adjacent empty positions and call Bear.walk
	  let adjacentEmptys = this.getAdjacentEmptys();

	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	const Util = {
	  inherits (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  }
	};

	module.exports = Util;


/***/ }
/******/ ]);