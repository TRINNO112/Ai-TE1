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
    <div className="sleek-card" style={{
      padding: '16px 24px',
      margin: '0 24px 24px 24px',
      background: 'rgba(12, 18, 32, 0.85)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Database size={16} color="#38bdf8" />
        <span style={{
          fontSize: '0.84rem',
          color: '#ffffff',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Model Weights & Research Dossier Console
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Load Pre-trained Champion */}
        <button 
          onClick={onLoadPretrainedChampion}
          className="sleek-btn sleek-btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          title="Instant load saved exhibition champion model (Score 100+)"
        >
          <Sparkles size={15} />
          <span>Load Pre-Trained Champion</span>
        </button>

        {/* Export Brain */}
        <button 
          onClick={onExportBrain}
          className="sleek-btn sleek-btn-neutral"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
        >
          <Download size={15} color="#38bdf8" />
          <span>Export Brain (JSON)</span>
        </button>

        {/* Import Brain */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="sleek-btn sleek-btn-neutral"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
        >
          <Upload size={15} color="#c084fc" />
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
          className="sleek-btn sleek-btn-neutral"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
        >
          <FileText size={15} color="#34d399" />
          <span>Export CSV Dossier</span>
        </button>

        {/* Clear Storage */}
        <button 
          onClick={onClearStorage}
          className="sleek-btn sleek-btn-neutral"
          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          title="Clear localStorage saved state"
        >
          <Trash2 size={15} color="#f43f5e" />
        </button>
      </div>
    </div>
  );
}
