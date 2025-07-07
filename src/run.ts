import { SimulationRunner, RunConfig } from './services/simulation.js';
import { agentRegistry } from './services/agent.js';
import { resultsStorage } from './services/results.js';
import { Golf4xGame } from './games/golf-4x.js';
import { Dice1000Game } from './games/dice-1000-10000.js';

export async function runCommand(args: string[]): Promise<void> {
  if (args.length < 2) {
    console.error('Usage: statsim run <game> <agent1> [agent2] [agent3] ...');
    process.exit(1);
  }

  const [gameType, ...agentNames] = args;
  
  if (!['golf-4x', 'dice-1000-10000'].includes(gameType)) {
    console.error(`Unknown game: ${gameType}`);
    console.error('Available games: golf-4x, dice-1000-10000');
    process.exit(1);
  }

  if (agentNames.length === 0) {
    console.error('At least one agent is required');
    process.exit(1);
  }

  // Validate agents exist
  const availableAgents = agentRegistry.getAvailableAgents();
  for (const agentName of agentNames) {
    if (!availableAgents.includes(agentName)) {
      console.error(`Unknown agent: ${agentName}`);
      console.error(`Available agents: ${availableAgents.join(', ')}`);
      process.exit(1);
    }
  }

  // Create game instance
  const game = gameType === 'golf-4x' ? new Golf4xGame() : new Dice1000Game();
  
  // Create agents
  const agents = agentNames.map(name => agentRegistry.create(name));
  
  // Create run configuration
  const config: RunConfig = {
    gameType: gameType as 'golf-4x' | 'dice-1000-10000',
    agents: agentNames,
    iterations: 1000, // Default iterations
    parameters: gameType === 'dice-1000-10000' ? { targetScore: 10000 } : {}
  };

  console.log(`Running ${gameType} with ${agents.length} players (${agentNames.join(', ')})...`);

  // Create simulation runner
  const runner = new SimulationRunner();
  
  // Set up progress callback
  let dotsShown = 0;
  runner.setProgressCallback((progress) => {
    if (progress.iteration % 10 === 0) {
      process.stdout.write('.');
      dotsShown++;
      
      if (dotsShown % 50 === 0) {
        process.stdout.write(`\n${progress.iteration}/${progress.totalIterations} `);
      }
    }
  });

  try {
    // Run simulation
    const results = await runner.run(config, game, agents);
    
    console.log('\nDONE\n');
    
    // Calculate and display results
    const totalGames = results.length;
    const wins = new Array(agents.length).fill(0);
    const totalScores = new Array(agents.length).fill(0);
    
    results.forEach(result => {
      wins[result.winner]++;
      result.finalScores.forEach((score, i) => {
        totalScores[i] += score;
      });
    });
    
    console.log('Results:');
    agents.forEach((agent, i) => {
      const avgScore = (totalScores[i] / totalGames).toFixed(1);
      const winRate = ((wins[i] / totalGames) * 100).toFixed(1);
      console.log(`  P${i + 1} - ${agent.name.padEnd(15)} Wins: ${wins[i].toString().padStart(4)} (${winRate}%)  Avg Score: ${avgScore}`);
    });
    
    // Save results
    results.forEach(result => {
      resultsStorage.save(result);
    });
    
    console.log(`\nResults saved. Run 'statsim show' to view detailed results.`);
    
  } catch (error) {
    console.error('Error running simulation:', error);
    process.exit(1);
  }
}