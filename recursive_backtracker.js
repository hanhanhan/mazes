var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var rows = 8;
var cols = 8;
var boxWidth = 50;
var boxHeight = 50;
var boxMargin = 4;
var grid, stack, currentCell;

// DOM elements and event listner
var nextButton = document.getElementById('nextbutton');
var restartButton = document.getElementById('restart');
nextButton.addEventListener('click', drawNextStep);
restartButton.addEventListener('click', initializeMazeGenerator);

function Cell (col, row) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.walls = {'top': true, 'right': true, 'bottom': true, 'left': true};
}

Cell.prototype.draw = function() {
    var x = this.col * boxWidth;
    var y = this.row * boxHeight;

    // Highlight if it's the currentCell
    if ( currentCell && this.row === currentCell.row && this.col === currentCell.col ) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.col * (boxWidth), this.row * (boxHeight), boxWidth, boxHeight);
    } else if (this.visited) {
        // otherwise, use these styles for visited cells:
        ctx.fillStyle = 'orange';
        ctx.strokeStyle = '#555';
        ctx.fillRect(this.col * (boxWidth), this.row * (boxHeight), boxWidth, boxHeight);
    } else {
        // or these styles for unvisited cells:
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#eee';
    }

    ctx.lineWidth = boxMargin;
    ctx.lineCap = 'square';

    // Draw each wall as individual lines
    ctx.beginPath();

    if (this.walls.top) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + boxWidth, y);
    }

    if (this.walls.right) {
        ctx.moveTo(x + boxWidth, y);
        ctx.lineTo(x + boxWidth , y + boxHeight);
    }

    if (this.walls.bottom) {
        ctx.moveTo(x, y + boxHeight);
        ctx.lineTo(x + boxWidth, y + boxHeight);
    }

    if (this.walls.left) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + boxHeight);
    }

    ctx.stroke();
};

Cell.prototype.checkRandomNeighbor = function() {
    var neighbors = [grid[ getGridIndex(this.row, this.col - 1) ],
    grid[ getGridIndex(this.row + 1, this.col) ],
    grid[ getGridIndex(this.row, this.col + 1) ],
    grid[ getGridIndex(this.row - 1, this.col) ]
];

var unvisitedNeighbors = neighbors.filter( function(neighbor) {return (neighbor && !neighbor.visited);} );

if (unvisitedNeighbors.length > 0) {
    return unvisitedNeighbors[ getRandomInt(0, unvisitedNeighbors.length - 1) ];
}
};

function drawNextStep() {
    // If there's an unvisited neighbor....
    var nextCell = currentCell.checkRandomNeighbor();
    if (nextCell) {
        // push visited cell to the stack on each round:
        stack.push(currentCell);

        console.log('found a neighbor! pushed to stack:');
        console.log(stack);

        // remove cell walls accordingly and redraw
        removeWalls(currentCell, nextCell);
        //currentCell.draw();
        //nextCell.draw();

        // set currentCell for the next round and draw it:
        currentCell = nextCell;

        // mark next cell as visited
        nextCell.visited = true;

    } else if (stack.length > 0) {

        // redraw the currentCell
        // currentCell.draw();

        // if we ran out of neighbors, revisit the last visited cell and start over!
        currentCell = stack.pop();

        console.log('popped one off the stack, backtracking!');
        console.log(stack);
    } else {
        // if no more neighbors and the stack is empty, we're done! show reset button!
        restartButton.style.display = 'block';
    }

    // LAZY SOLUTION FOR NOW: just redraw the entire grid each time
    grid.forEach(function(cell){ cell.draw();});

}

function removeWalls(firstCell, secondCell) {
    var neighborXSide = firstCell.col - secondCell.col;
    var neighborYSide = firstCell.row - secondCell.row;

    if (neighborXSide === 1) {
        firstCell.walls.left = false;
        secondCell.walls.right = false;
    } else if (neighborXSide === -1) {
        firstCell.walls.right = false;
        secondCell.walls.left = false;
    }

    if (neighborYSide === 1) {
        firstCell.walls.top = false;
        secondCell.walls.bottom = false;
    } else if (neighborYSide === -1) {
        firstCell.walls.bottom = false;
        secondCell.walls.top = false;
    }

}

// * * * * * * * * * * INITIALIZATION * * * * * * * * * * *
function initializeMazeGenerator() {
    // clear canvas!
    ctx.clearRect(0, 0, 800, 800);

    // Reset grid, stack, and current cell!
    grid = [];
    stack = [];
    currentCell = undefined;

    // Create the grid of cells and draw each one
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var newCell = new Cell(row, col);
            newCell.draw();
            grid.push(newCell);
        }
    }

    // initialize currentCell to start at top left corner
    currentCell = grid[0];

    // draw first step
    currentCell.visited = true;
    currentCell.draw();


    console.log(grid);


    // DOM stuff:
    restartButton.style.display = 'none';
}

initializeMazeGenerator();


// * * * * * * * * * * HELPER FUNCTIONS * * * * * * * * * * *
function getGridIndex(row, col) {
    if (row < 0 || col < 0 || row > cols - 1 || col > rows - 1) {
        return -1;
    }  else {
        return row + col * cols;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
