import { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { NeuralNetwork } from '../core/NeuralNetwork.js';
import { GeneticAlgorithm } from '../core/GeneticAlgorithm.js';
import { GameEngine } from '../core/GameEngine.js';
import { soundEngine } from '../core/AudioSynthesizer.js';

export function useSimulation(canvasRef) {
  // Engine references (mutable refs to avoid React re-render overhead during 60 FPS loop)
  const gameRef = useRef(null);
  const gaRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const turboTimeoutRef = useRef(null);

  // Configuration state
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [elitismRate, setElitismRate] = useState(0.05);
  const [mutationRate, setMutationRate] = useState(0.15);
  const [networkSize, setNetworkSize] = useState('medium');
  const [architecture, setArchitecture] = useState([9, 12, 12, 1]);
  const [showAllBirds, setShowAllBirds] = useState(true);
  const [turboMode, setTurboMode] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [showRaycasts, setShowRaycasts] = useState(true);
  const [freezeFrame, setFreezeFrame] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [obstaclesEnabled, setObstaclesEnabled] = useState(false); // Default: Disarmed (Open sky runway)

  // Reactive state for UI updates
  const [telemetry, setTelemetry] = useState({
    alive: 150,
    total: 150,
    bestScore: 0,
    bestFitness: 0,
    speed: 2.5,
    gap: 140
  });
  const [gaStats, setGaStats] = useState({
    generation: 1,
    bestFitnessEver: 0,
    bestScoreEver: 0
  });
  const [generationLog, setGenerationLog] = useState([]);
  const [championBrain, setChampionBrain] = useState(null);
  const [bestBird, setBestBird] = useState(null);
  const [activeDifficulties, setActiveDifficulties] = useState([]);
  const [turboStats, setTurboStats] = useState({
    gensPerSec: 0,
    generation: 0,
    bestScore: 0,
    bestFitness: 0
  });

  // Track stagnation for auto-tuning
  const lastImprovementGenRef = useRef(1);
  const previousBestFitnessRef = useRef(0);

  // Initialize Engines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new GameEngine(canvas);
    const ga = new GeneticAlgorithm(150, elitismRate, mutationRate, 0.5);

    // Initial random brains
    const initialBrains = [];
    for (let i = 0; i < 150; i++) {
      initialBrains.push(new NeuralNetwork(architecture));
    }
    game.init(initialBrains);
    game.showRaycasts = showRaycasts;
    game.simpleMode = simpleMode;
    game.draw(showAllBirds);

    gameRef.current = game;
    gaRef.current = ga;

    setChampionBrain(initialBrains[0]);
    setBestBird(game.birds[0]);

    // Check LocalStorage for saved brain
    try {
      const saved = localStorage.getItem('flappyAI_savedBrain');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.brain?.architecture && parsed.brain.architecture[0] === 9) {
          const loadedBrain = NeuralNetwork.fromJSON(parsed.brain);
          ga.bestBrainEver = loadedBrain;
          ga.bestFitnessEver = parsed.bestFitness || 0;
          ga.bestScoreEver = parsed.bestScore || 0;
          setChampionBrain(loadedBrain);
          setGaStats({
            generation: parsed.generation || 1,
            bestFitnessEver: ga.bestFitnessEver,
            bestScoreEver: ga.bestScoreEver
          });
        }
      }
    } catch {
      // Safe
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (turboTimeoutRef.current) clearTimeout(turboTimeoutRef.current);
    };
  }, []);

  // Update simulation configs in engines
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.showRaycasts = showRaycasts;
      gameRef.current.simpleMode = simpleMode;
      gameRef.current.freezeFrame = freezeFrame;
      gameRef.current.setObstaclesEnabled(obstaclesEnabled);
    }
  }, [showRaycasts, simpleMode, freezeFrame, obstaclesEnabled]);

  useEffect(() => {
    if (gaRef.current) {
      gaRef.current.elitismRate = elitismRate;
      gaRef.current.mutationRate = mutationRate;
    }
  }, [elitismRate, mutationRate]);

  // Handle Architecture Change
  const changeNetworkSize = useCallback((sizeKey) => {
    let newArch;
    switch (sizeKey) {
      case 'small': newArch = [9, 8, 1]; break;
      case 'medium': newArch = [9, 12, 12, 1]; break;
      case 'large': newArch = [9, 20, 20, 1]; break;
      case 'xlarge': newArch = [9, 32, 32, 1]; break;
      default: newArch = [9, 12, 12, 1];
    }
    setNetworkSize(sizeKey);
    setArchitecture(newArch);

    if (gameRef.current && gaRef.current) {
      gaRef.current.bestBrainEver = null;
      gaRef.current.bestFitnessEver = 0;
      gaRef.current.bestScoreEver = 0;
      gaRef.current.generation = 0;
      gaRef.current.generationLog = [];

      const newBrains = [];
      for (let i = 0; i < gaRef.current.populationSize; i++) {
        newBrains.push(new NeuralNetwork(newArch));
      }
      gameRef.current.init(newBrains);
      setChampionBrain(newBrains[0]);
      setGenerationLog([]);
      setGaStats({ generation: 1, bestFitnessEver: 0, bestScoreEver: 0 });
    }
  }, []);

  // Evolution Cycle Trigger
  const advanceGeneration = useCallback(() => {
    const game = gameRef.current;
    const ga = gaRef.current;
    if (!game || !ga) return;

    const populationResults = game.getResults();
    const { brains, stats } = ga.evolve(populationResults);

    // Track best fitness improvements without modifying user-selected mutationRate
    if (stats.bestFitness > previousBestFitnessRef.current) {
      previousBestFitnessRef.current = stats.bestFitness;
      lastImprovementGenRef.current = stats.generation;
    }

    // Celebration on record
    if (stats.newRecord) {
      soundEngine.playRecordFanfare();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      soundEngine.playGenAdvance();
    }

    // Re-init game with evolved brains
    game.init(brains);

    // Save state
    setGaStats({
      generation: ga.generation,
      bestFitnessEver: ga.bestFitnessEver,
      bestScoreEver: ga.bestScoreEver
    });
    setGenerationLog([...ga.generationLog]);
    setChampionBrain(ga.bestBrainEver || brains[0]);

    // Persist best brain to localStorage
    if (ga.bestBrainEver) {
      try {
        localStorage.setItem('flappyAI_savedBrain', JSON.stringify({
          generation: ga.generation,
          bestFitness: ga.bestFitnessEver,
          bestScore: ga.bestScoreEver,
          brain: ga.bestBrainEver.toJSON()
        }));
      } catch {
        // Safe
      }
    }
  }, []);

  // Headless Turbo Step Loop with Live Telemetry Streaming
  const runTurboBatch = useCallback(() => {
    const game = gameRef.current;
    const ga = gaRef.current;
    if (!game || !ga || !turboMode || !isRunning) return;

    const start = performance.now();
    let gensFinished = 0;
    let stepsInBatch = 0;
    let latestTelem = null;

    // Run generations in tight headless batch (18ms time slice)
    while (performance.now() - start < 18) {
      latestTelem = game.update();
      stepsInBatch++;
      if (latestTelem.gameOver) {
        advanceGeneration();
        gensFinished++;
      }
    }

    const elapsed = performance.now() - start;
    const stepsPerSec = elapsed > 0 ? Math.round((stepsInBatch / elapsed) * 1000) : 0;

    // Stream live metrics to UI during headless mode
    if (latestTelem) {
      setTelemetry(latestTelem);
      setActiveDifficulties(latestTelem.activeDifficulties || []);
      const topBird = game.getBestBird();
      if (topBird) {
        setBestBird(topBird);
        if (topBird.brain) setChampionBrain(topBird.brain);
      }
      if (latestTelem.score > ga.bestScoreEver) {
        ga.bestScoreEver = latestTelem.score;
      }
      if (latestTelem.bestFitness > ga.bestFitnessEver) {
        ga.bestFitnessEver = latestTelem.bestFitness;
      }
      setGaStats({
        generation: ga.generation,
        bestFitnessEver: ga.bestFitnessEver,
        bestScoreEver: ga.bestScoreEver
      });
    }

    setTurboStats({
      gensPerSec: Math.round(gensFinished * (1000 / Math.max(elapsed, 1))),
      stepsPerSec: stepsPerSec,
      generation: ga.generation,
      alive: latestTelem ? latestTelem.alive : 0,
      currentScore: latestTelem ? latestTelem.score : 0,
      bestScore: ga.bestScoreEver,
      bestFitness: ga.bestFitnessEver
    });

    turboTimeoutRef.current = setTimeout(runTurboBatch, 4);
  }, [turboMode, isRunning, advanceGeneration]);

  // Standard 60 FPS Game Loop
  useEffect(() => {
    if (!isRunning || turboMode) return;

    let frameCount = 0;

    const loop = () => {
      const game = gameRef.current;
      if (!game) return;

      // Execute physics steps according to simulationSpeed
      let telem;
      for (let s = 0; s < simulationSpeed; s++) {
        telem = game.update();
        if (telem.gameOver) {
          advanceGeneration();
          break;
        }
      }

      // Render frame
      game.draw(showAllBirds);

      // Throttled UI Telemetry updates (every 6 frames ~ 10 updates/sec for smooth 60fps)
      frameCount++;
      if (frameCount % 6 === 0) {
        const topBird = game.getBestBird();
        setBestBird(topBird);
        if (topBird && topBird.brain) {
          setChampionBrain(topBird.brain);
        }
        if (telem) {
          setTelemetry(telem);
          setActiveDifficulties(telem.activeDifficulties || []);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isRunning, turboMode, simulationSpeed, showAllBirds, advanceGeneration]);

  // Handle Turbo Mode Start/Stop
  useEffect(() => {
    if (turboMode && isRunning) {
      runTurboBatch();
    } else {
      if (turboTimeoutRef.current) clearTimeout(turboTimeoutRef.current);
    }
  }, [turboMode, isRunning, runTurboBatch]);

  // Toggle Play / Pause
  const togglePlay = () => {
    setIsRunning(prev => !prev);
  };

  // Toggle Sound
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundEngine.setEnabled(nextVal);
  };



  // Full Reset
  const resetSimulation = () => {
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    if (turboTimeoutRef.current) clearTimeout(turboTimeoutRef.current);

    const game = gameRef.current;
    const ga = gaRef.current;
    if (!game || !ga) return;

    ga.generation = 0;
    ga.bestFitnessEver = 0;
    ga.bestScoreEver = 0;
    ga.generationLog = [];
    previousBestFitnessRef.current = 0;
    lastImprovementGenRef.current = 1;

    const initialBrains = [];
    for (let i = 0; i < ga.populationSize; i++) {
      initialBrains.push(new NeuralNetwork(architecture));
    }

    game.init(initialBrains);
    game.draw(showAllBirds);

    setChampionBrain(initialBrains[0]);
    setBestBird(game.birds[0]);
    setGenerationLog([]);
    setGaStats({ generation: 1, bestFitnessEver: 0, bestScoreEver: 0 });
    setTelemetry({
      alive: 150,
      total: 150,
      bestScore: 0,
      bestFitness: 0,
      speed: 2.5,
      gap: 140
    });
  };

  // Model Export
  const exportBrainJSON = () => {
    const brain = championBrain || gameRef.current?.birds[0]?.brain;
    if (!brain) return;

    const payload = {
      modelName: "GCERT-Flappy-Neuroevolution-Champion",
      generation: gaStats.generation,
      bestFitness: gaStats.bestFitnessEver,
      bestScore: gaStats.bestScoreEver,
      brain: brain.toJSON()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `champion-brain-gen${gaStats.generation}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Model Import
  const importBrainJSON = (data) => {
    try {
      const rawBrain = data.brain || data;
      const loaded = NeuralNetwork.fromJSON(rawBrain);
      setChampionBrain(loaded);
      setArchitecture(loaded.layers);

      const game = gameRef.current;
      const ga = gaRef.current;
      if (game && ga) {
        ga.bestBrainEver = loaded;
        ga.bestFitnessEver = data.bestFitness || 10000;
        ga.bestScoreEver = data.bestScore || 50;

        // Populate generation with clones of champion plus small mutations
        const newBrains = [loaded.copy()];
        while (newBrains.length < ga.populationSize) {
          const clone = loaded.copy();
          clone.mutate(0.1, 0.3);
          newBrains.push(clone);
        }

        game.init(newBrains);
        setGaStats({
          generation: data.generation || 1,
          bestFitnessEver: ga.bestFitnessEver,
          bestScoreEver: ga.bestScoreEver
        });
        game.draw(showAllBirds);
      }
      alert('Brain imported successfully! Ready to fly.');
    } catch (err) {
      alert('Error importing brain: ' + err.message);
    }
  };

  // Load static pre-trained champion
  const loadPretrainedChampion = async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL || './';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      const res = await fetch(`${cleanBase}best-brain.json`);
      if (!res.ok) throw new Error(`Could not load ${cleanBase}best-brain.json`);
      const data = await res.json();
      importBrainJSON(data);
    } catch (err) {
      alert('Failed to fetch pre-trained champion: ' + err.message);
    }
  };

  // Export Log CSV
  const exportLogCSV = () => {
    if (generationLog.length === 0) {
      alert('No generation data recorded yet.');
      return;
    }

    const headers = ["Generation", "BestFitness", "AvgFitness", "WorstFitness", "BestScore", "AvgScore", "MutationRate"];
    const rows = generationLog.map(g => [
      g.generation,
      g.bestFitness,
      g.avgFitness,
      g.worstFitness,
      g.bestScore,
      g.avgScore,
      g.mutationRate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `neuroevolution-telemetry-log.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearStorage = () => {
    localStorage.removeItem('flappyAI_savedBrain');
    alert('Cleared saved brain from localStorage.');
  };

  return {
    isRunning,
    togglePlay,
    simulationSpeed,
    setSimulationSpeed,
    elitismRate,
    setElitismRate,
    mutationRate,
    setMutationRate,
    networkSize,
    changeNetworkSize,
    architecture,
    showAllBirds,
    setShowAllBirds,
    turboMode,
    setTurboMode,
    simpleMode,
    setSimpleMode,
    showRaycasts,
    setShowRaycasts,
    freezeFrame,
    setFreezeFrame,
    soundEnabled,
    toggleSound,
    resetSimulation,
    obstaclesEnabled,
    setObstaclesEnabled,
    telemetry,
    gaStats,
    generationLog,
    championBrain,
    bestBird,
    activeDifficulties,
    turboStats,
    exportBrainJSON,
    importBrainJSON,
    loadPretrainedChampion,
    exportLogCSV,
    clearStorage
  };
}
