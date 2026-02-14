"use client";

import { useState, useCallback, useMemo, useImperativeHandle, forwardRef } from "react";
import { CONFIG } from "@/config";
import PuzzlePiece from "./PuzzlePiece";

export interface PuzzleGridHandle {
  autoSolve: () => void;
}

interface PuzzleGridProps {
  onComplete: () => void;
  disabled?: boolean;
}

const GAP = 4;

function countInversions(tiles: number[], size: number): number {
  let inversions = 0;
  const filtered = tiles.filter((t) => t !== size - 1);
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++;
    }
  }
  return inversions;
}

function generateSolvable(size: number): number[] {
  const total = size * size;
  const tiles = Array.from({ length: total }, (_, i) => i);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  const blankPos = tiles.indexOf(total - 1);
  const blankRow = Math.floor(blankPos / size);
  const inversions = countInversions(tiles, total);

  if (size % 2 === 1) {
    if (inversions % 2 !== 0) {
      const [a, b] = tiles[0] === total - 1 ? [1, 2] : tiles[1] === total - 1 ? [0, 2] : [0, 1];
      [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
    }
  } else {
    const blankFromBottom = size - 1 - blankRow;
    if ((inversions + blankFromBottom) % 2 !== 0) {
      const [a, b] = tiles[0] === total - 1 ? [1, 2] : tiles[1] === total - 1 ? [0, 2] : [0, 1];
      [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
    }
  }

  if (tiles.every((v, i) => v === i)) {
    const [a, b] = tiles[0] === total - 1 ? [1, 2] : tiles[1] === total - 1 ? [0, 2] : [0, 1];
    [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  }

  return tiles;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((v, i) => v === i);
}

function getNeighbors(pos: number, cols: number, rows: number): number[] {
  const r = Math.floor(pos / cols);
  const c = pos % cols;
  const neighbors: number[] = [];
  if (r > 0) neighbors.push(pos - cols);
  if (r < rows - 1) neighbors.push(pos + cols);
  if (c > 0) neighbors.push(pos - 1);
  if (c < cols - 1) neighbors.push(pos + 1);
  return neighbors;
}

/** BFS solver for 3x3 sliding puzzle */
function solvePuzzle(tiles: number[], cols: number, rows: number): number[] {
  const total = cols * rows;
  const blankTile = total - 1;
  const goal = Array.from({ length: total }, (_, i) => i);
  const goalKey = goal.join(",");

  const startKey = tiles.join(",");
  if (startKey === goalKey) return [];

  const queue: { state: number[]; moves: number[] }[] = [{ state: [...tiles], moves: [] }];
  const visited = new Set<string>([startKey]);

  while (queue.length > 0) {
    const { state, moves } = queue.shift()!;
    const blankPos = state.indexOf(blankTile);
    const neighbors = getNeighbors(blankPos, cols, rows);

    for (const neighbor of neighbors) {
      const next = [...state];
      [next[blankPos], next[neighbor]] = [next[neighbor], next[blankPos]];
      const key = next.join(",");

      if (key === goalKey) return [...moves, neighbor];
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: next, moves: [...moves, neighbor] });
      }
    }
  }

  return [];
}

const PuzzleGrid = forwardRef<PuzzleGridHandle, PuzzleGridProps>(
  function PuzzleGrid({ onComplete, disabled }, ref) {
    const { cols, rows } = CONFIG.puzzleGrid;
    const total = cols * rows;
    const blankTile = total - 1;

    const [tiles, setTiles] = useState(() => generateSolvable(cols));
    const [solved, setSolved] = useState(false);
    const [autoSolving, setAutoSolving] = useState(false);

    const gridSize = useMemo(() => {
      if (typeof window === "undefined") return 300;
      return Math.min(window.innerWidth - 48, 360);
    }, []);

    const cellSize = (gridSize - GAP * (cols - 1)) / cols;

    const correctCount = tiles.filter((v, i) => v === i || v === blankTile).length - (solved ? 0 : 1);

    useImperativeHandle(ref, () => ({
      autoSolve() {
        if (solved || autoSolving) return;
        setAutoSolving(true);

        const moves = solvePuzzle(tiles, cols, rows);
        let current = [...tiles];

        moves.forEach((tilePos, i) => {
          setTimeout(() => {
            const blankPos = current.indexOf(blankTile);
            const next = [...current];
            [next[blankPos], next[tilePos]] = [next[tilePos], next[blankPos]];
            current = next;
            setTiles([...next]);

            try { navigator.vibrate?.(10); } catch {}

            if (i === moves.length - 1) {
              setSolved(true);
              setAutoSolving(false);
              setTimeout(onComplete, 600);
            }
          }, (i + 1) * 250);
        });
      },
    }), [tiles, solved, autoSolving, cols, rows, blankTile]);

    const handleTap = useCallback(
      (position: number) => {
        if (solved || disabled || autoSolving) return;

        const blankPos = tiles.indexOf(blankTile);
        const neighbors = getNeighbors(blankPos, cols, rows);

        if (!neighbors.includes(position)) return;

        setTiles((prev) => {
          const next = [...prev];
          [next[position], next[blankPos]] = [next[blankPos], next[position]];

          if (isSolved(next)) {
            setSolved(true);
            setTimeout(onComplete, 800);
          }

          return next;
        });

        try { navigator.vibrate?.(10); } catch {}
      },
      [tiles, solved, disabled, autoSolving, blankTile, cols, rows, onComplete]
    );

    return (
      <div className="flex flex-col items-center gap-4">
        {!autoSolving && !solved && (
          <p className="text-text-secondary text-sm">
            {correctCount}/{total - 1} на месте
          </p>
        )}
        <div
          className="relative"
          style={{ width: gridSize, height: gridSize }}
        >
          {tiles.map((tile, position) => {
            if (tile === blankTile && !solved) return null;

            const currentRow = Math.floor(position / cols);
            const currentCol = position % cols;

            return (
              <PuzzlePiece
                key={tile}
                tile={tile}
                cols={cols}
                image={CONFIG.puzzleImage}
                gridSize={gridSize}
                cellSize={cellSize}
                gap={GAP}
                x={currentCol * (cellSize + GAP)}
                y={currentRow * (cellSize + GAP)}
                isCorrect={tile === position}
                isSolved={solved}
                onTap={() => handleTap(position)}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

export default PuzzleGrid;
