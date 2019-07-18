var player = {x: 150, y: 250, size: 45};
var coins = [{x: 300, y: random(0, 500), size: 20, collected: false},
            {x: 800, y: random(0, 500), size: 20, collected: false},
            {x: 100, y: random(0, 500), size: 20, collected: false},
            {x: 900, y: random(0, 500), size: 20, collected: false},
            {x: 400, y: random(0, 500), size: 20, collected: false}];
var score = 0;
var gravity = 0.4;
var goUp = false;
var crashed = false;
var gap = {height: 300, y: 250};
var walls = [];
var smoke = [];

var setup = function() {
  setInterval(createSmoke, 100);
};


var draw = function() {
  noStroke();
  background(0,0,0);
  drawPlayer();
  drawScore();
  drawWalls();
  
  if (!crashed) {
    movePlayer();
    doCoin();
    moveWalls();
    doSmoke();
  } else {
    youLoseScreen();
  }
};

var createSmoke = function(){
  var newSmoke = {x:player.x, y:player.y, size:3};
  smoke.push(newSmoke);
};

var doSmoke = function() {
  
  smoke = smoke.filter((s) => {return s.x > -50});
  
  for (var s of smoke){
    fill(255,0,255);

    ellipse(s.x, s.y, s.size, s.size);
    
    s.x -= 6;
    s.size++;
  }

};


var drawWalls = function() {
  for (var wall of walls){
    rect(wall.x, wall.y, wall.w, wall.h);
  }
};

var doCoin = function() {
  
  var filteredCoins = coins.filter((coin) => {return coin.x > 0 && !coin.collected});
  coins = filteredCoins;
  
  if (random(0,100) < 10) {
    var newCoin = {x: 600, y: random(0,500), size: 20, collected: false};
    coins.push(newCoin);
  }
  
  for (var coin of coins) {
  if (coin.collected) {
    continue;
  }
  fill(255,255,0);
  ellipse(coin.x, coin.y, coin.size, coin.size);
  
  coin.x -= 3;
  
  var playerRadius = player.size / 2;
  var coinRadius = coin.size / 2;
  var touchDistance = playerRadius + coinRadius;
  
  if (dist(player.x, player.y, coin.x, coin.y) < touchDistance){
    coin.collected = true;
score += 1;
  }
  }
};


var drawPlayer = function() {
  fill(0, 255, 255);
  ellipse(player.x, player.y, player.size, player.size);
};

var movePlayer = function() {
  if (goUp) {
    gravity -= 0.4;
  } else {
    gravity += 0.4;
  }
  
  if (gravity > 8) {
    gravity = 8;
  }
  if (gravity < -6) {
    gravity = -6;
  }
  player.y += gravity;
  
  if (player.y > 500 || player.y < 0) {
    crashed = true;
  }
  
};

var mousePressed =function() {
  if (mouseButton === LEFT) {
    goUp = true;
    
    if (crashed) {
    crashed = false;
    player.y = 250;
    gravity = 0;
    
    score = 0;
    coins = [];
    walls = [];
      
    }
  }
};

var mouseReleased = function() {
  if (mouseButton === LEFT) {
    goUp = false;
  }
};

var youLoseScreen = function() {
  fill(255, 0, 0);
  
  textSize(24);
  
  text("Game Over! Try again!", 119, 150);
  
  text("Click to try again!", 150, 350);
  
};

var drawScore = function() {
  fill(255, 255, 0);    
  textSize(24);
  text(score, 50, 450);
};

var wallTimer = 0;

var moveWalls = function() {
  for (var wall of walls) {
    wall.x -= 3;
    
    if (wall.x < player.x && wall.x + wall.w > player.x) {
      if (player.y - player.size/2 < wall.y + wall.h &&
      player.y + player.size/2 > wall.y)
      crashed=true;
      
      
    }
    
  }
  
  if (wallTimer <= 0) {
  wallTimer = 16;
  gap.y += 75 * floor(random(2.74) - 1);
  
  if (gap.y < 150) {
    gap.y = 150;
  }
  if (gap.y > 350) {
    gap.y = 350;
  }
  
  var newWall = {x: 500, y: 0, w: 50, h: gap.y - gap.height / 2};
  walls.push(newWall);
}
wallTimer -= 1;

};