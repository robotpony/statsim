#!/usr/bin/env node

import { Command } from 'commander';
import { ListService } from './list';

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
  .command('run <name>')
  .description('Run the named model')
  .action((name: string) => {
    console.log(`run command called with: ${name}`);
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