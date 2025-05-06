import React, { memo, useMemo } from 'react';

interface GameInstructionsProps {
  size: number;
}

const GameInstructions: React.FC<GameInstructionsProps> = memo(({ size }) => {
  const containerStyle = useMemo<React.CSSProperties>(() => ({
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px',
  }), []);

  const titleStyle = useMemo<React.CSSProperties>(() => ({
    color: '#2196f3',
    marginBottom: '15px',
  }), []);

  const listStyle = useMemo<React.CSSProperties>(() => ({
    listStyleType: 'disc',
    paddingLeft: '20px',
  }), []);

  const listItemStyle = useMemo<React.CSSProperties>(() => ({
    marginBottom: '8px',
  }), []);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>How to Play</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}>
          Fill in the empty cells with numbers from 1 to {size * size}
        </li>
        <li style={listItemStyle}>
          Numbers must be connected horizontally, vertically, or diagonally
        </li>
        <li style={listItemStyle}>
          Click on an empty cell to start entering a number
        </li>
        <li style={listItemStyle}>
          Type a number and click another cell or press Enter to confirm
        </li>
        <li style={listItemStyle}>
          Use the "Show Solution" button if you need help
        </li>
      </ul>
    </div>
  );
});

GameInstructions.displayName = 'GameInstructions';

export default GameInstructions; 