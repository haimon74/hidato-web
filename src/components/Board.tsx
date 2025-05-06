import React, { memo, useCallback, useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Cell from './Cell';
import { generatePuzzle, checkSolution, Grid } from '../utils/hidatoUtils';

interface BoardProps {
  size: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
  showSolution: boolean;
}

export interface BoardRef {
  generateNewPuzzle: () => void;
}

const Board = forwardRef<BoardRef, BoardProps>(({
  size,
  difficulty,
  onComplete,
  showSolution,
}, ref) => {
  const [grid, setGrid] = useState<Grid>([]);
  const [solution, setSolution] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const boardRef = useRef<HTMLDivElement>(null);

  const generateNewPuzzle = useCallback(() => {
    const { puzzle, solution: newSolution } = generatePuzzle(size, difficulty);
    setGrid(puzzle);
    setSolution(newSolution);
    setSelectedCell(null);
    setInputValue('');
  }, [size, difficulty]);

  useImperativeHandle(ref, () => ({
    generateNewPuzzle,
  }), [generateNewPuzzle]);

  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  const checkCompletion = useCallback(() => {
    if (checkSolution(grid)) {
      onComplete();
    }
  }, [grid, onComplete]);

  const applyNumberToCell = useCallback((row: number, col: number, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > size * size) {
      return false;
    }

    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = numValue;
    setGrid(newGrid);
    return true;
  }, [grid, size]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (showSolution) return;

    if (selectedCell) {
      const [prevRow, prevCol] = selectedCell;
      if (prevRow === row && prevCol === col) {
        setSelectedCell(null);
        setInputValue('');
        return;
      }

      if (inputValue) {
        if (applyNumberToCell(prevRow, prevCol, inputValue)) {
          checkCompletion();
        }
      }
    }

    if (grid[row][col] === 0) {
      setSelectedCell([row, col]);
      setInputValue('');
    }
  }, [selectedCell, inputValue, grid, showSolution, applyNumberToCell, checkCompletion]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedCell) {
      const [row, col] = selectedCell;
      if (applyNumberToCell(row, col, inputValue)) {
        checkCompletion();
        setSelectedCell(null);
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setSelectedCell(null);
      setInputValue('');
    } else if (e.key === 'Backspace') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key)) {
      setInputValue(prev => {
        const newValue = prev + e.key;
        return newValue.length <= 2 ? newValue : prev;
      });
    }
  }, [selectedCell, inputValue, applyNumberToCell, checkCompletion]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        if (selectedCell && inputValue) {
          const [row, col] = selectedCell;
          if (applyNumberToCell(row, col, inputValue)) {
            checkCompletion();
          }
        }
        setSelectedCell(null);
        setInputValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCell, inputValue, applyNumberToCell, checkCompletion]);

  const containerStyle = useMemo<React.CSSProperties>(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
  }), []);

  const boardStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${size}, 40px)`,
    border: '2px solid #333',
    boxSizing: 'border-box',
  }), [size]);

  const displayGrid = useMemo(() => showSolution ? solution : grid, [showSolution, solution, grid]);

  return (
    <div ref={boardRef} style={containerStyle}>
      <div style={boardStyle}>
        {displayGrid.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              value={cell}
              isRevealed={grid[i][j] !== 0}
              isSelected={selectedCell?.[0] === i && selectedCell?.[1] === j}
              onClick={() => handleCellClick(i, j)}
              inputValue={selectedCell?.[0] === i && selectedCell?.[1] === j ? inputValue : ''}
              onKeyPress={handleKeyPress}
              row={i}
              col={j}
            />
          ))
        )}
      </div>
    </div>
  );
});

Board.displayName = 'Board';

export default memo(Board); 