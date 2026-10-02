#!/usr/bin/env node

const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TUIEditor {
  constructor() {
    this.screen = blessed.screen({
      mouse: true,
      title: '🧬 Gemini TUI Editor'
    });

    this.files = new Map();
    this.currentFile = 'main.c';
    this.initializeFiles();
    this.setupUI();
  }

  initializeFiles() {
    this.files.set('main.c', '#include <stdio.h>\n\nint main(void) {\n    printf("Hello World\\n");\n    return 0;\n}');
  }

  setupUI() {
    const fileList = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '20%',
      height: '100%',
      border: 'line',
      title: '📁 Files',
      style: { border: { fg: 'cyan' } }
    });

    const editor = blessed.textarea({
      parent: this.screen,
      top: 0,
      left: '20%',
      width: '60%',
      height: '85%',
      border: 'line',
      title: `✏️  ${this.currentFile}`,
      value: this.files.get(this.currentFile),
      style: { border: { fg: 'green' } }
    });

    const panel = blessed.box({
      parent: this.screen,
      top: 0,
      left: '80%',
      width: '20%',
      height: '100%',
      border: 'line',
      title: '🛠️  Tools',
      style: { border: { fg: 'yellow' } }
    });

    const commands = blessed.box({
      parent: this.screen,
      top: '85%',
      left: 0,
      width: '100%',
      height: '15%',
      border: 'line',
      title: '⌨️  Commands (q:quit)',
      content: 'C: Compile | A: Analyze | S: Save | T: Template | G: Genomics',
      style: { border: { fg: 'magenta' } }
    });

    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0);
    });

    this.screen.key(['c'], () => {
      const msg = blessed.box({ parent: this.screen, content: '✅ Compiled!', top: 'center', left: 'center' });
      setTimeout(() => msg.destroy(), 2000);
    });

    this.screen.key(['a'], () => {
      const lines = editor.value.split('\n').length;
      const analysis = blessed.box({
        parent: this.screen,
        top: 'center',
        left: 'center',
        width: 40,
        height: 10,
        border: 'line',
        content: `Lines: ${lines}\nAnalysis Complete`,
        style: { border: { fg: 'green' } }
      });
      setTimeout(() => analysis.destroy(), 3000);
    });

    fileList.setContent('main.c\nutils.c\ntest.c');
    panel.setContent('\n Build\n Analyze\n Save\n Load\n\n Genomics\n Add Gene\n Analyze Seq');

    editor.focus();
    this.screen.render();
  }

  run() {
    this.screen.key(['C-q'], () => {
      return process.exit(0);
    });
  }
}

const editor = new TUIEditor();
editor.run();

module.exports = { TUIEditor };
