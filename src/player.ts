import { board, BOARD_SIZE, DISC_OFFSET, disableDisc, paintTile } from './board';
import { endEvent } from './controls';
import { drawPlayer } from './canvas';

export type orinentation = 'up' | 'right' | 'left' | 'down';

interface player {
  currentPosition: position;
  points: number;
  lives: number;
  orinentation: orinentation;
  offset: position;
  jump: boolean;
  disk: number;
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
  lives: 3,
  orinentation: 'down',
  offset: {
    x: 0,
    y: 0
  },
  jump: false,
  disk: 0
};

export function orinentationToOffset(orinentation: orinentation): number {
  switch (orinentation) {
    case 'up':
      return 0;
    case 'right':
      return 1;
    case 'left':
      return 2;
    case 'down':
      return 3;
    default:
      return 0;
  }
}

export function moveUp() {
  player.jump = true;
  player.orinentation = 'up';

  let interval = setInterval(() => {
    if (player.offset.y >= -30) {
      player.offset.x += 3;
      player.offset.y -= 7;
    } else {
      player.offset.x += 3;
      player.offset.y += 4;
    }
    if (player.offset.x >= 20 && player.offset.y <= -23) {
      player.offset.x = 0;
      player.offset.y = 0;
      player.currentPosition.y--;
      player.jump = false;

      if (isPlayerDead()) {
        clearInterval(interval);
        player.lives--;
        player.currentPosition.y = 0;
        player.currentPosition.x = 1;
        window.alert("U DED");
        endEvent();
        return;
      }

      if (isOnDisc()) {
        player.disk = 2;
        discMove();
        clearInterval(interval);
        return;
      }

      paintTile(player.currentPosition.x, player.currentPosition.y);
      endEvent();
      clearInterval(interval);
    }
  }, 75);
}

export function moveDown() {
  if (player.jump) return;

  player.jump = true;
  player.orinentation = 'down';

  let interval = setInterval(() => {
    if (player.offset.x >= -9) {
      player.offset.x -= 3;
      player.offset.y -= 2;
    } else {
      player.offset.x -= 2;
      player.offset.y += 7;
    }
    if (player.offset.x <= -20 && player.offset.y >= 23) {
      player.offset.x = 0;
      player.offset.y = 0;
      player.currentPosition.y++;
      
      if (isPlayerDead()) {
        clearInterval(interval);
        player.lives--;
        player.currentPosition.y = 0;
        player.currentPosition.x = 1;
        window.alert("U DED");
        endEvent();
        return;
      }

      paintTile(player.currentPosition.x, player.currentPosition.y);
      player.jump = false;
      endEvent();
      clearInterval(interval);
    }
  }, 75);
}

export function moveLeft() {
  player.jump = true;
  player.orinentation = 'left';

  let interval = setInterval(() => {
    if (player.offset.x >= -15) {
      player.offset.x -= 3;
      player.offset.y -= 6;
    } else {
      player.offset.x -= 2;
      player.offset.y += 4;
    }
    if (player.offset.x <= -17) {
      player.offset.x = 0;
      player.offset.y = 0;
      player.currentPosition.y--;
      player.currentPosition.x--;
      player.jump = false;

      if (isPlayerDead()) {
        clearInterval(interval);
        player.currentPosition.y = 0;
        player.currentPosition.x = 1;
        window.alert("U DED");
        player.lives--;
        endEvent();
        return;
      }

      if (isOnDisc()) {
        player.disk = 1;
        discMove();
        clearInterval(interval);
        return;
      }

      paintTile(player.currentPosition.x, player.currentPosition.y);
      endEvent();
      clearInterval(interval);
    }
  }, 75);
}

export function moveRight() {
  player.jump = true;
  player.orinentation = 'right';

  let interval = setInterval(() => {
    if (player.offset.x <= 9) {
      player.offset.x += 3;
      player.offset.y -= 3;
    } else {
      player.offset.x += 2;
      player.offset.y += 7;
    }
    if (player.offset.x >= 19) {
      player.offset.x = 0;
      player.offset.y = 0;
      player.currentPosition.y++;
      player.currentPosition.x++;

      if (isPlayerDead()) {
        clearInterval(interval);
        player.lives--;
        player.currentPosition.y = 0;
        player.currentPosition.x = 1;
        window.alert("U DED");
        endEvent();
        return;
      }

      player.jump = false;
      paintTile(player.currentPosition.x, player.currentPosition.y);
      endEvent();
      clearInterval(interval);
    }
  }, 75);
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
  let interval = setInterval(() => {
    if (player.disk === 1) {
      player.offset.x += 3;
      player.offset.y -= 3;
    } else {
      player.offset.x -= 3;
      player.offset.y -= 3;
    }

    if (player.offset.y <= -95) {
      clearInterval(interval)

      player.offset.y += 3;

      setTimeout(() => {
        player.offset.y += 3;
      }, 75)

      setTimeout(() => {
        player.offset.y += 3;

        endEvent();
        disableDisc(player.currentPosition.x);
        player.currentPosition.x = 1;
        player.currentPosition.y = 0;
        player.offset.x = 0;
        player.offset.y = 0;
        player.disk = 0;
        drawPlayer();
      }, 75)
    }
  }, 75);
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
