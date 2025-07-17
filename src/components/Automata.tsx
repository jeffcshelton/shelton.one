import { onMount, onCleanup } from "solid-js";

/**
 * The state of a single cell in the grid.
 */
export const enum CellState {
  DEAD = 0,
  ALIVE,
  DYING,
}

export type CellGrid = CellState[][];

/**
 * Generates a 2D array of random cells.
 *
 * @param width - The width of the canvas, indexed second.
 * @param height - The height of the canvas, indexed first.
 * @returns A 2D array of random cells.
 */
function randomCells(
  width: number,
  height: number,
): [CellGrid, CellGrid] {
  const front = Array.from({ length: height }, () =>
    Array.from({ length: width }, () =>
      Math.random() < 0.9 ? CellState.DEAD : CellState.ALIVE
    )
  );

  const back = Array.from({ length: height }, () =>
    new Array(width).fill(CellState.DEAD)
  );

  return [front, back];
}

function countNeighbors(grid: CellGrid, x: number, y: number) {
  let neighbors = 0;

  // Count all live neighbors of the cell (including itself) in a 3x3 square.
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      // If the neighboring cell is alive, increment the count.
      if (grid[y + dy] && grid[y + dy][x + dx] === CellState.ALIVE) {
        neighbors++;
      }
    }
  }

  // Account for over-counting a live self.
  if (grid[y][x] === CellState.ALIVE) {
    neighbors--;
  }

  return neighbors;
}

function conwayLife(last: CellGrid, next: CellGrid) {
  for (let y = 0; y < last.length; y++) {
    for (let x = 0; x < last[y].length; x++) {
      const neighbors = countNeighbors(last, x, y);

      // Conway's Game of Life rules:
      // 1. Any live cell with fewer than two neighbors dies.
      // 2. Any live cell with two or three neighbors lives.
      // 3. Any live cell with more than three neighbors dies.
      // 4. Any dead cell with exactly three neighbors becomes live.

      let alive;
      switch (last[y][x]) {
      case CellState.DEAD:
        alive = neighbors === 3;
        break;
      case CellState.ALIVE:
        alive = neighbors === 2 || neighbors === 3;
        break;
      }

      next[y][x] = alive ? CellState.ALIVE : CellState.DEAD;
    }
  }

  // Randomly choose 0.005% of cells to make live.
  const area = last[0] ? last.length * last[0].length : 0;
  const spawn = area * 0.00005;

  for (let r = 0; r < spawn; r++) {
    const y = Math.floor(Math.random() * last.length);
    const x = Math.floor(Math.random() * last[y].length);

    next[y][x] = CellState.ALIVE;
  }
}

function brianBrain(last: CellGrid, next: CellGrid) {
  for (let y = 0; y < last.length; y++) {
    for (let x = 0; x < last[y].length; x++) {
      // Brian's Brain rules:
      // 1. Any dead cell with exactly two neighbors becomes live.
      // 2. Any live cell becomes dying.
      // 3. Any dying cell becomes dead.

      switch (last[y][x]) {
      case CellState.DEAD:
        const neighbors = countNeighbors(last, x, y);
        next[y][x] = neighbors === 2 ? CellState.ALIVE : CellState.DEAD;
        break;
      case CellState.ALIVE:
        next[y][x] = CellState.DYING;
        break;
      case CellState.DYING:
        next[y][x] = CellState.DEAD;
        break;
      }
    }
  }
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
      const color = colors[grid[y][x]];

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
      const state = grid[y][x];
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
 * Resize a cell grid into another image data frame, copying old data.
 *
 * @param context - The rendering context used to create the new buffer.
 * @param frame - The old frame to be resized.
 * @param width - The width of the new frame.
 * @param height - The height of the new frame.
 */
function resizeGrid(
  grid: CellGrid,
  width: number,
  height: number,
) {
  for (let y = grid.length; y < height; y++) {
    grid[y] = [];
  }

  grid.length = height;

  for (let y = 0; y < height; y++) {
    const row = grid[y];

    for (let x = row.length; x < width; x++) {
      row[x] = Math.random() < 0.9 ? CellState.DEAD : CellState.ALIVE;
    }

    row.length = width;
  }
}

export type Props = {
  class?: string,
  colors?: Partial<Record<CellState, number[]>>,
  fps?: number,
  rule?: "conway" | "brian",
  render?: "replace" | "decay",
  size?: [number, number] | "dynamic",
};

const DEFAULT_COLORS = {
  [CellState.DEAD]: [255, 255, 255, 0],
  [CellState.ALIVE]: [255, 255, 255, 255],
  [CellState.DYING]: [127, 127, 127, 255],
};

/**
 * The Automata component.
 *
 * @param props - The properties of the component.
 */
export default function Automata(props: Props) {
  const fps = props.fps !== undefined ? props.fps : 20;
  const frameRate = 1000.0 / fps;

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
    let front: CellGrid | null = null;
    let back: CellGrid | null = null;

    let frontLast = true;
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
          front = null;
          back = null;
          return;
        }

        if (front && back) {
          resizeGrid(front, width, height);
          resizeGrid(back, width, height);
        } else {
          [front, back] = randomCells(width, height);
        }

        frame = context.createImageData(width, height);
      });

      resizeObserver.observe(canvas);
    } else {
      const [width, height] = props.size as number[];

      frame = context.createImageData(width, height);
      [front, back] = randomCells(width, height);
    }

    function tick(time: number) {
      // End the rendering loop if the component is dropped.
      if (!running) return;

      // Wait until the frame timing aligns with the frame rate.
      // Also wait until the first resize event has been captured.
      if (time - lastTime < frameRate || !frame || !front || !back) {
        requestAnimationFrame(tick);
        return;
      }

      lastTime = time;

      // Update cells in the front or back buffer depending on which was last.
      if (frontLast) {
        updateCells(front, back);
        drawCells(back, colors, frame);
      } else {
        updateCells(back, front);
        drawCells(front, colors, frame);
      }

      // Push the image data onto the canvas.
      context.putImageData(frame, 0, 0);
      frontLast = !frontLast;

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
