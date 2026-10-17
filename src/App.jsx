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
      {/* Top Header */}
      <Header
        architecture={architecture}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onReset={resetSimulation}
      />

      {/* Main Bento Workspace Layout */}
      <main style={{
        flex: 1,
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 440px) minmax(500px, 1fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Game Viewport & Simulation Command Center */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GameViewport
            canvasRef={canvasRef}
            turboMode={turboMode}
            turboStats={turboStats}
            activeDifficulties={activeDifficulties}
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
          />
        </section>

        {/* Right Column: Telemetry & Visualization Bento Tabs */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <TelemetryPanel
            telemetry={telemetry}
            gaStats={gaStats}
          />

          <VisualizerTabs
            brain={championBrain}
            bestBird={bestBird}
            generationLog={generationLog}
          />
        </section>
      </main>

      {/* Model Weights & Dossier Export Bar */}
      <ExportImportBar
        onExportBrain={exportBrainJSON}
        onImportBrain={importBrainJSON}
        onLoadPretrainedChampion={loadPretrainedChampion}
        onExportLog={exportLogCSV}
        onClearStorage={clearStorage}
      />

      {/* Footer */}
      <footer style={{
        padding: '16px 20px',
        textAlign: 'center',
        borderTop: '2.5px solid #000000',
        background: '#0d121f',
        fontSize: '0.82rem',
        color: 'var(--text-sub)',
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
