import { player, isPlayerDead, isOnDisc, discMove } from './player';
import { board, isWon } from './board';

export let eventHappening: boolean = false;

export function endEvent() {
  eventHappening = false;
}

export function move(playerMove: () => void) {
  if (eventHappening) return;
  eventHappening = true;

  playerMove();

  if (isWon()) window.alert("YOU WON");
}
