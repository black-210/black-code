import React, { useState } from 'react';
import axios from 'axios';

interface GenomicsData {
  sequence: string;
  geneCount: number;
  gcContent: number;
  mutations: string[];
}

const GenomicsAPI = {
  analyzeSequence: async (sequence: string): Promise<GenomicsData> => {
    const gcContent = (sequence.match(/[GC]/gi) || []).length / sequence.length;
    const genes = sequence.split('ATG').length - 1;
    return {
      sequence,
      geneCount: genes,
      gcContent: gcContent * 100,
      mutations: []
    };
  },

  findMutations: (original: string, mutated: string): string[] => {
    const mutations: string[] = [];
    for (let i = 0; i < Math.min(original.length, mutated.length); i++) {
      if (original[i] !== mutated[i]) {
        mutations.push(`Position ${i}: ${original[i]} -> ${mutated[i]}`);
      }
    }
    return mutations;
  },

  translateDNA: (sequence: string): string => {
    const codonTable: { [key: string]: string } = {
      'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
      'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
      'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
      'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
      'TAC': 'Y', 'TAT': 'Y', 'TAA': '*', 'TAG': '*',
      'CAC': 'H', 'CAT': 'H', 'CAA': 'Q', 'CAG': 'Q',
      'AAC': 'N', 'AAT': 'N', 'AAA': 'K', 'AAG': 'K',
      'GAC': 'D', 'GAT': 'D', 'GAA': 'E', 'GAG': 'E',
      'TGC': 'C', 'TGT': 'C', 'TGA': '*', 'TGG': 'W',
      'CGC': 'R', 'CGT': 'R', 'CGA': 'R', 'CGG': 'R',
      'AGC': 'S', 'AGT': 'S', 'AGA': 'R', 'AGG': 'R',
      'GGC': 'G', 'GGT': 'G', 'GGA': 'G', 'GGG': 'G'
    };

    let protein = '';
    for (let i = 0; i < sequence.length - 2; i += 3) {
      const codon = sequence.substring(i, i + 3).toUpperCase();
      protein += codonTable[codon] || 'X';
    }
    return protein;
  },

  reverseComplement: (sequence: string): string => {
    const complement: { [key: string]: string } = {
      'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
      'a': 't', 't': 'a', 'g': 'c', 'c': 'g'
    };
    return sequence.split('').reverse().map(b => complement[b] || b).join('');
  },

  calculateHammingDistance: (seq1: string, seq2: string): number => {
    if (seq1.length !== seq2.length) return -1;
    let distance = 0;
    for (let i = 0; i < seq1.length; i++) {
      if (seq1[i] !== seq2[i]) distance++;
    }
    return distance;
  },

  findOpenReadingFrames: (sequence: string): { frame: number; start: number; end: number; sequence: string }[] => {
    const orfs = [];
    for (let frame = 0; frame < 3; frame++) {
      for (let i = frame; i < sequence.length - 2; i += 3) {
        const codon = sequence.substring(i, i + 3);
        if (codon === 'ATG' || codon === 'atg') {
          for (let j = i + 3; j < sequence.length - 2; j += 3) {
            const stopCodon = sequence.substring(j, j + 3);
            if (['TAA', 'TAG', 'TGA', 'taa', 'tag', 'tga'].includes(stopCodon)) {
              orfs.push({
                frame,
                start: i,
                end: j + 3,
                sequence: sequence.substring(i, j + 3)
              });
              break;
            }
          }
        }
      }
    }
    return orfs;
  }
};

const GenomicsPanel: React.FC = () => {
  const [sequence, setSequence] = useState('');
  const [analysis, setAnalysis] = useState<GenomicsData | null>(null);
  const [orfs, setOrfs] = useState<any[]>([]);
  const [protein, setProtein] = useState('');
  const [revComp, setRevComp] = useState('');

  const handleAnalyze = async () => {
    const result = await GenomicsAPI.analyzeSequence(sequence);
    setAnalysis(result);
  };

  const handleTranslate = () => {
    const p = GenomicsAPI.translateDNA(sequence);
    setProtein(p);
  };

  const handleReverseComplement = () => {
    const rc = GenomicsAPI.reverseComplement(sequence);
    setRevComp(rc);
  };

  const handleFindORFs = () => {
    const foundOrfs = GenomicsAPI.findOpenReadingFrames(sequence);
    setOrfs(foundOrfs);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧬 Genomics API</h2>
      
      <textarea
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        placeholder="Enter DNA sequence (ATCG)"
        style={styles.textarea}
      />

      <div style={styles.buttonGroup}>
        <button onClick={handleAnalyze} style={styles.button}>Analyze Sequence</button>
        <button onClick={handleTranslate} style={styles.button}>Translate to Protein</button>
        <button onClick={handleReverseComplement} style={styles.button}>Reverse Complement</button>
        <button onClick={handleFindORFs} style={styles.button}>Find ORFs</button>
      </div>

      {analysis && (
        <div style={styles.results}>
          <h3>Sequence Analysis</h3>
          <p>Length: {analysis.sequence.length} bp</p>
          <p>GC Content: {analysis.gcContent.toFixed(2)}%</p>
          <p>Gene Count (ATG): {analysis.geneCount}</p>
        </div>
      )}

      {protein && (
        <div style={styles.results}>
          <h3>Translated Protein</h3>
          <p style={styles.code}>{protein}</p>
        </div>
      )}

      {revComp && (
        <div style={styles.results}>
          <h3>Reverse Complement</h3>
          <p style={styles.code}>{revComp}</p>
        </div>
      )}

      {orfs.length > 0 && (
        <div style={styles.results}>
          <h3>Open Reading Frames</h3>
          {orfs.map((orf, idx) => (
            <p key={idx}>
              Frame {orf.frame}: {orf.start}-{orf.end} ({(orf.end - orf.start) / 3} codons)
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    borderRadius: '8px',
    fontFamily: 'monospace'
  } as React.CSSProperties,
  title: {
    color: '#00d4ff',
    marginBottom: '15px'
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    height: '150px',
    backgroundColor: '#2d2d2d',
    color: '#e0e0e0',
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '12px',
    marginBottom: '10px'
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap'
  } as React.CSSProperties,
  button: {
    padding: '8px 16px',
    backgroundColor: '#00d4ff',
    color: '#1e1e1e',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px'
  } as React.CSSProperties,
  results: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#2d2d2d',
    borderLeft: '3px solid #00d4ff',
    borderRadius: '4px'
  } as React.CSSProperties,
  code: {
    backgroundColor: '#1a1a1a',
    padding: '8px',
    borderRadius: '4px',
    overflow: 'auto',
    wordBreak: 'break-all'
  } as React.CSSProperties
};

export { GenomicsPanel, GenomicsAPI };
