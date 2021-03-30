import Frame from './Frame';
import Snake from './Snake';

enum GameLevel {
  ONE = 1,
  TWO,
  THREE,
  FOUR,
}

interface GameOptions {
  width: number;
  height: number;
  onScoreUpdate?: (score: number) => void;
  onPlay?: (score: number) => void;
  onPause?: () => void;
  onGameOver?: () => void;
}

export default class Game {
  private static instance: Game | undefined;

  public static init(options: GameOptions) {
    if (Game.instance) return Game.instance;
    return new Game(options);
  }

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private canvasWidth: number;
  private canvasHeight: number;

  private frame: Frame;
  private snake: Snake;

  private options: GameOptions;

  constructor(options: GameOptions) {
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
    this.options = options;

    this.canvasWidth = options.width;
    this.canvasHeight = options.height;

    this.frame = Frame.create(this.ctx, this.canvasWidth, this.canvasHeight);
    this.snake = Snake.create(this.ctx, {
      ateFood: this.incrementScore,
      killed: this.handleGameOver,
    });

    this.draw();

    window.addEventListener('resize', this.draw);
    window.addEventListener('keydown', this.handleKeyPress, true);
  }

  public draw = () => {
    this.canvas.setAttribute('width', this.canvasWidth.toString());
    this.canvas.setAttribute('height', this.canvasHeight.toString());
    this.frame.draw();
    this.snake.draw();
  };

  private score = 40;
  private level = GameLevel.ONE;
  private timer: NodeJS.Timeout | undefined = undefined;

  private shouldReset = false;

  private reset() {
    this.score = 40;
    this.level = GameLevel.ONE;
    this.snake.reset();
    this.shouldReset = false;
  }

  public play() {
    if (this.timer) return;

    if (this.shouldReset) this.reset();

    const delay = 250 - 50 * this.level;
    console.log({ delay, level: this.level });
    this.timer = setInterval(() => {
      const isDead = this.snake.move();
      if (isDead) {
        this.pause();
        this.options.onGameOver && this.options.onGameOver();
      }
    }, delay);

    this.options.onPlay && this.options.onPlay(this.score);
  }

  public pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      this.options.onPause && this.options.onPause();
    }
  }

  private togglePause() {
    if (this.timer) {
      this.pause();
    } else {
      this.play();
    }
  }

  public levelUp() {
    if (this.level < 5) {
      this.pause();
      this.level++;
      this.play();
    }
  }

  public incrementScore = () => {
    this.score += 10;
    this.options.onScoreUpdate && this.options.onScoreUpdate(this.score);

    if (this.score % 100 === 0) {
      this.levelUp();
    }
  };

  public handleGameOver = () => {
    this.shouldReset = true;
  };

  public handleKeyPress = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (e.code) {
      case 'ArrowRight':
        this.snake.turn('right');
        break;
      case 'ArrowLeft':
        this.snake.turn('left');
        break;
      case 'ArrowUp':
        this.snake.turn('up');
        break;
      case 'ArrowDown':
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
