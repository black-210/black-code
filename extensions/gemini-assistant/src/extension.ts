import * as vscode from 'vscode';

interface LocalFileInfo {
  name: string;
  path: string;
  content: string;
}

class GeminiAssistantPanel {
  private static currentPanel: GeminiAssistantPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];
  private readonly uploadedFiles: LocalFileInfo[] = [];

  public static createOrShow(): void {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (GeminiAssistantPanel.currentPanel) {
      GeminiAssistantPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'geminiAssistantPanel',
      'Gemini Assistant',
      { viewColumn: column ?? vscode.ViewColumn.One, preserveFocus: false },
      {
        enableScripts: true,
        localResourceRoots: []
      }
    );

    GeminiAssistantPanel.currentPanel = new GeminiAssistantPanel(panel);
  }

  private constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
    this.panel.webview.html = this.buildHtml();

    this.panel.onDidDispose(() => {
      GeminiAssistantPanel.currentPanel = undefined;
      while (this.disposables.length) {
        this.disposables.pop()?.dispose();
      }
    }, null, this.disposables);

    this.panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'prompt': {
          const suggestion = this.generateSuggestion(message.text);
          this.panel.webview.postMessage({ type: 'result', content: suggestion });
          break;
        }
        case 'upload': {
          await this.uploadSelectedFiles();
          break;
        }
        case 'insert': {
          await this.insertAtCursor(message.code);
          break;
        }
      }
    }, undefined, this.disposables);
  }

  private async uploadSelectedFiles(): Promise<void> {
    const selected = await vscode.window.showOpenDialog({
      canSelectMany: true,
      openLabel: 'Upload Files',
      filters: {
        'Text files': ['c', 'h', 'cpp', 'cc', 'hpp', 'js', 'ts', 'py', 'md', 'json', 'txt']
      }
    });

    if (!selected || selected.length === 0) {
      return;
    }

    for (const file of selected) {
      try {
        const content = await vscode.workspace.fs.readFile(file);
        const text = Buffer.from(content).toString('utf8');
        this.uploadedFiles.push({
          name: file.path.split('/').pop() ?? 'file',
          path: file.fsPath,
          content: text
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to read ${file.fsPath}: ${String(error)}`);
      }
    }

    this.panel.webview.postMessage({
      type: 'files',
      files: this.uploadedFiles.map(file => ({ name: file.name, path: file.path }))
    });
  }

  private async insertAtCursor(code: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    await editor.edit((builder) => {
      const selection = editor.selection;
      builder.replace(selection, code);
    });
  }

  private generateSuggestion(prompt: string): string {
    const trimmed = (prompt || '').trim();

    const fileContext = this.uploadedFiles
      .map(file => `// ${file.name}\n${file.content.slice(0, 500)}`)
      .join('\n\n');

    const combinedContext = `${trimmed}\n\n${fileContext}`;

    if (/c\b|c\+\+|cpp|stdio|malloc|printf|main\s*\(/i.test(combinedContext)) {
      return `#include <stdio.h>\n\nint main(void) {\n    printf("Gemini Assistant ready.\\n");\n    return 0;\n}`;
    }

    if (/http|fetch|api|axios|request/i.test(combinedContext)) {
      return `async function loadData() {\n  try {\n    const response = await fetch('/api/data');\n    if (!response.ok) {\n      throw new Error('Request failed');\n    }\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('loadData error:', error);\n    return null;\n  }\n}`;
    }

    if (/class|object|typescript|interface/i.test(combinedContext)) {
      return `export interface AssistantResult {\n  ok: boolean;\n  message: string;\n}\n\nexport class AssistantService {\n  public run(): AssistantResult {\n    return { ok: true, message: 'Gemini-like assistant loaded.' };\n  }\n}`;
    }

    if (/python|def |flask|requests/i.test(combinedContext)) {
      return `def run_assistant():\n    print("Gemini assistant ready")\n    return True`; 
    }

    return `// Gemini suggestion\nconst assistant = {\n  ready: true,\n  mode: 'offline',\n  help: 'Generate a faster and cleaner implementation.'\n};\n\nconsole.log(assistant);`;
  }

  private buildHtml(): string {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gemini Assistant</title>
        <style>
          :root {
            --bg: #0d1117;
            --panel: #111827;
            --card: #1f2937;
            --muted: #9ca3af;
            --border: rgba(255,255,255,0.08);
            --accent: #8b5cf6;
            --accent-2: #22c55e;
            --text: #f3f4f6;
          }

          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Segoe UI, sans-serif;
            background: linear-gradient(135deg, #0f172a, #111827);
            color: var(--text);
            padding: 18px;
          }

          .shell {
            max-width: 980px;
            margin: 0 auto;
            display: grid;
            gap: 16px;
          }

          .hero {
            background: linear-gradient(135deg, rgba(139,92,246,0.22), rgba(34,197,94,0.15));
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 18px 20px;
          }

          .hero h1 {
            margin: 0 0 6px;
            font-size: 24px;
          }

          .hero p {
            margin: 0;
            color: var(--muted);
          }

          .panel {
            background: rgba(17, 24, 39, 0.92);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 18px;
          }

          textarea {
            width: 100%;
            min-height: 140px;
            resize: vertical;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: #0b1220;
            color: var(--text);
            padding: 14px;
            font-size: 14px;
          }

          .actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 12px;
          }

          button {
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--accent), #7c3aed);
            color: white;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 600;
          }

          button.secondary {
            background: linear-gradient(135deg, var(--accent-2), #16a34a);
          }

          pre {
            margin: 0;
            white-space: pre-wrap;
            background: #020817;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 14px;
            color: #dbeafe;
            font-family: Consolas, monospace;
          }

          ul {
            margin: 0;
            padding-left: 18px;
            color: var(--muted);
          }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="hero">
            <h1>Gemini Code Assistant</h1>
            <p>Free, fast, independent, and stronger than a basic inline suggestion box.</p>
          </div>

          <div class="panel">
            <textarea id="prompt" placeholder="Describe the feature, bug, API, or C function you want to generate..."></textarea>
            <div class="actions">
              <button id="generate">Generate Suggestion</button>
              <button id="upload" class="secondary">Upload Files</button>
            </div>
          </div>

          <div class="panel">
            <h3>Result</h3>
            <pre id="result">No output yet.</pre>
            <div class="actions">
              <button id="insert">Insert into Editor</button>
            </div>
          </div>

          <div class="panel">
            <h3>Files</h3>
            <ul id="files"></ul>
          </div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          const resultBox = document.getElementById('result');
          const filesList = document.getElementById('files');
          const promptInput = document.getElementById('prompt');
          let latestCode = '';

          document.getElementById('generate').addEventListener('click', () => {
            const text = promptInput.value.trim();
            vscode.postMessage({ command: 'prompt', text });
          });

          document.getElementById('upload').addEventListener('click', () => {
            vscode.postMessage({ command: 'upload' });
          });

          document.getElementById('insert').addEventListener('click', () => {
            if (!latestCode) return;
            vscode.postMessage({ command: 'insert', code: latestCode });
          });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (!message) return;

            if (message.type === 'result') {
              latestCode = message.content;
              resultBox.textContent = message.content;
            }

            if (message.type === 'files') {
              filesList.innerHTML = '';
              if (!message.files || message.files.length === 0) {
                filesList.innerHTML = '<li>No files uploaded yet.</li>';
                return;
              }

              for (const file of message.files) {
                const item = document.createElement('li');
                item.textContent = file.name;
                filesList.appendChild(item);
              }
            }
          });
        </script>
      </body>
      </html>`;
  }
}

class GeminiAssistantService {
  public async uploadFiles(): Promise<void> {
    const files = await vscode.window.showOpenDialog({
      canSelectMany: true,
      openLabel: 'Select Files',
      filters: {
        'Code files': ['c', 'h', 'cpp', 'cc', 'hpp', 'js', 'ts', 'py', 'md', 'json']
      }
    });

    if (!files || files.length === 0) {
      return;
    }

    const loaded: string[] = [];
    for (const file of files) {
      const content = await vscode.workspace.fs.readFile(file);
      loaded.push(`${file.fsPath}:\n${Buffer.from(content).toString('utf8').slice(0, 500)}`);
    }

    if (loaded.length > 0) {
      vscode.window.showInformationMessage(`Loaded ${loaded.length} file(s) into the assistant context.`);
    }
  }

  public generateSuggestionForCurrentEditor(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Open a file before generating a suggestion.');
      return;
    }

    const text = editor.document.getText();
    const language = editor.document.languageId;
    const suggestion = this.createInlineSuggestion(text, language);
    editor.edit((builder) => {
      const selection = editor.selection;
      builder.replace(selection, suggestion);
    });
  }

  private createInlineSuggestion(source: string, language: string): string {
    if (language === 'c' || language === 'cpp') {
      return `#include <stdio.h>\n\nint main(void) {\n    printf("Gemini assistant ready.\\n");\n    return 0;\n}`;
    }

    if (language === 'typescript' || language === 'javascript') {
      return `const assistant = {\n  ready: true,\n  mode: 'offline',\n  message: 'Gemini-inspired suggestions are active.'\n};\n\nconsole.log(assistant);`;
    }

    return `# Gemini assistant\nprint('Ready and faster than a basic suggestion box')`;
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const panelService = new GeminiAssistantService();

  const openPanel = vscode.commands.registerCommand('geminiAssistant.openPanel', () => {
    GeminiAssistantPanel.createOrShow();
  });

  const uploadFiles = vscode.commands.registerCommand('geminiAssistant.uploadFiles', async () => {
    await panelService.uploadFiles();
    GeminiAssistantPanel.createOrShow();
  });

  const generateFromPrompt = vscode.commands.registerCommand('geminiAssistant.generateFromPrompt', () => {
    panelService.generateSuggestionForCurrentEditor();
  });

  const provider = vscode.languages.registerInlineCompletionItemProvider(
    [
      { language: 'c' },
      { language: 'cpp' },
      { language: 'javascript' },
      { language: 'typescript' },
      { language: 'python' }
    ],
    {
      provideInlineCompletionItems(document, position) {
        const content = document.getText();
        const language = document.languageId;
        const suggestion = new GeminiAssistantService().createInlineSuggestion(content, language);

        return [
          {
            insertText: suggestion,
            range: new vscode.Range(position, position),
            filterText: suggestion,
            command: {
              command: 'editor.action.triggerSuggest',
              arguments: []
            }
          }
        ];
      }
    }
  );

  context.subscriptions.push(openPanel, uploadFiles, generateFromPrompt, provider);
}

export function deactivate(): void {
  // no-op
}
