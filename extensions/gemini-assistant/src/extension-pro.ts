import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface CMemoryProfile {
  allocations: Array<{ line: number; size: string; isFreed: boolean }>;
  potentialLeaks: string[];
  unsafeFunctions: string[];
  leakRisk: number; // 0-100
}

interface CodeAnalysisResult {
  language: string;
  lineCount: number;
  complexity: number;
  issues: string[];
  suggestions: string[];
  patterns: string[];
}

class AdvancedCAnalyzer {
  /**
   * Perform deep memory safety analysis on C code
   */
  analyzeMemorySafety(content: string): CMemoryProfile {
    const profile: CMemoryProfile = {
      allocations: [],
      potentialLeaks: [],
      unsafeFunctions: [],
      leakRisk: 0
    };

    const lines = content.split('\n');
    const mallocLines: number[] = [];
    const freeLines: number[] = [];

    // Track malloc/free
    lines.forEach((line, index) => {
      if (/malloc\s*\(/.test(line)) {
        mallocLines.push(index);
        const sizeMatch = line.match(/malloc\s*\(\s*([^)]+)/);
        profile.allocations.push({
          line: index + 1,
          size: sizeMatch ? sizeMatch[1] : 'unknown',
          isFreed: false
        });
      }
      if (/free\s*\(/.test(line)) {
        freeLines.push(index);
      }
    });

    // Detect unsafe functions
    const unsafeFuncs = ['strcpy', 'strcat', 'sprintf', 'scanf', 'gets', 'scanf_s', 'fscanf'];
    unsafeFuncs.forEach(func => {
      if (new RegExp(`\\b${func}\\s*\\(`).test(content)) {
        profile.unsafeFunctions.push(func);
      }
    });

    // Calculate leak risk
    const mallocCount = mallocLines.length;
    const freeCount = freeLines.length;
    const difference = mallocCount - freeCount;

    if (difference > 0) {
      profile.potentialLeaks.push(`Found ${difference} malloc(s) without corresponding free()`);
      profile.leakRisk = Math.min(100, 50 + (difference * 25));
    }

    if (profile.unsafeFunctions.length > 0) {
      profile.leakRisk += profile.unsafeFunctions.length * 10;
      profile.potentialLeaks.push(`${profile.unsafeFunctions.length} unsafe function(s) detected`);
    }

    profile.leakRisk = Math.min(100, profile.leakRisk);
    return profile;
  }

  /**
   * Analyze code complexity and suggest improvements
   */
  analyzeComplexity(content: string, language: string): CodeAnalysisResult {
    const result: CodeAnalysisResult = {
      language,
      lineCount: content.split('\n').length,
      complexity: 0,
      issues: [],
      suggestions: [],
      patterns: []
    };

    // Calculate cyclomatic complexity
    const ifMatches = content.match(/\bif\s*\(/g) || [];
    const switchMatches = content.match(/\bswitch\s*\(/g) || [];
    const forMatches = content.match(/\bfor\s*\(/g) || [];
    const whileMatches = content.match(/\bwhile\s*\(/g) || [];
    const caseMatches = content.match(/\bcase\s+/g) || [];
    const andMatches = content.match(/&&/g) || [];
    const orMatches = content.match(/\|\|/g) || [];

    result.complexity =
      1 +
      ifMatches.length +
      switchMatches.length +
      forMatches.length +
      whileMatches.length +
      caseMatches.length +
      Math.floor((andMatches.length + orMatches.length) / 2);

    // Complexity assessment
    if (result.complexity > 10) {
      result.issues.push('High cyclomatic complexity - consider refactoring');
      result.suggestions.push('Extract complex logic into smaller functions');
    }

    if (result.lineCount > 500) {
      result.issues.push('File is quite long - consider splitting into modules');
      result.suggestions.push('Split into multiple files for better maintainability');
    }

    // Pattern detection
    if (/typedef\s+struct/g.test(content)) {
      result.patterns.push('struct-pattern');
    }
    if (/malloc\s*\(/.test(content)) {
      result.patterns.push('dynamic-memory');
    }
    if (/pointer\s*=\s*&/.test(content) || /\*\w+\s*=/.test(content)) {
      result.patterns.push('pointer-arithmetic');
    }
    if (/FILE\s*\*/.test(content)) {
      result.patterns.push('file-io');
    }

    return result;
  }

  /**
   * Generate optimized C code suggestions
   */
  generateOptimizedCode(prompt: string, context: string = ''): string {
    // Enhanced C code generation with patterns
    const lowerPrompt = prompt.toLowerCase();

    if (/linked\s*list|node|list/.test(lowerPrompt)) {
      return `typedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nNode *create_node(int data) {\n    Node *node = (Node *)malloc(sizeof(Node));\n    if (!node) return NULL;\n    node->data = data;\n    node->next = NULL;\n    return node;\n}\n\nvoid free_list(Node *head) {\n    while (head) {\n        Node *temp = head;\n        head = head->next;\n        free(temp);\n    }\n}`;
    }

    if (/hash|hashtable|map/.test(lowerPrompt)) {
      return `#define HASH_SIZE 256\n\ntypedef struct {\n    char *key;\n    char *value;\n} HashEntry;\n\ntypedef struct {\n    HashEntry entries[HASH_SIZE];\n    size_t count;\n} HashMap;\n\nint hash_function(const char *key) {\n    int hash = 0;\n    while (*key) {\n        hash = (hash * 31 + *key++) % HASH_SIZE;\n    }\n    return hash;\n}`;
    }

    if (/queue|fifo/.test(lowerPrompt)) {
      return `typedef struct {\n    int *items;\n    int front, rear, size, capacity;\n} Queue;\n\nQueue *queue_create(int capacity) {\n    Queue *q = (Queue *)malloc(sizeof(Queue));\n    if (!q) return NULL;\n    q->items = (int *)malloc(sizeof(int) * capacity);\n    if (!q->items) { free(q); return NULL; }\n    q->front = q->rear = -1;\n    q->size = 0;\n    q->capacity = capacity;\n    return q;\n}`;
    }

    if (/binary\s*tree|bst/.test(lowerPrompt)) {
      return `typedef struct TreeNode {\n    int value;\n    struct TreeNode *left;\n    struct TreeNode *right;\n} TreeNode;\n\nTreeNode *tree_create(int value) {\n    TreeNode *node = (TreeNode *)malloc(sizeof(TreeNode));\n    if (!node) return NULL;\n    node->value = value;\n    node->left = node->right = NULL;\n    return node;\n}\n\nvoid tree_insert(TreeNode **root, int value) {\n    if (*root == NULL) {\n        *root = tree_create(value);\n    } else if (value < (*root)->value) {\n        tree_insert(&(*root)->left, value);\n    } else {\n        tree_insert(&(*root)->right, value);\n    }\n}`;
    }

    if (/sorting|qsort|bubble/.test(lowerPrompt)) {
      return `int compare(const void *a, const void *b) {\n    return *(int *)a - *(int *)b;\n}\n\nvoid array_sort(int *arr, size_t size) {\n    qsort(arr, size, sizeof(int), compare);\n}\n\nvoid print_array(int *arr, size_t size) {\n    for (size_t i = 0; i < size; i++) {\n        printf(\"%d \", arr[i]);\n    }\n    printf(\"\\n\");\n}`;
    }

    if (/thread|pthread|mutex/.test(lowerPrompt)) {
      return `#include <pthread.h>\n\npthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;\n\nvoid *worker_thread(void *arg) {\n    pthread_mutex_lock(&lock);\n    // Critical section\n    printf(\"Working...\\n\");\n    pthread_mutex_unlock(&lock);\n    return NULL;\n}\n\nint main() {\n    pthread_t thread;\n    pthread_create(&thread, NULL, worker_thread, NULL);\n    pthread_join(thread, NULL);\n    return 0;\n}`;
    }

    // Default: provide a context-aware template
    return `// Generated by Gemini Assistant\n// Prompt: ${prompt}\n\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n// TODO: Implement based on prompt\nint main(void) {\n    return EXIT_SUCCESS;\n}`;
  }
}

class EnhancedGeminiPanel {
  private static currentPanel: EnhancedGeminiPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];
  private analyzer = new AdvancedCAnalyzer();

  public static createOrShow(): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (EnhancedGeminiPanel.currentPanel) {
      EnhancedGeminiPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'geminiAssistantEnhanced',
      '🧞 Gemini Assistant Pro',
      { viewColumn: column ?? vscode.ViewColumn.One, preserveFocus: false },
      { enableScripts: true }
    );

    EnhancedGeminiPanel.currentPanel = new EnhancedGeminiPanel(panel);
  }

  private constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
    this.panel.webview.html = this.buildEnhancedHtml();

    this.panel.onDidDispose(() => {
      EnhancedGeminiPanel.currentPanel = undefined;
      while (this.disposables.length) {
        this.disposables.pop()?.dispose();
      }
    }, null, this.disposables);

    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'analyze': {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
              const code = editor.document.getText();
              const safety = this.analyzer.analyzeMemorySafety(code);
              const complexity = this.analyzer.analyzeComplexity(
                code,
                editor.document.languageId
              );
              this.panel.webview.postMessage({
                type: 'analysis',
                safety,
                complexity
              });
            }
            break;
          }
          case 'generate': {
            const code = this.analyzer.generateOptimizedCode(message.prompt);
            this.panel.webview.postMessage({ type: 'generated', code });
            break;
          }
          case 'insert': {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
              await editor.edit((builder) => {
                builder.replace(editor.selection, message.code);
              });
            }
            break;
          }
        }
      },
      undefined,
      this.disposables
    );
  }

  private buildEnhancedHtml(): string {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gemini Assistant Pro</title>
        <style>
          :root {
            --primary: #8b5cf6;
            --primary-dark: #7c3aed;
            --accent: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --bg: #0f172a;
            --surface: #1e293b;
            --surface-light: #334155;
            --text: #f1f5f9;
            --text-muted: #94a3b8;
          }

          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr 1fr;
          }

          @media (max-width: 768px) {
            .container { grid-template-columns: 1fr; }
          }

          .header {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 12px;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }

          .card {
            background: var(--surface);
            border: 1px solid var(--surface-light);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .card h2 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--primary);
          }

          .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .metric {
            background: var(--surface-light);
            padding: 12px;
            border-radius: 8px;
            text-align: center;
          }

          .metric-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
          }

          .metric-label {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
          }

          .risk-high { color: var(--danger); }
          .risk-medium { color: var(--warning); }
          .risk-low { color: var(--accent); }

          textarea {
            width: 100%;
            min-height: 120px;
            border: 1px solid var(--surface-light);
            border-radius: 8px;
            background: var(--bg);
            color: var(--text);
            padding: 12px;
            font-family: monospace;
            resize: vertical;
          }

          button {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          }

          button:hover {
            transform: translateY(-2px);
          }

          button.secondary {
            background: var(--accent);
          }

          .issues-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .issues-list li {
            padding: 8px;
            background: rgba(239, 68, 68, 0.1);
            border-left: 3px solid var(--danger);
            border-radius: 4px;
            margin-bottom: 8px;
            font-size: 13px;
          }

          .code-output {
            background: var(--bg);
            border: 1px solid var(--surface-light);
            border-radius: 8px;
            padding: 12px;
            font-family: monospace;
            font-size: 12px;
            overflow-x: auto;
            max-height: 300px;
            overflow-y: auto;
          }

          .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--surface-light);
            border-radius: 4px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--primary-dark));
            transition: width 0.3s;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span style="font-size: 28px;">🧞</span>
            <div>
              <h1>Gemini Assistant Pro</h1>
              <p style="margin: 0; font-size: 12px; opacity: 0.9;">AI-Powered C Code Generation & Analysis</p>
            </div>
          </div>

          <div class="card">
            <h2>📊 Code Analysis</h2>
            <button id="analyzeBtn" class="secondary">Analyze Current File</button>
            <div id="analysisResults" style="display: none;">
              <div class="analysis-grid">
                <div class="metric">
                  <div class="metric-value" id="complexityValue">0</div>
                  <div class="metric-label">Complexity</div>
                </div>
                <div class="metric">
                  <div class="metric-value risk-high" id="leakRiskValue">0%</div>
                  <div class="metric-label">Memory Risk</div>
                </div>
              </div>
              <div style="margin-top: 12px;">
                <p style="font-size: 12px; color: var(--text-muted);">Issues Found:</p>
                <ul class="issues-list" id="issuesList"></ul>
              </div>
            </div>
          </div>

          <div class="card">
            <h2>✨ Code Generator</h2>
            <textarea id="prompt" placeholder="Describe the C code you want: linked list, binary tree, hash table, etc."></textarea>
            <button id="generateBtn">Generate Code</button>
            <div id="codeOutput" class="code-output" style="display: none;"></div>
            <button id="insertBtn" class="secondary" style="display: none;">Insert into Editor</button>
          </div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          let generatedCode = '';

          document.getElementById('analyzeBtn').addEventListener('click', () => {
            vscode.postMessage({ command: 'analyze' });
          });

          document.getElementById('generateBtn').addEventListener('click', () => {
            const prompt = document.getElementById('prompt').value;
            if (prompt.trim()) {
              vscode.postMessage({ command: 'generate', prompt });
            }
          });

          document.getElementById('insertBtn').addEventListener('click', () => {
            if (generatedCode) {
              vscode.postMessage({ command: 'insert', code: generatedCode });
            }
          });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'analysis') {
              document.getElementById('analysisResults').style.display = 'block';
              document.getElementById('complexityValue').textContent = message.complexity.complexity;
              const riskLevel = message.safety.leakRisk;
              document.getElementById('leakRiskValue').textContent = riskLevel + '%';
              document.getElementById('leakRiskValue').className =
                riskLevel < 30 ? 'metric-value risk-low' :
                riskLevel < 70 ? 'metric-value risk-medium' :
                'metric-value risk-high';

              const issuesList = document.getElementById('issuesList');
              issuesList.innerHTML = '';
              [...message.safety.potentialLeaks, ...message.complexity.issues].forEach(issue => {
                const li = document.createElement('li');
                li.textContent = issue;
                issuesList.appendChild(li);
              });
            }
            if (message.type === 'generated') {
              generatedCode = message.code;
              document.getElementById('codeOutput').textContent = message.code;
              document.getElementById('codeOutput').style.display = 'block';
              document.getElementById('insertBtn').style.display = 'block';
            }
          });
        </script>
      </body>
      </html>`;
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const openPanel = vscode.commands.registerCommand('geminiAssistant.openPanel', () => {
    EnhancedGeminiPanel.createOrShow();
  });

  context.subscriptions.push(openPanel);
}

export function deactivate(): void {}
