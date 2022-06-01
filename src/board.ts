import { addPoints, getPlayerPosition } from './player';
import { enemies, enemyOnPosition } from './enemy';

export type board = Array<Array<tile|null>>;

interface tile {
  painted: boolean;
  isDisc: boolean;
  available?: boolean;
};

export const BOARD_SIZE = 7;
export const DISC_OFFSET = 2;

export let board: board = generateBoard();

function generateBoard(): board {
  const board: board = new Array(BOARD_SIZE);

  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = new Array(BOARD_SIZE + DISC_OFFSET).fill(null);
    
    for (let j = 0; j <= i; j++) {
      board[i][j + 1] = { painted: false, isDisc: false };
    }
  }

  board[3][0] = { painted: false, isDisc: true, available: true };
  board[3][5] = { painted: false, isDisc: true, available: true };

  return board;
}

export function paintTile(x: number, y: number) {
  const tile = board[y][x];

  if (tile === null) return;
  if (!tile.painted && !tile.isDisc) {
    board[y][x]!.painted = true;
    addPoints();
  }
}

export function isWon() {
  let won = true;

  board.map((row) => {
    row.map((tile) => {
      if (tile !== null && !tile.isDisc)
        if (tile.painted === false) won = false;
    });
  });

  return won;
}

export function disableDisc(x: number) {
  board[3][x]!.available = false;
}

export function dumbRender() {
  setInterval(() => {
    const b = document.getElementById('board') as HTMLDivElement;
    const pos = getPlayerPosition();
    b.innerHTML = '';

    board.map((row, iR) => {
      const p = document.createElement('p');
      let str = '';

      row.map((tile, iT) => {
        const e = enemyOnPosition(iT, iR);
        if (pos.y === iR && pos.x === iT) str += ' Q '
        else if (e !== '') str += ` ${e} `;
        else if (tile === null) str += '   ';
        else if (tile?.isDisc === true && tile.available === true) str += ' d ';
        else if (tile?.isDisc === false) str += ' _ ';
        else str += '   ';
      })

      p.innerText = str;

      b.appendChild(p);
    });
  }, 300)
}
