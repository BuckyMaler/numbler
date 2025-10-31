interface GameHeaderProps {
  targetNumber: number;
}

export function GameHeader({ targetNumber }: GameHeaderProps) {
  return (
    <p className="text-center">
      Find the hidden calculation{' '}
      <span style={{ backgroundColor: 'yellow' }}>
        that equals {targetNumber}
      </span>
    </p>
  );
}
