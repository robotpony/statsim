#!/usr/bin/env node

import { Command } from 'commander';
import { ListService } from './list.js';
import { runCommand } from './run.js';
import './agents/index.js'; // Register agents

const program = new Command();

program
  .name('statsim')
  .description('Run a game simulation')
  .version('1.0.0');

program
  .command('list')
  .description('List simulations')
  .action(() => {
    const listService = new ListService();
    console.log(listService.formatList());
  });

program
  .command('run <game> <agents...>')
  .description('Run the named game with given agents')
  .action((game: string, agents: string[]) => {
    runCommand([game, ...agents]);
  });

program
  .command('show')
  .description('Show results from latest (or named) run')
  .action(() => {
    console.log('show command called');
  });

program
  .command('stop')
  .description('Stop a running simulation')
  .action(() => {
    console.log('stop command called');
  });

program
  .command('ps')
  .description('List simulation progress')
  .action(() => {
    console.log('ps command called');
  });

program.parse();