import React, { useRef, useEffect, useState, useCallback } from "react";

// Board dimensions
const COLS = 10,
  ROWS = 20;

// Types for cells, points, and tetrominos
type Cell = number | null;
type Point = { x: number; y: number };
type Tetromino = { shape: number[][]; color: string };

// Tetromino definitions (shapes and colors)
const TETROMINOS: Tetromino[] = [
  { shape: [[1, 1, 1, 1]], color: "#06b6d4" },
  {
    shape: [
      [0, 2],
      [0, 2],
      [2, 2],
    ],
    color: "#2563EB",
  },
  {
    shape: [
      [3, 0],
      [3, 0],
      [3, 3],
    ],
    color: "#f59e42",
  },
  {
    shape: [
      [4, 4],
      [4, 4],
    ],
    color: "#FFD600",
  },
  {
    shape: [
      [0, 5, 5],
      [5, 5, 0],
    ],
    color: "#22d3ee",
  },
  {
    shape: [
      [6, 6, 6],
      [0, 6, 0],
    ],
    color: "#a21caf",
  },
  {
    shape: [
      [7, 7, 0],
      [0, 7, 7],
    ],
    color: "#ef4444",
  },
];

// Generate a random tetromino with a starting position
function randomTetromino(): Tetromino & { pos: Point } {
  const i = Math.floor(Math.random() * TETROMINOS.length);
  return { ...TETROMINOS[i], pos: { x: 3, y: 0 } };
}

// Rotate a tetromino shape (clockwise)
function rotate(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map((row) => row[i]).reverse());
}

// Check if a tetromino fits in the grid at its current position
function fits(grid: Cell[][], tetro: Tetromino & { pos: Point }): boolean {
  const { shape, pos } = tetro;
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++)
      if (
        shape[y][x] &&
        (pos.y + y >= ROWS ||
          pos.x + x < 0 ||
          pos.x + x >= COLS ||
          (pos.y + y >= 0 && grid[pos.y + y][pos.x + x]))
      )
        return false;
  return true;
}

// Merge a tetromino into the grid (when it lands)
function merge(grid: Cell[][], tetro: Tetromino & { pos: Point }): void {
  const { shape, pos } = tetro;
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++)
      if (shape[y][x] && pos.y + y >= 0)
        grid[pos.y + y][pos.x + x] = shape[y][x];
}

// Clear completed lines and return the number of lines cleared
function clearLines(grid: Cell[][]): number {
  let lines = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (grid[y].every(Boolean)) {
      grid.splice(y, 1);
      grid.unshift(Array(COLS).fill(null));
      lines++;
      y++;
    }
  }
  return lines;
}

// Color palette for tetrominos and background
const COLORS: string[] = [
  "#232328", // background
  "#06b6d4",
  "#2563EB",
  "#f59e42",
  "#FFD600",
  "#22d3ee",
  "#a21caf",
  "#ef4444",
];

// Game state interface
interface GameState {
  grid: Cell[][];
  current: Tetromino & { pos: Point };
  over: boolean;
  dropTick: number;
  delay: number;
  score: number;
}

// Create a fresh game state
function freshState(): GameState {
  return {
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    current: randomTetromino(),
    over: false,
    dropTick: 0,
    delay: 28,
    score: 0,
  };
}

const TetrisGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aniFrame = useRef<number>(0);

  const [score, setScore] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({ width: 300, height: 300 });
  const [game, setGame] = useState<GameState>(freshState());

  // Responsive canvas sizing based on container width
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = width * (ROWS / COLS);
        setCanvasSize({ width, height });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw the game board and current tetromino
  const draw = useCallback(
    (_g?: GameState) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const g = _g || game;
      const bw = canvasSize.width / COLS,
        bh = canvasSize.height / ROWS;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.fillStyle = COLORS[0];
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw placed blocks
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++)
          if (g.grid[y][x]) {
            ctx.fillStyle = COLORS[g.grid[y][x]!];
            ctx.fillRect(x * bw, y * bh, bw - 2, bh - 2);
            ctx.strokeStyle = "#2d2d2d";
            ctx.lineWidth = 1;
            ctx.strokeRect(x * bw + 1, y * bh + 1, bw - 3, bh - 3);
          }

      // Draw the falling tetromino
      if (!g.over && !paused) {
        const { current } = g;
        for (let y = 0; y < current.shape.length; y++)
          for (let x = 0; x < current.shape[y].length; x++)
            if (current.shape[y][x]) {
              ctx.fillStyle = COLORS[current.shape[y][x]];
              ctx.fillRect(
                (current.pos.x + x) * bw,
                (current.pos.y + y) * bh,
                bw - 2,
                bh - 2
              );
              ctx.strokeStyle = "#2d2d2d";
              ctx.strokeRect(
                (current.pos.x + x) * bw + 1,
                (current.pos.y + y) * bh + 1,
                bw - 3,
                bh - 3
              );
            }
      }
      // Draw pause overlay
      if (paused && !g.over) {
        ctx.fillStyle = "rgba(23,23,28,0.94)";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(20, bw * 1.1)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Paused", canvasSize.width / 2, canvasSize.height / 2);

        // Draw controls below the "Paused" text
        ctx.font = `bold 13px Inter, sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(
          "Controls: ← → ↓ (move), F (rotate), D (drop)",
          canvasSize.width / 2,
          canvasSize.height / 2 + 32
        );
        ctx.font = `11px Inter, sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.85;
        ctx.fillText(
          `Click to resume`,
          canvasSize.width / 2,
          canvasSize.height / 2 + 52
        );
      }
      // Draw game over overlay
      if (g.over) {
        ctx.fillStyle = "rgba(23,23,28,0.94)";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(18, bw)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2);

        // Show a custom message below "Game Over"
        ctx.font = `bold 14px Inter, sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(
          "Hire me bro 😐",
          canvasSize.width / 2,
          canvasSize.height / 2 + 32
        );
        ctx.font = `12px Inter, sans-serif`;
        ctx.fillStyle = "#e5e7eb";
        ctx.globalAlpha = 0.85;
        ctx.fillText(
          "Click to restart",
          canvasSize.width / 2,
          canvasSize.height / 2 + 54
        );
      }
    },

    [canvasSize.width, canvasSize.height, paused, game]
  );

  // Main game loop: handles falling, merging, scoring, and game over
  useEffect(() => {
    let running = true;
    function loop() {
      setGame((game) => {
        if (game.over || paused) {
          draw(game);
          return game;
        }
        let { current, dropTick, score: sc } = game;
        let over: boolean = game.over;
        const { grid, delay } = game;

        dropTick++;

        // Drop tetromino down by one row if enough ticks have passed
        if (dropTick >= delay) {
          dropTick = 0;
          const test = {
            ...current,
            pos: { x: current.pos.x, y: current.pos.y + 1 },
          };
          if (fits(grid, test)) {
            current = test;
          } else {
            // Merge tetromino into grid and check for line clears
            merge(grid, current);
            const lines = clearLines(grid);
            sc += lines * 100;
            if (grid[0].some(Boolean)) {
              over = true;
              setScore(sc);
              setGameOver(true);
            } else {
              current = randomTetromino();
            }
          }
        }
        setScore(sc);
        const newState: GameState = {
          ...game,
          grid,
          current,
          dropTick,
          score: sc,
          over,
        };
        draw(newState);
        return newState;
      });
      if (running) aniFrame.current = requestAnimationFrame(loop);
    }
    // Cancel previous animation frame if any
    if (aniFrame.current) cancelAnimationFrame(aniFrame.current);
    if (!paused && !gameOver) aniFrame.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (aniFrame.current) cancelAnimationFrame(aniFrame.current);
    };
  }, [paused, gameOver, draw]);

  // Keyboard controls for moving, rotating, and dropping tetrominos
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (game.over || paused) return;
      setGame((game) => {
        const { grid } = game;
        let { current } = game;
        let changed = false;
        if (e.key === "ArrowLeft") {
          const test = {
            ...current,
            pos: { x: current.pos.x - 1, y: current.pos.y },
          };
          if (fits(grid, test)) {
            current = test;
            changed = true;
          }
        } else if (e.key === "ArrowRight") {
          const test = {
            ...current,
            pos: { x: current.pos.x + 1, y: current.pos.y },
          };
          if (fits(grid, test)) {
            current = test;
            changed = true;
          }
        } else if (e.key === "ArrowDown") {
          const test = {
            ...current,
            pos: { x: current.pos.x, y: current.pos.y + 1 },
          };
          if (fits(grid, test)) {
            current = test;
            changed = true;
          }
        } else if (e.key.toLowerCase() === "f") {
          const test = { ...current, shape: rotate(current.shape) };
          if (fits(grid, test)) {
            current = test;
            changed = true;
          }
        } else if (e.key.toLowerCase() === "d") {
          let test = { ...current };
          while (
            fits(grid, { ...test, pos: { x: test.pos.x, y: test.pos.y + 1 } })
          ) {
            test = { ...test, pos: { x: test.pos.x, y: test.pos.y + 1 } };
          }
          current = test;
          changed = true;
        }
        if (changed) {
          setTimeout(() => draw({ ...game, current }), 0);
          return { ...game, current };
        }
        return game;
      });
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [paused, game.over, draw]);

  // Pause, resume, or restart the game by clicking the canvas
  function handleCanvasClick(): void {
    if (game.over) {
      // Restart: fresh state
      const fresh = freshState();
      setGame(fresh);
      setScore(0);
      setPaused(false);
      setGameOver(false);
      draw(fresh);
    } else {
      setPaused((p) => !p);
    }
  }

  // Redraw whenever score, pause, or game over state changes
  useEffect(() => {
    draw();
  }, [score, paused, gameOver, draw]);

  return (
    <div
      className="flex flex-col items-center w-full "
      ref={containerRef}
      style={{ userSelect: "none" }}
    >
      <div className="w-full relative" style={{ aspectRatio: "10/20" }}>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          tabIndex={0}
          style={{
            touchAction: "manipulation",
            width: "100%",
            height: "86.1%",
            display: "block",
            borderRadius: 24,
            outline: "none",
            background: "#232328",
          }}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
};

export default TetrisGame;
