import './styles.scss';
import { windowBounds } from './utils';

function getGameBoard() {
  const board = document.querySelector<HTMLCanvasElement>('#game-board');

  if (!board) {
    throw new Error('Game board not found!');
  }

  const { width, height } = windowBounds();

  board.setAttribute('width', width.toString());
  board.setAttribute('height', height.toString());

  return board;
}

function paintGameBoard() {
  const board = getGameBoard();
  const ctx = board.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to get 2d context!');
  }

  const { width, height } = windowBounds();

  // draw main reactangle
  ctx.fillStyle = 'rgba(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // borders
  const pad = 14;
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(pad, pad, width - 2 * pad, height - 2 * pad);
}

function resize() {
  console.log('Window resized! Repainting canvas');
  paintGameBoard();
}

export function main() {
  paintGameBoard();
  window.addEventListener('resize', resize);
}

main();
