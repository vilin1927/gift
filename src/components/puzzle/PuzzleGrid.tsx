"use client";

import { useState, useCallback, useMemo } from "react";
import { CONFIG } from "@/config";
import PuzzlePiece from "./PuzzlePiece";

interface PuzzleGridProps {
  onComplete: () => void;
}

const GAP = 4;

/**
 * Count inversions to check solvability.
 * For a 3x3 puzzle with blank in bottom-right:
 * solvable if inversion count is even.
 */
function countInversions(tiles: number[], size: number): number {
  let inversions = 0;
  const filtered = tiles.filter((t) => t !== size - 1); // exclude blank
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++;
    }
  }
  return inversions;
}

function generateSolvable(size: number): number[] {
  const total = size * size;
  // tiles: 0..total-2 are image pieces, total-1 is the blank
  const tiles = Array.from({ length: total }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Find where the blank ended up
  const blankPos = tiles.indexOf(total - 1);
  const blankRow = Math.floor(blankPos / size);
  const inversions = countInversions(tiles, total);

  if (size % 2 === 1) {
    // Odd grid (3x3): solvable if inversions is even
    if (inversions % 2 !== 0) {
      // Swap two non-blank tiles to fix parity
      const [a, b] = tiles[0] === total - 1 ? [1, 2] : tiles[1] === total - 1 ? [0, 2] : [0, 1];
      [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
    }
  } else {
    // Even grid (4x4): solvable if (inversions + blank row from bottom) is even
    const blankFromBottom = size - 1 - blankRow;
    if ((inversions + blankFromBottom) % 2 !== 0) {
      const [a, b] = tiles[0] === total - 1 ? [1, 2] : tiles[1] === total - 1 ? [0, 2] : [0, 1];
      [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
    }
  }

  // Make sure it's not already solved
  if (tiles.every((v, i) => v === i)) {
    // Swap first two non-blank tiles
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
  if (r > 0) neighbors.push(pos - cols); // up
  if (r < rows - 1) neighbors.push(pos + cols); // down
  if (c > 0) neighbors.push(pos - 1); // left
  if (c < cols - 1) neighbors.push(pos + 1); // right
  return neighbors;
}

export default function PuzzleGrid({ onComplete }: PuzzleGridProps) {
  const { cols, rows } = CONFIG.puzzleGrid;
  const total = cols * rows;
  const blankTile = total - 1; // last tile is the blank

  const [tiles, setTiles] = useState(() => generateSolvable(cols));
  const [solved, setSolved] = useState(false);

  const gridSize = useMemo(() => {
    if (typeof window === "undefined") return 300;
    return Math.min(window.innerWidth - 48, 360);
  }, []);

  const cellSize = (gridSize - GAP * (cols - 1)) / cols;

  const correctCount = tiles.filter((v, i) => v === i || v === blankTile).length - (solved ? 0 : 1);

  const handleTap = useCallback(
    (position: number) => {
      if (solved) return;

      const blankPos = tiles.indexOf(blankTile);
      const neighbors = getNeighbors(blankPos, cols, rows);

      if (!neighbors.includes(position)) return;

      // Swap tapped tile with blank
      setTiles((prev) => {
        const next = [...prev];
        [next[position], next[blankPos]] = [next[blankPos], next[position]];

        if (isSolved(next)) {
          setSolved(true);
          setTimeout(onComplete, 800);
        }

        return next;
      });

      try {
        navigator.vibrate?.(10);
      } catch {}
    },
    [tiles, solved, blankTile, cols, rows, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-text-secondary text-sm">
        {correctCount}/{total - 1} на месте
      </p>
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
