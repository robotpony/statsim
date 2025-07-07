# CLAUDE.md

We;re building a production-quality command-line tool for running statistics simulations for games humans play, to simulate various strategies and gameplay scenarios.

## Project Overview

This is a simulation runner called `statsim` that executes game simulations with multiple players. The project appears to be in early development with empty source directories.

## Standard Workflow

1. Think through the problem, read the codebase and relavent flies, and write a plan in `tasks/todo/md`.
2. The plan should have a list of TODO iteams that you check off as you complete them.
3. Before you begin working, check in with me and I will verify your plan.
4. Then, begin working on the TODO items, marking them off as you go.
5. For every step, give an explanation of the changes made in a 1-2 line summary.
6. Make every task and code change as simple as possible. Every change should impact as little code as possible. Everything is about functional, clear, and simple code.
7. Finally, add a review section to the `TODO.md` file with a summary of the changes you made and any other relavent information. 

## Architecture

- **Project Structure**: `src/` contains all project components and `bin/` contains all runnable files.
- **Configuration**: Basic Node.js project with package-lock.json but no package.json
- **Documentation**: README.md contains usage examples and command structure

## Common Commands

Based on the README, the main executable is `./statsim` with these commands:

### Basic Usage
```bash
./statsim list          # List simulations
./statsim run <name>     # Run a named simulation (e.g., ./statsim run golf-4)
./statsim show          # Show results from latest run
./statsim stop          # Stop a running simulation
./statsim ps            # List simulation progress
```

### Flags
- `-h, --help` - Show help
- `-v, --version` - Show version

## Development Notes

- This is a command line tool that simulates a small set of board games using simple AI agents.
- Currently no build system or dependencies are defined
- Source code implementation is pending in the `src/` directory
- Binary output would go in the `bin/` directory
