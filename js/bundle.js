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

	const View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	};

	View.prototype.bindEvents = function () { //when cell is clicked, check if empty, then send cell to make move
	  let that = this;
	  $(".cell").on("click", (event) => {
	    // if($(event.currentTarget).html() === "") {
	    let cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    if(this.game.board.grid[Math.floor(cellNo / 5)][cellNo % 5] === "") {
	      this.makeMove($(event.currentTarget));
	      // console.log($(event.currentTarget).attr("data-number"));
	    }
	    // console.log($(event.currentTarget).attr("data-number"));
	  });

	  let currentImg;
	  $(".cell").hover(
	    function(event){
	      if($(event.currentTarget).html() === ""){

	        $(event.currentTarget).html(that.game.currentPiece.imgTag);
	        currentImg = undefined;

	        let cellNo = parseInt($(event.currentTarget).attr("data-number"));
	        that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], that.game.currentPiece.type);

	        that.game.adjacentTop.forEach(function (adjacentPos) {
	          $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-down");
	          // debugger
	        });
	        that.game.adjacentBottom.forEach(function (adjacentPos) {
	          $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-up");
	          // debugger
	        });
	        that.game.adjacentLeft.forEach(function (adjacentPos) {
	          $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-right");
	          // debugger
	        });
	        that.game.adjacentRight.forEach(function (adjacentPos) {
	          $(`.cell[data-number=${adjacentPos[0] * 5 + adjacentPos[1]}]`).addClass("bounce-left");
	          // debugger
	        });
	      } else {
	        currentImg = $(event.currentTarget).html();
	      }
	    },
	    function(event){
	      $(event.currentTarget).html(currentImg ? currentImg : "");
	    }
	  );
	};

	View.prototype.makeMove = function ($cell) {
	  //call game's play move?
	  this.game.playMove(parseInt(($cell).attr("data-number")));
	  //render new board
	  let that = this;
	  this.game.changed.forEach(function(changedCellNo) {
	    $(`.cell[data-number=${changedCellNo}]`).html(that.game.board.grid[Math.floor(changedCellNo / 5)][changedCellNo % 5].imgTag ? that.game.board.grid[Math.floor(changedCellNo / 5)][changedCellNo % 5].imgTag : "");
	    // debugger
	  });
	  //also render new current piece
	  $(`.current-piece`).html(this.game.currentPiece.imgTag);

	  if(this.game.isOver()) {
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
	    $(`.cell[data-number=${piece.cellNo}]`).html(piece.imgTag);
	  });

	  //make a separate place to hold to current piece to be placed
	  this.$el.append($("<div>").addClass("current-piece"));
	  $(`.current-piece`).html(this.game.currentPiece.imgTag);
	};

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const ImgConstants = __webpack_require__(3);
	const ImgValueConstants = __webpack_require__(4);
	const Board = __webpack_require__(5);
	const Piece = __webpack_require__(6);

	function Game() {
	  this.board = new Board();
	  this.pieces = [];
	  this.currentPiece = this.giveCurrentPiece();
	  this.changed = [];

	  this.adjacentTop = [];
	  this.adjacentBottom = [];
	  this.adjacentLeft = [];
	  this.adjacentRight = [];
	}

	Game.prototype.playMove = function (clickedCellNo) {
	  this.changed = [clickedCellNo];

	  let cellPos = [Math.floor(clickedCellNo / 5), clickedCellNo % 5];
	  this.board.grid[cellPos[0]][cellPos[1]] = this.currentPiece;

	  let adjacentPositions = this.adjacentMatchingPositions(cellPos);
	  while(adjacentPositions.length >= 2) {
	    console.log("time to combine!");
	    let biggerPiece = this.combine(clickedCellNo, adjacentPositions); //combine them

	    // $cell.html(newPiece); //render the new piece
	    adjacentPositions = this.adjacentMatchingPositions(cellPos, biggerPiece.type); //check that that doesn't need to be combined
	  }
	  // debugger
	    // console.log(this.board.isFull());
	    if(this.board.isFull()) {
	      console.log("IT'S OVER. STOP PLAYING");
	    } else {
	      this.currentPiece = this.giveCurrentPiece();
	    }
	};

	Game.prototype.isOver = function () {
	  return this.board.isFull();
	};

	Game.prototype.adjacentMatchingPositions = function (gridPos, pieceType) {
	  //reset the adjacent arrays
	  this.adjacentTop = [];
	  this.adjacentBottom = [];
	  this.adjacentLeft = [];
	  this.adjacentRight = [];

	  let row = gridPos[0];
	  let col = gridPos[1];

	  if(!pieceType) { //pieceType is a string
	    pieceType = this.currentPiece.type;
	  }

	  let adjacents = []; //to keep track of adjacent same objects

	  //check all adjacent cells to check if same piece
	  let topPos = [row - 1, col];
	  let bottomPos = [row + 1, col];
	  let leftPos = [row, col - 1];
	  let rightPos = [row, col + 1];

	  let that = this;
	  //if not top row
	  if((row > 0) && (this.board.grid[topPos[0]][topPos[1]].type === pieceType)) { //top
	    // debugger
	    adjacents.push(topPos); //adjacents.concat(this.adjacentMatchingPositions(topPos, pieceType, thirdParamToExcludeBottomPosCheck?));
	    that.adjacentTop.push(topPos);
	    if((topPos[0] > 0) && (this.board.grid[topPos[0] - 1][topPos[1]].type === pieceType)) { //top
	      adjacents.push([topPos[0] - 1, topPos[1]]);
	      that.adjacentTop.push([topPos[0] - 1, topPos[1]]);
	    }
	    if(((topPos[1]) % 5 > 0) && (this.board.grid[topPos[0]][topPos[1] - 1].type === pieceType)) { //left
	      adjacents.push([topPos[0], topPos[1] - 1]);
	      that.adjacentLeft.push([topPos[0], topPos[1] - 1]);
	    }
	    if(((topPos[1]) % 5 < 4) && (this.board.grid[topPos[0]][topPos[1] + 1].type === pieceType)) { //right
	      adjacents.push([topPos[0], topPos[1] + 1]);
	      that.adjacentRight.push([topPos[0], topPos[1] + 1]);
	    }
	  }

	  //if not bottom row
	  if((row < 4) && (this.board.grid[bottomPos[0]][bottomPos[1]].type === pieceType)) { //bottom
	    // debugger
	    adjacents.push(bottomPos);  //= this.adjacentMatchingPositions(Pos, pieceType);
	    that.adjacentBottom.push(bottomPos);
	    if((bottomPos[0] < 4) && (this.board.grid[bottomPos[0] + 1][bottomPos[1]].type === pieceType)) { //bottom
	      adjacents.push([bottomPos[0] + 1, bottomPos[1]]);
	      that.adjacentBottom.push([bottomPos[0] + 1, bottomPos[1]]);
	    }
	    if(((bottomPos[1]) % 5 > 0) && (this.board.grid[bottomPos[0]][bottomPos[1] - 1].type === pieceType)) { //left
	      adjacents.push([bottomPos[0], bottomPos[1] - 1]);
	      that.adjacentLeft.push([bottomPos[0], bottomPos[1] - 1]);
	    }
	    if(((bottomPos[1]) % 5 < 4) && (this.board.grid[bottomPos[0]][bottomPos[1] + 1].type === pieceType)) { //right
	      adjacents.push([bottomPos[0], bottomPos[1] + 1]);
	      that.adjacentRight.push([bottomPos[0], bottomPos[1] + 1]);
	    }
	  }

	  //if not left-most col
	  if((col % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1]].type === pieceType)) { //left
	    // debugger
	    adjacents.push(leftPos);  // = this.adjacentMatchingPositions(Pos, pieceType);
	    that.adjacentLeft.push(leftPos);
	    if((leftPos[0] > 0) && (this.board.grid[leftPos[0] - 1][leftPos[1]].type === pieceType)) { //top
	      adjacents.push([leftPos[0] - 1, leftPos[1]]);
	      that.adjacentTop.push([leftPos[0] - 1, leftPos[1]]);
	    }
	    if((leftPos[0] < 4) && (this.board.grid[leftPos[0] + 1][leftPos[1]].type === pieceType)) { //bottom
	      adjacents.push([leftPos[0] + 1, leftPos[1]]);
	      that.adjacentBottom.push([leftPos[0] + 1, leftPos[1]]);
	    }
	    if(((leftPos[1]) % 5 > 0) && (this.board.grid[leftPos[0]][leftPos[1] - 1].type === pieceType)) { //left
	      adjacents.push([leftPos[0], leftPos[1] - 1]);
	      that.adjacentLeft.push([leftPos[0], leftPos[1] - 1]);
	    }
	  }

	  //if not right-most col
	  if((col % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1]].type === pieceType)) { //right
	    // debugger
	    adjacents.push(rightPos);  // = this.adjacentMatchingPositions(Pos, pieceType);
	    that.adjacentRight.push(rightPos);
	    if((rightPos[0] > 0) && (this.board.grid[rightPos[0] - 1][rightPos[1]].type === pieceType)) { //top
	      adjacents.push([rightPos[0] - 1, rightPos[1]]);
	      that.adjacentTop.push([rightPos[0] - 1, rightPos[1]]);
	    }
	    if((rightPos[0] < 4) && (this.board.grid[rightPos[0] + 1][rightPos[1]].type === pieceType)) { //bottom
	      adjacents.push([rightPos[0] + 1, rightPos[1]]);
	      that.adjacentBottom.push([rightPos[0] + 1, rightPos[1]]);
	    }
	    if(((rightPos[1]) % 5 < 4) && (this.board.grid[rightPos[0]][rightPos[1] + 1].type === pieceType)) { //right
	      adjacents.push([rightPos[0], rightPos[1] + 1]);
	      that.adjacentRight.push([rightPos[0], rightPos[1] + 1]);
	    }
	  }

	  return adjacents;
	};

	Game.prototype.combine = function (cellNo, adjacentPositions) {
	  let that = this;
	  //clear adjacent cells and put bigger piece in cell (or return new piece)
	  adjacentPositions.forEach(function (pos) { //clear adjacent cells
	    that.board.grid[pos[0]][pos[1]] = "";
	    that.changed.push(pos[0] * 5 + pos[1]);
	  });
	  let newValue = this.board.grid[Math.floor(cellNo / 5)][cellNo % 5].value + 1;
	  let biggerPiece = new Piece(ImgValueConstants[newValue].slice(19, -7), cellNo);
	  this.board.grid[Math.floor(cellNo / 5)][cellNo % 5] = biggerPiece;

	  return biggerPiece;
	};

	Game.prototype.giveCurrentPiece = function () {
	  //pick random piece (from: grass, bush, tree)
	  let randomType = ImgConstants[Math.floor(Math.random() * (23 - 1) + 1)];
	  let randomCellNo = Math.floor(Math.random() * 25);
	  return new Piece(randomType, randomCellNo);
	};

	Game.prototype.generateInitialSetup = function () {
	  //place random pieces (from: grass, bush, tree, hut) in random cells
	  //- some number of pieces between 5-7
	  let numPieces = Math.floor(Math.random() * (8 - 5) + 5);

	  for(let i = 0; i < numPieces; i++) {
	    let randomType = ImgConstants[Math.floor(Math.random() * (24 - 1) + 1)];
	    let randomCellNo = Math.floor(Math.random() * 25);

	    // make sure cell is empty else do it again
	    // and also make sure this piece is not adjacent to 2+ of the same piece
	    while(this.board.grid[Math.floor(randomCellNo / 5)][randomCellNo % 5] !== "") {
	      console.log("oops! there's already something there!");
	      randomCellNo = Math.floor(Math.random() * 25);

	      // let adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], randomType );
	      // while(adjacentPositions.length >= 2) {
	      //   console.log("oops! close call. let's combine!"); //ether pick a diff cell here or actually combine...
	      //   // randomCellNo = Math.floor(Math.random() * 25);
	      //   let biggerPiece = this.combine(randomCellNo, adjacentPositions);
	      //   adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], biggerPiece.type );
	      // }
	    }

	    let adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], randomType );
	    while(adjacentPositions.length >= 2) {
	      console.log("oops! close call. we need to combine! or..."); //ether pick a diff cell here or actually combine...
	      randomCellNo = Math.floor(Math.random() * 25);
	      // let biggerPiece = this.combine(randomCellNo, adjacentPositions);
	      // adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], biggerPiece.type );
	      adjacentPositions = this.adjacentMatchingPositions([Math.floor(randomCellNo / 5), randomCellNo % 5], randomType );
	    }

	      let randomPiece = new Piece(randomType, randomCellNo);
	      this.pieces.push(randomPiece);
	      this.board.grid[Math.floor(randomCellNo / 5)][randomCellNo % 5] = randomPiece;
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

	  16: "bush",//"<img src='./images/bush.png' >",
	  17: "bush",//"<img src='./images/bush.png' >",
	  18: "bush",//"<img src='./images/bush.png' >",
	  19: "bush",//"<img src='./images/bush.png' >",
	  20: "bush",//"<img src='./images/bush.png' >",

	  21: "tree",//"<img src='./images/tree.png' >",
	  22: "tree",//"<img src='./images/tree.png' >",

	  23: "hut"//"<img src='./images/hut.png' >",
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

	  "grass": 0,
	  "bush": 1,
	  "tree": 2,
	  "hut": 3,
	  "house": 4,
	  "mansion": 5,
	  "castle": 6,
	  "floating_castle": 7,
	  "aa": 8,

	  0 : "<img src=\"./images/grass.png\" >",
	  1 : "<img src=\"./images/bush.png\" >",
	  2 : "<img src=\"./images/tree.png\" >",
	  3 : "<img src=\"./images/hut.png\" >",
	  4 : "<img src=\"./images/house.png\" >",
	  5 : "<img src=\"./images/mansion.png\" >",
	  6 : "<img src=\"./images/castle.png\" >",
	  7 : "<img src='./images/floating_castle.png' >",
	  8 : "<img src='./images/aa.png' >"
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

	const Piece = function (type, cellNo) {
	  this.type = type;
	  this.cellNo = cellNo;
	  this.value = ImgValueConstants[type];
	  this.imgTag = ImgValueConstants[this.value];
	  this.pos = [Math.floor(cellNo / 5), cellNo % 5]; //[row, col]
	  // debugger
	};

	Piece.prototype.render = function () {
	  return this.imgTag; //or call this getImg()
	};

	// Piece.prototype.adjacentMatches = function () {
	//   let adjacents = []; //to keep track of adjacent same objects
	//   let row = this.pos[0];
	//   let col = this.pos[1];
	//
	//   //check all adjacent cells to check if same piece
	//   let topPos = [row - 1, col];
	//   let bottomPos = [row + 1, col];
	//   let leftPos = [row, col - 1];
	//   let rightPos = [row, col + 1];
	//
	//   //top row
	//   if((row > 0) && $(`.cell[data-number=${topCellNo}]`).html() === $cell.html()) { //top
	//     adjacents.push($(`.cell[data-number=${topCellNo}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${this.pos - 5}]`), adjacentCount + 1);
	//     if(((topCellNo) > 4) && $(`.cell[data-number=${topCellNo - 5}]`).html() === $cell.html()) { //top
	//       adjacents.push($(`.cell[data-number=${topCellNo - 5}]`));
	//     }
	//     if(((topCellNo) % 5 !== 0) && $(`.cell[data-number=${topCellNo - 1}]`).html() === $cell.html()) { //left
	//       adjacents.push($(`.cell[data-number=${topCellNo - 1}]`));
	//     }
	//     if(((topCellNo) % 5 !== 4) && $(`.cell[data-number=${topCellNo + 1}]`).html() === $cell.html()) { //right
	//       adjacents.push($(`.cell[data-number=${topCellNo + 1}]`));
	//     }
	//   }
	//
	//     //bottom row
	//     if((this.pos < 20) && $(`.cell[data-number=${bottomCellNo}]`).html() === $cell.html()) { //bottom
	//       adjacents.push($(`.cell[data-number=${bottomCellNo}]`)); //= this.adjacentSamePieces($(`.cell[data-number=${parseInt(this.pos) + 5}]`), adjacentCount + 1);
	//       if((bottomCellNo < 20) && $(`.cell[data-number=${bottomCellNo + 5}]`).html() === $cell.html()) { //bottom
	//         adjacents.push($(`.cell[data-number=${bottomCellNo + 5}]`));
	//       }
	//       if((bottomCellNo % 5 !== 0) && $(`.cell[data-number=${bottomCellNo - 1}]`).html() === $cell.html()) { //left
	//         adjacents.push($(`.cell[data-number=${bottomCellNo - 1}]`));
	//       }
	//       if((bottomCellNo % 5 !== 4) && $(`.cell[data-number=${bottomCellNo + 1}]`).html() === $cell.html()) { //right
	//         adjacents.push($(`.cell[data-number=${bottomCellNo + 1}]`));
	//       }
	//     }
	//     if((this.pos % 5 !== 0) && $(`.cell[data-number=${leftCellNo}]`).html() === $cell.html()) { //left
	//       adjacents.push($(`.cell[data-number=${leftCellNo}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(this.pos) - 1}]`), adjacentCount + 1);
	//       if((leftCellNo > 4) && $(`.cell[data-number=${leftCellNo - 5}]`).html() === $cell.html()) { //top
	//         adjacents.push($(`.cell[data-number=${leftCellNo - 5}]`));
	//       }
	//       if((leftCellNo < 20) && $(`.cell[data-number=${leftCellNo + 5}]`).html() === $cell.html()) { //bottom
	//         adjacents.push($(`.cell[data-number=${leftCellNo + 5}]`));
	//       }
	//       if((leftCellNo % 5 !== 0) && $(`.cell[data-number=${leftCellNo - 1}]`).html() === $cell.html()) { //left
	//         adjacents.push($(`.cell[data-number=${leftCellNo - 1}]`));
	//       }
	//     }
	//     if((this.pos % 5 !== 4) && $(`.cell[data-number=${rightCellNo}]`).html() === $cell.html()) { //right
	//       adjacents.push($(`.cell[data-number=${rightCellNo}]`)); // = this.adjacentSamePieces($(`.cell[data-number=${parseInt(this.pos) + 1}]`), adjacentCount + 1);
	//       if((rightCellNo > 4) && $(`.cell[data-number=${rightCellNo - 5}]`).html() === $cell.html()) { //top
	//         adjacents.push($(`.cell[data-number=${rightCellNo - 5}]`));
	//       }
	//       if((rightCellNo < 20) && $(`.cell[data-number=${rightCellNo + 5}]`).html() === $cell.html()) { //bottom
	//         adjacents.push($(`.cell[data-number=${rightCellNo + 5}]`));
	//       }
	//       if((rightCellNo % 5 !== 4) && $(`.cell[data-number=${rightCellNo + 1}]`).html() === $cell.html()) { //right
	//         adjacents.push($(`.cell[data-number=${rightCellNo + 1}]`));
	//       }
	//     }
	//
	//     return adjacents;
	//
	// };

	Piece.prototype.combine = function () {

	};

	module.exports = Piece;


/***/ }
/******/ ]);