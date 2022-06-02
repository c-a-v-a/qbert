import type { position, orinentation } from './player';
import { getPlayerPosition, player, hurt } from './player';
import { BOARD_SIZE, DISC_OFFSET, board } from './board';
import { toggleDed } from './canvas';
import { monsterInterval, unset, setKeyboard, setInter } from './main';

interface enemy {
  currentPosition: position;
  type: enemyType;
  interval: number;
  orinentation?: orinentation;
  offset: position;
  squish?: boolean;
};

type enemyType = 'snake'|'snake-ball'|'ball';

export let enemies: Array<enemy> = [];

function spawnSnake() {
  const pos = getPlayerPosition();
  const newSnake: enemy = {
    currentPosition: {
      y: 1,
      x: randStart() + 1
    },
    type: 'snake-ball',
    interval: 0,
    offset: {
      x: 0,
      y: 0
    },
    squish: false
  };

  enemies.push(newSnake);

  const index = enemies.indexOf(newSnake);

  if (enemies[index].currentPosition.x === pos.x 
    && enemies[index].currentPosition.y === pos.y && !player.jump) clearMonsters();

  newSnake.interval = setInterval(() => snakeBallMove(newSnake), 2000);
}

function spawnBall() {
  const pos = getPlayerPosition();

  const ball: enemy = {
    currentPosition: {
      y: 1,
      x: randStart() + 1,
    },
    type: 'ball',
    interval: 0,
    offset: {
      x: 0,
      y: 0
    },
    squish: false
  };

  enemies.push(ball);

  const index = enemies.indexOf(ball);

  if (enemies[index].currentPosition.x === pos.x 
    && enemies[index].currentPosition.y === pos.y && !player.jump) clearMonsters();

  ball.interval = setInterval(() => ballMove(ball), 1500);
}

function ballMove(ball: enemy) {
  const x = ball.currentPosition.x + randStart();
  const y = ball.currentPosition.y + 1;
  const pos = getPlayerPosition();

  enemies[enemies.indexOf(ball)].squish = true;

  setTimeout(() => {
    enemies[enemies.indexOf(ball)].squish = false;
  }, 200);

  let interval = setInterval(() => {
    const index = enemies.indexOf(ball);
    if (x === ball.currentPosition.x) {
      if (ball.offset.x >= -9) {
        ball.offset.x -= 3;
        ball.offset.y -= 2;
      } else {
        ball.offset.x -= 2;
        ball.offset.y += 7;
      }
      if (ball.offset.x <= -20 && ball.offset.y >= 23) {
        ball.offset.x = 0;
        ball.offset.y = 0;
        ball.currentPosition.x = x;
        ball.currentPosition.y = y;
        enemies[index] = ball;
        clearInterval(interval);

        if (y >= BOARD_SIZE) {
          console.error('ball ded');
          enemies.splice(enemies.indexOf(ball), 1);
          clearInterval(ball.interval);
        }

        if (enemies[index].currentPosition.x === pos.x 
            && enemies[index].currentPosition.y === pos.y && !player.jump) clearMonsters();
      }
    } else {
      if (ball.offset.x <= 9) {
        ball.offset.x += 3;
        ball.offset.y -= 3;
      } else {
        ball.offset.x += 2;
        ball.offset.y += 7;
      }
      if (ball.offset.x >= 19) {
        ball.offset.x = 0;
        ball.offset.y = 0;
        ball.currentPosition.x = x;
        ball.currentPosition.y = y;
        enemies[index] = ball;
        clearInterval(interval);

        if (y >= BOARD_SIZE) {
          console.error('ball ded');
          enemies.splice(enemies.indexOf(ball), 1);
          clearInterval(ball.interval);
        }

        if (enemies[index].currentPosition.x === pos.x 
            && enemies[index].currentPosition.y === pos.y && !player.jump) clearMonsters();
    }
  }}, 75);
}

function snakeBallMove(ball: enemy) {
  const x = ball.currentPosition.x + randStart();
  const y = ball.currentPosition.y + 1;
  const pos = getPlayerPosition();

  enemies[enemies.indexOf(ball)].squish = true;

  setTimeout(() => {
    enemies[enemies.indexOf(ball)].squish = false;
  }, 200);

  let interval = setInterval(() => {
    const index = enemies.indexOf(ball);
    if (x === ball.currentPosition.x) {
      if (ball.offset.x >= -9) {
        ball.offset.x -= 3;
        ball.offset.y -= 2;
      } else {
        ball.offset.x -= 2;
        ball.offset.y += 7;
      }
      if (ball.offset.x <= -20 && ball.offset.y >= 23) {
        ball.offset.x = 0;
        ball.offset.y = 0;
        ball.currentPosition.x = x;
        ball.currentPosition.y = y;
        ball.orinentation = 'up';
        enemies[index] = ball;
        clearInterval(interval);

        if (y === BOARD_SIZE - 1) {
          enemies[enemies.indexOf(ball)].type = 'snake';
          clearInterval(ball.interval);
          enemies[enemies.indexOf(ball)].interval = setInterval(() => 
            snakeMove(enemies[enemies.indexOf(ball)]), 1500);
        }

        if (enemies[index].currentPosition.x === pos.x 
            && enemies[index].currentPosition.y === pos.y && !player.jump) clearMonsters();
      }
    } else {
      if (ball.offset.x <= 9) {
        ball.offset.x += 3;
        ball.offset.y -= 3;
      } else {
        ball.offset.x += 2;
        ball.offset.y += 7;
      }
      if (ball.offset.x >= 19) {
        ball.offset.x = 0;
        ball.offset.y = 0;
        ball.currentPosition.x = x;
        ball.currentPosition.y = y;
        ball.orinentation = 'up';
        enemies[index] = ball;
        clearInterval(interval);

        if (y === BOARD_SIZE - 1) {
          enemies[enemies.indexOf(ball)].type = 'snake';
          clearInterval(ball.interval);
          enemies[enemies.indexOf(ball)].interval = setInterval(() => 
            snakeMove(enemies[enemies.indexOf(ball)]), 1500);
        }

        if (enemies[index].currentPosition.x === pos.x 
            && enemies[index].currentPosition.y === pos.y && !player.jump) clearMonsters();
      }
    }
  }, 75);
}

function snakeMove(snake: enemy) {
  let x = snake.currentPosition.x;
  let y = snake.currentPosition.y;
  const pos = player.currentPosition;

  if (x > pos.x) {
    if (y < pos.y) { y++; } 
    else { y--; x--; }
  } else if (x < pos.x) {
    if (y < pos.y) { y++; x++;} 
    else { y--; }
  } else {
    if (y < pos.y) { y++; } 
    else { y--; }
  }

  if (y < snake.currentPosition.y && x === snake.currentPosition.x) {
      snake.orinentation = 'up';

      let interval = setInterval(() => {
        const index = enemies.indexOf(snake);

        if (snake.offset.y >= -30) {
          snake.offset.x += 3;
          snake.offset.y -= 7;
        } else {
          snake.offset.x += 3;
          snake.offset.y += 4;
        }

        if (snake.offset.x >= 20 && snake.offset.y <= -23) {
          snake.offset.x = 0;
          snake.offset.y = 0;
          snake.currentPosition.y--;
          enemies[index] = snake;
          clearInterval(interval);
          snakeHelper(index, x, y, pos);
        }
      }, 75)
  } else if (y < snake.currentPosition.y) {
      snake.orinentation = 'left';

      let interval = setInterval(() => {
        const index = enemies.indexOf(snake);

        if (snake.offset.x >= -15) {
          snake.offset.x -= 3;
          snake.offset.y -= 6;
        } else {
          snake.offset.x -= 2;
          snake.offset.y += 4;
        }

        if (snake.offset.x <= -17) {
          snake.offset.x = 0;
          snake.offset.y = 0;
          snake.currentPosition.y--;
          snake.currentPosition.x--;
          enemies[index] = snake;
          clearInterval(interval);
          snakeHelper(index, x, y, pos);
        }
      }, 75)
  } else if (y > snake.currentPosition.y && x === snake.currentPosition.x) {
      snake.orinentation = 'down';

      let interval = setInterval(() => {
        const index = enemies.indexOf(snake);

        if (snake.offset.x >= -9) {
          snake.offset.x -= 3;
          snake.offset.y -= 2;
        } else {
          snake.offset.x -= 2;
          snake.offset.y += 7;
        }

        if (snake.offset.x <= -20 && snake.offset.y > 23) {
          snake.offset.x = 0;
          snake.offset.y = 0;
          snake.currentPosition.y++;
          enemies[index] = snake;
          clearInterval(interval);
          snakeHelper(index, x, y, pos);
        }
      }, 75)
  } else {
      snake.orinentation = 'right';

      let interval = setInterval(() => {
        const index = enemies.indexOf(snake);

        if (snake.offset.x <= 9) {
          snake.offset.x += 3;
          snake.offset.y -= 2;
        } else {
          snake.offset.x += 2;
          snake.offset.y += 7;
        }

        if (snake.offset.x >= 19) {
          snake.offset.x = 0;
          snake.offset.y = 0;
          snake.currentPosition.y++;
          snake.currentPosition.x++;
          enemies[index] = snake;
          clearInterval(interval);
          snakeHelper(index, x, y, pos);
        }
      }, 75);
  }
}

function snakeHelper(index: number, x: number, y: number, pos: position) {
  if (x >= BOARD_SIZE + DISC_OFFSET || x < 0 || y < 0 || y >= BOARD_SIZE ||
      board[y][x] === null || board[y][x]!.isDisc === true) {
    console.log('snek ded');
    clearInterval(enemies[index].interval);
    enemies.splice(index, 1);
  }

  if (x === pos.x && y === pos.y && !player.jump) clearMonsters();
};

function randStart() {
  const num = Math.floor(Math.random() * 2);
  console.log(num)
  return num;
};

function doesSnakeExist(): boolean {
  let check = false;

  enemies.map((val) => {
    if (val.type === 'snake-ball' || val.type === 'snake') 
      check = true
  });
      
  return check;
}

export function monsterSpawner() {
  if (enemies.length === 0)
    spawnBall();
  else if (!doesSnakeExist())
    spawnSnake();
  else if (enemies.length < 3)
    spawnBall();
}

export function enemyOnPosition(x: number, y: number): string {
  let e = '';

  enemies.map((enemy) => {
    if (enemy.currentPosition.x === x && enemy.currentPosition.y === y)
      switch (enemy.type) {
        case 'snake':
          e = 's';
          break;
        case 'snake-ball':
          e = 'B';
          break;
        case 'ball':
          e = 'b';
          break;
        default:
          break;
      };
  });

  return e;
}

export function clearMonsters() {
  clearInterval(monsterInterval);
  unset(); 

  enemies.map((enemy) => {
    clearInterval(enemy.interval);
  });

  toggleDed();

  setTimeout(() => {
    enemies = [];
    toggleDed();

    setInter();
    setKeyboard();
    hurt();
  }, 2000);
}

export function silentClear() {
  clearInterval(monsterInterval);
  unset(); 

  enemies.map((enemy) => {
    clearInterval(enemy.interval);
  });

  setTimeout(() => {
    enemies = [];
    setInter();
    setKeyboard();
    hurt();
  }, 2000);
}
