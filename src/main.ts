import { board, dumbRender } from './board';
import { player, moveUp, moveDown, moveLeft, moveRight } from './player';
import { monsterSpawner } from './enemy';
import { gameAnimation } from './canvas';
import { move } from './controls';

console.log(board);
console.log(player);
gameAnimation();

setInterval(monsterSpawner, 4000);

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
