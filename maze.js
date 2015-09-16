function maze(){
  chanceOfWall = 1;
  var floor = Math.floor;
  var random = Math.random;
  var length = worldWidth * worldHeight;
//  var startX = floor(random()*worldWidth)
//    , startY = floor(random()*worldHeight);
  var startX = floor(worldWidth/2),
      startY = floor(worldHeight/2);
  var curr = [startX, startY];

  createMap();
  while(length){
    n = neighbours(curr[0], curr[1]);
    var r = floor(random()*n.length);
    var nx = n[r].x
      , ny = n[r].y;
    if(!mazeVisited[nx][ny] === -1){
      mazeVisited[nx][ny] = n[r];
    } else {
      curr = [nx,ny];
      world[nx][ny] = 0;
      length--;
      continue;
    }
    length--;  
  }
  draw();
}

function neighbours(x,y){
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
  return result;
}


function isTileFree(x, y) {
  return (
    (world[x]    != null) &&
    (world[x][y] != null));
}
