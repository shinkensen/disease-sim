# Disease Sim

Simple simulation of how diesease can spread in a population


The sim has several configurable settings to set the: 
    immunity amt (number of times an immune cell can experience exposure and not get infected),
    immunity chance (the chance that a cured cell get immunity)
    cure chance (the chance for every tick that an infected cell gets cured)
    infection chance (the chance in which an exposure leads to infection for normal cells)
    num tests and iterations (for the autosim, the number of individual tests and the number of iterations it goes through)

For the auto test mode there are also manual and auto mode, where manual graphs the results of the sim in the top left and auto does its own independent tests


## How this was made
This was just made with next.js + chart.js + react.js

## How to run

Just clone, install dependencies and spin up a dev server

```
git clone https://github.com/shinkensen/disease-sim.git

npm install

npm run dev
```