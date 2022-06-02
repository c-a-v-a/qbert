import { board } from './board';
import type { tile } from './board';
import { player, orinentationToOffset } from './player';
import { enemies } from './enemy';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const spritesheet = document.getElementById('spritesheet') as HTMLImageElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
export let diskInterval: number;
export let playerTitleInterval: number;
export let changeInterval: number;

let fpsInterval: number;
let then: number;
let startTime: number;
let elapsed: number;
let now: number;
let diskState = 0;
let playerTitleState = 0;
let changeState = 0;

function drawBackground() {
  ctx.fillRect(0, 0, 420, 300);
}

function drawMap() {
  board.map((row, iR) => {
    row.map((tile, iT) => {
      if (tile === null) return;
      if (tile.isDisc === true) {
        drawDisk(tile, iT);
        return;
      }
      if (tile.painted) {
        ctx.drawImage(spritesheet, 40, 124, 40, 32, tileXOffset(iR, iT), tileYOffset(iR), 40, 32)
      } else {
        ctx.drawImage(spritesheet, 0, 124, 40, 32, tileXOffset(iR, iT), tileYOffset(iR), 40, 32)
      }
    });
  });
}

function drawDisk(disk: tile, iT: number) {
  if (disk.available) {
    if (iT === 0) {
      if (player.disk === 1)
        ctx.drawImage(spritesheet, 24 * diskState, 104, 24, 13, 40 + player.offset.x + 7, 105 + player.offset.y - 7, 24, 13)
      else
        ctx.drawImage(spritesheet, 24 * diskState, 104, 24, 13, 40, 105, 24, 13)
    }
    else {
      if (player.disk === 2)
        ctx.drawImage(spritesheet, 24 * diskState, 104, 24, 13, 255 + player.offset.x - 7, 105 + player.offset.y - 7, 24, 13)
      else
        ctx.drawImage(spritesheet, 24 * diskState, 104, 24, 13, 255, 105, 24, 13)
    }
  }
}

function drawPlayerTitle() {
  ctx.drawImage(spritesheet, 78 * playerTitleState, 156, 78, 13, 15, 10, 78, 13);
}

function drawLevel() {
  ctx.drawImage(spritesheet, 0, 191, 62, 21, 250, 35, 62, 21);
}

function drawChange() {
  ctx.drawImage(spritesheet, 0, 183, 76, 8, 10, 40, 76, 8);
  ctx.drawImage(spritesheet, 80 * changeState, 169, 80, 14, 10, 55, 80, 14);
}

function drawLives() {
  if (player.lives > 1)
    ctx.drawImage(spritesheet, 0, 213, 14, 13, 10, 75, 14, 13);

  if (player.lives > 2)
    ctx.drawImage(spritesheet, 0, 213, 14, 13, 10, 90, 14, 13);
}

function tileXOffset(iR: number, iT: number): number {
  const horizontalOffset = 20;
  const columnOffset = 20;
  const rowOffset = (5 - iR) * horizontalOffset;
  const tileOffset = iT * 40;

  return rowOffset + tileOffset;
}

function tileYOffset(iR: number) {
  const verticalOffset = 25;
  const rowOffset = 23;

  return verticalOffset + 23 * iR;
}

export function drawPlayer() {
  const x = tileXOffset(player.currentPosition.y, player.currentPosition.x) + 9;
  const y = tileYOffset(player.currentPosition.y) - 9;
  
  if (player.jump)
    ctx.drawImage(spritesheet, 84 + 21 * orinentationToOffset(player.orinentation), 83, 21, 20, x + player.offset.x, y + player.offset.y, 21, 20);
  else
    ctx.drawImage(spritesheet, 21 * orinentationToOffset(player.orinentation), 83, 21, 20, x + player.offset.x, y + player.offset.y, 21, 20);
}

function drawEnemies() {
  enemies.map((enemy) => {
    const x = tileXOffset(enemy.currentPosition.y, enemy.currentPosition.x) + 9;
    const y = tileYOffset(enemy.currentPosition.y) - 9;

    if (enemy.type === 'ball')
      ctx.drawImage(spritesheet, 0, 0, 20, 20, x + 1 + enemy.offset.x, y + 2 + enemy.offset.y, 20, 20)
    else if (enemy.type === 'snake-ball')
      ctx.drawImage(spritesheet, 0, 21, 22, 22, x + enemy.offset.x, y + enemy.offset.y, 22, 22)
    else if (enemy.orinentation) {
      if (enemy.offset.x !== 0 || enemy.offset.y !== 0)
        ctx.drawImage(spritesheet, 22 * orinentationToOffset(enemy.orinentation) + 88, 43, 22, 40, x + enemy.offset.x, y - 17 + enemy.offset.y, 22, 40)
      else
        ctx.drawImage(spritesheet, 22 * orinentationToOffset(enemy.orinentation), 43, 22, 40, x + enemy.offset.x, y - 17 + enemy.offset.y, 22, 40)
    }
  });
}

function rotateDisk() {
  if (diskState === 7) diskState = 0;
  else diskState++;
}

function animatePlayerTitle() {
  if (playerTitleState === 4) playerTitleState = 0;
  else playerTitleState++;
}

function animateChange() {
  if (changeState === 2) changeState = 0;
  else changeState++;
}

export function gameAnimation() {
  fpsInterval = 20;
  then = Date.now();
  startTime = then;
  animate();
  diskInterval = setInterval(rotateDisk, 100);
  playerTitleInterval = setInterval(animatePlayerTitle, 200);
  changeInterval = setInterval(animateChange, 1500);
}

function animate() {
  window.requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now = (elapsed % fpsInterval);

    drawBackground();
    drawMap();
    drawPlayerTitle();
    drawLevel();
    drawChange();
    drawChange();
    drawLives();

    drawPlayer();
    drawEnemies();
  }
}
