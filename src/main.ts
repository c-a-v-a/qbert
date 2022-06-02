import { board } from './board';
import { player, moveUp, moveDown, moveLeft, moveRight } from './player';
import { monsterSpawner } from './enemy';
import { gameAnimation } from './canvas';
import { move } from './controls';

console.log(board);
console.log(player);
gameAnimation();

export let monsterInterval: number;
export let gameStarted = 0;

setTimeout(() => {
  gameStarted++;
  document.onkeydown = (event) => {
    const keyName = event.key;

    if (keyName === '1') {
      gameStarted++;
      setKeyboard();
      setInter();
    }
  }
}, 2000)

export function unset() {
  document.onkeydown = () => {};
}

export function setInter() {
  monsterInterval = setInterval(monsterSpawner, 3000);
}

export function removeInterval() {
  unset();
  clearInterval(monsterInterval);
  monsterInterval = -69;
}

export function setKeyboard() {
  document.onkeydown = (event) => {
    const keyName = event.key;

    switch (keyName) {
      case 'ArrowLeft':
        move(moveLeft);
        break;
      case 'ArrowRight':
        move(moveRight);
        break;
      case 'ArrowDown':
        move(moveDown);
        break;
      case 'ArrowUp':
        move(moveUp);
        break;
      default:
        break;
    }
  };
}
