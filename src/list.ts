export interface Game {
  name: string;
  description?: string;
}

export interface Run {
  id: string;
  game: string;
  scenario: string;
  agents: string[];
  timestamp: Date;
}

export interface Agent {
  name: string;
  description?: string;
}

export class ListService {
  private games: Game[] = [
    { name: 'golf-4x', description: 'Golf card game with 4 players' },
    { name: 'dice-1000-10000', description: 'Dice game with scoring ranges' }
  ];

  private agents: Agent[] = [
    { name: 'random', description: 'Makes random moves' },
    { name: 'low-card', description: 'Prefers low cards' },
    { name: 'example-agent', description: 'Example agent implementation' }
  ];

  private runs: Run[] = [
    {
      id: '1',
      game: 'golf-4x',
      scenario: 'scenario 1',
      agents: ['random', 'low-card'],
      timestamp: new Date()
    }
  ];

  getGames(): Game[] {
    return this.games;
  }

  getAgents(): Agent[] {
    return this.agents;
  }

  getRuns(): Run[] {
    return this.runs;
  }

  formatList(): string {
    const output: string[] = [];
    
    output.push('Available games:');
    this.games.forEach((game, index) => {
      const prefix = index === 0 ? ' ⎿ ' : '    ';
      output.push(`${prefix}${game.name}`);
    });
    
    output.push('');
    output.push('Available runs:');
    this.runs.forEach((run, index) => {
      const prefix = index === 0 ? ' ⎿ ' : '    ';
      output.push(`${prefix}${run.game} (${run.scenario})`);
    });
    
    output.push('');
    output.push('Available agents:');
    this.agents.forEach((agent, index) => {
      const prefix = index === 0 ? ' ⎿ ' : '    ';
      output.push(`${prefix}${agent.name}`);
    });
    
    return output.join('\n');
  }
}