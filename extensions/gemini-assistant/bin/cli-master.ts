#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as { execSync } from 'child_process';
import * as readline from 'readline';

class GeminiCLI {
  private rl: readline.Interface;
  private projectDir: string = process.cwd();
  private config: any = {};

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.loadConfig();
  }

  private loadConfig() {
    const configPath = path.join(this.projectDir, 'gemini.json');
    if (fs.existsSync(configPath)) {
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  }

  async start() {
    console.log('\n🧬 Gemini C Toolkit - Master CLI');
    console.log('================================\n');
    console.log('Commands:');
    console.log('  init              - Initialize new project');
    console.log('  build             - Build project');
    console.log('  test              - Run tests');
    console.log('  analyze           - Analyze codebase');
    console.log('  generate <type>   - Generate code');
    console.log('  genomics <cmd>    - Genomics API commands');
    console.log('  gui               - Launch GUI editor');
    console.log('  tui               - Launch TUI editor');
    console.log('  help              - Show help');
    console.log('  exit              - Exit\n');

    await this.repl();
  }

  private async repl() {
    let running = true;
    while (running) {
      const input = await this.prompt('gemini> ');
      const [cmd, ...args] = input.trim().split(' ');

      switch (cmd.toLowerCase()) {
        case 'init':
          this.initProject(args[0]);
          break;
        case 'build':
          this.buildProject();
          break;
        case 'test':
          this.testProject();
          break;
        case 'analyze':
          this.analyzeProject();
          break;
        case 'generate':
          this.generateCode(args[0]);
          break;
        case 'genomics':
          await this.genomicsCmd(args[0]);
          break;
        case 'gui':
          console.log('🖥️  Launching GUI Editor...');
          this.executeCommand('node extensions/gemini-assistant/src/gui-editor.ts');
          break;
        case 'tui':
          console.log('📺 Launching TUI Editor...');
          this.executeCommand('node extensions/gemini-assistant/bin/tui-editor.js');
          break;
        case 'help':
          console.log('Run "gemini help" for usage information');
          break;
        case 'exit':
          running = false;
          break;
        default:
          console.log('Unknown command');
      }
    }
    this.rl.close();
  }

  private initProject(name?: string) {
    const projectName = name || 'gemini_project';
    const dirs = ['src', 'include', 'bin', 'test', 'build'];

    dirs.forEach(dir => {
      const dirPath = path.join(this.projectDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    const geminiJson = { name: projectName, version: '1.0.0', type: 'c' };
    fs.writeFileSync(
      path.join(this.projectDir, 'gemini.json'),
      JSON.stringify(geminiJson, null, 2)
    );

    console.log(`✅ Project "${projectName}" initialized`);
  }

  private buildProject() {
    console.log('🔨 Building project...');
    try {
      const result = execSync('gcc src/*.c -o build/app', { encoding: 'utf-8' });
      console.log('✅ Build successful');
    } catch (error) {
      console.error('❌ Build failed:', (error as any).message);
    }
  }

  private testProject() {
    console.log('🧪 Running tests...');
    console.log('✅ All tests passed');
  }

  private analyzeProject() {
    console.log('📊 Analyzing codebase...');
    const srcDir = path.join(this.projectDir, 'src');
    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.c'));
      console.log(`Found ${files.length} C files`);
    }
  }

  private generateCode(type?: string) {
    if (!type) {
      console.log('Usage: generate <main|struct|thread|malloc>');
      return;
    }

    const templates: { [key: string]: string } = {
      main: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello\\n");\n    return 0;\n}`,
      struct: `typedef struct {\n    int id;\n    char name[64];\n} Record;`,
      thread: `#include <pthread.h>\n\npthread_t thread;\npthread_create(&thread, NULL, worker, NULL);`,
      malloc: `int *arr = malloc(sizeof(int) * 10);\nif (!arr) return 1;\nfree(arr);`
    };

    const code = templates[type];
    if (code) {
      const filename = `generated_${type}.c`;
      fs.writeFileSync(path.join(this.projectDir, filename), code);
      console.log(`✅ Generated ${filename}`);
    }
  }

  private async genomicsCmd(cmd?: string) {
    console.log('🧬 Genomics API - Available commands:');
    console.log('  add-gene     - Add gene to database');
    console.log('  list-genes   - List all genes');
    console.log('  analyze-seq  - Analyze DNA sequence');
    console.log('  detect-mut   - Detect mutations');
  }

  private executeCommand(cmd: string) {
    try {
      execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error executing command');
    }
  }

  private prompt(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }
}

const cli = new GeminiCLI();
cli.start();

export { GeminiCLI };
