import Frame from './Frame';

type BodyCellPosition = [x: number, y: number];

interface CellOptions {
  fill?: boolean;
  clear?: boolean;
}

enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export default class Snake {
  private length = 4;

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

  private drawCell(_x: number, _y: number, options: CellOptions) {
    const x = Frame.getXCoordinate(_x) + 1;
    const y = Frame.getXCoordinate(_y) + 1;
    const size = Frame.unit - 1;

    if (options.clear) {
      // to clear a rectangle fill it with background color
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(x, y, size, size);
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(x, y, size, size);
      return;
    }

    /** stroke width */
    const sw = 2;

    // outer rectangle
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    this.ctx.fillRect(x, y, size, size);

    // // inner rectangle
    // this.ctx.fillStyle = '#000';
    // this.ctx.fillRect(x + sw, y + sw, Frame.unit - 2 * sw, Frame.unit - 2 * sw);
  }

  public draw() {
    this.body.forEach(([x, y], index) => {
      this.drawCell(x, y, { fill: index === 0 });
    });
  }

  private addCell(x: number, y: number) {
    this.body.unshift([x, y]);
    this.drawCell(x, y, { fill: true });
  }

  /** used to enable/disable turning */
  private canTurn = false;

  public move() {
    // make head cell as normal body cell
    const [headX, headY] = this.body[0];
    this.drawCell(headX, headY, { clear: true });
    this.drawCell(headX, headY, { fill: false });

    // clear tail cell
    const [tailX, tailY] = this.body.pop()!;
    this.drawCell(tailX, tailY, { clear: true });

    switch (this.direction) {
      case Direction.EAST:
        this.addCell(headX + 1, headY);
        break;
      case Direction.WEST:
        this.addCell(headX - 1, headY);
        break;
      case Direction.NORTH:
        this.addCell(headX, headY - 1);
        break;
      case Direction.SOUTH:
        this.addCell(headX, headY + 1);
        break;
    }

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
