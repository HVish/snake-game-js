import Frame from './Frame';
import { getRandomInt } from './utils';

type CellPosition = [x: number, y: number];

interface CellOptions {
  fillStyle?: string;
  clear?: boolean;
}

enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export default class Snake {
  public static instance: Snake | undefined;

  public static create(ctx: CanvasRenderingContext2D) {
    if (Snake.instance) return Snake.instance;
    return new Snake(ctx);
  }

  private ctx: CanvasRenderingContext2D;

  private direction: Direction = Direction.EAST;

  /** x, y co-ordinate index */
  public food: CellPosition = [-1, -1];

  private body: CellPosition[] = [
    [4, 1], // head
    [3, 1],
    [2, 1],
    [1, 1], // tail
  ];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public drawCell(_x: number, _y: number, options?: CellOptions) {
    const x = Frame.getXCoordinate(_x) + 2;
    const y = Frame.getXCoordinate(_y) + 2;
    const size = Frame.unit - 4;

    if (options?.clear) {
      // to clear a rectangle fill it with background color
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(x, y, size, size);
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(x, y, size, size);
      return;
    }

    // outer rectangle
    this.ctx.fillStyle = options?.fillStyle || 'rgba(0, 255, 0, 0.8)';
    this.ctx.fillRect(x, y, size, size);
  }

  public draw() {
    const [foodX, foodY] = this.food;

    if (foodX === -1 && foodY === -1) {
      // create new food
      this.makeFood();
    } else {
      // repaint food at same position
      this.makeFood(foodX, foodY);
    }

    this.body.forEach(([x, y]) => {
      this.drawCell(x, y);
    });
  }

  private addCell(x: number, y: number) {
    this.body.unshift([x, y]);
    this.drawCell(x, y);
  }

  private makeFood(_x?: number, _y?: number) {
    const x = _x !== undefined ? _x : getRandomInt(Frame.MIN_X + 1, Frame.MAX_X - 1);
    const y = _y !== undefined ? _y : getRandomInt(Frame.MIN_Y + 1, Frame.MAX_Y - 1);

    this.food = [x, y];

    this.drawCell(x, y, {
      fillStyle: 'rgba(255, 255, 0, 0.8)',
    });
  }

  private getNextHead(): CellPosition {
    const [headX, headY] = this.body[0];
    switch (this.direction) {
      case Direction.EAST:
        return [headX + 1, headY];
      case Direction.WEST:
        return [headX - 1, headY];
      case Direction.NORTH:
        return [headX, headY - 1];
      case Direction.SOUTH:
        return [headX, headY + 1];
      default:
        return [headX, headY];
    }
  }

  /**
   * Eat food if available,
   * also create another food if ate food.
   */
  private eatFoodIfAvailable() {
    const [foodX, foodY] = this.food;
    const [headX, headY] = this.body[0];

    if (headX === foodX && headY === foodY) {
      this.addCell(...this.getNextHead());
      this.makeFood();
    }
  }

  /** used to enable/disable turning */
  private canTurn = false;

  public move() {
    // make head cell as normal body cell
    const [headX, headY] = this.body[0];
    this.drawCell(headX, headY, { clear: true });
    this.drawCell(headX, headY);

    // clear tail cell
    const [tailX, tailY] = this.body.pop()!;
    this.drawCell(tailX, tailY, { clear: true });

    const [nextHeadX, nextHeadY] = this.getNextHead();
    this.addCell(nextHeadX, nextHeadY);

    this.eatFoodIfAvailable();

    // enable turning again
    this.canTurn = true;
  }

  public turn(side: 'left' | 'right' | 'up' | 'down') {
    if (!this.canTurn) return;

    const turnMap = {
      [Direction.NORTH]: {
        left: Direction.WEST,
        right: Direction.EAST,
        up: Direction.NORTH, // no turning
        down: Direction.NORTH, // no turning
      },
      [Direction.EAST]: {
        up: Direction.NORTH,
        down: Direction.SOUTH,
        left: Direction.EAST, // no turning
        right: Direction.EAST, // no turning
      },
      [Direction.SOUTH]: {
        left: Direction.WEST,
        right: Direction.EAST,
        up: Direction.SOUTH, // no turning
        down: Direction.SOUTH, // no turning
      },
      [Direction.WEST]: {
        up: Direction.NORTH,
        down: Direction.SOUTH,
        left: Direction.WEST, // no turning
        right: Direction.WEST, // no turning
      },
    };

    const newDirection = turnMap[this.direction][side];

    if (this.direction !== newDirection) {
      this.direction = newDirection;
      // disable turning until next move
      this.canTurn = false;
    }
  }
}
