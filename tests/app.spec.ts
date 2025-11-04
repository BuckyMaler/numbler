import { Page, expect, test } from '@playwright/test';

type CellClass = 'bg-correct' | 'bg-present' | 'bg-absent' | 'bg-card';

async function enterGuess(page: Page, guess: string) {
  const chars = guess.split('');
  for (const char of chars) {
    await page.getByRole('button', { name: char, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Enter', exact: true }).click();
}

test('happy path win', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText('Find the hidden calculation that equals 20'),
  ).toBeVisible();

  await enterGuess(page, '20+1-1');
  await enterGuess(page, '20-1+1');
  await enterGuess(page, '10+5*2');

  // prettier-ignore
  const expectedClasses: CellClass[] = [
    'bg-present', 'bg-correct', 'bg-correct', 'bg-present', 'bg-absent', 'bg-absent',
    'bg-present', 'bg-correct', 'bg-absent', 'bg-present', 'bg-present', 'bg-absent',
    'bg-correct', 'bg-correct', 'bg-correct', 'bg-correct', 'bg-correct', 'bg-correct',
    ...Array(18).fill('bg-card'),
  ];

  const gameCells = await page.getByTestId('game-cell').all();
  for (let i = 0; i < gameCells.length; i++) {
    await expect(gameCells[i]).toContainClass(expectedClasses[i]);
  }

  await expect(page.getByText('Congratulations!')).toBeVisible();
  await expect(
    page.getByText('You solved the puzzle in 3 guesses!'),
  ).toBeVisible();
});

test('happy path loss', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText('Find the hidden calculation that equals 20'),
  ).toBeVisible();

  await enterGuess(page, '20+1-1');
  await enterGuess(page, '20-1+1');
  await enterGuess(page, '1-1+20');
  await enterGuess(page, '1+20-1');
  await enterGuess(page, '10+5+5');
  await enterGuess(page, '5+5+10');

  // prettier-ignore
  const expectedClasses: CellClass[] = [
    'bg-present', 'bg-correct', 'bg-correct', 'bg-present', 'bg-absent', 'bg-absent',
    'bg-present', 'bg-correct', 'bg-absent', 'bg-present', 'bg-present', 'bg-absent',
    'bg-correct', 'bg-absent', 'bg-absent', 'bg-present', 'bg-present', 'bg-present',
    'bg-correct', 'bg-present', 'bg-present', 'bg-present', 'bg-absent', 'bg-absent',
    'bg-correct', 'bg-correct', 'bg-correct', 'bg-correct', 'bg-absent', 'bg-absent',
    'bg-present', 'bg-present', 'bg-absent', 'bg-absent', 'bg-present', 'bg-present',
  ];

  const gameCells = await page.getByTestId('game-cell').all();
  for (let i = 0; i < gameCells.length; i++) {
    await expect(gameCells[i]).toContainClass(expectedClasses[i]);
  }

  await expect(page.getByText('Game Over')).toBeVisible();
  await expect(page.getByText('10+5*2 = 20')).toBeVisible();
});
