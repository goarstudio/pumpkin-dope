const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');

let spawnInterval;
let spiderInterval;

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  bgMusic.play().catch(() => {});
  startGame();
});

function startGame() {
  let timeLeft = 30;
  let goldenLimit = Math.random() < 0.5 ? 2 : 3;
  let goldenCount = 0;
  let ghostLimit = Math.random() < 0.5 ? 2 : 3;
  let ghostCount = 0;

  const timerDisplay = document.getElementById('timer');

  const timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      clearInterval(spiderInterval);
      endGame();
    }
  }, 1000);

  spawnInterval = setInterval(spawnPumpkin, 1000);

  setTimeout(() => {
    clearInterval(spawnInterval);
    spawnInterval = setInterval(() => {
      spawnPumpkin();
      spawnPumpkin();
    }, 800);
  }, 5000);

  spiderInterval = setInterval(spawnSpider, 3500);

  const ghostInterval = setInterval(() => {
    if (ghostCount < ghostLimit) {
      spawnGhost();
      ghostCount++;
    } else {
      clearInterval(ghostInterval);
    }
  }, 8000);

  const goldenInterval = setInterval(() => {
    if (goldenCount < goldenLimit) {
      spawnGoldenPumpkin();
      goldenCount++;
    } else {
      clearInterval(goldenInterval);
    }
  }, 10000);
}

window.addEventListener('load', () => {
  const laugh = document.getElementById('hehe-sound');
  laugh.volume = 0;
  laugh.play().then(() => {
    laugh.pause();
    laugh.currentTime = 0;
    laugh.volume = 1;
  }).catch(() => {});
});

muteBtn.addEventListener('click', () => {
  bgMusic.muted = !bgMusic.muted;
  muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
});

let score = 0;
const scoreElement = document.getElementById('score');

function updateScore(points) {
  score += points;
  scoreElement.textContent = `Score: ${score}`;
}

function spawnPumpkin() {
  const pumpkin = document.createElement('img');
  pumpkin.src = 'images/pumpkin.png';
  pumpkin.classList.add('pumpkin');
  pumpkin.style.left = Math.random() * 80 + '%';
  pumpkin.style.top = Math.random() * 80 + '%';
  document.body.appendChild(pumpkin);
  const disappearTimeout = setTimeout(() => pumpkin.remove(), 1000);
  pumpkin.addEventListener('click', () => {
    clearTimeout(disappearTimeout);
    pumpkin.classList.add('explode');
    updateScore(1);
    setTimeout(() => pumpkin.remove(), 500);
  });
}

function spawnGoldenPumpkin() {
  const golden = document.createElement('img');
  golden.src = 'images/golden-pumpkin.png';
  golden.classList.add('pumpkin', 'golden');
  golden.style.left = Math.random() * 80 + '%';
  golden.style.top = Math.random() * 80 + '%';
  document.body.appendChild(golden);
  const disappearTimeout = setTimeout(() => golden.remove(), 1500);
  golden.addEventListener('click', () => {
    clearTimeout(disappearTimeout);
    golden.classList.add('explode');
    updateScore(5);
    const cheer = document.getElementById('yooha-sound');
    cheer.currentTime = 0;
    cheer.play().catch(() => {});
    setTimeout(() => golden.remove(), 500);
  });
}

function spawnSpider() {
  const spider = document.createElement('img');
  spider.src = 'images/spider.png';
  spider.classList.add('spider');
  const baseLeft = Math.random() * 70 + 10;
  const baseTop = Math.random() * 70 + 10;
  spider.style.left = (baseLeft + Math.random() * 10 - 5) + '%';
  spider.style.top = (baseTop + Math.random() * 10 - 5) + '%';
  document.body.appendChild(spider);
  const disappearTimeout = setTimeout(() => spider.remove(), 1500);
  spider.addEventListener('click', () => {
    clearTimeout(disappearTimeout);
    const laugh = document.getElementById('hehe-sound').cloneNode();
    laugh.volume = 1;
    laugh.play().catch(() => {});
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    spider.remove();
  });
}

function spawnGhost() {
  const ghost = document.createElement('img');
  ghost.src = 'images/ghost.png';
  ghost.classList.add('ghost');
  ghost.style.zIndex = '9999';

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const directions = ['top', 'right', 'bottom', 'left'];
  const entry = directions[Math.floor(Math.random() * directions.length)];
  let startX = 0, startY = 0, endX = 0, endY = 0;
  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2;

  if (entry === 'top') {
    startX = Math.random() * screenWidth;
    startY = -100;
    endX = screenWidth - startX;
    endY = screenHeight + 100;
  } else if (entry === 'right') {
    startX = screenWidth + 100;
    startY = Math.random() * screenHeight;
    endX = -100;
    endY = screenHeight - startY;
  } else if (entry === 'bottom') {
    startX = Math.random() * screenWidth;
    startY = screenHeight + 100;
    endX = screenWidth - startX;
    endY = -100;
  } else {
    startX = -100;
    startY = Math.random() * screenHeight;
    endX = screenWidth + 100;
    endY = screenHeight - startY;
  }

  ghost.style.left = `${startX}px`;
  ghost.style.top = `${startY}px`;
  ghost.style.position = 'absolute';

  const animationStyle = Math.random() < 0.5 ? 'ghost-swirl' : 'ghost-zigzag';
  ghost.classList.add(animationStyle);

  ghost.animate([
    { transform: `translate(0, 0)`, opacity: 0.4 },
    { transform: `translate(${centerX - startX}px, ${centerY - startY}px)`, opacity: 1 },
    { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0.2 }
  ], {
    duration: 6000,
    easing: 'ease-in-out',
    fill: 'forwards'
  });

  document.body.appendChild(ghost);

  const removeTimeout = setTimeout(() => ghost.remove(), 6000);
  ghost.addEventListener('click', () => {
    clearTimeout(removeTimeout);
    ghost.remove();
    freezeGameFor(1500);
  });
}

function freezeGameFor(ms) {
  clearInterval(spawnInterval);
  clearInterval(spiderInterval);
  const overlay = document.getElementById('ice-overlay');
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.style.display = 'none';
    spawnInterval = setInterval(() => {
      spawnPumpkin();
      spawnPumpkin();
    }, 800);
    spiderInterval = setInterval(spawnSpider, 3500);
  }, ms);
}

function endGame() {
  document.querySelectorAll('.pumpkin, .spider, .ghost').forEach(el => el.remove());
  const gameOver = document.createElement('div');
  gameOver.id = 'game-over';
  gameOver.innerHTML = `
  <p>Game Over!</p>
  <p class="final-score">Your Score: <strong>${score}</strong></p>
  <button id="play-again">Play Again</button>
`;
  document.body.appendChild(gameOver);
  document.getElementById('play-again').addEventListener('click', () => {
    window.location.reload();
  });
}
