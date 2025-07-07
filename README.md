# statsim

Run a game simulation. This is a WIP project to learn claude.ai tooling.

```
./statsim list
Usage:
  statsim [flags]
  statsim [command]

Available Commands:
  show        Show results from latest (or named) run
  run         Run the named model
  stop        Stop a running simulation
  list        List simulations
  ps          List  simulation progress
  help        Help about any command

Flags:
  -h, --help      help for statsim
  -v, --version   Show version information

Use "statsim [command] --help" for more information about a command.
```

## List simulations
```
./statsim list

Available games:
 ⎿ golf-4x
    dice-1000-10000

Available results:
 ⎿ golf-4x (scenario 1)

Available agents
 ⎿ random
    low-card
```


## Running a simulation

```
./statsim run golf-4
Running 1,234 "golf-4" games with 3 players............................
.......................................................................
.......................................................................
.......................................................................
......................................................DONE


P1 - rando    45
P2 - iocane   87
P3 - mirror   1102
```

## Adding a game

## Adding a scenario
