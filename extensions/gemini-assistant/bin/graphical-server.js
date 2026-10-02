#!/usr/bin/env node

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
app.use(express.json());

// Genomics API endpoints
app.post('/api/genomics/analyze', (req, res) => {
  const { sequence } = req.body;
  if (!sequence) {
    return res.status(400).json({ error: 'Sequence required' });
  }

  const gcContent = (sequence.match(/[GC]/gi) || []).length / sequence.length * 100;
  const geneCount = sequence.split('ATG').length - 1;
  const length = sequence.length;

  res.json({
    length,
    gcContent: gcContent.toFixed(2),
    geneCount,
    status: 'analyzed'
  });
});

app.post('/api/genomics/translate', (req, res) => {
  const { sequence } = req.body;
  if (!sequence) {
    return res.status(400).json({ error: 'Sequence required' });
  }

  const codonTable = {
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

  res.json({ protein, length: protein.length });
});

app.post('/api/genomics/reverse-complement', (req, res) => {
  const { sequence } = req.body;
  if (!sequence) {
    return res.status(400).json({ error: 'Sequence required' });
  }

  const complement = {
    'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
    'a': 't', 't': 'a', 'g': 'c', 'c': 'g'
  };

  const revComp = sequence
    .split('')
    .reverse()
    .map(b => complement[b] || b)
    .join('');

  res.json({ reverseComplement: revComp });
});

app.post('/api/genomics/find-orfs', (req, res) => {
  const { sequence } = req.body;
  if (!sequence) {
    return res.status(400).json({ error: 'Sequence required' });
  }

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
              length: (j + 3 - i) / 3,
              sequence: sequence.substring(i, j + 3)
            });
            break;
          }
        }
      }
    }
  }

  res.json({ orfs, count: orfs.length });
});

// C Code compilation API
app.post('/api/compile', (req, res) => {
  const { code, filename } = req.body;
  if (!code || !filename) {
    return res.status(400).json({ error: 'Code and filename required' });
  }

  const tempFile = `/tmp/${filename}`;
  const outputFile = `/tmp/${filename.replace('.c', '')}_bin`;

  try {
    fs.writeFileSync(tempFile, code);
    execSync(`gcc -Wall -O2 ${tempFile} -o ${outputFile}`);
    res.json({ success: true, binary: outputFile, message: 'Compiled successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/analyze-code', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code required' });
  }

  const lines = code.split('\n').length;
  const functions = (code.match(/^\w+\s+\w+\s*\(/gm) || []).length;
  const mallocs = (code.match(/malloc/g) || []).length;
  const frees = (code.match(/free/g) || []).length;
  const unsafe = [
    'strcpy', 'gets', 'sprintf', 'scanf', 'strcat'
  ].reduce((count, func) => count + ((code.match(new RegExp(func, 'g')) || []).length), 0);

  res.json({
    lines,
    functions,
    mallocs,
    frees,
    unsafeFunctions: unsafe,
    memoryRisk: mallocs > frees ? 'HIGH' : 'LOW'
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gemini - Graphical Editor + Genomics</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #1e1e1e;
          color: #e0e0e0;
          font-family: 'Consolas', monospace;
        }
        h1 { color: #00d4ff; }
        .container { max-width: 1200px; margin: 0 auto; }
        .tab { padding: 10px; margin: 5px; background: #2d2d2d; border: 1px solid #444; cursor: pointer; }
        .active { background: #00d4ff; color: #1e1e1e; }
        textarea { width: 100%; height: 300px; background: #1a1a1a; color: #00d4ff; border: 1px solid #444; padding: 10px; }
        button { background: #00d4ff; color: #1e1e1e; padding: 8px 16px; border: none; cursor: pointer; }
        .api-section { background: #2d2d2d; padding: 20px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔥 GEMINI Graphical Editor + Genomics API</h1>
        <p>Standalone C editor with integrated genomics analysis tools</p>
        
        <h2>API Endpoints</h2>
        <div class="api-section">
          <h3>Genomics</h3>
          <p>POST /api/genomics/analyze - Analyze DNA sequence</p>
          <p>POST /api/genomics/translate - Translate DNA to protein</p>
          <p>POST /api/genomics/reverse-complement - Get reverse complement</p>
          <p>POST /api/genomics/find-orfs - Find open reading frames</p>
        </div>
        
        <div class="api-section">
          <h3>C Development</h3>
          <p>POST /api/compile - Compile C code</p>
          <p>POST /api/analyze-code - Analyze C code metrics</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Gemini Server running on http://localhost:${PORT}`);
  console.log(`✓ Genomics API available at /api/genomics/*`);
  console.log(`✓ C Compilation API available at /api/compile`);
});
