# statsim

Run a game simulation. This is a WIP project to learn claude.ai tooling.

```
./statsim list
Usage:
  statsim [flags]
  statsim [command]

Available Commands:
  show        Show results from latest (or named) run
  run         Run the named game with given parameters
  list        List simulations
  help        Help about any command

Flags:
  -h, --help      help for statsim
  -v, --version   Show version information

Use "statsim [command] --help" for more information about a command.
```

## List simulations

See the avaialble games, previous runs, and agents.

```
./statsim list

Available games:
 ⎿ golf-4x
    dice-1000-10000

Available runs:
 ⎿ golf-4x-00105235351 (scenario 1)

Available agents:
 ⎿ random
    low-card
    example-agent
```

## Running a simulation

Run a simulation for a game with a set of players. A name is generated automatically, and the simulation results are printed to the console.

```
./statsim run dice-1000-10000 random random random
Running dice-1000-10000 with 3 players (random, random, random) .......
.......................................................................
.......................................................................
.......................................................................
......................................................DONE

Score:
  P1 - random     45
  P2 - random     87
  P3 - random     1102
```
