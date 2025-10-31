export type CellState = 'correct' | 'present' | 'absent' | 'empty';

export type GameState = 'playing' | 'won' | 'lost';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MetadataGameResult {
  result: Exclude<GameState, 'playing'>;
  guesses: number;
  played_at: string;
}

export interface Puzzle {
  equation: string;
  target: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
