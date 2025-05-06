import React, { memo, useMemo } from 'react';

interface GameControlsProps {
  size: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onSizeChange: (size: number) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onNewGame: () => void;
  onToggleSolution: () => void;
  showSolution: boolean;
}

const GameControls: React.FC<GameControlsProps> = memo(({
  size,
  difficulty,
  onSizeChange,
  onDifficultyChange,
  onNewGame,
  onToggleSolution,
  showSolution,
}) => {
  const controlsStyle = useMemo<React.CSSProperties>(() => ({
    marginBottom: '20px',
  }), []);

  const buttonStyle = useMemo<React.CSSProperties>(() => ({
    margin: '0 10px',
    padding: '8px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  }), []);

  const toggleButtonStyle = useMemo<React.CSSProperties>(() => ({
    ...buttonStyle,
    backgroundColor: showSolution ? '#f44336' : '#4caf50',
  }), [buttonStyle, showSolution]);

  const selectStyle = useMemo<React.CSSProperties>(() => ({
    margin: '0 10px',
    padding: '8px',
    fontSize: '1rem',
  }), []);

  const handleSizeChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSizeChange(Number(e.target.value));
  }, [onSizeChange]);

  const handleDifficultyChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard');
  }, [onDifficultyChange]);

  return (
    <div style={controlsStyle}>
      <label>
        Grid Size:
        <select
          value={size}
          onChange={handleSizeChange}
          style={selectStyle}
        >
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
          <option value={6}>6x6</option>
          <option value={7}>7x7</option>
          <option value={8}>8x8</option>
          <option value={9}>9x9</option>
        </select>
      </label>

      <label>
        Difficulty:
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          style={selectStyle}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <button onClick={onNewGame} style={buttonStyle}>
        New Game
      </button>

      <button onClick={onToggleSolution} style={toggleButtonStyle}>
        {showSolution ? 'Hide Solution' : 'Show Solution'}
      </button>
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls; 