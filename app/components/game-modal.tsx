import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { TrophyIcon, TargetIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateGameStats } from '@/lib/game-logic';
import type { GameState, MetadataGameResult, RequestStatus } from '@/lib/types';

interface GameModalProps {
  isOpen: boolean;
  gameState: GameState;
  solution: string;
  targetNumber: number;
  guesses: number;
  gameResults: MetadataGameResult[];
  gameResultsStatus: RequestStatus;
  onClose: () => void;
  onNewGame: () => void;
}

export function GameModal({
  isOpen,
  gameState,
  solution,
  targetNumber,
  guesses,
  gameResults,
  gameResultsStatus,
  onClose,
  onNewGame,
}: GameModalProps) {
  const isLoggedIn = useIsLoggedIn();
  const isWin = gameState === 'won';
  const { gamesPlayed, winPercentage, currentWinStreak, longestWinStreak } =
    calculateGameStats(gameResults);
  const stats = [
    { label: 'Played', value: gamesPlayed },
    { label: 'Win %', value: winPercentage },
    { label: 'Current Streak', value: currentWinStreak },
    { label: 'Best Streak', value: longestWinStreak },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            {isWin ? (
              <TrophyIcon className="size-16 text-[gold]" />
            ) : (
              <TargetIcon className="size-16 text-destructive" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl">
            {isWin ? 'Congratulations!' : 'Game Over'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isWin ? (
              <p className="text-base">
                You solved the puzzle in{' '}
                <span className="font-bold text-foreground">{guesses}</span>{' '}
                {guesses === 1 ? 'guess' : 'guesses'}!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-base">Better luck next time!</p>
                <div className="p-3 rounded-md bg-muted">
                  <p className="mb-1 text-sm text-muted-foreground">
                    The solution was:
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground">
                    {solution} = {targetNumber}
                  </p>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        {isLoggedIn && (
          <div className="grid grid-cols-4 gap-x-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center space-y-1"
              >
                {gameResultsStatus === 'loading' ? (
                  <Skeleton className="size-7" />
                ) : (
                  <span className="text-xl font-bold">{stat.value}</span>
                )}
                <span className="text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-x-2 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button onClick={onNewGame} className="flex-1">
            New Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
