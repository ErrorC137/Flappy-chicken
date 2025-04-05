const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.5;
const FLAP = -8;
let chicken = { x: 50, y: 200, velocity: 0, width: 50, height: 35 };
let pipes = [];
let score = 0;
let gameOver = false;

// Load chicken image
const chickenImg = new Image();
chickenImg.src = "chicken_breast.png"; // Place this PNG in the same folder

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

    // Score
    if (pipe.x + pipe.width === chicken.x) score++;

    // Collision
    if (
      chicken.x < pipe.x + pipe.width &&
      chicken.x + chicken.width > pipe.x &&
      (chicken.y < pipe.top || chicken.y + chicken.height > pipe.bottom)
    ) {
      gameOver = true;
      alert("Game Over! Final Score: " + score);
      location.reload();
    }
  });

  // Floor/ceiling
  if (chicken.y > canvas.height || chicken.y < 0) {
    alert("Game Over! Final Score: " + score);
    location.reload();
  }

  // Score display
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") chicken.velocity = FLAP;
});

setInterval(createPipe, 1500);
draw();
