import { DeleteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CellState } from '@/lib/types';
import { cn } from '@/lib/utils';

interface KeyboardProps {
  keyStates: Record<string, CellState>;
  disabled: boolean;
  onKeyPress: (key: string) => void;
}

export function GameKeyboard({
  keyStates,
  disabled,
  onKeyPress,
}: KeyboardProps) {
  const numberKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
  const operatorKeys = ['+', '-', '*', '/'];

  const getKeyClass = (key: string) => {
    const state = keyStates[key];
    if (!state) return 'bg-secondary hover:bg-secondary/80';

    const stateClasses = {
      correct: 'bg-correct hover:bg-correct/90 text-white',
      present: 'bg-present hover:bg-present/90 text-white',
      absent: 'bg-absent hover:bg-absent/90 text-white',
      empty: 'bg-secondary hover:bg-secondary/80',
    };

    return stateClasses[state];
  };

  return (
    <div className="max-w-xs mx-auto space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {numberKeys.slice(0, 3).map((key) => (
          <Button
            key={key}
            disabled={disabled}
            variant="secondary"
            onClick={() => onKeyPress(key)}
            className={cn(
              'h-12 text-lg font-semibold cursor-pointer transition-colors',
              getKeyClass(key),
            )}
          >
            {key}
          </Button>
        ))}
        {numberKeys.slice(3, 6).map((key) => (
          <Button
            key={key}
            disabled={disabled}
            variant="secondary"
            onClick={() => onKeyPress(key)}
            className={cn(
              'h-12 text-lg font-semibold cursor-pointer transition-colors',
              getKeyClass(key),
            )}
          >
            {key}
          </Button>
        ))}
        {numberKeys.slice(6, 9).map((key) => (
          <Button
            key={key}
            disabled={disabled}
            variant="secondary"
            onClick={() => onKeyPress(key)}
            className={cn(
              'h-12 text-lg font-semibold cursor-pointer transition-colors',
              getKeyClass(key),
            )}
          >
            {key}
          </Button>
        ))}
        <Button
          disabled={disabled}
          variant="secondary"
          onClick={() => onKeyPress('Backspace')}
          className="h-12 cursor-pointer bg-secondary hover:bg-secondary/80"
        >
          <DeleteIcon className="size-5" />
        </Button>
        <Button
          disabled={disabled}
          variant="secondary"
          onClick={() => onKeyPress('0')}
          className={cn(
            'h-12 text-lg font-semibold cursor-pointer transition-colors',
            getKeyClass('0'),
          )}
        >
          0
        </Button>
        <Button
          disabled={disabled}
          variant="secondary"
          onClick={() => onKeyPress('Enter')}
          className="h-12 text-lg font-semibold cursor-pointer bg-secondary hover:bg-secondary/80"
        >
          Enter
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {operatorKeys.map((key) => (
          <Button
            key={key}
            disabled={disabled}
            variant="secondary"
            onClick={() => onKeyPress(key)}
            className={cn(
              'h-12 text-xl font-bold cursor-pointer transition-colors',
              getKeyClass(key),
            )}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  );
}
