#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GeminiCLI {
  constructor() {
    this.workdir = process.cwd();
    this.projectConfig = { name: 'gemini_project', version: '1.0.0', files: [] };
  }

  run(args) {
    const [cmd, ...params] = args;

    switch (cmd) {
      case 'init':
        this.initProject(params[0]);
        break;
      case 'create':
        this.createFile(params[0], params[1]);
        break;
      case 'build':
        this.buildProject();
        break;
      case 'run':
        this.runBinary(params[0]);
        break;
      case 'analyze':
        this.analyzeFile(params[0]);
        break;
      case 'template':
        this.useTemplate(params[0], params[1]);
        break;
      case 'memory-check':
        this.memoryCheck(params[0]);
        break;
      case 'unsafe-scan':
        this.unsafeScan(params[0]);
        break;
      case 'docs':
        this.showDocs();
        break;
      case 'help':
      default:
        this.showHelp();
    }
  }

  initProject(name) {
    const projectName = name || 'gemini_project';
    const projectDir = path.join(this.workdir, projectName);

    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const config = {
      name: projectName,
      version: '1.0.0',
      author: 'Gemini Developer',
      files: ['main.c'],
      cflags: '-Wall -Wextra -O2 -std=c11',
      output: `${projectName}_bin`
    };

    fs.writeFileSync(
      path.join(projectDir, 'gemini.json'),
      JSON.stringify(config, null, 2)
    );

    const mainC = `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("Gemini C Project - %s\\n");
    return EXIT_SUCCESS;
}
`.replace('%s', projectName);

    fs.writeFileSync(path.join(projectDir, 'main.c'), mainC);
    console.log(`✓ Project '${projectName}' initialized`);
    console.log(`  Run 'cd ${projectName}' to get started`);
  }

  createFile(name, type = 'c') {
    if (!name) {
      console.log('Usage: create <filename> [c|h]');
      return;
    }

    const ext = type === 'h' ? '.h' : '.c';
    const filename = name.endsWith(ext) ? name : name + ext;
    const filepath = path.join(this.workdir, filename);

    if (fs.existsSync(filepath)) {
      console.log(`✗ File ${filename} already exists`);
      return;
    }

    let content = '';
    if (type === 'h') {
      const guard = filename.replace(/\W/g, '_').toUpperCase();
      content = `#ifndef ${guard}\n#define ${guard}\n\n// Add declarations here\n\n#endif\n`;
    } else {
      content = `#include <stdio.h>\n#include <stdlib.h>\n\n// Add implementation here\n`;
    }

    fs.writeFileSync(filepath, content);
    console.log(`✓ Created ${filename}`);
  }

  buildProject() {
    const configPath = path.join(this.workdir, 'gemini.json');
    if (!fs.existsSync(configPath)) {
      console.log('✗ No gemini.json found. Run "gemini init" first');
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const cFiles = config.files.join(' ');
    const output = config.output || 'a.out';
    const cflags = config.cflags || '-Wall -O2';

    try {
      console.log(`Compiling: gcc ${cflags} ${cFiles} -o ${output}`);
      execSync(`gcc ${cflags} ${cFiles} -o ${output}`, { stdio: 'inherit' });
      console.log(`✓ Build successful: ${output}`);
    } catch (error) {
      console.error('✗ Build failed');
    }
  }

  runBinary(binary) {
    const binPath = binary || 'a.out';
    if (!fs.existsSync(binPath)) {
      console.log(`✗ Binary ${binPath} not found`);
      return;
    }

    try {
      console.log(`Running ${binPath}...\n`);
      execSync(`./${binPath}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('✗ Execution failed');
    }
  }

  analyzeFile(filepath) {
    if (!filepath || !fs.existsSync(filepath)) {
      console.log('Usage: analyze <filepath>');
      return;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    const funcs = (content.match(/^\w+\s+\w+\s*\(/gm) || []).length;
    const mallocs = (content.match(/malloc/g) || []).length;
    const frees = (content.match(/free/g) || []).length;

    console.log(`\n📊 Analysis of ${filepath}`);
    console.log(`   Lines: ${lines.length}`);
    console.log(`   Functions: ${funcs}`);
    console.log(`   Mallocs: ${mallocs}`);
    console.log(`   Frees: ${frees}`);

    if (mallocs !== frees) {
      console.log(`   ⚠️  Memory imbalance detected (malloc: ${mallocs}, free: ${frees})`);
    }
    console.log();
  }

  useTemplate(templateName, outputFile) {
    const templates = {
      'main': `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    printf("Hello, Gemini!\\n");\n    return EXIT_SUCCESS;\n}\n`,
      'struct': `typedef struct {\n    int id;\n    char name[64];\n    double value;\n} Record;\n`,
      'malloc': `int *arr = (int *)malloc(sizeof(int) * 100);\nif (!arr) {\n    fprintf(stderr, "malloc failed\\n");\n    return EXIT_FAILURE;\n}\nfree(arr);\narr = NULL;\n`,
      'file-io': `FILE *fp = fopen("data.txt", "rb");\nif (!fp) {\n    perror("fopen");\n    return EXIT_FAILURE;\n}\nchar buffer[256];\nif (fread(buffer, 1, sizeof(buffer), fp) > 0) {\n    printf("%s", buffer);\n}\nfclose(fp);\n`,
      'linked-list': `typedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nNode *create_node(int data) {\n    Node *n = (Node *)malloc(sizeof(Node));\n    n->data = data;\n    n->next = NULL;\n    return n;\n}\n`,
      'hash-table': `#define HASH_SIZE 256\ntypedef struct {\n    char *key;\n    int value;\n} HashEntry;\n\nunsigned int hash(const char *str) {\n    unsigned int h = 0;\n    while (*str) h = (h * 31 + *str++) % HASH_SIZE;\n    return h;\n}\n`,
      'binary-tree': `typedef struct TreeNode {\n    int value;\n    struct TreeNode *left, *right;\n} TreeNode;\n\nTreeNode *create_tree_node(int val) {\n    TreeNode *n = (TreeNode *)malloc(sizeof(TreeNode));\n    n->value = val;\n    n->left = n->right = NULL;\n    return n;\n}\n`,
      'thread': `#include <pthread.h>\n\nvoid *thread_func(void *arg) {\n    printf("Thread running\\n");\n    return NULL;\n}\n\nint main(void) {\n    pthread_t tid;\n    pthread_create(&tid, NULL, thread_func, NULL);\n    pthread_join(tid, NULL);\n    return 0;\n}\n`,
      'queue': `typedef struct {\n    int *data;\n    int front, rear, size, capacity;\n} Queue;\n\nQueue *create_queue(int cap) {\n    Queue *q = (Queue *)malloc(sizeof(Queue));\n    q->data = (int *)malloc(sizeof(int) * cap);\n    q->capacity = cap;\n    q->front = q->rear = 0;\n    q->size = 0;\n    return q;\n}\n`,
      'socket': `#include <sys/socket.h>\n#include <netinet/in.h>\n#include <arpa/inet.h>\n\nint create_socket(const char *ip, int port) {\n    int sock = socket(AF_INET, SOCK_STREAM, 0);\n    struct sockaddr_in addr;\n    addr.sin_family = AF_INET;\n    addr.sin_port = htons(port);\n    inet_pton(AF_INET, ip, &addr.sin_addr);\n    return sock;\n}\n`
    };

    if (!templates[templateName]) {
      console.log(`Available templates: ${Object.keys(templates).join(', ')}`);
      return;
    }

    const output = outputFile || `${templateName}.c`;
    fs.writeFileSync(output, templates[templateName]);
    console.log(`✓ Template '${templateName}' saved to ${output}`);
  }

  memoryCheck(filepath) {
    if (!filepath || !fs.existsSync(filepath)) {
      console.log('Usage: memory-check <filepath>');
      return;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const issues = [];

    if (content.includes('strcpy')) issues.push('⚠️  strcpy detected (use strncpy)');
    if (content.includes('gets')) issues.push('⚠️  gets detected (always unsafe)');
    if (content.includes('sprintf')) issues.push('⚠️  sprintf detected (use snprintf)');
    if (content.includes('scanf')) issues.push('⚠️  scanf detected (use fgets + sscanf)');

    const mallocs = (content.match(/malloc/g) || []).length;
    const frees = (content.match(/free/g) || []).length;
    if (mallocs > frees) issues.push(`⚠️  Potential memory leak (malloc: ${mallocs}, free: ${frees})`);

    console.log(`\n🔍 Memory Safety Check: ${filepath}`);
    if (issues.length === 0) {
      console.log('   ✓ No obvious issues detected');
    } else {
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    console.log();
  }

  unsafeScan(filepath) {
    if (!filepath || !fs.existsSync(filepath)) {
      console.log('Usage: unsafe-scan <filepath>');
      return;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const unsafeFuncs = ['strcpy', 'gets', 'sprintf', 'scanf', 'strcat', 'strlen'];
    const found = [];

    unsafeFuncs.forEach(func => {
      const matches = content.match(new RegExp(func, 'g'));
      if (matches) {
        found.push({ func, count: matches.length });
      }
    });

    console.log(`\n🔒 Unsafe Function Scan: ${filepath}`);
    if (found.length === 0) {
      console.log('   ✓ No unsafe functions detected');
    } else {
      found.forEach(item => console.log(`   ⚠️  ${item.func}: ${item.count} occurrence(s)`));
    }
    console.log();
  }

  showHelp() {
    console.log(`
🔧 Gemini CLI - Independent C Development Tool

Usage: gemini <command> [options]

Commands:
  init [name]              Create a new Gemini C project
  create <name> [c|h]      Create new C/H file
  build                    Build project (gcc)
  run [binary]             Execute binary
  analyze <file>           Analyze C file metrics
  template <name> [out]    Generate code template
  memory-check <file>      Check for memory issues
  unsafe-scan <file>       Scan for unsafe functions
  docs                     Show documentation
  help                     Show this message

Examples:
  gemini init myproject
  gemini create utils.c
  gemini template malloc output.c
  gemini build && gemini run a.out
  gemini memory-check main.c
  gemini unsafe-scan main.c
    `);
  }

  showDocs() {
    console.log(`
📚 Gemini CLI Documentation

1. Initialize a project:
   $ gemini init myproject
   $ cd myproject

2. Create C files:
   $ gemini create utils.c
   $ gemini create config.h h

3. Use templates:
   $ gemini template main main.c
   $ gemini template linked-list data.c
   $ gemini template malloc memory.c

4. Build and run:
   $ gemini build
   $ gemini run myproject_bin

5. Analyze code:
   $ gemini analyze main.c
   $ gemini memory-check main.c
   $ gemini unsafe-scan main.c

Available templates:
  main, struct, malloc, file-io, linked-list, hash-table,
  binary-tree, thread, queue, socket

Project config (gemini.json):
  {
    "name": "project_name",
    "files": ["main.c", "utils.c"],
    "cflags": "-Wall -O2 -std=c11",
    "output": "binary_name"
  }
    `);
  }
}

const cli = new GeminiCLI();
cli.run(process.argv.slice(2));
