import Frame, { CellPosition, cellPositionHash } from './Frame';
import { getRandomInt } from './utils';

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

const eatAudio = new Audio('assets/eat.wav');
eatAudio.preload = 'auto';

const outAudio = new Audio('assets/out.wav');
outAudio.preload = 'auto';

const initialSnakeBody: CellPosition[] = [
  [4, 1], // head
  [3, 1],
  [2, 1],
  [1, 1], // tail
];

interface Callbacks {
  ateFood: () => void;
  killed: () => void;
}

export default class Snake {
  public static instance: Snake | undefined;

  public static create(ctx: CanvasRenderingContext2D, callbacks: Callbacks) {
    if (Snake.instance) return Snake.instance;
    return new Snake(ctx, callbacks);
  }

  private ctx: CanvasRenderingContext2D;

  private direction: Direction = Direction.EAST;

  /** x, y co-ordinate index */
  public food: CellPosition = [-1, -1];

  /** used to enable/disable turning */
  private canTurn = true;

  private body: CellPosition[] = [...initialSnakeBody];

  private callbacks: Callbacks;

  constructor(ctx: CanvasRenderingContext2D, callbacks: Callbacks) {
    this.ctx = ctx;
    this.callbacks = callbacks;
  }

  public reset() {
    // remove current snake body cells from Frame
    this.body.forEach((cell) => {
      this.drawCell(cell, { clear: true });
    });

    // remove food
    this.drawCell(this.food, { clear: true });

    this.canTurn = true;
    this.direction = Direction.EAST;

    this.food = [-1, -1];
    this.body = [...initialSnakeBody];

    // repaint
    this.draw();
  }

  public drawCell([_x, _y]: CellPosition, options?: CellOptions) {
    const cellHash = cellPositionHash([_x, _y]);

    const x = Frame.getXCoordinate(_x) + 2;
    const y = Frame.getXCoordinate(_y) + 2;
    const size = Frame.unit - 4;

    if (options?.clear) {
      // to clear a rectangle fill it with background color
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(x, y, size, size);
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(x, y, size, size);

      Frame.occupiedCellMap[cellHash] = false;
      return;
    }

    // outer rectangle
    this.ctx.fillStyle = options?.fillStyle || 'rgba(0, 255, 0, 0.8)';
    this.ctx.fillRect(x, y, size, size);

    Frame.occupiedCellMap[cellHash] = true;
  }

  public draw() {
    const [foodX, foodY] = this.food;

    if (foodX === -1 && foodY === -1) {
      // create new food
      this.makeFood();
    } else {
      // repaint food at same position
      this.makeFood(this.food);
    }

    this.body.forEach((cell) => {
      this.drawCell(cell);
    });
  }

  private addCell(cell: CellPosition) {
    this.body.unshift(cell);
    this.drawCell(cell);
  }

  private makeFood(cell?: CellPosition) {
    if (!cell) {
      /**
       * loop to ensure that new food position does not
       * coincide with any walls of snake's body cell position
       */
      do {
        cell = [
          getRandomInt(Frame.MIN_X + 1, Frame.MAX_X - 1), // x
          getRandomInt(Frame.MIN_Y + 1, Frame.MAX_Y - 1), // y
        ];
        this.food = cell;
      } while (Frame.occupiedCellMap[cellPositionHash(cell)]);
    }

    this.drawCell(this.food, {
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
      eatAudio.play();
      this.addCell(this.getNextHead());
      this.makeFood();
      this.callbacks.ateFood();
    }
  }

  private checkIfDead() {
    const [foodX, foodY] = this.food;
    const [headX, headY] = this.getNextHead();

    if (
      !(foodX === headX && foodY === headY) && // not food position
      Frame.occupiedCellMap[cellPositionHash([headX, headY])]
    ) {
      // snake is self-hit of hit to a wall
      this.kill();
      return true;
    }

    return false;
  }

  private kill() {
    outAudio.play();
    this.body.forEach((cell, index) => {
      this.drawCell(cell, { clear: true });
      if (index === 0) {
        // head
        this.drawCell(cell, { fillStyle: 'rgba(255, 0, 0, 0.5)' });
      } else {
        this.drawCell(cell, { fillStyle: 'rgba(110, 110, 110, 0.8)' });
      }
    });
    this.callbacks.killed();
  }

  public move() {
    const isDead = this.checkIfDead();
    if (isDead) return true;

    this.eatFoodIfAvailable();

    // clear tail cell
    const tailCell = this.body.pop()!;
    this.drawCell(tailCell, { clear: true });

    const nextCell = this.getNextHead();

    // make new head cell
    this.addCell(nextCell);

    // enable turning again
    this.canTurn = true;
    return isDead;
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
