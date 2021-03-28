import Frame from './Frame';

type BodyCellPosition = [x: number, y: number];

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

  private body: BodyCellPosition[] = [
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
    this.body.forEach(([x, y]) => {
      this.drawCell(x, y);
    });
  }

  private addCell(x: number, y: number) {
    this.body.unshift([x, y]);
    this.drawCell(x, y);
  }

  /** used to enable/disable turning */
  private canTurn = false;

  public move(foodPos: { x: number; y: number }) {
    // make head cell as normal body cell
    const [headX, headY] = this.body[0];
    this.drawCell(headX, headY, { clear: true });
    this.drawCell(headX, headY);

    // clear tail cell
    const [tailX, tailY] = this.body.pop()!;
    this.drawCell(tailX, tailY, { clear: true });

    let ateFood = false;

    switch (this.direction) {
      case Direction.EAST: {
        const x = headX + 1;
        this.addCell(x, headY);
        if (x === foodPos.x && headY === foodPos.y) {
          this.addCell(x + 1, headY);
          ateFood = true;
        }
        break;
      }
      case Direction.WEST: {
        const x = headX - 1;
        this.addCell(x, headY);
        if (x === foodPos.x && headY === foodPos.y) {
          this.addCell(x - 1, headY);
          ateFood = true;
        }
        break;
      }
      case Direction.NORTH: {
        const y = headY - 1;
        this.addCell(headX, y);
        if (headX === foodPos.x && y === foodPos.y) {
          this.addCell(headX, y - 1);
          ateFood = true;
        }
        break;
      }
      case Direction.SOUTH: {
        const y = headY + 1;
        this.addCell(headX, y);
        if (headX === foodPos.x && y === foodPos.y) {
          this.addCell(headX, y + 1);
          ateFood = true;
        }
        break;
      }
    }

    // enable turning again
    this.canTurn = true;
    return ateFood;
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
