// * * * * * * * * * * GLOBAL VARIABLES (booo! but whatevs) * * * * * * * * * * *
var canvasElement = document.getElementById("mycanvas");
var canvasContext = canvasElement.getContext("2d");
var rows = 8, cols = 8;
var boxWidth = 50, boxHeight = 50, wallWidth = 4;
var grid, stack, currentCell;

// DOM elements and event listeners:
var nextButton = document.getElementById('nextbutton');
var restartButton = document.getElementById('restart');
nextButton.addEventListener('click', drawNextStep);
restartButton.addEventListener('click', initializeMazeGenerator);

// * * * * * * * * * * DEFINING THE CELL CLASS AND METHODS * * * * * * * * * * *
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
		canvasContext.fillStyle = 'red';
		canvasContext.fillRect(this.col * (boxWidth), this.row * (boxHeight), boxWidth, boxHeight);
	} else if (this.visited) {
		// otherwise, use these styles for visited cells:
		canvasContext.fillStyle = 'orange';
		canvasContext.strokeStyle = '#555';
		canvasContext.fillRect(this.col * (boxWidth), this.row * (boxHeight), boxWidth, boxHeight);
	} else {
		// or these styles for unvisited cells:
		canvasContext.fillStyle = '#fff';
		canvasContext.strokeStyle = '#eee';
	}

	// default styles for walls:
	canvasContext.lineWidth = wallWidth;
	canvasContext.lineCap = 'square';

	// Draw each wall as individual lines:
	canvasContext.beginPath();

	if (this.walls.top) {
		canvasContext.moveTo(x, y);
		canvasContext.lineTo(x + boxWidth, y);
	}

	if (this.walls.right) {
		canvasContext.moveTo(x + boxWidth, y);
		canvasContext.lineTo(x + boxWidth , y + boxHeight);
	}

	if (this.walls.bottom) {
		canvasContext.moveTo(x, y + boxHeight);
		canvasContext.lineTo(x + boxWidth, y + boxHeight);
	}

	if (this.walls.left) {
		canvasContext.moveTo(x, y);
		canvasContext.lineTo(x, y + boxHeight);
	}

	canvasContext.stroke();
};

Cell.prototype.checkRandomNeighbor = function() {
	var neighbors = [grid[ getGridIndex(this.row, this.col - 1) ],
		grid[ getGridIndex(this.row + 1, this.col) ],
		grid[ getGridIndex(this.row, this.col + 1) ],
		grid[ getGridIndex(this.row - 1, this.col) ]
	];

	// Filter the array to only include UNvisited neighbors (and no undefined neighbors!)
	var unvisitedNeighbors = neighbors.filter( function(neighbor) {
		return neighbor && !neighbor.visited;
	});

	// return a random unvisited neighbor if there are any
	if (unvisitedNeighbors.length > 0) {
		return unvisitedNeighbors[ getRandomInt(0, unvisitedNeighbors.length - 1) ];
	}
};

// * * * * * * * * * * GLOBAL FUNCTIONS * * * * * * * * * * *
function drawNextStep() {
	// mark current cell as visited
	currentCell.visited = true;

	// Check if there's an unvisited neighbor, and if so...
	var nextCell = currentCell.checkRandomNeighbor();
	if (nextCell) {
		// push the visited cell to the stack on each round
		stack.push(currentCell);

		// remove cell walls accordingly and redraw first cell
		removeWalls(currentCell, nextCell);

		// update state for the next iteration
		var previousCell = currentCell;
		currentCell = nextCell;

		// redraw both cells to show their new states
		previousCell.draw();
		currentCell.draw();

	// If all neighbors have been visited, then...
	} else if (stack.length > 0) {
		// update state for the next iteration and redrawing
		var previousCell = currentCell;
		// revisit the last visited cell and start over!
		currentCell = stack.pop();

		// redraw both cells to show new state
		previousCell.draw();
		currentCell.draw();
	} else {
		// If no more neighbors and the stack is empty, we're done! show reset button!
		restartButton.style.display = 'block';
	}
} // END of drawNextStep()

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
} // END of removeWalls()

function initializeMazeGenerator() {
	// clear canvas!
	canvasContext.clearRect(0, 0, 800, 800);

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

	// DOM stuff:
	restartButton.style.display = 'none';
} // END of initializeMazeGenerator()

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

// * * * * * * * * * * AND FINALLY... MAKE THE MAGIC HAPPEN!!! * * * * * * * * * * *

initializeMazeGenerator();
