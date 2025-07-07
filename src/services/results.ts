import { GameResult } from './game.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ResultsStorage {
  save(result: GameResult): void;
  load(runId: string): GameResult | null;
  loadAll(): GameResult[];
  getLatest(): GameResult | null;
  exportToCsv(results: GameResult[]): string;
}

export class FileResultsStorage implements ResultsStorage {
  private readonly dataDir: string;

  constructor(dataDir: string = 'data') {
    this.dataDir = dataDir;
    this.ensureDataDir();
  }

  private ensureDataDir(): void {
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
  }

  save(result: GameResult): void {
    const filePath = join(this.dataDir, `${result.runId}.json`);
    writeFileSync(filePath, JSON.stringify(result, null, 2));
  }

  load(runId: string): GameResult | null {
    const filePath = join(this.dataDir, `${runId}.json`);
    if (!existsSync(filePath)) {
      return null;
    }
    
    try {
      const data = readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading result ${runId}:`, error);
      return null;
    }
  }

  loadAll(): GameResult[] {
    const results: GameResult[] = [];
    
    if (!existsSync(this.dataDir)) {
      return results;
    }

    try {
      const files = require('fs').readdirSync(this.dataDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const runId = file.replace('.json', '');
          const result = this.load(runId);
          if (result) {
            results.push(result);
          }
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }

    return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getLatest(): GameResult | null {
    const results = this.loadAll();
    return results.length > 0 ? results[0] : null;
  }

  exportToCsv(results: GameResult[]): string {
    const headers = [
      'run_id', 'game_type', 'agents', 'parameters', 'round', 
      'player', 'score', 'moves', 'final_score', 'winner', 'timestamp'
    ];
    
    const rows = [headers.join(',')];
    
    for (const result of results) {
      const agentsStr = result.agents.join('|');
      const parametersStr = JSON.stringify(result.parameters).replace(/"/g, '""');
      
      for (const round of result.rounds) {
        for (let playerIndex = 0; playerIndex < result.agents.length; playerIndex++) {
          const score = round.playerScores[playerIndex];
          const finalScore = result.finalScores[playerIndex];
          const moves = round.moves.length;
          
          rows.push([
            result.runId,
            result.gameType,
            `"${agentsStr}"`,
            `"${parametersStr}"`,
            round.round,
            playerIndex,
            score,
            moves,
            finalScore,
            result.winner,
            result.timestamp.toISOString()
          ].join(','));
        }
      }
    }
    
    return rows.join('\n');
  }
}

export const resultsStorage = new FileResultsStorage();