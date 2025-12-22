const canvas = document.getElementById('c1'); // Get the canvas element
const ctx = canvas.getContext('2d'); // Get the 2D drawing context

/* Coordinates and ball speed
temp */

const coordinatesDisplay = document.getElementById('coordinates'); // Get the coordinates display element

canvas.addEventListener('mousemove', (event) => { // Add mousemove event listener to the canvas
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  coordinatesDisplay.textContent = `Coords: X:${x.toFixed(2)} Y:${y.toFixed(
    2
  )}`;
});

canvas.addEventListener('click', () => {
  if (!ifBallLaunched) {
    ifBallLaunched = true;
  }

  ball.x = ball.x + ball.speedX; // Update ball position on X axis
  ball.y = ball.y + ball.speedY; // Update ball position on Y axis
});

/* Platform */

const platform = {
  width: 130,
  height: 20,
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  speed: 7,
};

function drawPlatform() {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.fillStyle = "lightblue";
  ctx.roundRect(platform.x, platform.y, platform.width, platform.height);
  ctx.fill();
  ctx.stroke();
}

let isLeftisPressed = false;
let isRightisPressed = false;

let ifBallLaunched = false;

/* Controls */

window.addEventListener('mousemove', (event) => { // Mouse move event listener
  const canvasRect = canvas.getBoundingClientRect(); // Get the canvas position
  const mouseX = event.clientX - canvasRect.left; // Calculate mouse X relative to canvas

  platform.x = mouseX - platform.width / 2; // Center the platform on the mouse X position

  // Ensure the platform stays within the canvas boundaries

  if (platform.x < 0) { // Left boundary
    platform.x = 0; // Prevent going out of bounds
  } else if (platform.x + platform.width > canvas.width) { // Right boundary
    platform.x = canvas.width - platform.width; // Prevent going out of bounds
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    isLeftisPressed = true;
  }
  if (event.key === 'ArrowRight') {
    isRightisPressed = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    isLeftisPressed = false;
  }
  if (event.key === 'ArrowRight') {
    isRightisPressed = false;
  }
});

function updatePlatformPosition() {
  if (isLeftisPressed && platform.x > 0) {
    platform.x = platform.x - platform.speed;
  }
  if (isRightisPressed && platform.x + platform.width < canvas.width) {
    platform.x = platform.x + platform.speed;
  }
}

/* Ball */

const ball = {
  startAngle: 20,
  endAngle: 10,
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 50,
  speedX: 2,
  speedY: 2,
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(
    ball.x,
    ball.y,
    ball.radius,
    ball.startAngle,
    ball.endAngle * Math.PI
  );
  ctx.fillStyle = '#a53fe0ff';
  ctx.fill();
  ctx.stroke();
}

function updateBallPosition() {
  //const initialSpeed = 2;


  if (!ifBallLaunched) {
    ball.x = platform.x + platform.width / 2;
    ball.y = platform.y - ball.radius
    return;
  }

  ball.x = ball.x + ball.speedX; // Update ball position on X axis
  ball.y = ball.y + ball.speedY; // Update ball position on Y axis

  const maxSpeed = 2; // Maximum speed for both axes

  // Collision with the platform
  /*if ( // If the ball is colliding with the platform
    ball.y + ball.radius >= platform.y && // Lower than platform on Y axis
    ball.x >= platform.x && // The ball is not on the left from the platform
    ball.x <= platform.x + platform.width // Ball is not on the right from the platform
  ) {
    ball.speedY = -ball.speedY;
    const hitPoint =
      (ball.x - (platform.x + platform.width / 2)) / (platform.width / 2);

    console.log(hitPoint);

    if (hitPoint <= -0.49) {
      ball.speedX = -Math.abs(ball.speedX);
    }
    if (hitPoint >= 0.49) {
      ball.speedX = Math.abs(ball.speedX);
    }
    /*if (hitPoint >= -0.48 && hitPoint <= 0.48) {
      ball.speedX = 0;
      ball.speedY = -Math.abs(ball.speedY);
      ball.speedX = initialSpeed;
    }*/
  //}

  // Collision with the platform (Arkanoid style)
if (
  ball.speedY > 0 && // мяч летит вниз
  ball.y + ball.radius >= platform.y &&
  ball.y + ball.radius <= platform.y + platform.height &&
  ball.x >= platform.x &&
  ball.x <= platform.x + platform.width
) {
  const maxBounce = Math.PI / 3; // 60°
  const speed = Math.hypot(ball.speedX, ball.speedY);

  const hitPoint =
    (ball.x - (platform.x + platform.width / 2)) / (platform.width / 2);

  const angle = hitPoint * maxBounce;

  ball.speedX = speed * Math.sin(angle);
  ball.speedY = -speed * Math.cos(angle);

  // выталкиваем мяч вверх, чтобы не было повторных столкновений
  ball.y = platform.y - ball.radius - 0.01;
}

  // Collision with right and left window frames
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.speedX = -ball.speedX; // Reflect the ball on X axis
  }

  // Collision with X axis and Y=0 (the top)
  if (ball.y - ball.radius <= 0) {
    ball.speedY = -ball.speedY; // Reflect the ball on Y axis
  }

  if (ball.y + ball.radius >= canvas.height) { // Bottom window frame
    alert('Game Over');
    // if Y-pos of the ball + his radius is overboarding game window frames (the bottom)
    //location.reload();
  }
}

const showBallSpeed = document.getElementById('ball-speed');

const countPoints = document.getElementById('pts-counter');

/* Reset position for ball and platform */
function resetGame() {
  ball = {
    startAngle: 20,
    endAngle: 10,
    radius: 10,
    x: canvas.width / 2,
    y: canvas.height - 50,
    speedX: 2,
    speedY: 2,
  };

  platform = {
    width: 100,
    height: 20,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    speed: 7,
  };
}

/* Obstacles */
const obstacles = [
  // ===== РЯД 1 (strong) =====
  { x: 40,  y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 110, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 180, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 250, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 320, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 390, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 460, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 530, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 600, y: 40,  width: 60, height: 20, type: 'strong' },
  { x: 670, y: 40,  width: 60, height: 20, type: 'strong' },

  // ===== РЯД 2 (normal) =====
  { x: 70,  y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 140, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 210, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 280, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 350, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 420, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 490, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 560, y: 70,  width: 60, height: 20, type: 'normal' },
  { x: 630, y: 70,  width: 60, height: 20, type: 'normal' },

  // ===== РЯД 3 (weak) =====
  { x: 40,  y: 100, width: 60, height: 20, type: 'weak' },
  { x: 110, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 180, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 250, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 320, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 390, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 460, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 530, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 600, y: 100, width: 60, height: 20, type: 'weak' },
  { x: 670, y: 100, width: 60, height: 20, type: 'weak' },

  // ===== РЯД 4 (normal, дырки) =====
  { x: 110, y: 130, width: 60, height: 20, type: 'normal' },
  { x: 180, y: 130, width: 60, height: 20, type: 'normal' },
  { x: 320, y: 130, width: 60, height: 20, type: 'normal' },
  { x: 390, y: 130, width: 60, height: 20, type: 'normal' },
  { x: 530, y: 130, width: 60, height: 20, type: 'normal' },
  { x: 600, y: 130, width: 60, height: 20, type: 'normal' },

  // ===== РЯД 5 (strong, шахматка) =====
  { x: 70,  y: 160, width: 60, height: 20, type: 'strong' },
  { x: 210, y: 160, width: 60, height: 20, type: 'strong' },
  { x: 350, y: 160, width: 60, height: 20, type: 'strong' },
  { x: 490, y: 160, width: 60, height: 20, type: 'strong' },
  { x: 630, y: 160, width: 60, height: 20, type: 'strong' },
];

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    ctx.beginPath();
    ctx.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    if (obstacle.type === 'normal') {
      ctx.fillStyle = '#64ac82ff';
    } else if (obstacle.type === 'weak') {
      ctx.fillStyle = '#5a89daff';
    } else if (obstacle.type === 'strong') {
      ctx.fillStyle = '#e767abff';
    }
    ctx.fill();
    ctx.closePath();
  }
}

function obstaclesBallCollision() {
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];

    const hit =
      ball.x + ball.radius > o.x && // right side of ball > left side of obstacle
      ball.x - ball.radius < o.x + o.width && // left side of ball < right side of obstacle
      ball.y + ball.radius > o.y && // bottom side of ball > top side of obstacle
      ball.y - ball.radius < o.y + o.height; // top side of ball < bottom side of obstacle

    if (!hit) continue;

    // Определяем, откуда мяч прилетел (по prevX/prevY)
    const fromLeft   = ball.prevX + ball.radius <= o.x; // справа налево
    const fromRight  = ball.prevX - ball.radius >= o.x + o.width; // слева направо
    const fromTop    = ball.prevY + ball.radius <= o.y; // снизу вверх
    const fromBottom = ball.prevY - ball.radius >= o.y + o.height; // сверху вниз

    if (fromTop) {
      ball.speedY = -Math.abs(ball.speedY);
      ball.y = o.y - ball.radius - 0.01; // ball.y равно верхней точке препятствия минус радиус мяча - маленькая поправка
    } else if (fromBottom) {
      ball.speedY = Math.abs(ball.speedY);
      ball.y = o.y + o.height + ball.radius + 0.01; // ball.y равно нижней точке препятствия плюс радиус мяча + маленькая поправка
    } else if (fromLeft) {
      ball.speedX = -Math.abs(ball.speedX);
      ball.x = o.x - ball.radius - 0.01; // ball.x равно левой точке препятствия минус радиус мяча - маленькая поправка
    } else if (fromRight) {
      ball.speedX = Math.abs(ball.speedX);
      ball.x = o.x + o.width + ball.radius + 0.01; // ball.x равно правой точке препятствия плюс радиус мяча + маленькая поправка
    } else {
      // Редкий случай: мяч "родился" внутри/влетел диагонально глубоко.
      // Выходим по минимальному проникновению (и тоже выталкиваем).
      const overlapLeft = (ball.x + ball.radius) - o.x;
      const overlapRight = (o.x + o.width) - (ball.x - ball.radius);
      const overlapTop = (ball.y + ball.radius) - o.y;
      const overlapBottom = (o.y + o.height) - (ball.y - ball.radius);

      const minX = Math.min(overlapLeft, overlapRight);
      const minY = Math.min(overlapTop, overlapBottom);

      if (minX < minY) {
        if (overlapLeft < overlapRight) {
          ball.speedX = -Math.abs(ball.speedX);
          ball.x = o.x - ball.radius - 0.01;
        } else {
          ball.speedX = Math.abs(ball.speedX);
          ball.x = o.x + o.width + ball.radius + 0.01;
        }
      } else {
        if (overlapTop < overlapBottom) {
          ball.speedY = -Math.abs(ball.speedY);
          ball.y = o.y - ball.radius - 0.01;
        } else {
          ball.speedY = Math.abs(ball.speedY);
          ball.y = o.y + o.height + ball.radius + 0.01;
        }
      }
    }

    obstacles.splice(i, 1);

    if (obstacles.length === 0) {
      alert('You won! To restart, press F5');
      resetGame(); // Function is coming soon
    }
    break; // важно: максимум 1 кирпич за кадр, иначе опять “странности”
  }
}

/* Random number function */
function randomNum(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

/* Game loop */

function gameLoop() { // Главный игровой цикл
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас
  drawBall(); // Рисуем мяч
  drawPlatform(); // Рисуем платформу
  updatePlatformPosition(); // Обновляем позицию платформы
  updateBallPosition(); // Обновляем позицию мяча
  drawObstacles(); // Рисуем препятствия
  obstaclesBallCollision(); // Проверяем столкновения мяча с препятствиями
  showBallSpeed.textContent = `Ball Speed: ${ball.speedX} ${ball.speedY}`; // Отображаем скорость мяча
  requestAnimationFrame(gameLoop); // Запрашиваем следующий кадр
}

gameLoop(); // Начинаем игровой цикл