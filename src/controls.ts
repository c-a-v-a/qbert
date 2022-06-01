import { player, isPlayerDead, isOnDisc, discMove } from './player';
import { paintTile, board, isWon } from './board';

export let eventHappening: boolean = false;

export function move(playerMove: () => void) {
  if (eventHappening) return;

  eventHappening = true;

  playerMove();
  if (isPlayerDead()) {
    window.alert("U DED");
    return;
  }

  if (isOnDisc()) discMove();

  paintTile(player.currentPosition.x, player.currentPosition.y);
  if (isWon()) window.alert("YOU WON");

  console.log(player, board);

  eventHappening = false;
}
