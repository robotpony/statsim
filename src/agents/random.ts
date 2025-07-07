import { Agent } from '../services/agent.js';
import { GameState, Move, PlayerHand } from '../services/game.js';

export class RandomAgent implements Agent {
  readonly name = 'random';

  makeMove(gameState: GameState, playerHand: PlayerHand): Move {
    if (gameState.gameType === 'golf-4x') {
      return this.makeGolfMove(gameState, playerHand);
    } else {
      return this.makeDiceMove(gameState, playerHand);
    }
  }

  private makeGolfMove(gameState: GameState, playerHand: PlayerHand): Move {
    const actions = ['draw_deck', 'draw_discard', 'knock'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    switch (randomAction) {
      case 'draw_deck':
        return { type: 'draw_deck', data: {} };
      case 'draw_discard':
        return { type: 'draw_discard', data: {} };
      case 'knock':
        return { type: 'knock', data: {} };
      default:
        return { type: 'draw_deck', data: {} };
    }
  }

  private makeDiceMove(gameState: GameState, playerHand: PlayerHand): Move {
    if (!playerHand.canContinue) {
      return { type: 'roll', data: {} };
    }
    
    // Random choice to continue or bank
    const shouldContinue = Math.random() < 0.5;
    
    if (shouldContinue && (playerHand.remainingDice || 0) > 0) {
      return { type: 'continue', data: {} };
    } else {
      return { type: 'bank', data: {} };
    }
  }
}