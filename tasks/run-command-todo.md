# Run Command and Services Implementation Plan

## Goal
Add the run command and services to statsim, and expand the game design in DESIGN.md.

## TODO Items

### 1. Game Design Documentation
- [ ] Expand DESIGN.md with detailed game specifications for golf-4x and dice-1000-10000
- [ ] Define game rules, win conditions, and scoring systems
- [ ] Document agent interfaces and strategy patterns
- [ ] Define data structures for game state, moves, and results

### 2. Core Services Architecture
- [ ] Create game service interface (`src/services/game.ts`)
- [ ] Create agent service interface (`src/services/agent.ts`)
- [ ] Create simulation runner service (`src/services/simulation.ts`)
- [ ] Create results storage service (`src/services/results.ts`)

### 3. Game Implementations
- [ ] Implement golf-4x game logic (`src/games/golf-4x.ts`)
- [ ] Implement dice-1000-10000 game logic (`src/games/dice-1000-10000.ts`)
- [ ] Create base game interface (`src/games/base.ts`)

### 4. Agent Implementations
- [ ] Create base agent interface (`src/agents/base.ts`)
- [ ] Implement random agent (`src/agents/random.ts`)
- [ ] Implement low-card agent (`src/agents/low-card.ts`)
- [ ] Implement example-agent (`src/agents/example.ts`)

### 5. Run Command Implementation
- [ ] Create run command handler (`src/run.ts`)
- [ ] Add run command to CLI (`src/cli.ts`)
- [ ] Implement progress tracking and display
- [ ] Add result output formatting

### 6. Testing
- [ ] Add tests for game implementations
- [ ] Add tests for agent implementations
- [ ] Add tests for run command
- [ ] Add integration tests for full simulation runs

## Review Notes

### Implementation Summary
Successfully implemented the run command and core services for statsim. The implementation includes:

**Core Services:**
- Game service interface with comprehensive game state management
- Agent service with registry pattern for extensible AI agents
- Simulation runner with progress tracking and async execution
- Results storage with JSON file persistence and CSV export

**Game Logic:**
- Golf-4x: Complete card game with 4-card hands, column scoring, and knock mechanics
- Dice-1000-10000: Dice game with entry requirements, banking, and risk/reward decisions

**CLI Integration:**
- Updated run command to accept game type and multiple agents
- Integrated agent registration system
- Added progress display with dots and completion statistics

### Key Design Decisions
1. **Modular Architecture**: Separated concerns between games, agents, and simulation logic
2. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
3. **Extensibility**: Registry pattern allows easy addition of new agents and games
4. **Progress Tracking**: Real-time feedback during long simulations
5. **Result Persistence**: JSON storage with CSV export for analysis

## Changes Made

### Services Created
- `src/services/game.ts` - Game interface and data structures
- `src/services/agent.ts` - Agent interface and registry
- `src/services/simulation.ts` - Simulation runner with progress tracking
- `src/services/results.ts` - File-based results storage

### Game Implementations
- `src/games/golf-4x.ts` - Complete golf card game logic
- `src/games/dice-1000-10000.ts` - Dice game with entry requirements

### Command Implementation
- `src/run.ts` - Run command handler with error handling
- `src/cli.ts` - Updated CLI to support run command
- `src/agents/random.ts` - Basic random agent implementation
- `src/agents/index.ts` - Agent registration