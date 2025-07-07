import { Game, GameState, GameResult, GameParameters, RoundResult } from './game.js';
import { Agent } from './agent.js';

export interface RunConfig {
  gameType: 'golf-4x' | 'dice-1000-10000';
  agents: string[];
  iterations: number;
  parameters: GameParameters;
}

export interface SimulationProgress {
  iteration: number;
  totalIterations: number;
  currentGame?: GameState;
  results: GameResult[];
}

export class SimulationRunner {
  private progressCallback?: (progress: SimulationProgress) => void;

  setProgressCallback(callback: (progress: SimulationProgress) => void): void {
    this.progressCallback = callback;
  }

  async run(config: RunConfig, game: Game, agents: Agent[]): Promise<GameResult[]> {
    const results: GameResult[] = [];
    
    for (let i = 0; i < config.iterations; i++) {
      const result = await this.runSingleGame(config, game, agents, i);
      results.push(result);
      
      if (this.progressCallback) {
        this.progressCallback({
          iteration: i + 1,
          totalIterations: config.iterations,
          results: results
        });
      }
    }
    
    return results;
  }

  private async runSingleGame(config: RunConfig, game: Game, agents: Agent[], iteration: number): Promise<GameResult> {
    const runId = `${config.gameType}-${Date.now()}-${iteration}`;
    const gameState = game.initialize(agents.length, config.parameters);
    const rounds: RoundResult[] = [];
    
    while (!game.isGameOver(gameState)) {
      const round = await this.playRound(gameState, game, agents);
      rounds.push(round);
      
      if (this.progressCallback) {
        this.progressCallback({
          iteration: iteration + 1,
          totalIterations: config.iterations,
          currentGame: gameState,
          results: []
        });
      }
    }
    
    return {
      runId,
      gameType: config.gameType,
      agents: agents.map(a => a.name),
      parameters: config.parameters,
      rounds,
      finalScores: agents.map((_, i) => game.getScore(gameState, i)),
      winner: game.getWinner(gameState),
      timestamp: new Date()
    };
  }

  private async playRound(gameState: GameState, game: Game, agents: Agent[]): Promise<RoundResult> {
    const roundMoves = [];
    const initialScores = agents.map((_, i) => game.getScore(gameState, i));
    
    while (gameState.currentPlayer < agents.length && !game.isGameOver(gameState)) {
      const currentAgent = agents[gameState.currentPlayer];
      const playerHand = game.getPlayerHand(gameState, gameState.currentPlayer);
      const move = currentAgent.makeMove(gameState, playerHand);
      
      if (game.isValidMove(gameState, gameState.currentPlayer, move)) {
        game.applyMove(gameState, gameState.currentPlayer, move);
        roundMoves.push(move);
      }
      
      gameState.currentPlayer = (gameState.currentPlayer + 1) % agents.length;
    }
    
    return {
      round: gameState.round,
      playerScores: agents.map((_, i) => game.getScore(gameState, i)),
      moves: roundMoves,
      winner: game.isGameOver(gameState) ? game.getWinner(gameState) : undefined
    };
  }
}