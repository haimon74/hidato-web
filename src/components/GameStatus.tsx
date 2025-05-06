import React, { memo, useMemo } from 'react';

interface GameStatusProps {
  isComplete: boolean;
  showSolution: boolean;
}

const GameStatus: React.FC<GameStatusProps> = memo(({ isComplete, showSolution }) => {
  const statusStyle = useMemo<React.CSSProperties>(() => ({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: isComplete ? '#4caf50' : showSolution ? '#f44336' : '#2196f3',
  }), [isComplete, showSolution]);

  const getStatusMessage = useMemo(() => {
    if (isComplete) {
      return 'Congratulations! You solved the puzzle!';
    }
    if (showSolution) {
      return 'Solution is visible';
    }
    return 'Keep going!';
  }, [isComplete, showSolution]);

  return (
    <div style={statusStyle}>
      {getStatusMessage}
    </div>
  );
});

GameStatus.displayName = 'GameStatus';

export default GameStatus; 