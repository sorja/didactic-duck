/*
Global variables:
canvas: canvas elem
context: 2d context from elem
spritesheet: spritesheet
spritesheetLoaded: is img loaded
world: 2d array integers
worldWidth/worldHeight: how many blocks w/h
tileHeight/tileWidth: image size in pxl
pathStart/pathEnd/currentPath: path variables
chanceOfWall: The chance of creating a wall
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
  , currentPath = []
  , chanceOfWall = 0.35;

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
      world[x][y] = Math.random() > chanceOfWall ? 0 : 1;
    }
  }
  draw();
}

function draw() {
  // If sprite is not ready,
  if (!spritesheetLoaded) return;

  var sprite = 0;

  // pick color
  context.fillStyle = '#000000';
  // fill full canvas
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (var x=0; x < worldWidth; x++) {
    for (var y=0; y < worldHeight; y++) {
      // After filling the 2D array with 1 and 0
      // we can now select the correct tile to draw
      sprite = world[x][y];

      // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
      context.drawImage(spritesheet
        , sprite*tileWidth
        , 0
        , tileWidth
        , tileHeight
        , x*tileWidth
        , y*tileHeight
        , tileWidth
        , tileHeight);
    }
  }
  drawPath();
}

function drawPath() {
  var length = currentPath.length;
  var sprite;
  for (var i = 0; i < length; i++) {
    sprite = 4; // Pathnode (as default)
    if(i === 0) sprite = 2; // Startnode
    if(i === length - 1) sprite = 3; // Endnode

    context.drawImage(spritesheet
      , sprite*tileWidth
      , 0
      , tileWidth
      , tileHeight
      , currentPath[i][0]*tileWidth
      , currentPath[i][1]*tileHeight
      , tileWidth
      , tileHeight);
  }
}

// handle click events on the canvas
function handleClick(e) {
  var drawing = document.getElementById("draw_on_map").checked;

  if(!e.pageX || !e.pageY){
    console.log('Unsupported browser.');
  }
  var x = e.pageX,
      y = e.pageY;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  var cell = [Math.floor(x/tileWidth), Math.floor(y/tileHeight)];

  if(drawing){
    drawOnMap(cell);
    return;
  }

  pathStart = pathEnd;
  pathEnd = cell;

  // calculate path
  currentPath = findPath(world,pathStart,pathEnd);
  draw();
}

function drawOnMap(cell){
  // var x,y = cell;
  var x = cell[0]
    , y = cell[1];

  world[x][y] = world[x][y] === 1 ? 0 : 1;
  draw();

}

/*
  world: 2d array
  pathStart: startNode ex. [0,0]
  pathEnd: endNode ex. [5,5]
*/
function findPath(world, pathStart, pathEnd) {
  var  abs = Math.abs
    ,  max = Math.max
    ,  pow = Math.pow
    ,  sqrt = Math.sqrt;
  // Variable for later use,
  // if wanted to add more sprites
  // which are walkable
  var allowedTiles = 0;

  var worldWidth = world[0].length
    , worldHeight = world.length
    , worldSize =  worldWidth * worldHeight;

/*
  Here we can choose the heuristic.
  The idea is to implement more than one
  and then able to change it from the UI (here html page)
*/
  var distanceFunction = ManhattanDistance;
  /*
    This is also for later use
  */
  var findNeighbours = function(){};

  /*
    Manhattan movement allows only NSEW movement,
    no diagonal movement allowed.
    Other heurestics to be added later
  */
  function ManhattanDistance(Point, Goal) {
    return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
  }

  // Returns every available North, South, East or West
  // cell that is empty. No diagonals,
  // unless distanceFunction function is not Manhattan
  function Neighbours(x, y) {
    var  N = y - 1
    ,   S = y + 1
    ,   E = x + 1
    ,   W = x - 1
    ,   n = N > -1 && isTileFree(x, N)
    ,   s = S < worldHeight && isTileFree(x, S)
    ,   e = E < worldWidth && isTileFree(E, y)
    ,   w = W > -1 && isTileFree(W, y)
    ,   result = [];

    if(n) result.push({x:x, y:N});
    if(e) result.push({x:E, y:y});
    if(s) result.push({x:x, y:S});
    if(w) result.push({x:W, y:y});
    // For later use
    findNeighbours(n, s, e, w, N, S, E, W, result);
    return result;
  }

  /*
    Check if a block is walkable,
    aka: under allowed tiles,
    and not null
    x: x
    y: y
  */
  function isTileFree(x, y) {
    return (
      (world[x]    != null) &&
      (world[x][y] != null) &&
      (world[x][y] <= allowedTiles));
  };


  /*
    The algorithm itself: A*
  */
  return function() {
    /*
      myPathStart: Create node from start x,y
      myPathEnd Create node from end x,y
      AStar: Array containning all world cells
      Open: List of open nodes
      Closed: List of closed nodes
      result: final Path
      nodeNeighbours: reference to a node that is close
      curr: reference to a node that we're handling atm
      currPath: node that starts a path
    */

    var  mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]})
     ,   mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]})
     ,   AStar = []
     ,   Open = [mypathStart]
     ,   Closed = []
     ,   result = []
     ,   nodeNeighbours
     ,   curr
     ,   currPath
     ,   length, max, min, i, j;

    /*
      Let's start iterating through the list of open nodes
    */
    while(length = Open.length) {
      max = worldSize;
      min = -1;
      for(i = 0; i < length; i++) {
        if(Open[i].f < max) {
          max = Open[i].f;
          min = i;
        }
      }
      // Save next node, and remove it from the array
      curr = Open.splice(min, 1)[0];
      // Are we @end?
      if(curr.value === mypathEnd.value) {
        currPath = Closed[Closed.push(curr) - 1];
        do { result.push([currPath.x, currPath.y]); }
        while (currPath = currPath.Parent);
        // clear arrs
        AStar = Closed = Open = [];
        // moving from end to start, therefore reversing needed
        result.reverse();
      // If not @ end
      } else {
        // check neighbours
        nodeNeighbours = Neighbours(curr.x, curr.y);
        // test each one that hasn't been tried already
        for(i = 0, j = nodeNeighbours.length; i < j; i++) {
          currPath = Node(curr, nodeNeighbours[i]);
          if (!AStar[currPath.value]) {
            // Here we can use our distancefunction, default: manhattan
            currPath.g = curr.g + distanceFunction(nodeNeighbours[i], curr);
            // f(n) = g(n) + h(n)
            currPath.f = currPath.g + distanceFunction(nodeNeighbours[i], mypathEnd);
            // Add path to open list and
            // mark current node as visited in the world array
            Open.push(currPath);
            AStar[currPath.value] = true;
          }
        }
        // add curr to closed arr
        Closed.push(curr);
      }
    }
    return result;
  } ();
}

/*
  Basic node 'class' (function)
  Parent: Parent node
  Point: this node
*/
function Node(Parent, Point) {
  var node = {
    Parent:Parent,
    value:Point.x + (Point.y * worldWidth),
    x:Point.x,
    y:Point.y,
    // Heuristic cost of path using this node
    f:0,
    // Distance function cost to here from start
    g:0
  };
  return node;
}

/*
  This stuff is outside of the algorithm,
  it's for the ui
*/

// Toggle drawing with shift, cause
// too lazy to move mouse
window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  var checkbox = document.getElementById("draw_on_map");
  if (key == 16) {
    checkbox.checked = !checkbox.checked;
  }
}

function handleWallChanges(e){
  chanceOfWall = +e.value/100;
  createMap();
}
