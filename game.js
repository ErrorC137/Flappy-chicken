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

// Create a new pipe pair
function createPipe() {
  const gap = 140;
  const topHeight = Math.floor(Math.random() * 250) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 60,
    scored: false
  });
}

// Draw a single pipe pair
function drawPipe(pipe) {
  ctx.fillStyle = "#228B22";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
}

// Update game elements when game is running
function updateGame() {
  // Update chicken
  chicken.velocity += GRAVITY;
  chicken.y += chicken.velocity;
  
  // Update pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
  }
  
  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
  
  // Check collision with pipes
  for (let pipe of pipes) {
    if (
      chicken.x < pipe.x + pipe.width &&
      chicken.x + chicken.width > pipe.x &&
      (chicken.y < pipe.top || chicken.y + chicken.height > pipe.bottom)
    ) {
      endGame();
    }
  }
  
  // Check collision with floor and ceiling
  if (chicken.y + chicken.height > canvas.height || chicken.y < 0) {
    endGame();
  }
  
  // Update score when passing a pipe
  for (let pipe of pipes) {
    if (!pipe.scored && pipe.x + pipe.width < chicken.x) {
      score++;
      pipe.scored = true;
    }
  }
}

// Main draw loop
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!started) {
    // Draw start screen (static)
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Tap or Press Space to Start", 60, 300);
  } else if (gameOver) {
    // Draw game-over screen
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 120, 300);
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + score, 140, 340);
  } else {
    // Game is running: update and draw game objects
    updateGame();
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    pipes.forEach(pipe => drawPipe(pipe));
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }
  
  requestAnimationFrame(drawGame);
}

// Flap or start the game on input
function flap() {
  if (!started) {
    started = true;
    chicken.velocity = FLAP;
    // Start generating pipes every 1.5 seconds
    pipeInterval = setInterval(createPipe, 1500);
  } else if (!gameOver) {
    chicken.velocity = FLAP;
  } else {
    // Restart the game if it is over
    location.reload();
  }
}

// End the game
function endGame() {
  gameOver = true;
  clearInterval(pipeInterval);
}

// Input events for keyboard and touch
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    flap();
  }
});
canvas.addEventListener("touchstart", flap);

// Start the draw loop once the chicken image loads
chickenImg.onload = function() {
  drawGame();
};
