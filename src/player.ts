import { board, BOARD_SIZE, DISC_OFFSET, disableDisc } from './board';

interface player {
  currentPosition: position;
  points: number;
};

export interface position {
  x: number;
  y: number;
};

export let player: player = {
  currentPosition: {
    x: 1,
    y: 0
  },
  points: 0,
};

export function moveUp() {
  player.currentPosition.y--;
}

export function moveDown() {
  player.currentPosition.y++;
}

export function moveLeft() {
  player.currentPosition.x--;
  player.currentPosition.y--;
}

export function moveRight() {
  player.currentPosition.x++;
  player.currentPosition.y++;
}

export function isPlayerDead(): boolean {
  const x = player.currentPosition.x;
  const y = player.currentPosition.y;

  if (x >= BOARD_SIZE + DISC_OFFSET || x < 0 
    || y < 0 || y >= BOARD_SIZE) return true;

  if (board[y][x] === null ||
      (board[y][x]?.isDisc === true && board[y][x]?.available === false))
    return true;

  return false;
}

export function isOnDisc(): boolean {
  const x = player.currentPosition.x;
  const y = player.currentPosition.y;

  return (board[y][x]?.isDisc === true && board[y][x]?.available === true)
}

export function discMove() {
  disableDisc(player.currentPosition.x);

  player.currentPosition.x = 1;
  player.currentPosition.y = 0;
}

export function addPoints() {
  player.points += 25;
}

export function getPlayerPosition(): position {
  return {
    x: player.currentPosition.x,
    y: player.currentPosition.y
  };
}
