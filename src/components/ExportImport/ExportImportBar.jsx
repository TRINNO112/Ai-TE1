import React, { useRef } from 'react';
import { Download, Upload, Sparkles, FileText, Trash2, Database } from 'lucide-react';

export function ExportImportBar({
  onExportBrain,
  onImportBrain,
  onLoadPretrainedChampion,
  onExportLog,
  onClearStorage
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onImportBrain(json);
      } catch (err) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bento-card" style={{
      padding: '16px 24px',
      margin: '0 20px 24px 20px',
      background: '#151d30',
      border: '2.5px solid #000000',
      boxShadow: '4px 4px 0px #000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Database size={18} color="var(--neo-cyan)" />
        <span style={{
          fontSize: '0.88rem',
          color: '#FFFFFF',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Model Weights & Research Dossier Export
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Load Pre-trained Champion */}
        <button 
          onClick={onLoadPretrainedChampion}
          className="neo-btn neo-btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          title="Instant load saved exhibition champion model (Score 100+)"
        >
          <Sparkles size={16} strokeWidth={2.5} />
          <span>Load Pre-Trained Champion</span>
        </button>

        {/* Export Brain */}
        <button 
          onClick={onExportBrain}
          className="neo-btn neo-btn-cyan"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <Download size={16} strokeWidth={2.5} />
          <span>Export Brain (JSON)</span>
        </button>

        {/* Import Brain */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="neo-btn neo-btn-purple"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <Upload size={16} strokeWidth={2.5} />
          <span>Import Brain</span>
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Export Log */}
        <button 
          onClick={onExportLog}
          className="neo-btn neo-btn-emerald"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <FileText size={16} strokeWidth={2.5} />
          <span>Export CSV Dossier</span>
        </button>

        {/* Clear Storage */}
        <button 
          onClick={onClearStorage}
          className="neo-btn neo-btn-coral"
          style={{ padding: '8px 12px', fontSize: '0.82rem' }}
          title="Clear localStorage saved state"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
