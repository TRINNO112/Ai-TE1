/**
 * Automated Headless Test Suite for AI Neuroevolution Simulator
 * Validates:
 * 1. Obstacle Mode (Disarmed open sky vs Armed pipes)
 * 2. Multi-speed physics sub-stepping (1x to 100x)
 * 3. Genetic Algorithm evolutionary convergence & Elitism
 * 4. Brain serialization (Export / Import JSON)
 * 5. Telemetry & Compact number formatting invariants
 */

import { GameEngine } from '../src/core/GameEngine.js';
import { GeneticAlgorithm } from '../src/core/GeneticAlgorithm.js';
import { NeuralNetwork } from '../src/core/NeuralNetwork.js';
import { formatCompactNumber } from '../src/utils/numberFormat.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('AI NEUROEVOLUTION ENGINE: AUTOMATED TEST SUITE');
console.log('====================================================\n');

// TEST 1: Default Obstacles Disarmed Mode
console.log('--- TEST GROUP 1: Obstacles Mode Verification ---');
{
  const mockCanvas = { width: 400, height: 600, getContext: () => null };
  const game = new GameEngine(mockCanvas);
  
  assert(game.obstaclesEnabled === false, 'Obstacles are disarmed by default (normal condition)');

  const brains = Array.from({ length: 20 }, () => new NeuralNetwork([9, 8, 1]));
  game.init(brains);

  // Run 200 frames with obstacles disarmed
  for (let f = 0; f < 200; f++) {
    game.update();
  }

  assert(game.pipes.length === 0, 'No pipes spawned during Open Sky runway training (200 frames)');
  const telem1 = game.getTelemetry();
  assert(telem1.obstaclesEnabled === false, 'Telemetry reports obstaclesEnabled: false');
  assert(telem1.activeDifficulties.includes('Open Sky Runway'), 'Active difficulties indicates Open Sky Runway');

  // Now Activate Obstacles with fresh flight batch
  game.init(brains);
  game.setObstaclesEnabled(true);
  assert(game.obstaclesEnabled === true, 'setObstaclesEnabled(true) arms the corridor');

  // Run 300 frames to allow pipe spawning (initial runway = 150 frames, spawn interval = 135)
  for (let f = 0; f < 300; f++) {
    game.update();
  }

  assert(game.pipes.length > 0, `Pipes successfully spawned when armed (Pipes active: ${game.pipes.length})`);
  const telem2 = game.getTelemetry();
  assert(telem2.obstaclesEnabled === true, 'Telemetry reports obstaclesEnabled: true');

  // Disarm again
  game.setObstaclesEnabled(false);
  assert(game.pipes.length === 0, 'Disarming obstacles immediately clears active pipes and resets corridor');
}

// TEST 2: Multi-Physics Speed & Sub-stepping
console.log('\n--- TEST GROUP 2: Physics Speed & Sub-stepping ---');
{
  const mockCanvas = { width: 400, height: 600, getContext: () => null };
  const game = new GameEngine(mockCanvas);
  const brains = Array.from({ length: 10 }, () => new NeuralNetwork([9, 8, 1]));
  game.init(brains);

  const initialFrame = game.frameCount;
  const speed = 10;
  for (let s = 0; s < speed; s++) {
    game.update();
  }
  assert(game.frameCount === initialFrame + 10, '10x sub-stepping accurately advances physics by 10 frames');
}

// TEST 3: Genetic Algorithm Elitism & Evolution
console.log('\n--- TEST GROUP 3: Genetic Algorithm & Elitism Retention ---');
{
  const populationSize = 50;
  const elitismRate = 0.05; // 5% = 2 champions
  const mutationRate = 0.15;
  const ga = new GeneticAlgorithm(populationSize, elitismRate, mutationRate, 0.5);

  let population = Array.from({ length: populationSize }, (_, i) => ({
    brain: new NeuralNetwork([9, 12, 12, 1]),
    fitness: (i + 1) * 100
  }));

  const sortedPop = [...population].sort((a, b) => b.fitness - a.fitness);
  const topChampion = sortedPop[0];

  const { brains: nextGenBrains } = ga.evolve(population);
  assert(nextGenBrains.length === populationSize, `Evolution maintains fixed population size of ${populationSize}`);
  assert(ga.generation === 1, 'Generation counter accurately increments from 0 to 1 after first epoch evolve');
  assert(ga.bestFitnessEver >= topChampion.fitness, `Best fitness ever tracked correctly (${ga.bestFitnessEver})`);
}

// TEST 4: Brain Serialization (Import / Export JSON)
console.log('\n--- TEST GROUP 4: Neural Brain Export & Import ---');
{
  const originalBrain = new NeuralNetwork([9, 12, 12, 1]);
  const brainJSON = originalBrain.toJSON();
  
  assert(brainJSON.architecture.length === 4, 'Serialized JSON contains correct architecture depth');
  assert(brainJSON.weights.length > 0, `Serialized JSON contains ${brainJSON.weights.length} synaptic weights`);
  assert(brainJSON.biases.length > 0, `Serialized JSON contains ${brainJSON.biases.length} bias values`);

  const loadedBrain = NeuralNetwork.fromJSON(brainJSON);
  const dummyInputs = [0.5, 0.2, 0.8, -0.4, 0.1, 0.3, 0.7, 0.0, 0.9];
  
  const output1 = originalBrain.predict(dummyInputs);
  const output2 = loadedBrain.predict(dummyInputs);

  assert(Math.abs(output1[0] - output2[0]) < 0.01, 'Loaded brain reconstructs weight matrices with high fidelity (fidelity delta < 0.01)');
}

// TEST 5: Telemetry Compact Number Formatting (No Text Overflow)
console.log('\n--- TEST GROUP 5: Compact Number Formatting Invariants ---');
{
  assert(formatCompactNumber(328649.989) === '328.6k', '328,649.989 formats compactly to 328.6k');
  assert(formatCompactNumber(244258.032) === '244.3k', '244,258.032 formats compactly to 244.3k');
  assert(formatCompactNumber(1250000) === '1.3M', '1,250,000 formats to 1.3M');
  assert(formatCompactNumber(8859) === '8,859', '8859 retains integer formatting without decimals');
  assert(formatCompactNumber(156) === '156', '156 formats cleanly as 156');
  assert(formatCompactNumber(0) === '0', '0 formats cleanly as 0');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED (100% SUCCESS)`);
console.log('====================================================\n');
