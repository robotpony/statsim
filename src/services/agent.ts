import { GameState, Move, PlayerHand } from './game.js';

export interface Agent {
  name: string;
  makeMove(gameState: GameState, playerHand: PlayerHand): Move;
}

export interface AgentFactory {
  create(name: string): Agent;
  getAvailableAgents(): string[];
}

export class AgentRegistry {
  private agents: Map<string, () => Agent> = new Map();

  register(name: string, factory: () => Agent): void {
    this.agents.set(name, factory);
  }

  create(name: string): Agent {
    const factory = this.agents.get(name);
    if (!factory) {
      throw new Error(`Agent '${name}' not found`);
    }
    return factory();
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}

export const agentRegistry = new AgentRegistry();