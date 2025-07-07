# statsim design

## Tracking games, runs, agents, and results

- games refers to the available games (golf-4x and dice-1000-10000)
- a run is a single execution of a game with a set of agents and number of iterations
- agents are functions that take the gameboard and current hand, and return the next move
- agents are simple functions
- results are stored per run in a CSV file, listing the game, agents, parameters, each hand, and the overall results including the winners and losers
- results can be compared with each other
