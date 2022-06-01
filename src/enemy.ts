import type { position } from './player';
import { getPlayerPosition } from './player';
import { BOARD_SIZE, DISC_OFFSET, board } from './board';

interface enemy {
  currentPosition: position;
  type: enemyType;
  interval: number;
};

type enemyType = 'snake'|'snake-ball'|'ball';

export let enemies: Array<enemy> = [];

function spawnSnake() {
  const newSnake: enemy = {
    currentPosition: {
      y: 1,
      x: randStart()
    },
    type: 'snake-ball',
    interval: 0
  };

  enemies.push(newSnake);

  newSnake.interval = setInterval(() => snakeBallMove(newSnake), 1500);
}

function spawnBall() {
  const ball: enemy = {
    currentPosition: {
      y: 1,
      x: randStart()
    },
    type: 'ball',
    interval: 0
  };

  enemies.push(ball);

  ball.interval = setInterval(() => ballMove(ball), 1500);
}

function ballMove(ball: enemy) {
  const x = ball.currentPosition.x + randStart() - 1;
  const y = ball.currentPosition.y + 1;
  const pos = getPlayerPosition();

  enemies[enemies.indexOf(ball)].currentPosition.x = x;
  enemies[enemies.indexOf(ball)].currentPosition.y = y;

  if (y >= BOARD_SIZE) {
    console.error('ball ded');
    enemies.splice(enemies.indexOf(ball), 1);
    clearInterval(ball.interval);
  }

  if (x === pos.x && y === pos.y) window.alert('player ded');
}

function snakeBallMove(ball: enemy) {
  const x = ball.currentPosition.x + randStart() - 1;
  const y = ball.currentPosition.y + 1;
  const pos = getPlayerPosition();

  enemies[enemies.indexOf(ball)].currentPosition.x = x;
  enemies[enemies.indexOf(ball)].currentPosition.y = y;

  if (y === BOARD_SIZE - 1) {
    enemies[enemies.indexOf(ball)].type = 'snake';
    clearInterval(ball.interval);
    enemies[enemies.indexOf(ball)].interval = setInterval(() => 
      snakeMove(enemies[enemies.indexOf(ball)]), 1500);
  }

  if (x === pos.x && y === pos.y) window.alert('player ded');
}

function snakeMove(snake: enemy) {
  let x = snake.currentPosition.x;
  let y = snake.currentPosition.y;
  const pos = getPlayerPosition();

  if (pos.x < x) {
    if (pos.y > y) {
      y++;
    } else {
      y--;
      x--;
    }
  } else if (pos.x > x) {
    if (pos.y > y) {
      y--;
    } else {
      y++;
      x++;
    }
  } else {
    if (pos.y > y) {
      y++;
    } else {
      y--;
    }
  }

  const i = enemies.indexOf(snake);
  enemies[i].currentPosition.x = x;
  enemies[i].currentPosition.y = y;

  if (x >= BOARD_SIZE + DISC_OFFSET || x < 0 || y < 0 || y >= BOARD_SIZE ||
      board[y][x] === null || board[y][x]!.isDisc === true) {
    console.log('snek ded');
    clearInterval(enemies[i].interval);
    enemies.splice(i, 1);
  }

  if (x === pos.x && y === pos.y) window.alert('player ded');
}

function randStart() {
  const num = Math.floor(Math.random() * (10));

  return num > 5 ? 1 : 2;
}

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
