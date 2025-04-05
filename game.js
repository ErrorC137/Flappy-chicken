const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let screenW = window.innerWidth;
let screenH = window.innerHeight;
let scale = Math.min(screenW / 400, screenH / 600);
canvas.width = 400;
canvas.height = 600;
canvas.style.width = 400 * scale + "px";
canvas.style.height = 600 * scale + "px";

const GRAVITY = 0.5;
const FLAP = -8;
let chicken = { x: 50, y: 200, velocity: 0, width: 50, height: 35 };
let pipes = [];
let score = 0;
let gameOver = false;

const chickenImg = new Image();
chickenImg.src = "chicken_breast.png";

function createPipe() {
  const gap = 140;
  const topHeight = Math.floor(Math.random() * 250) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 60
  });
}

function drawPipe(pipe) {
  ctx.fillStyle = "#228B22";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
}

function draw() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chicken
  chicken.velocity += GRAVITY;
  chicken.y += chicken.velocity;
  ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);

  // Pipes
  pipes.forEach(pipe => {
    pipe.x -= 2;
    drawPipe(pipe);

    if (pipe.x + pipe.width === chicken.x) score++;

    if (
      chicken.x < pipe.x + pipe.width &&
      chicken.x + chicken.width > pipe.x &&
      (chicken.y < pipe.top || chicken.y + chicken.height > pipe.bottom)
    ) {
      endGame();
    }
  });

  // Floor/ceiling
  if (chicken.y > canvas.height || chicken.y < 0) {
    endGame();
  }

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(draw);
}

function flap() {
  if (!gameOver) chicken.velocity = FLAP;
}

function endGame() {
  gameOver = true;
  setTimeout(() => {
    alert("Game Over! Final Score: " + score);
    location.reload();
  }, 100);
}

// Input support
document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("touchstart", flap);

setInterval(createPipe, 1500);
draw();
