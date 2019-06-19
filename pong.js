const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const mainColor = "#FFF";

//
//seting ball and players parameters
const session = {
  state: 1,
  start: "Start game",
  win: "You won",
  loss: "You lost"
};

const player = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0
};

const comp = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  speed: 7
};

//
//drawing functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "55px fantasy";
  ctx.fillText(text, x, y);
}

function drawNet() {
  ctx.strokeStyle = mainColor;
  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(300, 0);
  ctx.lineTo(300, 400);
  ctx.stroke();
}

function drawGame() {
  // clear canvas
  drawRect(0, 0, canvas.width, canvas.height, "#000");

  // net
  drawNet();

  //score
  drawText(player.score, canvas.width / 4, canvas.height / 5, mainColor);
  drawText(comp.score, (3 * canvas.width) / 4, canvas.height / 5, mainColor);

  //paddles
  drawRect(player.x, player.y, player.width, player.height, mainColor);
  drawRect(comp.x, comp.y, comp.width, comp.height, mainColor);

  //ball
  drawBall(ball.x, ball.y, ball.radius, mainColor);
}

function drawMenu() {
  //draw start menu
  drawRect(0, 0, canvas.width, canvas.height, "#000");

  //draw title
  drawText(session.start, 190, 200, mainColor);

  //draw button
  drawRect(250, 250, 100, 50, mainColor);
  drawText("start", 252, 290, "#000");
}
//
//button function
function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function isInside(pos, rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

let rect = {
  x: 250,
  y: 250,
  width: 100,
  height: 50
};

function clickM(evt) {
  if (isInside(getMousePos(canvas, evt), rect)) {
    session.state = 0;
  } else {
    alert("clicked outside rect");
  }
}

canvas.addEventListener("click", clickM, false);

// prop: ball, paddle|| if ball hits the paddle
function isCollision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

//control of paddle;
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event) {
  let rect = canvas.getBoundingClientRect();

  player.y = event.clientY - rect.top - player.height / 2;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  ball.speed = 5;
  ball.velocityY = -ball.velocityX;
}

function seeWiner() {
  if (player.score == 7) {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText("You Won", canvas.width / 2 - 50, canvas.height / 2, mainColor);
  }
}
//pos, changes and score
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //comp ai
  let compDificulty = 0.1;
  comp.y += (ball.y - (comp.y + comp.height / 2)) * compDificulty;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let paddleUser = ball.x < canvas.width / 2 ? player : comp;

  if (isCollision(ball, paddleUser)) {
    let collidePoint = ball.y - (paddleUser.y + paddleUser.height / 2);

    collidePoint = collidePoint / (paddleUser.height / 2);

    let angleRad = collidePoint * (Math.PI / 4);

    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.5;
  }

  if (ball.x - ball.radius < 0) {
    comp.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    player.score++;
    resetBall();
  }
}

//render game
function render() {
  if (session.state) {
    drawMenu();
  } else {
    canvas.removeEventListener("click", clickM, false);
    drawGame();
  }
}

//game start
function game() {
  update();
  render();
}

//game loop
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
