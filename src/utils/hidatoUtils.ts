// Directions for 8 neighbors in a square grid
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export type Position = [number, number];
export type Grid = number[][];

export const isValidPosition = (x: number, y: number, size: number): boolean => {
  return x >= 0 && x < size && y >= 0 && y < size;
};

export const getNeighbors = (x: number, y: number, grid: Grid): Position[] => {
  const size = grid.length;
  return DIRECTIONS
    .map(([dx, dy]) => [x + dx, y + dy] as Position)
    .filter(([nx, ny]) => isValidPosition(nx, ny, size) && grid[nx][ny] === 0);
};

export const warnsdorffSort = (x: number, y: number, grid: Grid): Position[] => {
  const neighbors = getNeighbors(x, y, grid);
  return neighbors.sort((a, b) => {
    const aNeighbors = getNeighbors(a[0], a[1], grid).length;
    const bNeighbors = getNeighbors(b[0], b[1], grid).length;
    return aNeighbors - bNeighbors;
  });
};

export const generatePath = (size: number): Grid => {
  const grid: Grid = Array(size).fill(0).map(() => Array(size).fill(0));
  const maxNumber = size * size;
  let currentNumber = 1;
  let x = Math.floor(Math.random() * size);
  let y = Math.floor(Math.random() * size);

  grid[y][x] = currentNumber;

  while (currentNumber < maxNumber) {
    const neighbors = getValidNeighbors(x, y, size, grid);
    if (neighbors.length === 0) {
      // If no valid neighbors, backtrack
      const prevPos = findPreviousNumber(grid, currentNumber);
      if (!prevPos) break;
      [x, y] = prevPos;
      currentNumber--;
      continue;
    }

    const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
    currentNumber++;
    grid[ny][nx] = currentNumber;
    x = nx;
    y = ny;
  }

  return grid;
};

export const maskGrid = (solution: Grid, revealCount: number): Grid => {
  const size = solution.length;
  const puzzle: Grid = Array(size).fill(0).map(() => Array(size).fill(0));
  const positions: [number, number][] = [];

  // Collect all positions
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Reveal the first revealCount positions
  for (let i = 0; i < revealCount; i++) {
    const [y, x] = positions[i];
    puzzle[y][x] = solution[y][x];
  }

  return puzzle;
};

export const findNumber = (grid: Grid, target: number): Position | null => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === target) {
        return [i, j];
      }
    }
  }
  return null;
};

export const getValidMoves = (x: number, y: number, grid: Grid, visited: Set<string>): Position[] => {
  const size = grid.length;
  const moves: Position[] = [];
  
  DIRECTIONS.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (isValidPosition(nx, ny, size)) {
      const key = `${nx},${ny}`;
      if ((grid[nx][ny] === 0 || typeof grid[nx][ny] === 'number') && !visited.has(key)) {
        moves.push([nx, ny]);
      }
    }
  });
  
  return moves;
};

export const countSolutions = (
  grid: Grid,
  currentNum: number = 1,
  visited: Set<string> = new Set(),
  solutions: number[] = [0]
): void => {
  const size = grid.length;
  const totalCells = size * size;

  const pos = findNumber(grid, currentNum);
  if (!pos) return;

  if (currentNum === totalCells) {
    solutions[0]++;
    return;
  }

  const [x, y] = pos;
  visited.add(`${x},${y}`);

  const nextVal = currentNum + 1;
  const nextPos = findNumber(grid, nextVal);

  if (nextPos) {
    if (getValidMoves(x, y, grid, visited).some(([nx, ny]) => nx === nextPos[0] && ny === nextPos[1])) {
      countSolutions(grid, nextVal, new Set(visited), solutions);
    }
  } else {
    getValidMoves(x, y, grid, visited).forEach(([nx, ny]) => {
      if (grid[nx][ny] === 0) {
        grid[nx][ny] = nextVal;
        countSolutions(grid, nextVal, new Set(visited), solutions);
        grid[nx][ny] = 0;
      }
    });
  }
};

export const hasUniqueSolution = (puzzle: Grid): boolean => {
  const solutions = [0];
  countSolutions([...puzzle.map(row => [...row])], 1, new Set(), solutions);
  return solutions[0] === 1;
};

export interface PuzzleResult {
  puzzle: Grid;
  solution: Grid;
}

export const generatePuzzle = (size: number, difficulty: 'easy' | 'medium' | 'hard'): PuzzleResult => {
  // Generate a complete solution
  const solution = generatePath(size);

  // Determine number of revealed cells based on difficulty
  const revealCount = {
    easy: Math.floor(size * size * 0.4),
    medium: Math.floor(size * size * 0.3),
    hard: Math.floor(size * size * 0.2),
  }[difficulty];

  // Create the puzzle by masking the solution
  const puzzle = maskGrid(solution, revealCount);

  return { puzzle, solution };
};

export const checkSolution = (grid: Grid): boolean => {
  // Check if all cells are filled
  const isComplete = grid.every(row => 
    row.every(cell => cell !== 0)
  );

  if (!isComplete) return false;

  // Verify the solution
  const size = grid.length;
  const maxNumber = size * size;
  const numbers = new Set<number>();

  // Check if all numbers from 1 to maxNumber are present
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = grid[i][j];
      if (value < 1 || value > maxNumber || numbers.has(value)) {
        return false;
      }
      numbers.add(value);
    }
  }

  // Check if numbers are connected
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const currentValue = grid[i][j];
      if (currentValue === maxNumber) continue;

      const nextValue = currentValue + 1;
      let found = false;

      // Check all 8 adjacent cells
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;

          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
            if (grid[ni][nj] === nextValue) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) return false;
    }
  }

  return true;
};

export const getValidNeighbors = (x: number, y: number, size: number, grid: Grid): [number, number][] => {
  const neighbors: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[ny][nx] === 0) {
        neighbors.push([nx, ny]);
      }
    }
  }
  return neighbors;
};

export const findPreviousNumber = (grid: Grid, number: number): [number, number] | undefined => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === number - 1) {
        return [j, i];
      }
    }
  }
  return undefined;
}; 