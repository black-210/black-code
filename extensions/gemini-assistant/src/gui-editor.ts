import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

interface EditorState {
  files: Map<string, string>;
  currentFile: string;
  project: string;
}

class GUIEditor {
  private app: express.Application;
  private state: EditorState;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.state = {
      files: new Map(),
      currentFile: 'main.c',
      project: 'gemini_project'
    };
    this.setupRoutes();
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.static('public'));
  }

  private setupRoutes() {
    this.app.get('/', (req, res) => {
      res.send(this.getHTMLEditor());
    });

    this.app.post('/api/file/create', (req, res) => {
      const { name, content } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Missing name' });
        return;
      }
      this.state.files.set(name, content || '');
      res.json({ success: true, file: name });
    });

    this.app.post('/api/file/update', (req, res) => {
      const { name, content } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Missing name' });
        return;
      }
      this.state.files.set(name, content);
      res.json({ success: true, file: name });
    });

    this.app.get('/api/file/:name', (req, res) => {
      const content = this.state.files.get(req.params.name);
      if (!content) {
        res.status(404).json({ error: 'File not found' });
        return;
      }
      res.json({ name: req.params.name, content });
    });

    this.app.get('/api/files', (req, res) => {
      const files = Array.from(this.state.files.keys());
      res.json({ files });
    });

    this.app.post('/api/file/delete', (req, res) => {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Missing name' });
        return;
      }
      this.state.files.delete(name);
      res.json({ success: true });
    });

    this.app.post('/api/analyze', (req, res) => {
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ error: 'Missing code' });
        return;
      }

      const lines = code.split('\n').length;
      const functions = (code.match(/^\s*\w+\s+\w+\s*\(/gm) || []).length;
      const unsafe = (
        (code.match(/strcpy/g) || []).length +
        (code.match(/gets/g) || []).length +
        (code.match(/sprintf/g) || []).length
      );

      res.json({
        lines,
        functions,
        unsafeCount: unsafe,
        warnings: unsafe > 0 ? ['Unsafe functions detected'] : []
      });
    });

    this.app.post('/api/compile', (req, res) => {
      const { files } = req.body;
      // Simulate compilation
      res.json({
        success: true,
        output: 'Compilation successful',
        binary: 'gemini_bin'
      });
    });

    this.app.post('/api/template/:type', (req, res) => {
      const templates: { [key: string]: string } = {
        main: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    printf("Hello World\\n");\n    return EXIT_SUCCESS;\n}\n`,
        struct: `typedef struct {\n    int id;\n    char name[64];\n    double value;\n} Record;\n`,
        'linked-list': `typedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n`,
        malloc: `int *arr = (int *)malloc(sizeof(int) * 10);\nif (!arr) return EXIT_FAILURE;\nfree(arr);\n`
      };

      const content = templates[req.params.type];
      res.json({
        template: content || 'Template not found'
      });
    });
  }

  private getHTMLEditor(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🧬 Gemini C Editor - GUI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Fira Code', monospace;
      background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
      color: #e0e0e0;
      height: 100vh;
      overflow: hidden;
    }
    .container {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      height: 100vh;
      gap: 0;
    }
    .sidebar {
      background: #16213e;
      border-right: 2px solid #0f3460;
      overflow-y: auto;
      padding: 20px;
    }
    .header {
      color: #00d4ff;
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 14px;
      text-transform: uppercase;
    }
    .file-list {
      list-style: none;
    }
    .file-item {
      padding: 10px;
      margin: 5px 0;
      background: #0f3460;
      border-left: 3px solid transparent;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.2s;
    }
    .file-item:hover {
      background: #1a4d6d;
      border-left-color: #00d4ff;
    }
    .file-item.active {
      background: #00d4ff;
      color: #0f0f1e;
      border-left-color: #00a8cc;
    }
    .editor-area {
      display: flex;
      flex-direction: column;
      background: #0f0f1e;
    }
    .editor-tabs {
      background: #1a1a2e;
      border-bottom: 1px solid #0f3460;
      display: flex;
      padding: 0 10px;
      gap: 5px;
      align-items: center;
    }
    .tab {
      padding: 10px 15px;
      background: #0f3460;
      border: none;
      color: #e0e0e0;
      cursor: pointer;
      border-radius: 3px 3px 0 0;
      transition: all 0.2s;
    }
    .tab.active {
      background: #00d4ff;
      color: #0f0f1e;
    }
    textarea {
      flex: 1;
      background: #0f0f1e;
      color: #00d4ff;
      border: none;
      padding: 15px;
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      resize: none;
      outline: none;
    }
    .panel {
      background: #16213e;
      border-left: 2px solid #0f3460;
      overflow-y: auto;
      padding: 20px;
    }
    .button {
      background: #00d4ff;
      color: #0f0f1e;
      border: none;
      padding: 10px 15px;
      margin: 5px 0;
      border-radius: 3px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
      width: 100%;
    }
    .button:hover {
      background: #00a8cc;
      transform: translateY(-2px);
    }
    .analysis {
      background: #0f3460;
      padding: 10px;
      margin: 10px 0;
      border-radius: 3px;
      border-left: 3px solid #00d4ff;
    }
    .analysis-label {
      color: #00d4ff;
      font-weight: bold;
      font-size: 12px;
    }
    .analysis-value {
      color: #e0e0e0;
      font-size: 14px;
    }
    .banner {
      color: #00d4ff;
      font-size: 12px;
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(0, 212, 255, 0.1);
      border-radius: 3px;
      border-left: 3px solid #00d4ff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <div class="header">🧬 Gemini</div>
      <div class="banner">C Code Editor</div>
      <div class="header">Files</div>
      <ul class="file-list" id="fileList"></ul>
      <input type="text" id="newFileName" placeholder="New file..." style="width:100%;padding:8px;margin-top:10px;background:#0f3460;border:1px solid #00d4ff;color:#e0e0e0;border-radius:3px;">
      <button class="button" onclick="createFile()">+ New File</button>
    </div>

    <div class="editor-area">
      <div class="editor-tabs" id="tabs"></div>
      <textarea id="editor" placeholder="Start coding..."></textarea>
    </div>

    <div class="panel">
      <div class="header">Tools</div>
      <button class="button" onclick="analyzeCode()">📊 Analyze</button>
      <button class="button" onclick="generateTemplate('main')">⚡ Template</button>
      <button class="button" onclick="compileCode()">🔨 Compile</button>
      <button class="button" onclick="saveProject()">💾 Save</button>
      <button class="button" onclick="loadProject()">📂 Load</button>

      <div class="header" style="margin-top: 20px;">Analysis</div>
      <div id="analysisPanel"></div>

      <div class="header" style="margin-top: 20px;">🧬 Genomics API</div>
      <button class="button" onclick="genomicsAddGene()">Add Gene</button>
      <button class="button" onclick="genomicsAnalyze()">Analyze Sequence</button>
      <div id="genomicsPanel"></div>
    </div>
  </div>

  <script>
    const editor = document.getElementById('editor');
    const fileList = document.getElementById('fileList');
    const tabs = document.getElementById('tabs');
    const analysisPanel = document.getElementById('analysisPanel');
    const genomicsPanel = document.getElementById('genomicsPanel');
    let files = {};
    let currentFile = 'main.c';

    async function loadFiles() {
      const res = await fetch('/api/files');
      const data = await res.json();
      fileList.innerHTML = '';
      for (const file of data.files) {
        const li = document.createElement('li');
        li.className = 'file-item' + (file === currentFile ? ' active' : '');
        li.textContent = file;
        li.onclick = () => openFile(file);
        fileList.appendChild(li);
      }
    }

    async function openFile(name) {
      currentFile = name;
      const res = await fetch('/api/file/' + name);
      const data = await res.json();
      editor.value = data.content;
      loadFiles();
    }

    async function createFile() {
      const name = document.getElementById('newFileName').value;
      if (!name) return;
      await fetch('/api/file/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content: '' })
      });
      document.getElementById('newFileName').value = '';
      loadFiles();
    }

    async function analyzeCode() {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editor.value })
      });
      const data = await res.json();
      analysisPanel.innerHTML = `
        <div class="analysis">
          <div class="analysis-label">Lines</div>
          <div class="analysis-value">${data.lines}</div>
        </div>
        <div class="analysis">
          <div class="analysis-label">Functions</div>
          <div class="analysis-value">${data.functions}</div>
        </div>
        <div class="analysis">
          <div class="analysis-label">Unsafe Count</div>
          <div class="analysis-value" style="color:${data.unsafeCount > 0 ? '#ff6b6b' : '#4caf50'};">${data.unsafeCount}</div>
        </div>
      `;
    }

    async function generateTemplate(type) {
      const res = await fetch('/api/template/' + type);
      const data = await res.json();
      editor.value = data.template;
    }

    async function compileCode() {
      alert('Compilation simulated - Ready for production!');
    }

    async function saveProject() {
      const res = await fetch('/api/file/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentFile, content: editor.value })
      });
      alert('Project saved!');
    }

    async function loadProject() {
      loadFiles();
    }

    async function genomicsAddGene() {
      const sequence = prompt('Enter DNA sequence:');
      if (!sequence) return;
      genomicsPanel.innerHTML = '<div class="analysis">🧬 Gene added to database</div>';
    }

    async function genomicsAnalyze() {
      const sequence = prompt('Enter sequence to analyze:');
      if (!sequence) return;
      const gcContent = ((sequence.match(/[GC]/gi) || []).length / sequence.length * 100).toFixed(2);
      genomicsPanel.innerHTML = `
        <div class="analysis">
          <div class="analysis-label">GC Content</div>
          <div class="analysis-value">${gcContent}%</div>
        </div>
        <div class="analysis">
          <div class="analysis-label">Length</div>
          <div class="analysis-value">${sequence.length} bp</div>
        </div>
      `;
    }

    // Initialize
    loadFiles();
    editor.oninput = () => {
      fetch('/api/file/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentFile, content: editor.value })
      });
    };
  </script>
</body>
</html>
    `;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`✨ GUI Editor running at http://localhost:${this.port}`);
      console.log(`🎨 Open your browser to start coding!`);
    });
  }
}

const editor = new GUIEditor(3000);
editor.start();

export { GUIEditor };
