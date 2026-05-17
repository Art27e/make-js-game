const canvas = document.getElementById('c1'); // Get the canvas element
const ctx = canvas.getContext('2d'); // Get the 2D drawing context

let gameState = 'menu'; // Initial game state

canvas.addEventListener('mousemove', (event) => {
  // Mouse move event listener
  const rect = canvas.getBoundingClientRect(); // Get the canvas position and size
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
});

canvas.addEventListener('click', () => {
  if (gameState !== 'playing') return;
  if (!ifBallLaunched) {
    ifBallLaunched = true;
  }
});

/* Platform */
const platform = {
  width: 130,
  height: 20,
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  speed: 2,
};

function drawPlatform() {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'lightblue';
  ctx.roundRect(platform.x, platform.y, platform.width, platform.height);
  ctx.fill();
  ctx.stroke();
}

let isLeftisPressed = false;
let isRightisPressed = false;

let ifBallLaunched = false;

/* Controls */

window.addEventListener('mousemove', (event) => {
  // Mouse move event listener
  if (gameState !== 'playing') return; // Only respond to mouse movement when the game is in the 'playing' state
  const canvasRect = canvas.getBoundingClientRect(); // Get the canvas position
  const mouseX = event.clientX - canvasRect.left; // Calculate mouse X relative to canvas

  platform.x = mouseX - platform.width / 2; // Center the platform on the mouse X position

  // Ensure the platform stays within the canvas boundaries

  if (platform.x < 0) {
    // Left boundary
    platform.x = 0; // Prevent going out of bounds
  } else if (platform.x + platform.width > canvas.width) {
    // Right boundary
    platform.x = canvas.width - platform.width; // Prevent going out of bounds
  }
});

window.addEventListener('keydown', (event) => {
  if (gameState !== 'playing') return; // Only respond to key presses when the game is in the 'playing' state
  if (event.key === 'ArrowLeft') {
    isLeftisPressed = true;
  }
  if (event.key === 'ArrowRight') {
    isRightisPressed = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (gameState !== 'playing') return; // Only respond to key releases when the game is in the 'playing' state
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
  prevX: canvas.width / 2,
  prevY: canvas.height - 50,
  speedX: 5,
  speedY: 5,
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(
    ball.x,
    ball.y,
    ball.radius,
    ball.startAngle,
    ball.endAngle * Math.PI,
  );
  ctx.fillStyle = '#a53fe0ff';
  ctx.fill();
  ctx.stroke();
}

function updateBallPosition() {
  //const initialSpeed = 2;

  if (!ifBallLaunched) {
    // If the ball is not launched, it should be positioned on top of the platform
    ball.x = platform.x + platform.width / 2; // Center the ball on the platform
    ball.y = platform.y - ball.radius; // Position the ball just above the platform
    ball.prevX = ball.x; // Update previous position to current position
    ball.prevY = ball.y;
    return;
  }

  ball.prevX = ball.x; // Store the current position as previous position before updating
  ball.prevY = ball.y;
  ball.x = ball.x + ball.speedX; // Update ball position on X axis
  ball.y = ball.y + ball.speedY; // Update ball position on Y axis

  const maxSpeed = 2; // Maximum speed for both axes

  // Collision with the platform (Arkanoid style)
  if (
    ball.speedY > 0 && // Only check for collision if the ball is moving downwards
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

    // Ensure the ball's speed does not exceed the maximum speed
    ball.y = platform.y - ball.radius - 0.01;
  }

  // Collision with X axis and X=0 (the left) and X=canvas.width (the right)
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.speedX = -ball.speedX; // Reflect the ball on X axis
  }

  // Collision with X axis and Y=0 (the top)
  if (ball.y - ball.radius <= 0) {
    ball.speedY = -ball.speedY; // Reflect the ball on Y axis
  }

  if (ball.y + ball.radius >= canvas.height) {
    // Bottom window frame
    alert('Game Over. To restart, press F5');
    // if Y-pos of the ball + his radius is overboarding game window frames (the bottom)
    //location.reload();
  }
}

//const countPoints = document.getElementById('pts-counter');

/* Reset position for ball and platform */
function resetGame() {
  ball = {
    startAngle: 20,
    endAngle: 10,
    radius: 10,
    x: canvas.width / 2,
    y: canvas.height - 50,
    speedX: 5,
    speedY: 5,
  };

  platform = {
    width: 100,
    height: 20,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    speed: 4,
  };
}

/* Obstacles */
const obstacles = [
  // ===== РЯД 1 (strong) =====
  { x: 40, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 110, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 180, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 250, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 320, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 390, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 460, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 530, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 600, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 670, y: 40, width: 60, height: 20, type: 'strong', hits: 0 },

  // ===== РЯД 2 (normal) =====
  { x: 70, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 140, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 210, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 280, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 350, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 420, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 490, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 560, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 630, y: 70, width: 60, height: 20, type: 'normal', hits: 0 },

  // ===== РЯД 3 (weak) =====
  { x: 40, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 110, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 180, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 320, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 390, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 460, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 530, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 600, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },
  { x: 670, y: 100, width: 60, height: 20, type: 'weak', hits: 0 },

  // ===== РЯД 4 (normal, дырки) =====
  { x: 110, y: 130, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 180, y: 130, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 320, y: 130, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 390, y: 130, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 530, y: 130, width: 60, height: 20, type: 'normal', hits: 0 },
  { x: 600, y: 130, width: 60, height: 20, type: 'normal', hits: 0 },

  // ===== РЯД 5 (strong, шахматка) =====
  { x: 70, y: 160, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 210, y: 160, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 350, y: 160, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 490, y: 160, width: 60, height: 20, type: 'strong', hits: 0 },
  { x: 630, y: 160, width: 60, height: 20, type: 'strong', hits: 0 },
];

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];

    let fillColor = '#64ac82';
    let strokeColor = '#2f5f45';
    let highlightColor = '#9fdfb8';
    let shadowColor = '#2a4a37';

    if (obstacle.type === 'weak') {
      fillColor = '#5a89da';
      strokeColor = '#2d4f8f';
      highlightColor = '#9bbcff';
      shadowColor = '#223d6b';
    } else if (obstacle.type === 'strong') {
      fillColor = '#e767ab';
      strokeColor = '#943d6b';
      highlightColor = '#ff9ac8';
      shadowColor = '#6f2c4e';
    }

    // Основной корпус
    ctx.fillStyle = fillColor;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Рамка
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Верхний блик
    ctx.fillStyle = highlightColor;
    ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, 4);

    // Нижняя тень
    ctx.fillStyle = shadowColor;
    ctx.fillRect(
      obstacle.x + 2,
      obstacle.y + obstacle.height - 6,
      obstacle.width - 4,
      4,
    );
  }
}

function obstaclesBallCollision() {
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];

    const sweepLeft = Math.min(ball.prevX, ball.x) - ball.radius;
    const sweepRight = Math.max(ball.prevX, ball.x) + ball.radius;
    const sweepTop = Math.min(ball.prevY, ball.y) - ball.radius;
    const sweepBottom = Math.max(ball.prevY, ball.y) + ball.radius;

    const hit = // Переменные для проверки пересечения траектории мяча с прямоугольником препятствия
      sweepRight > o.x && // это правая сторона траектории мяча > левая сторона препятствия
      sweepLeft < o.x + o.width && // это левая сторона траектории мяча < правая сторона препятствия
      sweepBottom > o.y && // это нижняя сторона траектории мяча > верхняя сторона препятствия
      sweepTop < o.y + o.height; // это верхняя сторона траектории мяча < нижняя сторона препятствия

    if (!hit) continue; // Если нет пересечения, переходим к следующему препятствию

    // Определяем, откуда мяч прилетел (по prevX/prevY)
    const fromLeft = ball.prevX + ball.radius <= o.x; // справа налево
    const fromRight = ball.prevX - ball.radius >= o.x + o.width; // слева направо
    const fromTop = ball.prevY + ball.radius <= o.y; // снизу вверх
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
      const overlapLeft = ball.x + ball.radius - o.x;
      const overlapRight = o.x + o.width - (ball.x - ball.radius);
      const overlapTop = ball.y + ball.radius - o.y;
      const overlapBottom = o.y + o.height - (ball.y - ball.radius);

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

    if (o.type === 'weak') {
      // Если препятствие слабое, оно просто удаляется при первом столкновении
      obstacles.splice(i, 1);
      continue;
    }

    if (o.type === 'normal') {
      // Если препятствие нормальное, оно удаляется при втором столкновении
      o.type = 'weak'; // Сначала превращаем его в слабое, чтобы при следующем столкновении удалить
      continue;
    }

    if (o.type === 'strong') {
      o.hits++;

      if (o.hits >= 3) {
        o.type = 'normal';
        o.hits = 0;
      }

      continue;
    }

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

/* Menu */
function drawMenu() {
  ctx.fillStyle = 'rgb(21, 255, 0)';
  ctx.font = '30px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
}

/* Pause menu */
function pauseMenu() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Полупрозрачный черный фон
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Заполнение всего канваса
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Paused', canvas.width / 2, canvas.height / 2);
  ctx.fillText('Press P to Resume', canvas.width / 2, canvas.height / 2 + 40);
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    if (gameState === 'paused') {
      gameState = 'playing';
    } else if (gameState === 'playing') {
      gameState = 'paused';
    }
  }
});

window.addEventListener('click', () => {
  if (gameState === 'menu') {
    gameState = 'playing';
  }
});

/* Game loop */
// Главный игровой цикл - функция, которая будет вызываться для обновления и отрисовки игры на каждом кадре

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас

  if (gameState === 'menu') {
    drawMenu();
  }

  if (gameState === 'playing') {
    drawBall(); // Рисуем мяч
    drawPlatform(); // Рисуем платформу
    updatePlatformPosition(); // Обновляем позицию платформы
    updateBallPosition(); // Обновляем позицию мяча
    drawObstacles(); // Рисуем препятствия
    obstaclesBallCollision(); // Проверяем столкновения мяча с препятствиями
  }

  if (gameState === 'paused') {
    drawBall();
    drawPlatform();
    drawObstacles();
    pauseMenu();
  }

  requestAnimationFrame(gameLoop); // Запрашиваем следующий кадр для анимации
}

gameLoop(); // Начинаем игровой цикл
