import Frame from './Frame';
import Snake from './Snake';
import { getRandomInt, windowBounds } from './utils';

type SpeedFactor = 1 | 2 | 3 | 4;

export default class Game {
  private static instance: Game | undefined;

  public static init() {
    if (Game.instance) return Game.instance;
    return new Game();
  }

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private frame: Frame;
  private snake: Snake;

  private foodPos = { x: -1, y: -1 };

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
    this.snake = Snake.create(this.ctx);

    this.draw();

    window.addEventListener('resize', this.draw);
    window.addEventListener('keydown', this.handleKeyPress, true);
  }

  private draw = () => {
    const { width, height } = windowBounds();

    this.canvas.setAttribute('width', width.toString());
    this.canvas.setAttribute('height', height.toString());

    this.frame.draw();
    this.snake.draw();

    if (this.foodPos.x !== -1 && this.foodPos.y !== -1) {
      this.createFood(this.foodPos.x, this.foodPos.y);
    }
  };

  private createFood(_x?: number, _y?: number) {
    this.foodPos.x = _x !== undefined ? _x : getRandomInt(Frame.MIN_X + 1, Frame.MAX_X - 1);
    this.foodPos.y = _y !== undefined ? _y : getRandomInt(Frame.MIN_Y + 1, Frame.MAX_Y - 1);

    this.snake.drawCell(this.foodPos.x, this.foodPos.y, {
      fillStyle: 'rgba(255, 255, 0, 0.8)',
    });
  }

  private speedFactor: SpeedFactor = 1;
  private timer: NodeJS.Timeout | undefined = undefined;

  public play() {
    if (this.timer) return;

    // create food
    if (this.foodPos.x === -1) {
      this.createFood();
    }

    this.timer = setInterval(() => {
      const ateFood = this.snake.move(this.foodPos);
      if (ateFood) {
        this.createFood();
      }
    }, 200 - 100 * this.speedFactor);
  }

  public pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private togglePause() {
    if (this.timer) {
      this.pause();
    } else {
      this.play();
    }
  }

  public handleKeyPress = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (e.code) {
      case 'ArrowRight':
        this.play();
        this.snake.turn('right');
        break;
      case 'ArrowLeft':
        this.play();
        this.snake.turn('left');
        break;
      case 'ArrowUp':
        this.play();
        this.snake.turn('up');
        break;
      case 'ArrowDown':
        this.play();
        this.snake.turn('down');
        break;
      case 'Space':
        this.togglePause();
        break;
      default:
        break;
    }

    // Cancel the default action to avoid it being handled twice
    e.preventDefault();
  };
}
