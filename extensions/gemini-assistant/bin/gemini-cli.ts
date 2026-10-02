#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface CFileAnalysis {
  fileName: string;
  functions: string[];
  includes: string[];
  structs: string[];
  macros: string[];
  issues: string[];
}

class GeminiCLI {
  private codebase: CFileAnalysis[] = [];

  async parseFile(filePath: string): Promise<CFileAnalysis> {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    const analysis: CFileAnalysis = {
      fileName,
      functions: [],
      includes: [],
      structs: [],
      macros: [],
      issues: []
    };

    // Extract #include directives
    const includeRegex = /#include\s*[<"]([^>"]+)[>"]/g;
    let match;
    while ((match = includeRegex.exec(content)) !== null) {
      analysis.includes.push(match[1]);
    }

    // Extract function definitions
    const functionRegex = /^\s*(?:static\s+)?(?:inline\s+)?(\w+)\s+(\w+)\s*\([^)]*\)\s*\{/gm;
    while ((match = functionRegex.exec(content)) !== null) {
      analysis.functions.push(`${match[1]} ${match[2]}()`);
    }

    // Extract struct definitions
    const structRegex = /struct\s+(\w+)\s*\{/g;
    while ((match = structRegex.exec(content)) !== null) {
      analysis.structs.push(match[1]);
    }

    // Extract macros
    const macroRegex = /#define\s+(\w+)\s+(.+?)$/gm;
    while ((match = macroRegex.exec(content)) !== null) {
      analysis.macros.push(`${match[1]} = ${match[2].slice(0, 40)}`);
    }

    // Detect potential issues
    this.detectIssues(content, analysis);

    return analysis;
  }

  private detectIssues(content: string, analysis: CFileAnalysis): void {
    // Check for unsafe functions
    const unsafeFunctions = ['strcpy', 'strcat', 'sprintf', 'scanf', 'gets'];
    for (const func of unsafeFunctions) {
      if (new RegExp(`\\b${func}\\s*\\(`).test(content)) {
        analysis.issues.push(`⚠️ Unsafe function detected: ${func}`);
      }
    }

    // Check for missing malloc/free pairs
    const mallocCount = (content.match(/malloc\s*\(/g) || []).length;
    const freeCount = (content.match(/free\s*\(/g) || []).length;
    if (mallocCount > freeCount) {
      analysis.issues.push(`⚠️ Potential memory leak: ${mallocCount} malloc(s), only ${freeCount} free(s)`);
    }

    // Check for missing NULL checks
    if (/malloc\s*\(/.test(content) && !/NULL\s*==|==\s*NULL/.test(content)) {
      analysis.issues.push('⚠️ No NULL check after malloc()');
    }
  }

  async suggestCCode(prompt: string, context: CFileAnalysis[] = []): Promise<string> {
    const contextStr = context
      .map(c => `File: ${c.fileName}\nFunctions: ${c.functions.join(', ')}\n`)
      .join('\n');

    // Pattern matching for common C code generation
    if (/main|entry|start/i.test(prompt)) {
      return `#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    // TODO: Add your code here\n    return EXIT_SUCCESS;\n}`;
    }

    if (/malloc|alloc|memory/i.test(prompt)) {
      return `int *ptr = (int *)malloc(sizeof(int) * 10);\nif (ptr == NULL) {\n    fprintf(stderr, "Memory allocation failed\\n");\n    return EXIT_FAILURE;\n}\nfree(ptr);\nptr = NULL;`;
    }

    if (/struct|typedef/i.test(prompt)) {
      return `typedef struct {\n    int id;\n    char name[64];\n    double value;\n} DataRecord;\n\nDataRecord *create_record(int id, const char *name, double value) {\n    DataRecord *rec = (DataRecord *)malloc(sizeof(DataRecord));\n    if (!rec) return NULL;\n    rec->id = id;\n    snprintf(rec->name, sizeof(rec->name), "%s", name);\n    rec->value = value;\n    return rec;\n}`;
    }

    if (/file|read|write|fopen/i.test(prompt)) {
      return `FILE *fp = fopen("data.txt", "r");\nif (!fp) {\n    perror("fopen failed");\n    return EXIT_FAILURE;\n}\nchar buffer[256];\nwhile (fgets(buffer, sizeof(buffer), fp)) {\n    printf("%s", buffer);\n}\nfclose(fp);`;
    }

    if (/pointer|ptr|dereference/i.test(prompt)) {
      return `int value = 42;\nint *ptr = &value;\nprintf("Address: %p\\n", (void *)ptr);\nprintf("Value: %d\\n", *ptr);\n*ptr = 100;\nprintf("New value: %d\\n", value);`;
    }

    if (/array|loop|iterate/i.test(prompt)) {
      return `int arr[10] = {0};\nfor (int i = 0; i < 10; i++) {\n    arr[i] = i * 2;\n    printf("arr[%d] = %d\\n", i, arr[i]);\n}`;
    }

    return `// Gemini C Assistant\n// Prompt: ${prompt}\nint gemini_result = 0;\nprintf("Awaiting implementation\\n");`;
  }

  async analyzeDirectory(dirPath: string): Promise<CFileAnalysis[]> {
    const results: CFileAnalysis[] = [];

    const walkDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (/\.(c|h|hpp|cpp)$/.test(file)) {
          try {
            const analysis = this.parseFile(fullPath);
            results.push(analysis);
          } catch (error) {
            console.error(`Error parsing ${fullPath}:`, error);
          }
        }
      }
    };

    walkDir(dirPath);
    return results;
  }

  printAnalysis(analysis: CFileAnalysis[]): void {
    console.log('\n=== Gemini C Assistant Analysis ===\n');

    for (const file of analysis) {
      console.log(`📄 ${file.fileName}`);
      console.log(`   Functions: ${file.functions.length > 0 ? file.functions.join(', ') : 'None'}`);
      console.log(`   Includes: ${file.includes.join(', ')}`);
      console.log(`   Structs: ${file.structs.length > 0 ? file.structs.join(', ') : 'None'}`);
      if (file.issues.length > 0) {
        console.log(`   Issues: ${file.issues.join(' | ')}`);
      }
      console.log();
    }
  }

  async interactive(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const prompt = (query: string): Promise<string> => {
      return new Promise(resolve => rl.question(query, resolve));
    };

    console.log('\n🎯 Gemini C Code Assistant (CLI)\n');
    console.log('Commands:');
    console.log('  analyze <dir>  - Analyze C files in directory');
    console.log('  generate       - Generate C code from prompt');
    console.log('  exit           - Exit the assistant');
    console.log();

    let running = true;
    while (running) {
      const input = await prompt('gemini> ');
      const [command, ...args] = input.trim().split(' ');

      if (command === 'exit') {
        running = false;
        console.log('Goodbye!');
      } else if (command === 'analyze') {
        const dir = args[0] || '.';
        if (fs.existsSync(dir)) {
          const results = await this.analyzeDirectory(dir);
          this.printAnalysis(results);
        } else {
          console.log(`Directory not found: ${dir}`);
        }
      } else if (command === 'generate') {
        const codePrompt = await prompt('Describe the C code you want: ');
        const suggestion = await this.suggestCCode(codePrompt, this.codebase);
        console.log('\n📝 Generated Code:\n');
        console.log(suggestion);
        console.log();
      } else if (command === 'help') {
        console.log('Available commands: analyze, generate, exit, help');
      } else if (command.length > 0) {
        console.log('Unknown command. Type "help" for available commands.');
      }
    }

    rl.close();
  }
}

async function main() {
  const cli = new GeminiCLI();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await cli.interactive();
  } else if (args[0] === 'analyze' && args[1]) {
    const results = await cli.analyzeDirectory(args[1]);
    cli.printAnalysis(results);
  } else if (args[0] === 'generate' && args[1]) {
    const suggestion = await cli.suggestCCode(args.slice(1).join(' '));
    console.log(suggestion);
  } else {
    console.log('Usage:');
    console.log('  gemini-cli                    - Interactive mode');
    console.log('  gemini-cli analyze <dir>      - Analyze C files');
    console.log('  gemini-cli generate <prompt>  - Generate C code');
  }
}

main().catch(console.error);
