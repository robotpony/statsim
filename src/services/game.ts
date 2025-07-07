export interface GameState {
  currentPlayer: number;
  round: number;
  scores: number[];
  gameType: 'golf-4x' | 'dice-1000-10000';
  gameSpecificState: any;
}

export interface Move {
  type: string;
  data: any;
}

export interface PlayerHand {
  cards?: any[];
  dice?: number[];
  [key: string]: any;
}

export interface GameParameters {
  rounds?: number;
  targetScore?: number;
  [key: string]: any;
}

export interface RoundResult {
  round: number;
  playerScores: number[];
  moves: Move[];
  winner?: number;
}

export interface GameResult {
  runId: string;
  gameType: string;
  agents: string[];
  parameters: GameParameters;
  rounds: RoundResult[];
  finalScores: number[];
  winner: number;
  timestamp: Date;
}

export interface Game {
  readonly name: string;
  readonly gameType: 'golf-4x' | 'dice-1000-10000';
  
  initialize(playerCount: number, parameters: GameParameters): GameState;
  isValidMove(gameState: GameState, playerIndex: number, move: Move): boolean;
  applyMove(gameState: GameState, playerIndex: number, move: Move): GameState;
  isGameOver(gameState: GameState): boolean;
  getWinner(gameState: GameState): number;
  getPlayerHand(gameState: GameState, playerIndex: number): PlayerHand;
  getScore(gameState: GameState, playerIndex: number): number;
}