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
    <div className="sleek-card app-export-bar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#E0F2FE',
          border: '1.5px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Database size={16} color="#0284C7" />
        </div>
        <span style={{
          fontSize: '0.84rem',
          color: 'var(--text-primary)',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Model Weights & Research Dossier Console
        </span>
      </div>

      <div className="app-export-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
          <Download size={15} color="#0284C7" />
          <span>Export Brain (JSON)</span>
        </button>

        {/* Import Brain */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="sleek-btn sleek-btn-neutral"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
        >
          <Upload size={15} color="#7C3AED" />
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
          <FileText size={15} color="#059669" />
          <span>Export CSV Dossier</span>
        </button>

        {/* Clear Storage */}
        <button 
          onClick={onClearStorage}
          className="sleek-btn sleek-btn-neutral"
          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          title="Clear localStorage saved state"
        >
          <Trash2 size={15} color="#E11D48" />
        </button>
      </div>
    </div>
  );
}
