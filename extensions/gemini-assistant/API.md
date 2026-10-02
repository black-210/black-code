# Gemini Code Assistant - API Reference

## Overview

The Gemini API provides programmatic access to code analysis and generation features.

## CLI API

### Installation

```bash
npm install -g gemini-assistant-cli
```

### Commands

#### `gemini-cli analyze [directory]`

Analyze C/C++ files in a directory.

```bash
gemini-cli analyze ./src
```

**Output**:
```json
{
  "files": [
    {
      "name": "main.c",
      "functions": ["int main()"],
      "issues": ["⚠️ Unsafe function detected: strcpy"]
    }
  ]
}
```

#### `gemini-cli generate [prompt]`

Generate C code from a prompt.

```bash
gemini-cli generate "linked list implementation"
```

#### `gemini-cli memory-check [file]`

Perform memory safety analysis.

```bash
gemini-cli memory-check main.c
```

## TypeScript API

### Analyzer Class

```typescript
import { AdvancedCAnalyzer } from 'gemini-assistant';

const analyzer = new AdvancedCAnalyzer();

// Analyze memory safety
const safety = analyzer.analyzeMemorySafety(sourceCode);
console.log(safety.leakRisk); // 0-100

// Analyze complexity
const complexity = analyzer.analyzeComplexity(sourceCode, 'c');
console.log(complexity.complexity); // Cyclomatic complexity

// Generate code
const code = analyzer.generateOptimizedCode('binary tree implementation');
```

## Shell Script API

### `gemini-shell.sh`

```bash
# Interactive mode
bash gemini-shell.sh

# Analyze file
bash gemini-shell.sh analyze myfile.c

# Generate template
bash gemini-shell.sh generate struct

# Check for unsafe functions
bash gemini-shell.sh unsafe myfile.c
```

## VS Code Extension API

### Commands

```typescript
// Open the Gemini panel
vscode.commands.executeCommand('geminiAssistant.openPanel');

// Generate code from prompt
vscode.commands.executeCommand('geminiAssistant.generateFromPrompt');

// Upload files
vscode.commands.executeCommand('geminiAssistant.uploadFiles');
```

## Data Structures

### CFileAnalysis

```typescript
interface CFileAnalysis {
  fileName: string;
  functions: string[];
  includes: string[];
  structs: string[];
  macros: string[];
  issues: string[];
}
```

### CMemoryProfile

```typescript
interface CMemoryProfile {
  allocations: Array<{ line: number; size: string; isFreed: boolean }>;
  potentialLeaks: string[];
  unsafeFunctions: string[];
  leakRisk: number; // 0-100
}
```

### CodeAnalysisResult

```typescript
interface CodeAnalysisResult {
  language: string;
  lineCount: number;
  complexity: number;
  issues: string[];
  suggestions: string[];
  patterns: string[];
}
```

## Examples

### Analyze a Project

```bash
gemini-cli analyze . > analysis.json
```

### Generate Safe Memory Code

```bash
gemini-cli generate "safe malloc with error handling"
```

### Integration with CI/CD

```bash
#!/bin/bash
gemini-cli analyze ./src > analysis.json
LEAK_RISK=$(jq '.files[].leakRisk' analysis.json | sort -rn | head -1)
if [ "$LEAK_RISK" -gt 50 ]; then
  echo "High memory risk detected"
  exit 1
fi
```

## Environment Variables

- `GEMINI_DEBUG` - Enable debug logging
- `GEMINI_CC` - Set C compiler (gcc, clang)
- `DISPLAY` - X11 display for GUI features

## Error Codes

- `0` - Success
- `1` - General error
- `2` - File not found
- `3` - Parse error
- `4` - Memory error

---

For more information, visit: https://github.com/black-210/black-code
