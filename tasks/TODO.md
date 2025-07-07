# TODO: Implement List Feature

## Plan

Based on the README and DESIGN files, I need to implement the `list` command that displays:
- Available games (golf-4x, dice-1000-10000)
- Available runs (stored executions with parameters)
- Available agents (random, low-card, example-agent)

## Tasks

- [x] Create data structure to store games, runs, and agents
- [x] Implement games listing functionality
- [x] Implement runs listing functionality  
- [x] Implement agents listing functionality
- [x] Update CLI list command to display formatted output
- [x] Add tests for the list functionality
- [x] Test the complete list command integration

## Implementation Notes

- Games will be hardcoded initially (golf-4x, dice-1000-10000)
- Runs will be stored/retrieved from filesystem (likely JSON/CSV)
- Agents will be hardcoded initially (random, low-card, example-agent), and the agent interface should be simple
- Output should match the format shown in README with tree-like structure

## Review

### Changes Made

1. **Created `/src/list.ts`** - Added ListService class with Game, Run, and Agent interfaces
2. **Updated `/src/cli.ts`** - Integrated ListService into the CLI list command
3. **Added `/src/__tests__/list.test.ts`** - Comprehensive tests for all listing functionality

### Summary

The list feature is now fully implemented and matches the README specification. The command `./statsim list` displays available games, runs, and agents in the expected tree format. All tests pass and the integration works correctly.