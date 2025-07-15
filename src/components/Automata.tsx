import { createSignal, onMount, onCleanup } from "solid-js";
import { useSystemTheme } from "../system";

/**
 * The state of a single cell in the grid.
 */
export const enum CellState {
  DEAD = 0,
  ALIVE,
  DYING,
}

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
  states: number,
): CellState[][][] {
  const front = Array.from({ length: height }, () =>
    Array.from({ length: width }, () =>
      Math.floor(Math.random() * states) as CellState
    )
  );

  const back = Array.from({ length: height }, () =>
    new Array(width).fill(CellState.DEAD)
  );

  return [front, back];
}

function countNeighbors(cells: CellState[][], x: number, y: number) {
  let neighbors = 0;

  // Count all live neighbors of the cell (including itself) in a 3x3 square.
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      // If the neighboring cell is alive, increment the count.
      if (cells[y + dy] && cells[y + dy][x + dx] === CellState.ALIVE) {
        neighbors++;
      }
    }
  }

  // Account for over-counting a live self.
  if (cells[y][x] === CellState.ALIVE) {
    neighbors--;
  }

  return neighbors;
}

function conwayLife(last: CellState[][], next: CellState[][]) {
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

  // Randomly choose 20 cells to make live.
  for (let r = 0; r < 20; r++) {
    const y = Math.floor(Math.random() * last.length);
    const x = Math.floor(Math.random() * last[y].length);

    next[y][x] = CellState.ALIVE;
  }
}

function brianBrain(
  last: CellState[][],
  next: CellState[][],
) {
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
  cells: CellState[][],
  colors: Record<CellState, number[]>,
  frame: ImageData,
) {
  // The index in the image data of the current pixel.
  let px = 0;

  // Color each pixel according to whether the corresponding cell is alive.
  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++, px += 4) {
      const color = colors[cells[y][x]];

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
  cells: CellState[][],
  colors: Record<CellState, number[]>,
  frame: ImageData,
) {
  let px = 0;

  console.log(colors);

  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++, px += 4) {
      const state = cells[y][x];
      const color = colors[state];

      for (let c = 0; c < 3; c++) {
        if (state === CellState.DEAD) {
          frame.data[px + c] = 0.9 * frame.data[px + c] + 0.1 * color[c];
        } else {
          frame.data[px + c] = color[c];
        }
      }

      if (color.length > 3) {
        frame.data[px + 3] = color[3];
      }
    }
  }
}

export type Props = {
  class?: string,
  colors?: Record<CellState, number[]>,
  fps?: number,
  rule?: "conway" | "brian",
  render?: "replace" | "decay",
  size?: [number, number] | "dynamic",
};

/**
 * The Automata component.
 *
 * @param props - The properties of the component.
 */
export default function Automata(props: Props) {
  const fps = props.fps !== undefined ? props.fps : 30;
  const frameRate = 1000.0 / fps;

  let updateCells = conwayLife;
  if (props.rule === "brian") {
    updateCells = brianBrain;
  }

  let drawCells = renderReplace;
  if (props.render === "decay") {
    drawCells = renderDecay;
  }

  const colors = props.colors !== undefined
    ? props.colors
    : {
      [CellState.DEAD]: [38, 38, 38, 255],
      // [CellState.ALIVE]: [255, 255, 255, 255],
      [CellState.ALIVE]: [30, 65, 123, 255],
      [CellState.DYING]: [193, 247, 220, 255],
    };

  let dynamic = !props.size || props.size === "dynamic";

  const isDark = useSystemTheme();
  let canvas!: HTMLCanvasElement;

  let frame: ImageData | undefined;

  onMount(() => {
    // Create a front and back buffer for the cells.
    const context = canvas.getContext("2d")!;
    context.imageSmoothingEnabled = false;

    // Create an image data buffer frame for rendering and pushing to canvas.
    const frame = context.createImageData(width, height);

    // Create a front buffer and a back buffer of cells.
    const [front, back] = randomCells(width, height, 2);

    // Draw the back buffer (consisting of all dead cells) to the frame.
    renderReplace(back, colors, frame);
    context.putImageData(frame, 0, 0);

    let frontLast = true;
    let running = true;
    let lastTime = 0;

    function tick(time: number) {
      // End the rendering loop if the component is dropped.
      if (!running) return;

      // Wait until the frame timing aligns with the frame rate.
      if (time - lastTime < frameRate) {
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

    // Detect resize events and update size if dynamic.
    let resizeObserver: ResizeObserver | undefined;
    if (dynamic) {
      resizeObserver = new ResizeObserver(entries => {
        const rect = entries[0].contentRect;
        setSize([Math.floor(rect.width), Math.floor(rect.height)]);
      });

      resizeObserver.observe(canvas);
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
