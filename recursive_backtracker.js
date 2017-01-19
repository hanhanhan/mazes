var canvas = document.getElementById('recursiveBacktracker')
//recursive backtracker context
var ctx = canvas.getContext('2d')

var canvasWidth = 600
var canvasHeight = 600
var tileSize = 60

var interval = 500
var drawTime = Date.now()
var elapsed

canvas.width = canvasWidth
canvas.height = canvasHeight

var rows = Math.floor(canvasWidth/tileSize)
var columns = Math.floor(canvasHeight/tileSize)

var grid = []
// var current

function setupMazeArray(){

    for(var row=0; row < rows; row++){
        var colObjs = []
        for(var column=0; column < columns; column++){
            colObjs.push(new Cell(row, column))
        }
        grid.push(colObjs)
    }
    // current = grid[0][0]
}

function Cell(row, column){
    this.row = row
    this.column = column
    this.walls = { 'up': true, 'down':true, 'left': true, 'right': true };
    this.visited = false

    this.checkNeighbors = function checkNeighbors() {
        // good place for curryed function?
        if(!(this.row === 0)){
            var left = grid[this.column][this.row - 1]
        }
        if(!(this.row === rows - 1)){
            var right = grid[this.column][this.row + 1]
        }
        if(!(this.column === 0)){
            var up = grid[this.column - 1][this.row]
        }
        if(!(this.column === columns - 1)){
            var down = grid[this.column + 1][this.row]
        }

        var neighbors = [left, right, up, down].filter(neighbor =>
            neighbor && !neighbor.visited)
        // console.log(neighbors)

        var nextIndex = Math.floor(Math.random() * neighbors.length)

        if(neighbors.length > 0){
            return neighbors[nextIndex];
        } else {
            return false;
        }
    }

    this.checkVisited = function checkVisited(tile){
        if(tile && !tile.visited){
            this.neighbors.push(tile)
        }
    }

    this.next = function next(){

    }

    this.drawTile = function drawTile(color){

        var x = this.column * tileSize
        var y = this.row * tileSize

        ctx.fillStyle = color
        ctx.fillRect(x, y, x + tileSize, y + tileSize)



        // ctx.fill()
        // ctx.stroke()
    }
}

function removeWalls(currentTile, nextTile){
    var side = currentTile.column - nextTile.column
    var upDown = currentTile.row - nextTile.row

    switch(side){
        case 1:
            currentTile.walls.left = false;
            nextTile.walls.right = false;
            break;
        case -1:
            currentTile.walls.right = false;
            nextTile.walls.left = false;
            break;
        }

    switch(upDown){
        case 1:
            currentTile.walls.top = false;
            nextTile.walls.bottom = false;
            break;
        case -1:
            currentTile.walls.bottom = false;
            nextTile.walls.top = false;
            break;

    }
}



setupMazeArray()

function draw(){
  // draw whole array
  for(var row=0; row < rows; row++){
      for(var column=0; column < columns; column++){

          ctx.clearRect(0, 0, canvasWidth, canvasHeight)

          var x = grid[row][column].row * tileSize
          var y = grid[row][column].column * tileSize

          ctx.rect(x, y, x + tileSize, y + tileSize)

          if (grid[row][column].visited === true){
              ctx.fillStyle = 'hsla(180, 90%, 80%, 0.8)'
          } else {
              ctx.fillStyle = 'gray'
          }

          ctx.strokeStyle = 'white'
          ctx.fill()
          ctx.stroke()
      }
  }
}

draw()
var current = grid[0][0]
var stack = []
crawlMaze()

// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker
function crawlMaze(){

  elapsed = Date.now() - drawTime

    if(elapsed > interval){
      var next = current.checkNeighbors()

      if(next){
          stack.push(current)
          removeWalls(current, next)
          next.visited = true

      } else {
          next = stack.pop()
      }

      // draw()

      current.drawTile('red')
      current = next
      next.drawTile('white')


      drawTime = Date.now()
    }
    window.requestAnimationFrame(crawlMaze)
}
