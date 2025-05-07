import React, { memo, useRef, useEffect } from 'react';
import styles from './Cell.module.css';

interface CellProps {
  value: number;
  isRevealed: boolean;
  isSelected: boolean;
  onClick: () => void;
  inputValue: string;
  onKeyPress: (e: React.KeyboardEvent) => void;
  row?: number;
  col?: number;
  isFirstOrLast?: boolean;
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
  isFirstOrLast = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  let cellClass = styles.cell;
  if (isFirstOrLast) cellClass += ` ${styles.cellFirstLast}`;
  if (isSelected) cellClass += ` ${styles.cellSelected}`;
  else if (isRevealed) cellClass += ` ${styles.cellRevealed}`;
  if (col === 0) cellClass += ` ${styles.cellFirstCol}`;
  if (row === 0) cellClass += ` ${styles.cellFirstRow}`;

  return (
    <div className={cellClass} onClick={onClick}>
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
          className={styles.input}
        />
      ) : (
        value || ''
      )}
    </div>
  );
});

Cell.displayName = 'Cell';

export default Cell; 