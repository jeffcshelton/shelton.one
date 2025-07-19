import { onMount, onCleanup } from "solid-js";

/**
 * The state of a single cell in the grid.
 */
export const enum CellState {
  DEAD = 0,
  ALIVE,
  DYING,
}

export class CellGrid {
  readonly width: number;
  readonly height: number;
  readonly area: number;

  readonly front: Uint8Array;
  readonly back: Uint8Array;

  useFront = false;

  constructor(width: number, height: number, old?: CellGrid | null) {
    this.width = width;
    this.height = height;
    this.area = width * height;

    this.front = new Uint8Array(this.area);

    if (old) {
      this.copy(old);
    } else {
      this.randomize(0.9);
    }

    this.back = new Uint8Array(this.front);
  }

  private randomize(live: number) {
    for (let i = 0; i < this.front.length; i++) {
      this.front[i] = Math.random() < live
        ? CellState.DEAD
        : CellState.ALIVE;
    }
  }

  private copy(src: CellGrid) {
    const srcArr = src.useFront ? src.front : src.back;
    const minWidth = Math.min(this.width, src.width);
    const minHeight = Math.min(this.height, src.height);

    let srcOffset = 0;
    let dstOffset = 0;

    for (let y = 0; y < minHeight; y++) {
      const srcRow = srcArr.subarray(srcOffset, srcOffset + minWidth);
      const dstRow = this.front.subarray(dstOffset, dstOffset + this.width);
      dstRow.set(srcRow, 0);

      // Generate new columns if necessary.
      if (this.width > src.width) {
        for (let x = src.width; x < this.width; x++) {
          dstRow[x] = Math.random() < 0.9
            ? CellState.DEAD
            : CellState.ALIVE;
        }
      }

      srcOffset += src.width;
      dstOffset += this.width;
    }

    // Generate new rows if necessary.
    if (this.height > src.height) {
      for (; srcOffset < this.area; srcOffset++) {
        this.front[srcOffset] = Math.random() < 0.9
          ? CellState.DEAD
          : CellState.ALIVE;
      }
    }
  }

  private active(): Uint8Array {
    return this.useFront ? this.front : this.back;
  }

  private inactive(): Uint8Array {
    return this.useFront ? this.back : this.front;
  }

  index(x: number, y: number): CellState | undefined {
    return this.inactive()[y * this.width + x];
  }

  set(x: number, y: number, state: CellState) {
    this.active()[y * this.width + x] = state;
  }

  neighbors(x: number, y: number) {
    let neighbors = 0;

    // Count all live neighbors of the cell (including itself) in a 3x3 square.
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        // If the neighboring cell is alive, increment the count.
        if (this.index(x + dx, y + dy) === CellState.ALIVE) {
          neighbors++;
        }
      }
    }

    // Account for over-counting a live self.
    if (this.index(x, y) === CellState.ALIVE) {
      neighbors--;
    }

    return neighbors;
  }

  swap() {
    this.useFront = !this.useFront;
  }
}

function conwayLife(grid: CellGrid, spawn: number) {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const neighbors = grid.neighbors(x, y);

      // Conway's Game of Life rules:
      // 1. Any live cell with fewer than two neighbors dies.
      // 2. Any live cell with two or three neighbors lives.
      // 3. Any live cell with more than three neighbors dies.
      // 4. Any dead cell with exactly three neighbors becomes live.

      let alive;
      switch (grid.index(x, y)) {
      case CellState.DEAD:
        alive = neighbors === 3;
        break;
      case CellState.ALIVE:
        alive = neighbors === 2 || neighbors === 3;
        break;
      }

      grid.set(x, y, alive ? CellState.ALIVE : CellState.DEAD);
    }
  }

  // Choose a random selection of cells to make live.
  const spawnCount = grid.area * spawn;

  for (let r = 0; r < spawnCount; r++) {
    const x = Math.floor(Math.random() * grid.width);
    const y = Math.floor(Math.random() * grid.height);

    grid.set(x, y, CellState.ALIVE);
  }

  grid.swap();
}

function brianBrain(grid: CellGrid) {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      // Brian's Brain rules:
      // 1. Any dead cell with exactly two neighbors becomes live.
      // 2. Any live cell becomes dying.
      // 3. Any dying cell becomes dead.

      switch (grid.index(x, y)) {
      case CellState.DEAD:
        const neighbors = grid.neighbors(x, y);
        grid.set(x, y, neighbors === 2 ? CellState.ALIVE : CellState.DEAD);
        break;
      case CellState.ALIVE:
        grid.set(x, y, CellState.DYING);
        break;
      case CellState.DYING:
        grid.set(x, y, CellState.DEAD);
        break;
      }
    }
  }

  grid.swap();
}

/**
 * Draws cells of the automaton onto the frame's image data buffer by directly
 * replacing old cells with new cells.
 *
 * @param cells - The array of cells defining the current grid state.
 * @param colors - The colors corresponding to each cell state.
 * @param frame - The image data buffer of the canvas.
 */
function renderReplace(
  grid: CellGrid,
  colors: Record<CellState, number[]>,
  frame: ImageData,
) {
  // The index in the image data of the current pixel.
  let px = 0;

  // Color each pixel according to whether the corresponding cell is alive.
  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++, px += 4) {
      const color = colors[grid.index(x, y)!];

      for (let c = 0; c < color.length; c++) {
        frame.data[px + c] = color[c];
      }
    }
  }
}

/**
 * Draws cells of the automaton onto the frame's image data buffer by blending
 * blending new and old cells.
 *
 * Specifically, non-dead cells replace any other cells, and dead cells decay
 * by gradually fading.
 *
 * @param cells - The array of cells defining the current grid state.
 * @param colors - The colors corresponding to each cell state.
 * @param frame - The image data buffer of the canvas.
 */
function renderDecay(
  grid: CellGrid,
  colors: Record<CellState, number[]>,
  frame: ImageData,
) {
  let px = 0;

  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++, px += 4) {
      const state = grid.index(x, y)!;
      const color = colors[state];

      for (let c = 0; c < 4; c++) {
        if (state === CellState.DEAD) {
          frame.data[px + c] = 0.9 * frame.data[px + c] + 0.1 * color[c];
        } else {
          frame.data[px + c] = color[c];
        }
      }
    }
  }
}

/**
 * Properties for an Automaton component.
 */
export type Props = {
  /** Additional classes to be applied. */
  class?: string,

  /** Color overrides for specified cell states. */
  colors?: Partial<Record<CellState, number[]>>,

  /** The rendering speed, in frames per second. */
  fps?: number,

  /** The update rule for the cells. */
  rule?: "conway" | "brian",

  /**
   * The cell rendering rule.
   */
  render?: "replace" | "decay",

  /**
   * The dimensions of the grid canvas, or "dynamic" for it to be automatically
   * determined based on layout size.
   */
  size?: [number, number] | "dynamic",

  /**
   * The rate, in percent of the total area per second, at which cells are
   * randomly selected to be made live.
   */
  spawnRate?: number,
};

const DEFAULT_COLORS = {
  [CellState.DEAD]: [255, 255, 255, 0],
  [CellState.ALIVE]: [255, 255, 255, 50],
  [CellState.DYING]: [127, 127, 127, 50],
};

/**
 * A component rendering a cellular automaton with defined rules.
 *
 * @param props - The properties of the component.
 */
export default function Automaton(props: Props) {
  const fps = props.fps !== undefined ? props.fps : 20;
  const frameRate = 1000.0 / fps;

  const spawnRate = props.spawnRate !== undefined ? props.spawnRate : 0.001;
  const spawnPerFrame = spawnRate / fps;

  let updateCells = conwayLife;
  if (props.rule === "brian") {
    updateCells = brianBrain;
  }

  let drawCells = renderReplace;
  if (props.render === "decay") {
    drawCells = renderDecay;
  }

  const colors = { ...DEFAULT_COLORS, ...props.colors };

  let dynamic = !props.size || props.size === "dynamic";
  let canvas!: HTMLCanvasElement;
  let frame: ImageData | null = null;

  onMount(() => {
    // Create a front and back buffer for the cells.
    const context = canvas.getContext("2d")!;
    context.imageSmoothingEnabled = false;

    let resizeObserver: ResizeObserver | undefined;
    let grid: CellGrid | null = null;

    let running = true;
    let lastTime = 0;

    // If the canvas size is dynamic:
    // - Upon detecting a resize event, resize the image buffer and cell grid.
    // - The first resize event will correspond to the original size.
    //
    // If the canvas size is static:
    // - Create a static image buffer and cell grid.
    // - No resize observer is necessary.
    if (dynamic) {
      const dpr = window.devicePixelRatio;
      context.scale(dpr, dpr);

      resizeObserver = new ResizeObserver(entries => {
        let { width, height } = entries[0].contentRect;
        width = Math.floor(width / dpr);
        height = Math.floor(height / dpr);

        canvas.width = width;
        canvas.height = height;

        if (width <= 0 || height <= 0) {
          frame = null;
          grid = null;
          return;
        }

        grid = new CellGrid(width, height, grid);
        frame = context.createImageData(width, height);
      });

      resizeObserver.observe(canvas);
    } else {
      const [width, height] = props.size as number[];

      frame = context.createImageData(width, height);
      grid = new CellGrid(width, height);
    }

    function tick(time: number) {
      // End the rendering loop if the component is dropped.
      if (!running) return;

      // Wait until the frame timing aligns with the frame rate.
      // Also wait until the first resize event has been captured.
      if (time - lastTime < frameRate || !frame || !grid) {
        requestAnimationFrame(tick);
        return;
      }

      lastTime = time;

      updateCells(grid, spawnPerFrame);
      drawCells(grid, colors, frame);

      // Push the image data onto the canvas.
      context.putImageData(frame, 0, 0);
      requestAnimationFrame(tick);
    }

    onCleanup(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      running = false;
    });

    // Start ticking the automaton.
    tick(0);
  });

  return <canvas
    class={props.class}
    ref={canvas}
    style="image-rendering: pixelated;"
  />;
}
