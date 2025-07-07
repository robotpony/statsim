# statsim design

## Tracking games, runs, agents, and results

- games refers to the available games (golf-4x and dice-1000-10000)
- a run is a single execution of a game with a set of agents and number of iterations
- agents are functions that take the gameboard and current hand, and return the next move
- agents are simple functions
- results are stored per run in a CSV file, listing the game, agents, parameters, each hand, and the overall results including the winners and losers
- results can be compared with each other

## Game Specifications

### Golf-4x
A card game where players try to achieve the lowest score over multiple rounds.

**Rules:**
- Each player starts with 4 cards face down
- Players can look at their bottom 2 cards at the start
- Each turn: draw from deck or discard pile, then discard one card
- Players can swap cards in their hand with drawn cards
- Round ends when a player knocks (thinks they have lowest score)
- All other players get one more turn
- Cards are revealed and scored

**Scoring:**
- Number cards: face value (2-10)
- Face cards (J, Q, K): 10 points each
- Aces: 1 point each
- Pairs in same column: 0 points
- Lowest total score wins

**Win Condition:** Lowest cumulative score after multiple rounds

### Dice-1000-10000
A dice game where players must reach 1000 points to start scoring, then they try to reach the goal of 10000 points.


**Rules:**
- Players roll 5 dice per turn
- To enter the game, a player must roll 1000 points
- Must score points with at least one die to continue turn
- Can choose to bank points or continue rolling with remaining dice
- If no scoring dice in a roll, lose all unbanked points for that turn
- First player to reach target score wins

**Scoring:**
- Single 1: 100 points
- Single 5: 50 points
- Three 1s: 1000 points
- Three 2s: 200 points
- Three 3s: 300 points
- Three 4s: 400 points
- Three 5s: 500 points
- Three 6s: 600 points


**Win Condition:** First to reach target score (10000)

## Agent Interface

```typescript
interface Agent {
  name: string;
  makeMove(gameState: GameState, playerHand: PlayerHand): Move;
}

interface GameState {
  currentPlayer: number;
  round: number;
  scores: number[];
  gameType: 'golf-4x' | 'dice-1000-10000';
  gameSpecificState: any;
}

interface Move {
  type: string;
  data: any;
}
```

## Data Structures

### Run Configuration
```typescript
interface RunConfig {
  gameType: 'golf-4x' | 'dice-1000-10000';
  agents: string[];
  iterations: number;
  parameters: GameParameters;
}
```

### Game Results
```typescript
interface GameResult {
  runId: string;
  gameType: string;
  agents: string[];
  parameters: GameParameters;
  rounds: RoundResult[];
  finalScores: number[];
  winner: number;
  timestamp: Date;
}
```

### Storage Format
Results stored as CSV with columns:
- run_id, game_type, agents, parameters, round, player, score, moves, final_score, winner, timestamp
