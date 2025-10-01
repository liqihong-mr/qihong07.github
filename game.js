const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');

// 初始化画布尺寸
canvas.width = 800;
canvas.height = 600;
gameContainer.appendChild(canvas);

// 玩家飞船属性
const player = {
  x: canvas.width/2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 40,
  speed: 7,
  bullets: [],
  isShooting: false
};

// 键盘控制
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ') {
    player.bullets.push({
      x: player.x + player.width/2 - 2.5,
      y: player.y - 15,
      width: 5,
      height: 15
    });
  }
});
document.addEventListener('keyup', e => keys[e.key] = false);

// 游戏主循环
let gameOver = false;

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// 敌人属性
const enemies = [];
let spawnTimer = 0;
const ENEMY_SPAWN_RATE = 60;
let score = 0;
let lives = 3;

// 碰撞检测
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function update() {
  // 玩家移动
  if (keys.ArrowLeft) player.x = Math.max(0, player.x - player.speed);
  if (keys.ArrowRight) player.x = Math.min(canvas.width - player.width, player.x + player.speed);

  // 敌人生成
  spawnTimer++;
  if (spawnTimer > ENEMY_SPAWN_RATE) {
    enemies.push({
      x: Math.random() * (canvas.width - 40),
      y: -40,
      width: 40,
      height: 40,
      speed: 3
    });
    spawnTimer = 0;
  }

  // 更新敌人位置
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }

    // 玩家碰撞检测
    if (checkCollision(player, enemy)) {
      enemies.splice(index, 1);
      lives = Math.max(0, lives - 1);
      if (lives === 0) {
        gameOver = true;
      }
    }
  });

  // 更新子弹
  player.bullets.forEach((bullet, index) => {
    bullet.y -= 10;
    if (bullet.y < 0) {
      player.bullets.splice(index, 1);
    }

    // 子弹碰撞检测
    enemies.forEach((enemy, enemyIndex) => {
      if (checkCollision(bullet, enemy)) {
        player.bullets.splice(index, 1);
        enemies.splice(enemyIndex, 1);
        score += 100;
      }
    });
  });
}

function draw() {
  if (gameOver) {
    ctx.fillStyle = '#ff0000';
    ctx.font = '48px 宋体, Arial, sans-serif';
    ctx.fillText('游戏结束', canvas.width/2 - 100, canvas.height/2);
    return;
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制玩家
  ctx.fillStyle = '#00f7ff';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 绘制敌人
  ctx.fillStyle = '#ff0000';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // 绘制子弹
  ctx.fillStyle = '#ffff00';
  player.bullets.forEach(bullet => {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bullet.x, bullet.y, 5, 15);
  });

  // 绘制得分和生命值
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);
}

// 初始化游戏
function init() {
  gameLoop();
}

init();