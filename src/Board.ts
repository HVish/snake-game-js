import Frame from './Frame';
import { windowBounds } from './utils';

export default class GameBoard {
  private static instance: GameBoard | undefined;

  public static init() {
    if (GameBoard.instance) return GameBoard.instance;
    return new GameBoard();
  }

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private frame: Frame;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>('#game-board');

    if (!canvas) {
      throw new Error('Game board canvas not found!');
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Unable to get 2d context!');
    }

    this.ctx = ctx;
    this.canvas = canvas;
    this.frame = Frame.create(this.ctx);

    this.draw();
    window.addEventListener('resize', this.draw);
  }

  private draw = () => {
    const { width, height } = windowBounds();

    this.canvas.setAttribute('width', width.toString());
    this.canvas.setAttribute('height', height.toString());

    this.frame.draw();
  };
}
