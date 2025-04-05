const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Responsive scaling for mobile
let scale = Math.min(window.innerWidth / 400, window.innerHeight / 600);
canvas.style.width = canvas.width * scale + "px";
canvas.style.height = canvas.height * scale + "px";

// Game constants and state
const GRAVITY = 0.5;
const FLAP = -8;
let chicken = { x: 50, y: 250, velocity: 0, width: 50, height: 35 };
let pipes = [];
let score = 0;
let gameOver = false;
let started = false;
let pipeInterval;

const chickenImg = new Image();
chickenImg.src = "chicken_breast.png";

function createPipe() {
  const gap = 140;
  const topHeight = Math.floor(Math.random() * (canvas.height - gap - 200)) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 60,
    scored: false
  });
}

function drawPipe(pipe) {
  ctx.fillStyle = "#228B22";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
}

function updateGame() {
  chicken.velocity += GRAVITY;
  chicken.y += chicken.velocity;
  
  pipes.forEach(pipe => pipe.x -= 2);
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
  
  // Collision detection
  pipes.forEach(pipe => {
    if (checkCollision(pipe)) endGame();
  });

  // Screen boundaries
  if (chicken.y < 0 || chicken.y + chicken.height > canvas.height) {
    endGame();
  }

  // Score update
  pipes.forEach(pipe => {
    if (!pipe.scored && pipe.x + pipe.width < chicken.x) {
      score++;
      pipe.scored = true;
    }
  });
}

function checkCollision(pipe) {
  return chicken.x < pipe.x + pipe.width &&
         chicken.x + chicken.width > pipe.x &&
         (chicken.y < pipe.top || chicken.y + chicken.height > pipe.bottom);
}

function drawGame() {
  // Draw background
  ctx.fillStyle = "#4EC0CA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!started) {
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Tap or Press Space to Start", 60, 300);
  } else if (gameOver) {
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 120, 300);
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + score, 140, 340);
  } else {
    updateGame();
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    pipes.forEach(pipe => drawPipe(pipe));
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }
  
  requestAnimationFrame(drawGame);
}

function flap() {
  if (!started) {
    started = true;
    chicken.velocity = FLAP;
    pipeInterval = setInterval(createPipe, 1500);
  } else if (!gameOver) {
    chicken.velocity = FLAP;
  } else {
    resetGame();
  }
}

function endGame() {
  if (!gameOver) {
    gameOver = true;
    clearInterval(pipeInterval);
  }
}

function resetGame() {
  chicken.y = 250;
  chicken.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  started = false;
}

// Input handling
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    flap();
  }
});

canvas.addEventListener("touchstart", function(e) {
  e.preventDefault();
  flap();
});

// Start the game
chickenImg.onload = drawGame;
