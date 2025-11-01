# Numbler

[https://numbler-khaki.vercel.app](https://numbler-khaki.vercel.app)

## About

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and built with TypeScript, shadcn/ui, Tailwind CSS, and the Dynamic React SDK.

- 💪 TypeScript
- 🏗️ Next.js (React framework & build system)
  - Fast development builds
  - Optimized production build
- 🎨 shadcn/ui (component library)
  - Accelerates development with pre-built components
  - Provides design consistency
- 💅 Tailwind CSS (CSS library)
  - Accelerates development with utility classes
  - Pairs well with shadcn/ui
- 🛠️ Dynamic React SDK (authentication & user management library)
  - SDK for interacting with the Dynamic API

### Requirements

✅ = Full support  
⛔ = Partial support  
❌ = No support

| Requirement                                                                          | Support | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Should use Dynamic SDK for user to log-in and store the user’s history in `metadata` | ✅      | <ul><li>Dynamic SDK provider and widget for log in</li><li>Game results are stored on the `numbler_game_results` property of user metadata and surfaced as stats in the win/loss modal</li></ul>                                                                                                                                                                                                                                        |
| Numbers and operators can appear multiple times                                      | ✅      |                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Order of operation applies (\* and / are calculated before + and -)                  | ✅      |                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Should accept cumulative solutions (e.g. 1+5\*15 === 15\*5+1)                        | ✅      |                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| After each guess the color of the tiles should change to reflect the status          | ✅      |                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Controlling the game should be done with the mouse and keyboard                      | ✅      |                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Surprise us with something crypto related                                            | ✅      | <ul><li>I went a little rogue. 😅 Rather than building a crypto related feature, I created this [issue](https://github.com/BuckyMaler/numbler/issues/1) in hopes of potentially influencing direct business value for Dynamic React SDK consumers.</li></ul>                                                                                                                                                                            |
| Should include reasonable test coverage                                              | ❌      | <ul><li>No tests due to time constraints</li><li>Given more time, I would lean primarily on integration testing components, but I would also unit test the game logic in `lib/game-logic.ts` and include a happy path e2e test.</li><li>While each type of test has its advantages, I would lean primarily on integration tests because they offer the best balance of simulating a user, test coverage, and execution speed.</li></ul> |

## Development

### Prerequisites

- node 22.x

- npm 10.x

### Running the App

1. Run `npm install` to install all dependencies

2. Run `cp .env.example .env.local` to setup your environment variables

3. Run `npm run dev` to start the development server

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
