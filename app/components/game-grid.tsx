import { EQUATION_LENGTH, MAX_GUESSES } from '@/lib/game-logic';
import type { CellState } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameGridProps {
  guesses: string[];
  currentGuess: string;
  cellStates: CellState[][];
}

export function GameGrid({ guesses, currentGuess, cellStates }: GameGridProps) {
  const rows: { chars: string[]; states: CellState[]; isActive: boolean }[] =
    Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
      if (rowIndex < guesses.length) {
        // Completed guess
        return {
          chars: guesses[rowIndex].split(''),
          states: cellStates[rowIndex],
          isActive: false,
        };
      } else if (rowIndex === guesses.length) {
        // Current guess
        const chars = currentGuess.split('');
        const paddedChars = [
          ...chars,
          ...Array(EQUATION_LENGTH - chars.length).fill(''),
        ];
        return {
          chars: paddedChars,
          states: Array(EQUATION_LENGTH).fill('empty'),
          isActive: true,
        };
      } else {
        // Empty row
        return {
          chars: Array(EQUATION_LENGTH).fill(''),
          states: Array(EQUATION_LENGTH).fill('empty'),
          isActive: false,
        };
      }
    });

  const stateClasses = {
    correct: 'bg-correct text-white border-correct',
    present: 'bg-present text-white border-present',
    absent: 'bg-absent text-white border-absent',
    empty: 'bg-card border-border',
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.chars.map((char, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'flex items-center justify-center size-14 border-2 rounded-md font-mono text-2xl font-bold transition-all duration-300',
                stateClasses[row.states[colIndex]],
                row.isActive && char && 'scale-105 border-primary',
              )}
              data-testid="game-cell"
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
