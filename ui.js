
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

function handleMapSizeChanges(e){
  worldWidth = worldHeight = +e.value;
  onload();
}

function handleCellSizeChanges(e){
  tileWidth = tileHeight = +e.value;
  onload();
}
