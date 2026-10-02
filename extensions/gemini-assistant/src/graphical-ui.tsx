import React, { useState } from 'react';
import { GenomicsPanel } from './genomics-api';

const GraphicalEditorUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [code, setCode] = useState(`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("Gemini Graphical Editor\\n");
    return EXIT_SUCCESS;
}`);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🔥 GEMINI</h1>
        <p style={styles.subtitle}>Independent C Editor + Genomics API</p>
      </header>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('editor')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'editor' ? '#00d4ff' : '#2d2d2d',
            color: activeTab === 'editor' ? '#1e1e1e' : '#e0e0e0'
          }}
        >
          📝 Code Editor
        </button>
        <button
          onClick={() => setActiveTab('genomics')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'genomics' ? '#00d4ff' : '#2d2d2d',
            color: activeTab === 'genomics' ? '#1e1e1e' : '#e0e0e0'
          }}
        >
          🧬 Genomics
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'tools' ? '#00d4ff' : '#2d2d2d',
            color: activeTab === 'tools' ? '#1e1e1e' : '#e0e0e0'
          }}
        >
          🛠️ Tools
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'editor' && (
          <div style={styles.panel}>
            <h2>📝 C Code Editor</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={styles.codeEditor}
            />
            <div style={styles.buttonRow}>
              <button style={styles.actionButton}>💾 Save</button>
              <button style={styles.actionButton}>🔨 Build</button>
              <button style={styles.actionButton}>▶️ Run</button>
              <button style={styles.actionButton}>📊 Analyze</button>
            </div>
          </div>
        )}

        {activeTab === 'genomics' && <GenomicsPanel />}

        {activeTab === 'tools' && (
          <div style={styles.panel}>
            <h2>🛠️ Tools & Features</h2>
            <div style={styles.toolGrid}>
              <ToolCard icon="📚" title="Templates" desc="10+ C code templates" />
              <ToolCard icon="🔍" title="Analyzer" desc="Code metrics & safety" />
              <ToolCard icon="⚙️" title="Builder" desc="GCC compilation" />
              <ToolCard icon="🧪" title="Tests" desc="Unit test runner" />
              <ToolCard icon="📈" title="Profiler" desc="Performance analysis" />
              <ToolCard icon="🔒" title="Security" desc="Unsafe function scan" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={styles.toolCard}>
    <div style={styles.toolIcon}>{icon}</div>
    <h3 style={styles.toolTitle}>{title}</h3>
    <p style={styles.toolDesc}>{desc}</p>
  </div>
);

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    fontFamily: "'Consolas', 'Monaco', monospace",
    display: 'flex',
    flexDirection: 'column' as const
  },
  header: {
    backgroundColor: '#0d0d0d',
    borderBottom: '2px solid #00d4ff',
    padding: '20px',
    textAlign: 'center' as const
  },
  title: {
    fontSize: '48px',
    margin: '0',
    color: '#00d4ff',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
  },
  subtitle: {
    fontSize: '14px',
    margin: '5px 0 0 0',
    color: '#888'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#1e1e1e',
    borderBottom: '1px solid #333'
  } as React.CSSProperties,
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px'
  } as React.CSSProperties,
  panel: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #444'
  } as React.CSSProperties,
  codeEditor: {
    width: '100%',
    height: '400px',
    backgroundColor: '#1a1a1a',
    color: '#00d4ff',
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    resize: 'vertical' as const,
    marginBottom: '15px'
  } as React.CSSProperties,
  buttonRow: {
    display: 'flex',
    gap: '10px'
  } as React.CSSProperties,
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#00d4ff',
    color: '#1e1e1e',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'transform 0.2s'
  } as React.CSSProperties,
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '20px'
  } as React.CSSProperties,
  toolCard: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    border: '1px solid #444',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  toolIcon: {
    fontSize: '32px',
    marginBottom: '10px'
  } as React.CSSProperties,
  toolTitle: {
    margin: '10px 0 5px 0',
    color: '#00d4ff'
  } as React.CSSProperties,
  toolDesc: {
    fontSize: '12px',
    color: '#888',
    margin: '0'
  } as React.CSSProperties
};

export default GraphicalEditorUI;
