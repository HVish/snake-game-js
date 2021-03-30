export type CellPosition = [x: number, y: number];
export const cellPositionHash = (cell: CellPosition) => cell.join();

export default class Frame {
  public static readonly unit = 20;

  public static OFFSET_X = 0;
  public static OFFSET_Y = 0;

  public static MIN_X = 0;
  public static MAX_X = 0;

  public static MIN_Y = 0;
  public static MAX_Y = 0;

  public static occupiedCellMap: { [cellPositionHash: string]: boolean } = {};

  private static instance: Frame | undefined = undefined;

  public static create(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    if (Frame.instance) return Frame.instance;
    return new Frame(ctx, canvasWidth, canvasHeight);
  }

  public static getXCoordinate(x: number) {
    return x * Frame.unit + Frame.OFFSET_X;
  }

  public static getYCoordinate(y: number) {
    return y * Frame.unit + Frame.OFFSET_Y;
  }

  private ctx: CanvasRenderingContext2D;

  /** canvas width */
  private canvasWidth: number;
  /** canvas height */
  private canvasHeight: number;

  /** frame painting width */
  public frameWidth = 0;
  /** frame painting height */
  public frameHeight = 0;

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  public draw() {
    const width = this.canvasWidth;
    const height = this.canvasHeight;

    // draw main reactangle
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, width, height);

    const minPadding = Frame.unit;

    // frame width should be integral multiple of Frame.unit
    Frame.MAX_X = Math.floor((width - 2 * minPadding) / Frame.unit) - 1; // zero based index
    this.frameWidth = (Frame.MAX_X + 1) * Frame.unit;

    // frame height should be integral multiple of Frame.unit
    Frame.MAX_Y = Math.floor((height - 2 * minPadding) / Frame.unit) - 1; // zero based index
    this.frameHeight = (Frame.MAX_Y + 1) * Frame.unit;

    Frame.OFFSET_X = (width - this.frameWidth) / 2;
    Frame.OFFSET_Y = (width - this.frameWidth) / 2;

    // borders
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(Frame.OFFSET_X, Frame.OFFSET_Y, this.frameWidth, this.frameHeight);

    this.makeBorderWall();
  }

  private drawBrick([_x, _y]: CellPosition) {
    const x = Frame.getXCoordinate(_x);
    const y = Frame.getYCoordinate(_y);

    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    this.ctx.fillRect(x, y, Frame.unit, Frame.unit);
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(x, y, Frame.unit, Frame.unit);

    Frame.occupiedCellMap[cellPositionHash([_x, _y])] = true;
  }

  private makeBorderWall() {
    for (let x = 0; x <= Frame.MAX_X; x++) {
      this.drawBrick([x, 0]); // top wall
      this.drawBrick([x, Frame.MAX_Y]); // bottom wall
    }

    for (let y = 1; y < Frame.MAX_Y; y++) {
      this.drawBrick([0, y]); // left wall
      this.drawBrick([Frame.MAX_X, y]); // right wall
    }
  }
}
