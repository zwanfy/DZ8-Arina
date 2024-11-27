const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "./img/ground.png";

const foodImg = new Image();
foodImg.src = "./img/food.png";

let box = 32;
let score = 0;

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [];

snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

let dir;

function direction(e) {
  if (e.keyCode === 37 && dir !== "right") dir = "left";
  else if (e.keyCode === 38 && dir !== "down") dir = "up";
  else if (e.keyCode === 39 && dir !== "left") dir = "right";
  else if (e.keyCode === 40 && dir !== "up") dir = "down";
}

document.addEventListener("keydown", direction);

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) {
      clearInterval(game);
      setModal();
    }
  }
}

function setModal() {
  const div = document.createElement("div");
  div.setAttribute("class", "modal");

  document.body.style.background = "rgba(0,0,0,0.5)";
  div.innerHTML = `
    <h1>Game Over</h1>
    <p>Your score: ${score}</p>
    <button id="restart">New Game</button>
  `;

  document.body.append(div);

  div.style.transform = "scale(0)";
  setTimeout(() => {
    div.style.transform = "scale(1)";
    div.style.transition = "transform 0.5s ease";
  }, 0);
 
  document.getElementById("restart").addEventListener("click", restartGame);
}

function drawGame() {
  ctx.drawImage(ground, 0, 0);
  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "red";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7);

  let snakeY = snake[0].y;
  let snakeX = snake[0].x;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else snake.pop();

  if (
    snakeX < box ||
    snakeX > box * 17 ||
    snakeY < 3 * box ||
    snakeY > box * 17
  ) {
    clearInterval(game);
    setModal();
  }

  if (dir === "left") snakeX -= box;
  if (dir === "right") snakeX += box;
  if (dir === "up") snakeY -= box;
  if (dir === "down") snakeY += box;

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  eatTail(newHead, snake);
  snake.unshift(newHead);
}

let game = setInterval(drawGame, 200);



function restartGame() {
  document.querySelector(".modal").remove(); 
  document.body.style.background = "";
  score = 0; 
  snake = [{ x: 9 * box, y: 10 * box }]; 
  dir = undefined; 
  food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
  }; 
  game = setInterval(drawGame, 200); 
}

