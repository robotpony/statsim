import { Game, GameState, Move, PlayerHand, GameParameters } from '../services/game.js';

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: number; // 1-13 (1=Ace, 11=Jack, 12=Queen, 13=King)
}

interface GolfGameState extends GameState {
  gameSpecificState: {
    deck: Card[];
    discardPile: Card[];
    playerHands: Card[][];
    playerKnownCards: boolean[][]; // which cards each player has looked at
    hasKnocked: boolean[];
    knockedPlayer: number | null;
    finalTurn: boolean;
  };
}

export class Golf4xGame implements Game {
  readonly name = 'golf-4x';
  readonly gameType = 'golf-4x' as const;

  initialize(playerCount: number, parameters: GameParameters): GameState {
    const deck = this.createDeck();
    this.shuffleDeck(deck);
    
    const playerHands: Card[][] = [];
    const playerKnownCards: boolean[][] = [];
    
    for (let i = 0; i < playerCount; i++) {
      playerHands.push(deck.splice(0, 4));
      playerKnownCards.push([false, false, true, true]); // can look at bottom 2 cards
    }
    
    const discardPile = [deck.pop()!];
    
    return {
      currentPlayer: 0,
      round: 1,
      scores: new Array(playerCount).fill(0),
      gameType: 'golf-4x',
      gameSpecificState: {
        deck,
        discardPile,
        playerHands,
        playerKnownCards,
        hasKnocked: new Array(playerCount).fill(false),
        knockedPlayer: null,
        finalTurn: false
      }
    } as GolfGameState;
  }

  private createDeck(): Card[] {
    const deck: Card[] = [];
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    
    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({ suit, rank });
      }
    }
    
    return deck;
  }

  private shuffleDeck(deck: Card[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  isValidMove(gameState: GameState, playerIndex: number, move: Move): boolean {
    const state = gameState as GolfGameState;
    
    if (playerIndex !== gameState.currentPlayer) {
      return false;
    }
    
    switch (move.type) {
      case 'draw_deck':
      case 'draw_discard':
        return true;
      case 'replace_card':
        return move.data.position >= 0 && move.data.position < 4;
      case 'discard':
        return true;
      case 'knock':
        return !state.gameSpecificState.hasKnocked[playerIndex];
      default:
        return false;
    }
  }

  applyMove(gameState: GameState, playerIndex: number, move: Move): GameState {
    const state = { ...gameState } as GolfGameState;
    
    switch (move.type) {
      case 'draw_deck':
        // Drawing from deck is handled in the turn logic
        break;
      case 'draw_discard':
        // Drawing from discard is handled in the turn logic
        break;
      case 'replace_card':
        const { position, card } = move.data;
        const oldCard = state.gameSpecificState.playerHands[playerIndex][position];
        state.gameSpecificState.playerHands[playerIndex][position] = card;
        state.gameSpecificState.playerKnownCards[playerIndex][position] = true;
        state.gameSpecificState.discardPile.push(oldCard);
        break;
      case 'discard':
        state.gameSpecificState.discardPile.push(move.data.card);
        break;
      case 'knock':
        state.gameSpecificState.hasKnocked[playerIndex] = true;
        state.gameSpecificState.knockedPlayer = playerIndex;
        state.gameSpecificState.finalTurn = true;
        break;
    }
    
    // Move to next player
    state.currentPlayer = (state.currentPlayer + 1) % state.scores.length;
    
    // Check if final turn is complete
    if (state.gameSpecificState.finalTurn && state.currentPlayer === state.gameSpecificState.knockedPlayer) {
      state.round++;
      this.scoreRound(state);
      
      if (this.isGameOver(state)) {
        return state;
      }
      
      // Start new round
      this.startNewRound(state);
    }
    
    return state;
  }

  private scoreRound(state: GolfGameState): void {
    for (let i = 0; i < state.gameSpecificState.playerHands.length; i++) {
      const hand = state.gameSpecificState.playerHands[i];
      let roundScore = 0;
      
      // Calculate pairs in columns
      const column1 = [hand[0], hand[2]];
      const column2 = [hand[1], hand[3]];
      
      if (column1[0].rank === column1[1].rank) {
        // Pair in column 1 = 0 points
      } else {
        roundScore += this.getCardValue(column1[0]) + this.getCardValue(column1[1]);
      }
      
      if (column2[0].rank === column2[1].rank) {
        // Pair in column 2 = 0 points
      } else {
        roundScore += this.getCardValue(column2[0]) + this.getCardValue(column2[1]);
      }
      
      state.scores[i] += roundScore;
    }
  }

  private getCardValue(card: Card): number {
    if (card.rank === 1) return 1; // Ace
    if (card.rank >= 11) return 10; // Face cards
    return card.rank;
  }

  private startNewRound(state: GolfGameState): void {
    const deck = this.createDeck();
    this.shuffleDeck(deck);
    
    const playerHands: Card[][] = [];
    const playerKnownCards: boolean[][] = [];
    
    for (let i = 0; i < state.scores.length; i++) {
      playerHands.push(deck.splice(0, 4));
      playerKnownCards.push([false, false, true, true]);
    }
    
    state.gameSpecificState.deck = deck;
    state.gameSpecificState.discardPile = [deck.pop()!];
    state.gameSpecificState.playerHands = playerHands;
    state.gameSpecificState.playerKnownCards = playerKnownCards;
    state.gameSpecificState.hasKnocked.fill(false);
    state.gameSpecificState.knockedPlayer = null;
    state.gameSpecificState.finalTurn = false;
    state.currentPlayer = 0;
  }

  isGameOver(gameState: GameState): boolean {
    const maxRounds = 9; // Standard golf game
    return gameState.round > maxRounds;
  }

  getWinner(gameState: GameState): number {
    let minScore = Infinity;
    let winner = 0;
    
    for (let i = 0; i < gameState.scores.length; i++) {
      if (gameState.scores[i] < minScore) {
        minScore = gameState.scores[i];
        winner = i;
      }
    }
    
    return winner;
  }

  getPlayerHand(gameState: GameState, playerIndex: number): PlayerHand {
    const state = gameState as GolfGameState;
    return {
      cards: state.gameSpecificState.playerHands[playerIndex],
      knownCards: state.gameSpecificState.playerKnownCards[playerIndex],
      discardTop: state.gameSpecificState.discardPile[state.gameSpecificState.discardPile.length - 1]
    };
  }

  getScore(gameState: GameState, playerIndex: number): number {
    return gameState.scores[playerIndex];
  }
}