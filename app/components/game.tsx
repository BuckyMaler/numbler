'use client';

import {
  useDynamicContext,
  useIsLoggedIn,
  useUserUpdateRequest,
} from '@dynamic-labs/sdk-react-core';
import { CircleAlertIcon, InfoIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { GameGrid } from '@/app/components/game-grid';
import { GameHeader } from '@/app/components/game-header';
import { GameKeyboard } from '@/app/components/game-keyboard';
import { GameModal } from '@/app/components/game-modal';
import { Button } from '@/components/ui/button';
import {
  EQUATION_LENGTH,
  MAX_GUESSES,
  evaluateGuess,
  generatePuzzle,
  isValidEquation,
} from '@/lib/game-logic';
import type {
  CellState,
  GameState,
  MetadataGameResult,
  RequestStatus,
} from '@/lib/types';

export function Game() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [targetNumber, setTargetNumber] = useState(0);
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [cellStates, setCellStates] = useState<CellState[][]>([]);
  const [keyStates, setKeyStates] = useState<Record<string, CellState>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, user, showAuthFlow } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();
  const [gameResults, setGameResults] = useState<MetadataGameResult[]>([]);
  const [gameResultsStatus, setGameResultsStatus] =
    useState<RequestStatus>('idle');

  const startNewGame = () => {
    const puzzle = generatePuzzle();
    setTargetNumber(puzzle.target);
    setSolution(puzzle.equation);
    setGuesses([]);
    setCurrentGuess('');
    setCellStates([]);
    setKeyStates({});
    setGameState('playing');
    setErrorMessage('');
    setShowModal(false);
    console.log('New puzzle generated:', puzzle);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startNewGame();
  }, []);

  const saveGameResult = useCallback(
    async (result: GameState, guesses: number) => {
      try {
        if (!isLoggedIn || !user) return;
        setGameResultsStatus('loading');
        const response = await updateUser({
          metadata: {
            numbler_game_results: [
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: Property `numbler_game_results` does not exist on type `object`.
              ...(user.metadata?.numbler_game_results ?? []),
              {
                result,
                guesses,
                played_at: new Date().toISOString(),
              },
            ],
          },
        });
        setGameResults(
          // prettier-ignore
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Property `numbler_game_results` does not exist on type `object`.
          response.updateUserProfileResponse.user.metadata?.numbler_game_results ?? [],
        );
        setGameResultsStatus('success');
      } catch (error) {
        console.error('Error updating user metadata:', error);
        setGameResultsStatus('error');
      }
    },
    [isLoggedIn, user, updateUser],
  );

  const submitGuess = useCallback(() => {
    const validation = isValidEquation(currentGuess, targetNumber);
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'Invalid equation');
      return;
    }

    const evaluation = evaluateGuess(currentGuess, solution);
    const newGuesses = [...guesses, currentGuess];
    const newCellStates = [...cellStates, evaluation];

    // Update key states
    const newKeyStates = { ...keyStates };
    currentGuess.split('').forEach((char, index) => {
      const state = evaluation[index];
      const currentState = newKeyStates[char];

      // Priority: correct > present > absent
      if (
        state === 'correct' ||
        (state === 'present' && currentState !== 'correct') ||
        (state === 'absent' && !currentState)
      ) {
        newKeyStates[char] = state;
      }
    });

    setGuesses(newGuesses);
    setCellStates(newCellStates);
    setKeyStates(newKeyStates);
    setCurrentGuess('');

    if (
      currentGuess === solution ||
      // Cumulative case
      evaluation.every(
        (cellState) => cellState === 'correct' || cellState === 'present',
      )
    ) {
      setGameState('won');
      saveGameResult('won', newGuesses.length);
      setTimeout(() => setShowModal(true), 1500);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState('lost');
      saveGameResult('lost', newGuesses.length);
      setTimeout(() => setShowModal(true), 1500);
    }
  }, [
    currentGuess,
    targetNumber,
    solution,
    guesses,
    cellStates,
    keyStates,
    saveGameResult,
  ]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== 'playing' || showAuthFlow) return;

      setErrorMessage('');

      if (key === 'Enter') {
        submitGuess();
      } else if (key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < EQUATION_LENGTH) {
        const validChars = '0123456789+-*/';
        if (validChars.includes(key)) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    },
    [gameState, showAuthFlow, submitGuess, currentGuess],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key.length === 1) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="space-y-4">
      {sdkHasLoaded && !isLoggedIn && (
        <div className="flex items-center justify-center py-2 px-4 rounded-md text-center text-sm text-foreground bg-muted">
          <InfoIcon className="size-4 mr-2" /> Log in or sign up to save your
          game results
        </div>
      )}
      <GameHeader targetNumber={targetNumber} />
      {errorMessage && (
        <div className="flex items-center justify-center py-2 px-4 rounded-md text-center text-sm text-destructive bg-destructive/10">
          <CircleAlertIcon className="size-4 mr-2" /> {errorMessage}
        </div>
      )}
      <GameGrid
        guesses={guesses}
        currentGuess={currentGuess}
        cellStates={cellStates}
      />
      <GameKeyboard
        keyStates={keyStates}
        disabled={gameState !== 'playing'}
        onKeyPress={handleKeyPress}
      />
      <div className="flex justify-center">
        <Button
          variant="link"
          onClick={startNewGame}
          className="underline cursor-pointer"
        >
          New Game
        </Button>
      </div>
      <GameModal
        isOpen={showModal}
        gameState={gameState}
        solution={solution}
        targetNumber={targetNumber}
        guesses={guesses.length}
        gameResults={gameResults}
        gameResultsStatus={gameResultsStatus}
        onClose={() => setShowModal(false)}
        onNewGame={() => {
          setShowModal(false);
          // Small delay (equivalent to modal close animation)
          // to allow the modal to close before resetting state.
          // Otherwise, a winning modal will flash a losing state
          // when closing.
          setTimeout(() => startNewGame(), 150);
        }}
      />
    </div>
  );
}
