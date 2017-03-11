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
	var InstructionConstants = __webpack_require__(3);
	
	$(function () {
	  var $rootEl = $('.ta');
	
	  $rootEl.append($("<button>").addClass("play-button display").html("Play!"));
	  $(".play-button").on("click", function () {
	    startGame($rootEl);
	  });
	  $rootEl.append($("<img>").addClass("demo-gif").attr("src", "./assets/images/demo-small.gif"));
	});
	
	var startGame = function startGame($rootEl) {
	  $(".container").remove();
	  $(".demo-gif").remove();
	  $(".play-button").removeClass("display");
	  $rootEl.removeClass("game-over");
	
	  var game = new Game();
	  var view = new View(game, $rootEl);
	  view.setupBoard();
	  view.bindEvents();
	};

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
	  var _this2 = this;
	
	  //when cell is clicked, check if empty, then send cell to make move
	  var clear = false;
	
	  $(".cell").hover(function (event) {
	    var _this = this;
	
	    var cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	
	    if ($(event.currentTarget).html() === "") {
	
	      $(event.currentTarget).addClass("zoom");
	      $(event.currentTarget).html(this.game.currentPiece.imgTag);
	
	      var currentVal = this.game.currentPiece.value;
	      this.game.setAdjacentMatchingPositions(cellPos, currentVal);
	      while (!(this.game.currentPiece instanceof Bear) && this.game.multAdjacentsExist()) {
	        currentVal++;
	
	        var _loop = function _loop(dir) {
	          _this.game.adjacentsObj[dir].forEach(function (pos) {
	            $('.cell[data-number=' + (pos[0] * 5 + pos[1]) + ']').addClass(dir + ' bounce');
	          });
	        };
	
	        for (var dir in this.game.adjacentsObj) {
	          _loop(dir);
	        }
	        this.game.setAdjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
	      }
	      clear = true;
	    } else {
	      clear = false;
	      //display the instructions for this piece from instruction constants
	      var hoverPiece = this.game.getPiece(cellPos);
	      $(".instructions").html(InstructionConstants[hoverPiece.type]);
	    }
	  }.bind(this), function (event) {
	    if (clear) {
	      $(event.currentTarget).html("");
	    }
	    $(".cell").removeClass("top bottom left right bounce");
	    $(".instructions").empty().append($("<div>").html("Hover over an object for instructions!"));
	  });
	
	  $(".cell").on("click", function (event) {
	    var cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	    if (_this2.game.board.grid[cellPos[0]][cellPos[1]] === "") {
	      _this2.makeMove($(event.currentTarget));
	    }
	    $(".cell").removeClass("top bottom right left bounce zoom");
	  });
	
	  $(".hold").on("click", function (event) {
	    _this2.game.swapHoldPiece(function () {
	      $('.current-piece').html("next:" + _this2.game.currentPiece.imgTag);
	      $('.hold').html("hold:" + _this2.game.holdPiece.imgTag);
	    });
	  });
	};
	
	View.prototype.unbind = function (actions) {
	  if (actions.includes("click")) {
	    $(".cell").off("click");
	    $(".hold").off("click");
	  }
	  if (actions.includes("hover")) {
	    $(".cell").off("mouseenter mouseleave");
	  }
	};
	
	View.prototype.makeMove = function ($cell) {
	  var _this3 = this;
	
	  var cellNo = parseInt($cell.attr("data-number"));
	  var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	
	  this.game.playMove(cellPos);
	  //then render new board
	  this.game.changed.forEach(function (changedPos) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').html(_this3.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? _this3.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
	  });
	
	  //also render new current piece
	  $('.score').html("score:<p>" + this.game.score + "</p>");
	  $('.current-piece').html("next:" + this.game.currentPiece.imgTag);
	  $('.hold').html("hold:<p>" + (this.game.holdPiece ? this.game.holdPiece.imgTag : "") + "</p>");
	
	  if (this.game.won) {
	    this.unbind(["click", "hover"]);
	    this.$el.addClass("game-won");
	    $(".cell").html(ImgValueConstants[7]);
	    $(".current-piece").html("<p>YAY!!!</p>");
	  } else if (this.game.isOver()) {
	    this.unbind(["click", "hover"]);
	    this.$el.addClass("game-over");
	    $(".container").append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
	    $(".play-button").addClass("display").html("Play again!");
	    $(".instructions-button").remove();
	  } else {
	    if (this.game.bearsExist()) {
	      this.game.walkBears(this.updateBears.bind(this));
	    }
	  }
	};
	
	View.prototype.updateBears = function () {
	  var _this4 = this;
	
	  this.unbind(["click"]); //don't allow clicks while bears are walking!
	
	  this.game.oldBears.forEach(function (changedPos, i) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').addClass('' + _this4.movementClass(i));
	    $('.cell[data-number=' + changedCellNo + ']').off('hover');
	    //use index no to index into newbears to see what direction they are moving in
	  });
	  this.game.newBears.forEach(function (changedPos) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').off('hover');
	  });
	
	  //add class to bears to bounce
	  this.bearTimeout = setTimeout(function () {
	    var bearArr = _this4.game.newBears.concat(_this4.game.oldBears);
	    bearArr.forEach(function (changedPos) {
	      var changedCellNo = changedPos[0] * 5 + changedPos[1];
	      $('.cell[data-number=' + changedCellNo + ']').html(_this4.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? _this4.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
	    });
	    $('.cell').removeClass("toLeft toRight toUp toDown zoom");
	
	    _this4.bindEvents();
	    clearTimeout(_this4.bearTimeout);
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
	
	View.prototype.addInstructions = function () {
	  var _this5 = this;
	
	  var showInstructions = function showInstructions() {
	    _this5.$el.append($("<div>").addClass("instructions-modal display"));
	    $(".instructions-modal").append($("<div>").addClass("outer-modal close-button"));
	    $(".instructions-modal").append($("<div>").addClass("inner-modal"));
	
	    var instrStr = 'Place pieces next to each other to build bigger pieces.</br>Match 3 ' + ImgValueConstants[5] + '\'s to win!</br></br>';
	    for (var piece in InstructionConstants) {
	      instrStr += InstructionConstants[piece];
	    }
	    $(".inner-modal").html(instrStr);
	
	    $(".inner-modal").append($("<div>").addClass("close-button").html("&times"));
	    $(".close-button").on("click", function () {
	      hideInstructions();
	    });
	  };
	
	  var hideInstructions = function hideInstructions() {
	    $(".instructions-modal").remove();
	  };
	
	  this.$el.append($("<button>").addClass("instructions-button").html("Instructions"));
	  $(".instructions-button").on("click", function () {
	    showInstructions();
	  });
	};
	
	View.prototype.setupBoard = function () {
	  this.addInstructions();
	
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
	  $(".instructions").append($("<div>").html("Hover over an object for instructions!"));
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
	  "hut": "<div>" + ImgValueConstants[4] + " + " + ImgValueConstants[4] + " + " + ImgValueConstants[4] + " = " + ImgValueConstants[5] + "</div>",
	  // "hut"   : `<div>${ImgValueConstants[4]} + ${ImgValueConstants[4]} + ${ImgValueConstants[4]} =   YOU WIN!!!</div>`,
	  "house": "<div>" + ImgValueConstants[5] + " + " + ImgValueConstants[5] + " + " + ImgValueConstants[5] + " = YOU WIN!!!</div>",
	  "bear": "<div>" + ImgValueConstants[0] + "'s just walk around...</div>"
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
	
	var DIRECTIONS = {
	  'top': [-1, 0],
	  'bottom': [1, 0],
	  'left': [0, -1],
	  'right': [0, 1]
	};
	
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
	
	      if (biggerPiece.value === 6) {
	        //mansion to win
	        this.won = true;
	      }
	
	      this.setAdjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
	    }
	  }
	
	  if (!this.isOver()) {
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
	
	  for (var dir in DIRECTIONS) {
	    var newPos = [row + DIRECTIONS[dir][0], col + DIRECTIONS[dir][1]];
	    if (this.board.isValidGridPos(newPos) && this.board.grid[newPos[0]][newPos[1]] === "") {
	      emptys.push(newPos);
	    }
	  }
	
	  return emptys;
	};
	
	Game.prototype.walkBears = function (updateBears) {
	  var _this = this;
	
	  //iterate through bears
	  this.bears.forEach(function (bear) {
	    var empties = _this.getAdjacentEmptys(bear.pos);
	    if (empties.length > 0) {
	      _this.board.grid[bear.pos[0]][bear.pos[1]] = "";
	      _this.oldBears.push(bear.pos);
	      var newBearPos = bear.walk(empties);
	      _this.updateGrid(newBearPos, bear);
	      _this.newBears.push(newBearPos);
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
	  var _this2 = this;
	
	  this.emptyAdjacentsObj(); //empty the arrays
	
	  var currentRow = gridPos[0];
	  var currentCol = gridPos[1];
	
	  if (!pieceValue) {
	    //pieceValue is a string
	    pieceValue = this.currentPiece.value;
	  }
	
	  var board = this.board;
	
	  var isMatching = function isMatching(pos) {
	    if (board.isValidGridPos(pos)) {
	      return board.grid[pos[0]][pos[1]].value === pieceValue;
	    } else {
	      return false;
	    }
	  };
	
	  var storePos = function storePos(directions, pos) {
	    if (!Array.isArray(directions)) {
	      directions = [directions];
	    }
	    directions.forEach(function (dir) {
	      _this2.adjacentsObj[dir].push(pos);
	    });
	  };
	
	  for (var dir in DIRECTIONS) {
	    var pos = [currentRow + DIRECTIONS[dir][0], currentCol + DIRECTIONS[dir][1]];
	    if (isMatching(pos)) {
	      storePos(dir, pos);
	      for (var dir2 in DIRECTIONS) {
	        var pos2 = [pos[0] + DIRECTIONS[dir2][0], pos[1] + DIRECTIONS[dir2][1]];
	        if (!(pos2[0] === currentRow && pos2[1] === currentCol) && isMatching(pos2)) {
	          storePos([dir, dir2], pos2);
	        }
	      }
	    }
	  }
	};
	
	Game.prototype.combine = function (cellPos, adjacentPositions) {
	  var _this3 = this;
	
	  var grid = this.board.grid;
	  for (var direction in this.adjacentsObj) {
	    this.adjacentsObj[direction].forEach(function (pos) {
	      grid[pos[0]][pos[1]] = "";
	      _this3.changed.push(pos);
	    });
	  }
	
	  var newValue = grid[cellPos[0]][cellPos[1]].value + 1;
	  var biggerPiece = new Piece(ImgValueConstants[newValue].slice(26, -7), cellPos);
	  grid[cellPos[0]][cellPos[1]] = biggerPiece;
	
	  return biggerPiece;
	};
	
	Game.prototype.giveCurrentPiece = function () {
	  //pick random piece (from: grass, bush, tree, hut, bear)
	  var randomType = FrequencyConstants[Math.floor(Math.random() * 70 + 1)];
	  var randomCellNo = Math.floor(Math.random() * 25);
	
	  if (randomType === "bear") {
	    return new Bear();
	  } else {
	    return new Piece(randomType);
	  }
	};
	
	Game.prototype.generateInitialSetup = function () {
	  //place random pieces (from: grass, bush, tree, hut) in random cells
	  //- some number of pieces between 5-7
	  var numPieces = Math.floor(Math.random() * (8 - 5) + 5);
	
	  for (var i = 0; i < numPieces; i++) {
	    var randomType = FrequencyConstants[Math.floor(Math.random() * 65 + 1)];
	
	    var randomCellNo = Math.floor(Math.random() * 25);
	    var pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	    // make sure cell is empty else do it again
	    // and also make sure this piece is not adjacent to 2+ of the same piece
	    while (this.board.grid[pos[0]][pos[1]] !== "") {
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
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
	
	var FrequencyConstants = {};
	
	for (var i = 1; i <= 45; i++) {
	  FrequencyConstants[i] = "grass";
	}
	
	for (var _i = 46; _i <= 60; _i++) {
	  FrequencyConstants[_i] = "bush";
	}
	
	for (var _i2 = 61; _i2 <= 65; _i2++) {
	  FrequencyConstants[_i2] = "tree";
	}
	
	for (var _i3 = 66; _i3 <= 67; _i3++) {
	  FrequencyConstants[_i3] = "hut";
	}
	
	for (var _i4 = 68; _i4 <= 70; _i4++) {
	  FrequencyConstants[_i4] = "bear";
	}
	
	var increaseFrequency = function increaseFrequency(piece, num) {
	  var length = Object.keys(FrequencyConstants).length;
	  for (var _i5 = 1; _i5 <= num; _i5++) {
	    FrequencyConstants[length + _i5] = piece;
	  }
	};
	
	module.exports = FrequencyConstants;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
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
	
	Board.prototype.isValidGridPos = function (pos) {
	  var _pos = _slicedToArray(pos, 2);
	
	  var row = _pos[0];
	  var col = _pos[1];
	
	  if (row >= 0 && row < 5 && col >= 0 && col < 5) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = Board;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map