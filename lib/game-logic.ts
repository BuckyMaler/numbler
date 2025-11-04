import type {
  CellState,
  MetadataGameResult,
  Puzzle,
  ValidationResult,
} from '@/lib/types';

export const MAX_GUESSES = 6;
export const EQUATION_LENGTH = 6;

/**
 * Evaluates a mathematical expression following order of operations
 */
export function evaluateExpression(expression: string) {
  try {
    // Only allow digits and + - * /
    if (!/^[\d+\-*/]+$/.test(expression)) {
      return null;
    }
    // Evaluate using `Function` constructor (safe due to regex)
    const result = Function(`'use strict'; return (${expression})`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Validates if an equation is properly formed and evaluates to the target
 */
export function isValidEquation(
  equation: string,
  target: number,
): ValidationResult {
  if (equation.length !== EQUATION_LENGTH) {
    return {
      valid: false,
      error: `Equation must be ${EQUATION_LENGTH} characters`,
    };
  }

  // Check for valid characters
  if (!/^[\d+\-*/]+$/.test(equation)) {
    return { valid: false, error: 'Invalid characters' };
  }

  // Check that it doesn't start or end with an operator
  if (/^[+\-*/]/.test(equation) || /[+\-*/]$/.test(equation)) {
    return { valid: false, error: 'Cannot start/end with operator' };
  }

  // Check for consecutive operators
  if (/[+\-*/]{2,}/.test(equation)) {
    return { valid: false, error: 'Invalid operator sequence' };
  }

  const result = evaluateExpression(equation);

  if (result === null) {
    return { valid: false, error: 'Invalid equation' };
  }

  if (result !== target) {
    return { valid: false, error: `Equals ${result}, not ${target}` };
  }

  return { valid: true };
}

/**
 * Compares a guess against the solution and returns cell states
 */
export function evaluateGuess(guess: string, solution: string): CellState[] {
  const result: CellState[] = Array(guess.length).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');

  // First pass: mark correct positions
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = 'correct';
      solutionChars[i] = ''; // Mark as used
    }
  }

  // Second pass: mark present characters
  for (let i = 0; i < guessChars.length; i++) {
    if (result[i] === 'correct') continue;

    const charIndex = solutionChars.indexOf(guessChars[i]);
    if (charIndex !== -1) {
      result[i] = 'present';
      solutionChars[charIndex] = ''; // Mark as used
    }
  }

  return result;
}

/**
 * Generates a random valid puzzle
 */
export function generatePuzzle(): Puzzle {
  const puzzles: Puzzle[] = [
    { equation: '10+5*2', target: 20 },
    { equation: '8*3-12', target: 12 },
    { equation: '15/3+7', target: 12 },
    { equation: '9+6-10', target: 5 },
    { equation: '4*5+10', target: 30 },
    { equation: '18-6/2', target: 15 },
    { equation: '7*2+11', target: 25 },
    { equation: '20/4+8', target: 13 },
    { equation: '119-41', target: 78 },
    { equation: '12-8/4', target: 10 },
    { equation: '5*6-15', target: 15 },
    { equation: '16/2+9', target: 17 },
    { equation: '21/7+9', target: 12 },
    { equation: '14-7+8', target: 15 },
    { equation: '90/9+7', target: 17 },
    { equation: '24/3+2', target: 10 },
    { equation: '11+5-7', target: 9 },
    { equation: '8/2+12', target: 16 },
    { equation: '6*4-18', target: 6 },
    { equation: '15+3/3', target: 16 },
  ];

  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true') {
    return puzzles[0];
  }

  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

/**
 * Calculates game statistics from an array of `MetadataGameResult`
 */
export function calculateGameStats(results: MetadataGameResult[]) {
  const gamesPlayed = results.length;
  const wins = results.filter((r) => r.result === 'won');
  const winCount = wins.length;
  const winPercentage =
    gamesPlayed === 0 ? 0 : Math.round((winCount / gamesPlayed) * 100);

  const sorted = [...results].sort(
    (a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime(),
  );

  let currentWinStreak = 0;
  let longestWinStreak = 0;
  let streak = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].result === 'won') {
      streak++;
      if (streak > longestWinStreak) longestWinStreak = streak;
    } else {
      streak = 0;
    }
  }
  currentWinStreak = streak;

  return {
    gamesPlayed,
    winPercentage,
    currentWinStreak,
    longestWinStreak,
  };
}
