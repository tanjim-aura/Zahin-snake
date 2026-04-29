const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let direction;
let food;
let score;
let game;

// 👇 image
const headImg = new Image();
headImg.src = "head.png";

// 👇 init game
function init(){
  snake = [{x: 9 * box, y: 9 * box}];
  direction = "RIGHT";
  score = 0;

  food = {
    x: Math.floor(Math.random()*19+1)*box,
    y: Math.floor(Math.random()*19+1)*box
  };

  document.getElementById("score").innerText = "Score: " + score;
}

// 👇 keyboard
document.addEventListener("keydown", function(e){
  if(e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if(e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if(e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if(e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// 👇 button control
function setDir(newDir){
  if(newDir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  else if(newDir === "UP" && direction !== "DOWN") direction = "UP";
  else if(newDir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  else if(newDir === "DOWN" && direction !== "UP") direction = "DOWN";
}

// 👇 swipe control
let startX, startY;

canvas.addEventListener("touchstart", function(e){
  let touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

canvas.addEventListener("touchmove", function(e){
  let touch = e.touches[0];
  let dx = touch.clientX - startX;
  let dy = touch.clientY - startY;

  if(Math.abs(dx) > Math.abs(dy)){
    if(dx > 0) setDir("RIGHT");
    else setDir("LEFT");
  } else {
    if(dy > 0) setDir("DOWN");
    else setDir("UP");
  }
});

// 👇 draw
function draw(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,400,400);

  // body
  for(let i=1;i<snake.length;i++){
    ctx.fillStyle = "lime";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // head image
  ctx.drawImage(headImg, snake[0].x-2, snake[0].y-2, box+4, box+4);

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if(direction === "LEFT") snakeX -= box;
  if(direction === "UP") snakeY -= box;
  if(direction === "RIGHT") snakeX += box;
  if(direction === "DOWN") snakeY += box;

  // eat
  if(snakeX === food.x && snakeY === food.y){
    score++;
    document.getElementById("score").innerText = "Score: " + score;

    food = {
      x: Math.floor(Math.random()*19+1)*box,
      y: Math.floor(Math.random()*19+1)*box
    };
  } else {
    snake.pop();
  }

  let newHead = {x: snakeX, y: snakeY};

  // game over
  if(
    snakeX < 0 || snakeY < 0 ||
    snakeX >= 400 || snakeY >= 400 ||
    collision(newHead, snake)
  ){
    clearInterval(game);
    alert("Game Over 😢 Score: " + score);
  }

  snake.unshift(newHead);
}

// 👇 collision
function collision(head, array){
  for(let i=0;i<array.length;i++){
    if(head.x === array[i].x && head.y === array[i].y){
      return true;
    }
  }
  return false;
}

// 👇 restart
function restartGame(){
  clearInterval(game);
  init();
  game = setInterval(draw, 120);
}

// 👇 start
headImg.onload = function(){
  init();
  game = setInterval(draw, 120);
};
