/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var View = __webpack_require__(1);
	var Game = __webpack_require__(7);
	
	$(function () {
	
	  var $rootEl = $('.ta');
	
	  // $playButton = $("<button>").addClass("play-button").html("Start!");
	  // $rootEl.append($playButton);
	
	  var game = new Game();
	  var view = new View(game, $rootEl);
	  view.setupBoard();
	  view.bindEvents();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ImgValueConstants = __webpack_require__(2);
	var InstructionConstants = __webpack_require__(3);
	var Bear = __webpack_require__(4);
	
	var View = function View(game, $el) {
	  this.game = game;
	  this.$el = $el;
	};
	
	View.prototype.bindEvents = function () {
	  var _this = this;
	
	  //when cell is clicked, check if empty, then send cell to make move
	  var that = this;
	
	  var clear = false;
	
	  $(".cell").hover(function (event) {
	    var cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	    if ($(event.currentTarget).html() === "") {
	
	      $(event.currentTarget).addClass("zoom");
	      $(event.currentTarget).html(that.game.currentPiece.imgTag);
	
	      var currentVal = that.game.currentPiece.value;
	      that.game.setAdjacentMatchingPositions(cellPos, currentVal);
	      while (!(that.game.currentPiece instanceof Bear) && that.game.multAdjacentsExist()) {
	        currentVal++;
	        that.game.adjacentsObj.top.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-down");
	        });
	        that.game.adjacentsObj.bottom.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-up");
	        });
	        that.game.adjacentsObj.left.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-right");
	        });
	        that.game.adjacentsObj.right.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-left");
	        });
	        that.game.setAdjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
	      }
	      clear = true;
	    } else {
	      clear = false;
	      //display the instructions for this piece from instruction constants
	      var hoverPiece = that.game.getPiece(cellPos);
	      $(".instructions").html(InstructionConstants[hoverPiece.type]);
	    }
	  }, function (event) {
	    if (clear) {
	      $(event.currentTarget).html("");
	    }
	
	    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left");
	    $(".instructions").html("Hover over an object for instructions!");
	  });
	
	  $(".cell").on("click", function (event) {
	    var cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	    if (_this.game.board.grid[cellPos[0]][cellPos[1]] === "") {
	      _this.makeMove($(event.currentTarget));
	      // $(event.currentTarget).addClass("has-piece");
	    }
	    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left zoom");
	  });
	
	  $(".hold").on("click", function (event) {
	    _this.game.swapHoldPiece(function () {
	      $('.current-piece').html("next:" + that.game.currentPiece.imgTag);
	      $('.hold').html("hold:" + that.game.holdPiece.imgTag);
	    });
	  });
	};
	
	View.prototype.unbindClick = function () {
	  $(".cell").off("click");
	  $(".hold").off("click");
	  $(".cell").off("mouseenter mouseleave");
	};
	
	View.prototype.makeMove = function ($cell) {
	
	  var cellNo = parseInt($cell.attr("data-number"));
	  var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	
	  this.game.playMove(cellPos);
	  //then render new board
	  var that = this;
	  this.game.changed.forEach(function (changedPos) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
	  });
	
	  //also render new current piece
	  $('.score').html("score:<p>" + this.game.score + "</p>");
	  $('.current-piece').html("next:" + this.game.currentPiece.imgTag);
	  $('.hold').html("hold:<p>" + (this.game.holdPiece ? this.game.holdPiece.imgTag : "") + "</p>");
	
	  if (this.game.won) {
	    this.unbindClick();
	    this.$el.addClass("game-won");
	    console.log("you did it, really. good work.");
	    $(".cell").html(ImgValueConstants[7]);
	    $(".current-piece").html("<p>YAY!!!</p>");
	  } else if (this.game.isOver()) {
	    this.unbindClick();
	    this.$el.addClass("game-over");
	    $(".container").append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
	    console.log("it's over. seriously.");
	  } else {
	    if (this.game.bearsExist()) {
	      this.game.walkBears(this.updateBears.bind(that));
	    }
	  }
	};
	
	View.prototype.updateBears = function () {
	  this.unbindClick(); //don't allow clicks while bears are walking!
	  var that = this;
	
	  this.game.oldBears.forEach(function (changedPos, i) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').addClass('' + that.movementClass(i));
	    $('.cell[data-number=' + changedCellNo + ']').off('hover');
	
	    //use index no to index into newbears to see what direction they are moving in
	  });
	  this.game.newBears.forEach(function (changedPos) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').off('hover');
	  });
	
	  //add class to bears to bounce
	  this.bearTimeout = setTimeout(function () {
	    var bearArr = that.game.newBears.concat(that.game.oldBears);
	    bearArr.forEach(function (changedPos) {
	      var changedCellNo = changedPos[0] * 5 + changedPos[1];
	      $('.cell[data-number=' + changedCellNo + ']').html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
	    });
	    $('.cell').removeClass("toLeft toRight toUp toDown zoom");
	
	    that.bindEvents();
	    clearTimeout(that.bearTimeout);
	  }, 800);
	};
	
	View.prototype.movementClass = function (idx) {
	  var oldRow = this.game.oldBears[idx][0];
	  var oldCol = this.game.oldBears[idx][1];
	
	  var newRow = this.game.newBears[idx][0];
	  var newCol = this.game.newBears[idx][1];
	
	  if (oldRow === newRow) {
	    if (oldCol - 1 === newCol) {
	      return "toLeft";
	    } else {
	      return "toRight";
	    }
	  } else {
	    //same col
	    if (oldRow - 1 === newRow) {
	      return "toUp";
	    } else {
	      return "toDown";
	    }
	  }
	};
	
	View.prototype.setupBoard = function () {
	  var $container = $("<div>").addClass("container");
	
	  var grid = $("<ul>").addClass("grid").addClass("group");
	
	  for (var i = 0; i < 25; i++) {
	    var $cell = $("<li>").addClass("cell");
	    $cell.attr("data-number", i);
	    grid.append($cell);
	  }
	
	  this.$el.append($container);
	  $container.append(grid); //set up the grid for the pieces to be places
	
	  this.game.generateInitialSetup();
	  this.game.pieces.forEach(function (piece) {
	    $('.cell[data-number=' + piece.getCellNo() + ']').html(piece.imgTag);
	  });
	
	  $container.append($("<div>").addClass("score"));
	  $('.score').html("score:<p>" + this.game.score + "</p>");
	
	  //make a separate place to hold to current piece to be placed
	  $container.append($("<div>").addClass("current-piece"));
	  $('.current-piece').html("next:" + this.game.currentPiece.imgTag);
	
	  $container.append($("<div>").addClass("hold"));
	  $('.hold').html("hold:<p>" + (this.game.holdPiece ? this.game.holdPiece.imgTag : "") + "</p>");
	
	  $container.append($("<div>").addClass("instructions"));
	  $(".instructions").html("Hover over an object for instructions!");
	
	  this.$el.append($("<div>").addClass("instructions-box"));
	  for (var _i = 0; _i < 6; _i++) {
	    $(".instructions-box").append($("<p>").html());
	  }
	};
	
	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var ImgValueConstants = {
	  // "<img src=\"./images/grass.png\" >": 0,
	  // "<img src=\"./images/bush.png\" >": 1,
	  // "<img src=\"./images/tree.png\" >": 2,
	  // "<img src=\"./images/hut.png\" >": 3,
	  // "<img src=\"./images/house.png\" >": 4,
	  // "<img src=\"./images/mansion.png\" >": 5,
	  // "<img src=\"./images/castle.png\" >": 6,
	
	  "bear": 0,
	  "grass": 1,
	  "bush": 2,
	  "tree": 3,
	  "hut": 4,
	  "house": 5,
	  "mansion": 6,
	  "aa": 7,
	  // "floatingcastle": 8,
	  // "aa": 9,
	
	  0: "<img src=\"./assets/images/bear2.png\">",
	  1: "<img src=\"./assets/images/grass2.png\">",
	  2: "<img src=\"./assets/images/bush2.png\">",
	  3: "<img src=\"./assets/images/tree2.png\">",
	  4: "<img src=\"./assets/images/hut2.png\">",
	  5: "<img src=\"./assets/images/house2.png\">",
	  6: "<img src=\"./assets/images/mansion2.png\">",
	  7: "<img src=\"./assets/images/aa2.png\">"
	  // 8 : "<img src='./images/floatingcastle2.png' >",
	  // 9 : "<img src='./images/aa.png' >"
	};
	
	module.exports = ImgValueConstants;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var ImgValueConstants = __webpack_require__(2);
	
	var InstructionConstants = {
	  "grass": "<div>" + ImgValueConstants[1] + " + " + ImgValueConstants[1] + " + " + ImgValueConstants[1] + " = " + ImgValueConstants[2] + "</div>",
	  "bush": "<div>" + ImgValueConstants[2] + " + " + ImgValueConstants[2] + " + " + ImgValueConstants[2] + " = " + ImgValueConstants[3] + "</div>",
	  "tree": "<div>" + ImgValueConstants[3] + " + " + ImgValueConstants[3] + " + " + ImgValueConstants[3] + " = " + ImgValueConstants[4] + "</div>",
	  // "hut"   : `<div>${ImgValueConstants[4]} + ${ImgValueConstants[4]} + ${ImgValueConstants[4]} = ${ImgValueConstants[5]}</div>`,
	  "hut": "<div>" + ImgValueConstants[4] + " + " + ImgValueConstants[4] + " + " + ImgValueConstants[4] + " =   YOU WIN!!!</div>",
	  // "house" : `<div>${ImgValueConstants[5]} + ${ImgValueConstants[5]} + ${ImgValueConstants[5]} =  YOU WIN!!!</div>`,
	  "bear": "<div class=\"bear-instr\">Bears just walk around and get in your way!</div>"
	  // mansion: `${ImgValueConstants[1]} + ${ImgValueConstants[1]} + ${ImgValueConstants[1]} = ${ImgValueConstants[1]}`,
	  // castle: `${ImgValueConstants[1]} + ${ImgValueConstants[1]} + ${ImgValueConstants[1]} = ${ImgValueConstants[1]}`
	};
	
	module.exports = InstructionConstants;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Piece = __webpack_require__(5);
	var Util = __webpack_require__(6);
	
	var Bear = function Bear(cellPos) {
	  Piece.call(this, "bear", cellPos);
	};
	
	Util.inherits(Bear, Piece);
	
	Bear.prototype.walk = function (adjacentEmptyPositions) {
	  //find adjacent empty spaces... or get them from game?
	  //pick a random one to walk to
	  var n = Math.floor(Math.random() * adjacentEmptyPositions.length);
	  //update bear's pos and cell No
	  this.pos = adjacentEmptyPositions[n];
	  //update grid or re turn new pos so game can update grid
	  return this.pos;
	};
	
	module.exports = Bear;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ImgValueConstants = __webpack_require__(2);
	
	var Piece = function Piece(type, cellPos) {
	  this.type = type;
	
	  this.pos = cellPos;
	
	  this.value = ImgValueConstants[type];
	
	  this.imgTag = ImgValueConstants[this.value];
	};
	
	Piece.prototype.getCellNo = function () {
	  return this.pos[0] * 5 + this.pos[1];
	};
	
	module.exports = Piece;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	var Util = {
	  inherits: function inherits(ChildClass, BaseClass) {
	    function Surrogate() {
	      this.constructor = ChildClass;
	    }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  }
	};
	
	module.exports = Util;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var FrequencyConstants = __webpack_require__(8);
	var ImgValueConstants = __webpack_require__(2);
	var Board = __webpack_require__(9);
	var Piece = __webpack_require__(5);
	var Bear = __webpack_require__(4);
	
	function Game() {
	  this.board = new Board();
	  this.pieces = [];
	  this.currentPiece = this.giveCurrentPiece();
	  this.changed = [];
	  this.oldBears = [];
	  this.newBears = [];
	
	  this.won = false;
	
	  this.adjacentsObj = { top: [],
	    bottom: [],
	    left: [],
	    right: [] };
	
	  this.bears = [];
	
	  this.score = 0;
	  this.holdPiece = undefined;
	}
	
	Game.prototype.getPiece = function (hoverCellPos) {
	  return this.board.grid[hoverCellPos[0]][hoverCellPos[1]];
	};
	
	Game.prototype.bearsExist = function () {
	  return this.bears.length > 0;
	};
	
	Game.prototype.playMove = function (clickedCellPos) {
	  this.changed = [clickedCellPos];
	  this.oldBears = [];
	  this.newBears = [];
	  this.updateGrid(clickedCellPos, this.currentPiece);
	
	  if (this.currentPiece instanceof Bear) {
	    this.bears.push(this.currentPiece);
	    this.score += 100;
	  } else {
	    this.score += this.currentPiece.value;
	
	    this.setAdjacentMatchingPositions(clickedCellPos);
	    while (this.multAdjacentsExist()) {
	      var biggerPiece = this.combine(clickedCellPos); //combine them
	      this.score += biggerPiece.value;
	
	      if (biggerPiece.value === 5) {
	        //house to win
	        console.log("YOU WIN!!!!!!!! YAAAAAYYYYYYY");
	        this.won = true;
	      }
	
	      this.setAdjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
	    }
	  }
	
	  if (this.isOver()) {
	    console.log("IT'S OVER. STOP PLAYING");
	  } else {
	    this.currentPiece = this.giveCurrentPiece();
	  }
	};
	
	Game.prototype.updateGrid = function (pos, piece) {
	  this.board.grid[pos[0]][pos[1]] = piece;
	  piece.pos = pos;
	};
	
	Game.prototype.isOver = function () {
	  return this.board.isFull();
	};
	
	Game.prototype.getAdjacentEmptys = function (pos) {
	  var row = pos[0];
	  var col = pos[1];
	
	  var emptys = [];
	
	  var topPos = [row - 1, col];
	  var bottomPos = [row + 1, col];
	  var leftPos = [row, col - 1];
	  var rightPos = [row, col + 1];
	
	  if (row > 0 && this.board.grid[topPos[0]][topPos[1]] === "") {
	    emptys.push(topPos);
	  }
	  if (row < 4 && this.board.grid[bottomPos[0]][bottomPos[1]] === "") {
	    emptys.push(bottomPos);
	  }
	  if (col % 5 > 0 && this.board.grid[leftPos[0]][leftPos[1]] === "") {
	    emptys.push(leftPos);
	  }
	  if (col % 5 < 4 && this.board.grid[rightPos[0]][rightPos[1]] === "") {
	    emptys.push(rightPos);
	  }
	
	  return emptys;
	};
	
	Game.prototype.walkBears = function (updateBears) {
	  var that = this;
	  //iterate through bears
	  this.bears.forEach(function (bear) {
	    var empties = that.getAdjacentEmptys(bear.pos);
	    if (empties.length > 0) {
	      that.board.grid[bear.pos[0]][bear.pos[1]] = "";
	      that.oldBears.push(bear.pos);
	      var newBearPos = bear.walk(empties);
	      that.updateGrid(newBearPos, bear);
	      that.newBears.push(newBearPos);
	    }
	  });
	
	  updateBears();
	};
	
	Game.prototype.emptyAdjacentsObj = function () {
	  this.adjacentsObj = { top: [],
	    bottom: [],
	    left: [],
	    right: [] };
	};
	
	Game.prototype.multAdjacentsExist = function () {
	  if (this.adjacentsObj.top.length + this.adjacentsObj.bottom.length + this.adjacentsObj.left.length + this.adjacentsObj.right.length >= 2) {
	    return true;
	  }
	  return false;
	};
	
	Game.prototype.setAdjacentMatchingPositions = function (gridPos, pieceValue, reset) {
	
	  this.emptyAdjacentsObj(); //empty the arrays
	
	  var row = gridPos[0];
	  var col = gridPos[1];
	
	  if (!pieceValue) {
	    //pieceValue is a string
	    pieceValue = this.currentPiece.value;
	  }
	
	  var topPos = [row - 1, col]; //check all adjacent cells to check if same piece
	  var bottomPos = [row + 1, col];
	  var leftPos = [row, col - 1];
	  var rightPos = [row, col + 1];
	
	  //if not top row
	  if (row > 0 && this.board.grid[topPos[0]][topPos[1]].value === pieceValue) {
	    //top
	    this.adjacentsObj.top.push(topPos);
	    if (topPos[0] > 0 && this.board.grid[topPos[0] - 1][topPos[1]].value === pieceValue) {
	      //top
	      this.adjacentsObj.top.push([topPos[0] - 1, topPos[1]]);
	    }
	    if (topPos[1] % 5 > 0 && this.board.grid[topPos[0]][topPos[1] - 1].value === pieceValue) {
	      //left
	      this.adjacentsObj.top.push([topPos[0], topPos[1] - 1]);
	      this.adjacentsObj.left.push([topPos[0], topPos[1] - 1]);
	    }
	    if (topPos[1] % 5 < 4 && this.board.grid[topPos[0]][topPos[1] + 1].value === pieceValue) {
	      //right
	      this.adjacentsObj.top.push([topPos[0], topPos[1] + 1]);
	      this.adjacentsObj.right.push([topPos[0], topPos[1] + 1]);
	    }
	  }
	
	  //if not bottom row
	  if (row < 4 && this.board.grid[bottomPos[0]][bottomPos[1]].value === pieceValue) {
	    //bottom
	    this.adjacentsObj.bottom.push(bottomPos);
	    if (bottomPos[0] < 4 && this.board.grid[bottomPos[0] + 1][bottomPos[1]].value === pieceValue) {
	      //bottom
	      this.adjacentsObj.bottom.push([bottomPos[0] + 1, bottomPos[1]]);
	    }
	    if (bottomPos[1] % 5 > 0 && this.board.grid[bottomPos[0]][bottomPos[1] - 1].value === pieceValue) {
	      //left
	      this.adjacentsObj.bottom.push([bottomPos[0], bottomPos[1] - 1]);
	      this.adjacentsObj.left.push([bottomPos[0], bottomPos[1] - 1]);
	    }
	    if (bottomPos[1] % 5 < 4 && this.board.grid[bottomPos[0]][bottomPos[1] + 1].value === pieceValue) {
	      //right
	      this.adjacentsObj.bottom.push([bottomPos[0], bottomPos[1] + 1]);
	      this.adjacentsObj.right.push([bottomPos[0], bottomPos[1] + 1]);
	    }
	  }
	
	  //if not left-most col
	  if (col % 5 > 0 && this.board.grid[leftPos[0]][leftPos[1]].value === pieceValue) {
	    //left
	    this.adjacentsObj.left.push(leftPos);
	    if (leftPos[0] > 0 && this.board.grid[leftPos[0] - 1][leftPos[1]].value === pieceValue) {
	      //top
	      this.adjacentsObj.left.push([leftPos[0] - 1, leftPos[1]]);
	      this.adjacentsObj.top.push([leftPos[0] - 1, leftPos[1]]);
	    }
	    if (leftPos[0] < 4 && this.board.grid[leftPos[0] + 1][leftPos[1]].value === pieceValue) {
	      //bottom
	      this.adjacentsObj.left.push([leftPos[0] + 1, leftPos[1]]);
	      this.adjacentsObj.bottom.push([leftPos[0] + 1, leftPos[1]]);
	    }
	    if (leftPos[1] % 5 > 0 && this.board.grid[leftPos[0]][leftPos[1] - 1].value === pieceValue) {
	      //left
	      this.adjacentsObj.left.push([leftPos[0], leftPos[1] - 1]);
	    }
	  }
	
	  //if not right-most col
	  if (col % 5 < 4 && this.board.grid[rightPos[0]][rightPos[1]].value === pieceValue) {
	    //right
	    this.adjacentsObj.right.push(rightPos);
	    if (rightPos[0] > 0 && this.board.grid[rightPos[0] - 1][rightPos[1]].value === pieceValue) {
	      //top
	      this.adjacentsObj.right.push([rightPos[0] - 1, rightPos[1]]);
	      this.adjacentsObj.top.push([rightPos[0] - 1, rightPos[1]]);
	    }
	    if (rightPos[0] < 4 && this.board.grid[rightPos[0] + 1][rightPos[1]].value === pieceValue) {
	      //bottom
	      this.adjacentsObj.right.push([rightPos[0] + 1, rightPos[1]]);
	      this.adjacentsObj.bottom.push([rightPos[0] + 1, rightPos[1]]);
	    }
	    if (rightPos[1] % 5 < 4 && this.board.grid[rightPos[0]][rightPos[1] + 1].value === pieceValue) {
	      //right
	      this.adjacentsObj.right.push([rightPos[0], rightPos[1] + 1]);
	    }
	  }
	};
	
	Game.prototype.combine = function (cellPos, adjacentPositions) {
	  var that = this;
	
	  for (var direction in this.adjacentsObj) {
	    that.adjacentsObj[direction].forEach(function (pos) {
	      that.board.grid[pos[0]][pos[1]] = "";
	      that.changed.push(pos);
	    });
	  }
	
	  var newValue = this.board.grid[cellPos[0]][cellPos[1]].value + 1;
	  var biggerPiece = new Piece(ImgValueConstants[newValue].slice(26, -7), cellPos);
	  this.board.grid[cellPos[0]][cellPos[1]] = biggerPiece;
	
	  return biggerPiece;
	};
	
	Game.prototype.giveCurrentPiece = function () {
	  //pick random piece (from: grass, bush, tree, hut, bear)
	  var randomType = FrequencyConstants[Math.floor(Math.random() * (74 - 1) + 1)];
	
	  var randomCellNo = Math.floor(Math.random() * 25);
	  // let pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	  if (randomType === "bear") {
	    return new Bear(); //pos);
	  } else {
	    return new Piece(randomType); //, pos);
	  }
	};
	
	Game.prototype.generateInitialSetup = function () {
	  //place random pieces (from: grass, bush, tree, hut) in random cells
	  //- some number of pieces between 5-7
	  var numPieces = Math.floor(Math.random() * (8 - 5) + 5);
	
	  for (var i = 0; i < numPieces; i++) {
	    var randomType = FrequencyConstants[Math.floor(Math.random() * (52 - 1) + 1)];
	
	    var randomCellNo = Math.floor(Math.random() * 25);
	    var pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	    // make sure cell is empty else do it again
	    // and also make sure this piece is not adjacent to 2+ of the same piece
	    while (this.board.grid[pos[0]][pos[1]] !== "") {
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	      //also check adjacents in here?
	    }
	
	    this.setAdjacentMatchingPositions(pos, ImgValueConstants[randomType]);
	    while (this.multAdjacentsExist()) {
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	      this.setAdjacentMatchingPositions(pos, ImgValueConstants[randomType]);
	    }
	
	    var randomPiece = new Piece(randomType, pos);
	    this.pieces.push(randomPiece);
	    this.board.grid[pos[0]][pos[1]] = randomPiece;
	  }
	};
	
	Game.prototype.swapHoldPiece = function (updateView) {
	  if (this.holdPiece) {
	    var temp = this.holdPiece;
	    this.holdPiece = this.currentPiece;
	    this.currentPiece = temp;
	  } else {
	    this.holdPiece = this.currentPiece;
	    this.currentPiece = this.giveCurrentPiece();
	  }
	
	  updateView();
	};
	
	module.exports = Game;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	//for initial setup (piece randomization)
	
	var FrequencyConstants = {
	  1: "grass",
	  2: "grass",
	  3: "grass",
	  4: "grass",
	  5: "grass",
	  6: "grass",
	  7: "grass",
	  8: "grass",
	  9: "grass",
	  10: "grass",
	  11: "grass",
	  12: "grass",
	  13: "grass",
	  14: "grass",
	  15: "grass",
	  16: "grass",
	  17: "grass",
	  18: "grass",
	  19: "grass",
	  20: "grass",
	  21: "grass",
	  22: "grass",
	  23: "grass",
	  24: "grass",
	  25: "grass",
	  26: "grass",
	  27: "grass",
	  28: "grass",
	  29: "grass",
	  30: "grass",
	
	  31: "bush",
	  32: "bush",
	  33: "bush",
	  34: "bush",
	  35: "bush",
	
	  36: "bush",
	  37: "bush",
	  38: "bush",
	  39: "bush",
	  40: "bush",
	  41: "bush",
	  42: "bush",
	  43: "bush",
	  44: "bush",
	  45: "bush",
	
	  46: "tree",
	  47: "tree",
	  48: "tree",
	
	  49: "tree",
	  50: "tree",
	
	  51: "hut",
	
	  //^^ for initial setup
	  //vv for pieces given
	
	  52: "tree",
	  53: "tree",
	  54: "hut",
	
	  55: "hut",
	  56: "hut",
	  57: "bear",
	  58: "bear",
	  59: "bear",
	  60: "bear",
	  61: "bear",
	  62: "bear",
	  63: "bear",
	  64: "bear",
	  65: "bear",
	  66: "bear",
	  67: "bear",
	  68: "bear",
	  69: "bear",
	  70: "bear",
	  71: "bear",
	  72: "bear",
	  73: "bear"
	};
	
	module.exports = FrequencyConstants;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	var Board = function Board() {
	  this.grid = this.makeGrid();
	};
	
	Board.prototype.isFull = function () {
	  for (var i = 0; i < 5; i++) {
	    for (var j = 0; j < 5; j++) {
	      if (this.grid[i][j] === "") {
	        return false;
	      }
	    }
	  }
	
	  return true;
	};
	
	Board.prototype.makeGrid = function () {
	  var grid = [];
	  for (var i = 0; i < 5; i++) {
	    grid.push([]);
	    for (var j = 0; j < 5; j++) {
	      grid[i].push("");
	    }
	  }
	  return grid;
	};
	
	module.exports = Board;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map