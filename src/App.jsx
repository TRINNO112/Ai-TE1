import React, { useRef, useState } from 'react';
import { Header } from './components/Header/Header.jsx';
import { GameViewport } from './components/Game/GameViewport.jsx';
import { ControlCenter } from './components/Controls/ControlCenter.jsx';
import { TelemetryPanel } from './components/Telemetry/TelemetryPanel.jsx';
import { VisualizerTabs } from './components/Visualizer/VisualizerTabs.jsx';
import { WalkthroughModal } from './components/Pedagogy/WalkthroughModal.jsx';
import { ExportImportBar } from './components/ExportImport/ExportImportBar.jsx';
import { useSimulation } from './hooks/useSimulation.js';

export default function App() {
  const canvasRef = useRef(null);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  const {
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
  } = useSimulation(canvasRef);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Aerospace Cockpit Header */}
      <Header
        architecture={architecture}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onReset={resetSimulation}
      />

      {/* Full-Width Telemetry Deck */}
      <TelemetryPanel
        telemetry={telemetry}
        gaStats={gaStats}
        obstaclesEnabled={obstaclesEnabled}
      />

      {/* Main Spacious Command Cockpit */}
      <main style={{
        flex: 1,
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 460px) minmax(560px, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Flight Viewport & Flight Parameters */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GameViewport
            canvasRef={canvasRef}
            turboMode={turboMode}
            turboStats={turboStats}
            activeDifficulties={activeDifficulties}
            telemetry={telemetry}
            gaStats={gaStats}
            onToggleTurboMode={() => setTurboMode(false)}
          />

          <ControlCenter
            isRunning={isRunning}
            onTogglePlay={togglePlay}
            onReset={resetSimulation}
            speed={simulationSpeed}
            onChangeSpeed={setSimulationSpeed}
            elitismRate={elitismRate}
            onChangeElitism={setElitismRate}
            mutationRate={mutationRate}
            onChangeMutation={setMutationRate}
            networkSize={networkSize}
            onChangeNetworkSize={changeNetworkSize}
            showAllBirds={showAllBirds}
            onToggleShowAllBirds={setShowAllBirds}
            turboMode={turboMode}
            onToggleTurboMode={setTurboMode}
            simpleMode={simpleMode}
            onToggleSimpleMode={setSimpleMode}
            showRaycasts={showRaycasts}
            onToggleRaycasts={setShowRaycasts}
            freezeFrame={freezeFrame}
            onToggleFreezeFrame={() => setFreezeFrame(prev => !prev)}
            obstaclesEnabled={obstaclesEnabled}
            onToggleObstacles={() => setObstaclesEnabled(prev => !prev)}
          />
        </section>

        {/* Right Column: Neural Intelligence & Mathematical Deck */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <VisualizerTabs
            brain={championBrain}
            bestBird={bestBird}
            generationLog={generationLog}
            onChangeNetworkSize={changeNetworkSize}
            onChangeMutation={setMutationRate}
            onChangeElitism={setElitismRate}
          />
        </section>
      </main>

      {/* Model Weights & Research Dossier Console */}
      <ExportImportBar
        onExportBrain={exportBrainJSON}
        onImportBrain={importBrainJSON}
        onLoadPretrainedChampion={loadPretrainedChampion}
        onExportLog={exportLogCSV}
        onClearStorage={clearStorage}
      />

      {/* Sleek Footer */}
      <footer style={{
        padding: '16px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 18, 0.9)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)'
      }}>
        <span>
          Developed for <strong>GCERT & NCERT Children's Science Exhibition 2026–27</strong> (બાળ વૈજ્ઞાનિક પ્રદર્શન) • 
          Themes: <em>Subtheme 1(A) AI for Better Life</em> & <em>Subtheme 1(B) Mathematical Modelling</em> • 
          Zero External AI Libraries • Pure Canvas API & Linear Algebra (z = W · x + b)
        </span>
      </footer>

      {/* Guided Walkthrough Modal */}
      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />
    </div>
  );
}
