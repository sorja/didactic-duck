/*
Global variables:
canvas: canvas elem
context: 2d context from elem
spritesheet: spritesheet
spritesheetLoaded: is img loaded
world: 2d array
worldWidth/worldHeight: how many blocks w/h
tileHeight/tileWidth: image size in pxl
pathStart/pathEnd/currentPath: path variables
*/
var canvas = null
	, context = null
	, spritesheet = null
	, spritesheetLoaded = false

	, world = [[]]
	, worldWidth = 20
	, worldHeight = 20

	, tileWidth = 32
	, tileHeight = 32

	, pathStart = [worldWidth,worldHeight]
	, pathEnd = [0,0]
	, currentPath = [];

// ie console fix
if (typeof console == "undefined") var console = { log: function() {} };

/*
init function
This function gets called when tha page is ready
General setup of canvas
*/
function onload() {
	// Initialize the 'canvas' variable with our html elem
	canvas = document.getElementById('canvas');
	// Setup our canvas size
	canvas.width = worldWidth * tileWidth;
	canvas.height = worldHeight * tileHeight;
	// add onclick listener to handle clicks on canvas
	canvas.addEventListener("click", handleClick, false);
	context = canvas.getContext("2d");
	spritesheet = new Image();
	/*
	http://websemantics.co.uk/online_tools/image_to_data_uri_convertor/
	Image converted to data URI using above tool
	*/
	spritesheet.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAgCAYAAACVf3P1AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgFDDMDTGpyRwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC0UlEQVR42u2cP5KbMBTGH5kUKZXJAaIjvCPIJwCfwHK7DdyAI2AatyInkF2nEJSpOILxATKhTEeKXc2QHRsbL152Z78f4xnAjycGfXp6En8CIuroYxMQmI3PRERdN48GgwB1DwGCR7oLPUEwMlKO9Ndd6ImCkZF6rL8tbQftH+hhVPnX+vsE5YF78eurRQS8ISMM7uqnmzbSjfVzKTKOjXSDfv4Q/aCfg5ERERDMCgQIIEDwNvj95QgBgvn49vc7BAg+2piPqPvgE9GYDUcOCCBAACDA+VFKKWutdc45pZTSWmvXI8uyzNtaa61SSvltb5OmaUpENHTstSRJkjjnnLXWSimlEEIYY4xzzkVRFHk7rbXu+2dm1lrr93DNu7mgx1n5uX//4ZxzQghBRCSllP39fbsoiqI0TVNjjHluY4wxz4V5S8VkWZYlSZIQEYkn+r6ttZaZ2a8bY4w/Z6WU8g3hXmxp212654sIeANxHMdCCNE0TXPOJgzDMM/z3AvAi0QppaSUcujYa2Fm3mw2G37C7yvLsiQiyvM8D8Mw9OVVVVX1o+K9xXdqHQJ8IYvFYnE8Ho/GGHOuCxNCCCmlbNu2Lcuy9JUuhBBxHMdlWZZTCLAvxDRNU2bmtm3bUw1mv9/vd7vdbrVarZADvnOKoijW6/X6XGVGURQJIYRzzjEzh2EYEhE1TdMsl8ul/38q8RVFUfio54Xuo3BVVZXvbq211jeOe1+j/kMLL32AATngsxzQcy6P8wMCv13Xdd230Vrrfv51aw7IzFzXde3Px3fFzjlX13WdZVnGzNzPQ7XWOkmSRCmlDofDwR/7Vhs7JqIxEY0uGECAAECAs9I9LTOV0xF13Su8oXiunCnm9K6dvumXAwECREAAAQIAAQIIEIBXBe8FnxqlnmLqLyMMjFJPFz/tlxGGRqmn9k/9ZQREQPAmwK043IqbX4C4BmAu/gHUY66QV7+O0QAAAABJRU5ErkJggg==';
	// When image is ready move on
	spritesheet.onload = spriteReady;
}

/*
	call createworld when image is loaded
*/
function spriteReady() {
	spritesheetLoaded = true;
	createMap();
}
/*
	generate map, scatter walls
*/
function createMap() {
	for (var x=0; x < worldWidth; x++) {
		world[x] = [];
		for (var y=0; y < worldHeight; y++) {
			world[x][y] = Math.random() > 0.75 ? 1 : 0;
		}
	}
	draw();
}

function draw() {
	// If sprite is not ready,
	if (!spritesheetLoaded) return;

	var spriteNum = 0;

	// pick color
	context.fillStyle = '#000000';
	// fill full canvas
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (var x=0; x < worldWidth; x++) {
		for (var y=0; y < worldHeight; y++) {
			// After filling the 2D array with 1 and 0
			// we can now select the correct tile to draw
			spriteNum = world[x][y];

			// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
			context.drawImage(spritesheet,
			spriteNum*tileWidth, 0,
			tileWidth, tileHeight,
			x*tileWidth, y*tileHeight,
			tileWidth, tileHeight);
		}
	}
}

// handle click events on the canvas
// TODO: Add route handling
function handleClick(e)
{
	createMap();
}
