import React, { memo, useRef, useEffect, useMemo } from 'react';
import {
  cellStyle,
  revealedCellStyle,
  selectedCellStyle,
  inputStyle,
  numberStyle,
  revealedNumberStyle,
  solutionNumberStyle,
} from '../styles/gameStyles';

interface CellProps {
  value: number;
  isRevealed: boolean;
  isSelected: boolean;
  onClick: () => void;
  inputValue: string;
  onKeyPress: (e: React.KeyboardEvent) => void;
  row?: number;
  col?: number;
}

const Cell: React.FC<CellProps> = memo(({
  value,
  isRevealed,
  isSelected,
  onClick,
  inputValue,
  onKeyPress,
  row = 0,
  col = 0,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  const cellStyle = useMemo<React.CSSProperties>(() => ({
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isSelected ? '#e3f2fd' : isRevealed ? '#f5f5f5' : 'white',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: isRevealed ? '#2196f3' : '#222',
    boxSizing: 'border-box',
    userSelect: 'none',
    borderRight: '1px solid #333',
    borderBottom: '1px solid #333',
    borderLeft: col === 0 ? '1px solid #333' : undefined,
    borderTop: row === 0 ? '1px solid #333' : undefined,
    padding: 0,
    margin: 0,
  }), [isSelected, isRevealed, row, col]);

  const inputStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    border: 'none',
    textAlign: 'center',
    fontSize: '1.2rem',
    backgroundColor: 'transparent',
    outline: 'none',
    fontWeight: 'bold',
    color: '#2196f3',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
  }), []);

  const getCellStyle = () => {
    if (isSelected) return selectedCellStyle;
    if (isRevealed) return revealedCellStyle;
    return cellStyle;
  };

  const getNumberStyle = () => {
    if (value !== undefined) return solutionNumberStyle;
    if (isRevealed) return revealedNumberStyle;
    return numberStyle;
  };

  return (
    <div style={getCellStyle()} onClick={onClick}>
      {isSelected && !isRevealed ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[1-9]*"
          maxLength={2}
          value={inputValue}
          onChange={() => {}}
          onKeyDown={onKeyPress}
          style={inputStyle}
        />
      ) : (
        value || ''
      )}
    </div>
  );
});

Cell.displayName = 'Cell';

export default Cell; 