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
visited: a list of visited nodes
*/
var canvas = null
  , context = null
  , spritesheet = null
  , spritesheetLoaded = false

  , world = [[]]
  , worldWidth = 100
  , worldHeight = 100

  , tileWidth = 8
  , tileHeight = 8

  , pathStart = [worldWidth,worldHeight]
  , pathEnd = [0,0]
  , currentPath = []

  , chanceOfWall = 0.15
  , elapsedTime = null

  , visited = [];

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
  createMap();
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
  // pick color
  context.fillStyle = '#000000';
  // fill full canvas
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (var x=0; x < worldWidth; x++) {
    for (var y=0; y < worldHeight; y++) {
      // After filling the 2D array with 1 and 0
      // we can now select the correct tile to draw
      var rand = (Math.floor(+Math.random() * 25 + 230)).toString(16);
      var clear = Math.random() > 0.5 ? "#FFF" : "#"+rand+rand+rand;
      var color = world[x][y] === 1 ? "#222" : clear;
      context.fillStyle = color;
      // context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
      context.fillRect(x*tileWidth,y*tileHeight,tileWidth,tileHeight);
    }
  }
  drawPath();
}

function drawPath() {
  var length = currentPath.length;
  var color;
  for (var i = 0; i < length; i++) {
    (function(i){
      setTimeout(function(){
        color = "#00A";                      // Pathnode (as default)
        if(i === 0) color = "#F00";          // Startnode
        if(i === length - 1) color = "#0F0"; // Endnode

        context.fillStyle = color;
        context.fillRect(
          currentPath[i][0]*tileWidth
          , currentPath[i][1]*tileHeight
          , tileWidth
          , tileHeight);

      }, i*i/i)
    }(i));
  }
  drawVisitedNodes();
}

function drawVisitedNodes(){
  var length = visited.length;
  if(!length) return;

  for (var i = 0; i < length; i++){
    var x = visited[i].x
    ,   y = visited[i].y
    ,   f = visited[i].f
    ,   g = visited[i].g
    ,   value = visited[i].value;

    var alpha = g/1000+0.15;

    var color = "rgba(255,000,000,"+alpha+")";

    context.fillStyle = color;
    context.fillRect(
        x*tileWidth
      , y*tileHeight
      , tileWidth
      , tileHeight);
  }
  visited = [];
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

  var startTime = new Date().getTime();
  // calculate path
  currentPath = findPath(world,pathStart,pathEnd);
  displayTimeAndLength(startTime, length);
  draw();
}

function displayTimeAndLength(time, length){
  var curr = new Date().getTime();
  document.getElementById("time").innerHTML = curr - time + "ms";
  var length = currentPath.length;
  document.getElementById("length").innerHTML = length;
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
  distanceFunction = ManhattanDistance;
  // this is just picking the distance function from ui
  // This needs to be refactored though!
  // TODO: ^^
  var e = document.getElementById("heuristic_function");
  if(e){
    var val = e.value;

    if(e.value === "Diagonal"){
      distanceFunction = DiagonalDistance;
    }

    if(e.value === "Manhattan"){
      distanceFunction = ManhattanDistance;
    }

    if(e.value === "Euclidean"){
      distanceFunction = EuclideanDistance;
    }

    if(e.value === "None"){
      distanceFunction = NoneDistance;
    }
  }
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

  function DiagonalDistance(Point, Goal) {
    return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
  }

  function EuclideanDistance(Point, Goal){
    return sqrt(abs(Point.x - Goal.x) + abs(Point.x - Goal.x))
  }

  function NoneDistance(Point, Goal){
    return 1;
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
      // save to draw it later
      visited.push(curr)
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
