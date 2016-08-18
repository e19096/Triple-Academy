#TripleAcademy
inspired by TripleTown

##MVP

The player places objects (randomly generated and given to them) on a board.
When there are 3 adjacent objects of the same value, they combine at the
location(cell) of the last placed object in that group, into an object of the next
level(a bigger version?) and the others disappear.

###Features

- [ ] randomly generated objects to populate board at start
- [ ] randomly generated objects to place (at least 3 levels deep...? e.g. weed -> bush -> tree)
- [ ] logic in js to combine when 3 or more objects are adjacent
- [ ] logic in js to validate moves (on grid, empty space)

##Technologies, Libraries, APIs

- [ ] Javascript for logic (when object is placed, check adjacent objects for matching objects)
  - will also need to check the matching objects' adjacent objects
- [ ] HTML and CSS for layout/presentation
- [ ] jQuery to interact with DOM

##Wireframes

##Implementation Timeline

###Phase 1
- [ ] set up html page
- [ ] set up elements on page (grid, cells, etc) using jQuery
- [ ] css for board/cells, "pieces"

###Phase 2
- [ ] set up logic for grid (value of object on board, game won?)
- [ ] random new object generation
- [ ] set up valid moves
- [ ] set up game and move logic

###Phase 3
- [ ] set up user interactions with game
- [ ] polish up css
- [ ] add movement to adjacent pieces on hover
- [ ] add bears


view.js
-for setting up/rendering grid
game.js
-game logic
board.js
play.js
-start game?


**fix initial render(make sure nothing can be combined)
...also now after adjacent cells are checked, already taken cells are not checked 
