import React, { useRef, useState, useEffect } from 'react';
import { Header } from './components/Header/Header.jsx';
import { GameViewport } from './components/Game/GameViewport.jsx';
import { ControlCenter } from './components/Controls/ControlCenter.jsx';
import { TelemetryPanel } from './components/Telemetry/TelemetryPanel.jsx';
import { VisualizerTabs } from './components/Visualizer/VisualizerTabs.jsx';
import { WalkthroughModal } from './components/Pedagogy/WalkthroughModal.jsx';
import { ExportImportBar } from './components/ExportImport/ExportImportBar.jsx';
import { MobileCockpit } from './components/Mobile/MobileCockpit.jsx';
import { useSimulation } from './hooks/useSimulation.js';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 840 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 840);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default function App() {
  const canvasRef = useRef(null);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const isMobile = useIsMobile();

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
      {isMobile ? (
        <MobileCockpit
          canvasRef={canvasRef}
          architecture={architecture}
          isRunning={isRunning}
          togglePlay={togglePlay}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          elitismRate={elitismRate}
          setElitismRate={setElitismRate}
          mutationRate={mutationRate}
          setMutationRate={setMutationRate}
          networkSize={networkSize}
          changeNetworkSize={changeNetworkSize}
          showAllBirds={showAllBirds}
          setShowAllBirds={setShowAllBirds}
          turboMode={turboMode}
          setTurboMode={setTurboMode}
          simpleMode={simpleMode}
          setSimpleMode={setSimpleMode}
          showRaycasts={showRaycasts}
          setShowRaycasts={setShowRaycasts}
          freezeFrame={freezeFrame}
          setFreezeFrame={setFreezeFrame}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          resetSimulation={resetSimulation}
          obstaclesEnabled={obstaclesEnabled}
          setObstaclesEnabled={setObstaclesEnabled}
          telemetry={telemetry}
          gaStats={gaStats}
          generationLog={generationLog}
          championBrain={championBrain}
          bestBird={bestBird}
          activeDifficulties={activeDifficulties}
          turboStats={turboStats}
          exportBrainJSON={exportBrainJSON}
          importBrainJSON={importBrainJSON}
          loadPretrainedChampion={loadPretrainedChampion}
          exportLogCSV={exportLogCSV}
          clearStorage={clearStorage}
          onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        />
      ) : (
        <>
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
          <main className="app-main-layout">
            {/* Stage Row: Live Simulation Viewport + Neural Radar Side-by-Side */}
            <div className="app-cockpit-stage">
              <GameViewport
                canvasRef={canvasRef}
                turboMode={turboMode}
                turboStats={turboStats}
                activeDifficulties={activeDifficulties}
                telemetry={telemetry}
                gaStats={gaStats}
                onToggleTurboMode={() => setTurboMode(false)}
              />

              <VisualizerTabs
                brain={championBrain}
                bestBird={bestBird}
                generationLog={generationLog}
                onChangeNetworkSize={changeNetworkSize}
                onChangeMutation={setMutationRate}
                onChangeElitism={setElitismRate}
              />
            </div>

            {/* Command Row: Simulation Command Deck */}
            <div className="app-cockpit-controls">
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
            </div>

            {/* Model Weights & Research Dossier Console */}
            <ExportImportBar
              onExportBrain={exportBrainJSON}
              onImportBrain={importBrainJSON}
              onLoadPretrainedChampion={loadPretrainedChampion}
              onExportLog={exportLogCSV}
              onClearStorage={clearStorage}
            />
          </main>

          {/* Presentation Footer */}
          <footer style={{
            padding: '16px 24px',
            textAlign: 'center',
            borderTop: '1.5px solid var(--border-medium)',
            background: '#FFFFFF',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            marginTop: 'auto'
          }}>
            <span>
              Developed for <strong style={{ color: 'var(--text-primary)' }}>GCERT & NCERT Children's Science Exhibition 2026–27</strong> (બાળ વૈજ્ઞાનિક પ્રદર્શન) • 
              Themes: <em>Subtheme 1(A) AI for Better Life</em> & <em>Subtheme 1(B) Mathematical Modelling</em> • 
              Zero External AI Libraries • Pure Canvas API & Linear Algebra (z = W · x + b)
            </span>
          </footer>
        </>
      )}

      {/* Guided Walkthrough Modal */}
      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />
    </div>
  );
}
