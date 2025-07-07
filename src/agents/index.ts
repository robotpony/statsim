import { agentRegistry } from '../services/agent.js';
import { RandomAgent } from './random.js';

// Register all agents
agentRegistry.register('random', () => new RandomAgent());

export { agentRegistry };