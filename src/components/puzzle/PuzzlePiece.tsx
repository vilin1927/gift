"use client";

import { motion } from "motion/react";

interface PuzzlePieceProps {
  tile: number;
  cols: number;
  image: string;
  gridSize: number;
  cellSize: number;
  gap: number;
  x: number;
  y: number;
  isCorrect: boolean;
  isSolved: boolean;
  onTap: () => void;
}

export default function PuzzlePiece({
  tile,
  cols,
  image,
  gridSize,
  cellSize,
  gap,
  x,
  y,
  isCorrect,
  isSolved,
  onTap,
}: PuzzlePieceProps) {
  const tileCol = tile % cols;
  const tileRow = Math.floor(tile / cols);
  // Scale background to account for gaps in the visual grid
  const bgSize = gridSize;
  const bgX = tileCol * (cellSize + gap);
  const bgY = tileRow * (cellSize + gap);

  return (
    <motion.div
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      onClick={onTap}
      className={`absolute rounded-lg overflow-hidden cursor-pointer active:brightness-110 ${
        isCorrect && !isSolved
          ? "ring-2 ring-accent-gold/40"
          : ""
      } ${isSolved ? "ring-0" : ""}`}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundImage: `url(${image})`,
        backgroundSize: `${bgSize}px ${bgSize}px`,
        backgroundPosition: `-${bgX}px -${bgY}px`,
      }}
    />
  );
}
