import { Game, GameState, Move, PlayerHand, GameParameters } from '../services/game.js';

interface DiceGameState extends GameState {
  gameSpecificState: {
    playerScores: number[];
    playerEnteredGame: boolean[]; // has player scored 1000+ to enter?
    currentTurnScore: number;
    remainingDice: number;
    lastRoll: number[];
    canContinue: boolean;
    targetScore: number;
  };
}

export class Dice1000Game implements Game {
  readonly name = 'dice-1000-10000';
  readonly gameType = 'dice-1000-10000' as const;

  initialize(playerCount: number, parameters: GameParameters): GameState {
    const targetScore = parameters.targetScore || 10000;
    
    return {
      currentPlayer: 0,
      round: 1,
      scores: new Array(playerCount).fill(0),
      gameType: 'dice-1000-10000',
      gameSpecificState: {
        playerScores: new Array(playerCount).fill(0),
        playerEnteredGame: new Array(playerCount).fill(false),
        currentTurnScore: 0,
        remainingDice: 5,
        lastRoll: [],
        canContinue: false,
        targetScore
      }
    } as DiceGameState;
  }

  isValidMove(gameState: GameState, playerIndex: number, move: Move): boolean {
    const state = gameState as DiceGameState;
    
    if (playerIndex !== gameState.currentPlayer) {
      return false;
    }
    
    switch (move.type) {
      case 'roll':
        return state.gameSpecificState.remainingDice > 0;
      case 'bank':
        return state.gameSpecificState.currentTurnScore > 0;
      case 'continue':
        return state.gameSpecificState.canContinue && state.gameSpecificState.remainingDice > 0;
      default:
        return false;
    }
  }

  applyMove(gameState: GameState, playerIndex: number, move: Move): GameState {
    const state = { ...gameState } as DiceGameState;
    
    switch (move.type) {
      case 'roll':
        this.rollDice(state);
        break;
      case 'bank':
        this.bankPoints(state, playerIndex);
        this.nextPlayer(state);
        break;
      case 'continue':
        // Continue with remaining dice
        break;
    }
    
    return state;
  }

  private rollDice(state: DiceGameState): void {
    const roll = [];
    for (let i = 0; i < state.gameSpecificState.remainingDice; i++) {
      roll.push(Math.floor(Math.random() * 6) + 1);
    }
    
    state.gameSpecificState.lastRoll = roll;
    const rollScore = this.calculateRollScore(roll);
    
    if (rollScore === 0) {
      // Bust - lose all turn points
      state.gameSpecificState.currentTurnScore = 0;
      state.gameSpecificState.canContinue = false;
      this.nextPlayer(state);
    } else {
      state.gameSpecificState.currentTurnScore += rollScore;
      state.gameSpecificState.canContinue = true;
      // Remove scoring dice (simplified - remove all dice that scored)
      state.gameSpecificState.remainingDice = Math.max(0, state.gameSpecificState.remainingDice - this.countScoringDice(roll));
      
      // If no dice left, can roll all 5 again
      if (state.gameSpecificState.remainingDice === 0) {
        state.gameSpecificState.remainingDice = 5;
      }
    }
  }

  private calculateRollScore(dice: number[]): number {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // index 0 unused, 1-6 for dice values
    dice.forEach(die => counts[die]++);
    
    let score = 0;
    
    // Three of a kind
    for (let i = 1; i <= 6; i++) {
      if (counts[i] >= 3) {
        if (i === 1) {
          score += 1000;
        } else {
          score += i * 100;
        }
        counts[i] -= 3;
      }
    }
    
    // Individual 1s and 5s
    score += counts[1] * 100; // remaining 1s
    score += counts[5] * 50;  // remaining 5s
    
    return score;
  }

  private countScoringDice(dice: number[]): number {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    dice.forEach(die => counts[die]++);
    
    let scoringDice = 0;
    
    // Three of a kind uses 3 dice
    for (let i = 1; i <= 6; i++) {
      if (counts[i] >= 3) {
        scoringDice += 3;
        counts[i] -= 3;
      }
    }
    
    // Individual 1s and 5s
    scoringDice += counts[1] + counts[5];
    
    return scoringDice;
  }

  private bankPoints(state: DiceGameState, playerIndex: number): void {
    const totalScore = state.gameSpecificState.currentTurnScore;
    
    // Check if player can enter the game
    if (!state.gameSpecificState.playerEnteredGame[playerIndex]) {
      if (totalScore >= 1000) {
        state.gameSpecificState.playerEnteredGame[playerIndex] = true;
        state.gameSpecificState.playerScores[playerIndex] += totalScore;
        state.scores[playerIndex] = state.gameSpecificState.playerScores[playerIndex];
      }
    } else {
      // Player already in game, add to score
      state.gameSpecificState.playerScores[playerIndex] += totalScore;
      state.scores[playerIndex] = state.gameSpecificState.playerScores[playerIndex];
    }
    
    // Reset turn
    state.gameSpecificState.currentTurnScore = 0;
    state.gameSpecificState.remainingDice = 5;
    state.gameSpecificState.canContinue = false;
  }

  private nextPlayer(state: DiceGameState): void {
    state.currentPlayer = (state.currentPlayer + 1) % state.scores.length;
    state.gameSpecificState.currentTurnScore = 0;
    state.gameSpecificState.remainingDice = 5;
    state.gameSpecificState.canContinue = false;
    state.gameSpecificState.lastRoll = [];
  }

  isGameOver(gameState: GameState): boolean {
    const state = gameState as DiceGameState;
    return state.gameSpecificState.playerScores.some(score => score >= state.gameSpecificState.targetScore);
  }

  getWinner(gameState: GameState): number {
    const state = gameState as DiceGameState;
    let maxScore = -1;
    let winner = 0;
    
    for (let i = 0; i < state.gameSpecificState.playerScores.length; i++) {
      if (state.gameSpecificState.playerScores[i] >= state.gameSpecificState.targetScore && 
          state.gameSpecificState.playerScores[i] > maxScore) {
        maxScore = state.gameSpecificState.playerScores[i];
        winner = i;
      }
    }
    
    return winner;
  }

  getPlayerHand(gameState: GameState, playerIndex: number): PlayerHand {
    const state = gameState as DiceGameState;
    return {
      dice: state.gameSpecificState.lastRoll,
      currentScore: state.gameSpecificState.playerScores[playerIndex],
      turnScore: state.gameSpecificState.currentTurnScore,
      remainingDice: state.gameSpecificState.remainingDice,
      hasEntered: state.gameSpecificState.playerEnteredGame[playerIndex],
      canContinue: state.gameSpecificState.canContinue
    };
  }

  getScore(gameState: GameState, playerIndex: number): number {
    const state = gameState as DiceGameState;
    return state.gameSpecificState.playerScores[playerIndex];
  }
}