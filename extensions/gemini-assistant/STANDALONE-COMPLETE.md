# Gemini Advanced Features - Standalone Edition

## 🚀 Three Independent Components

Gemini now provides three independent ways to develop C code and analyze genomics data:

### 1. 🖥️ **Graphical UI + Genomics API**

A modern graphical interface with built-in genomics analysis.

```bash
node bin/graphical-server.js
open http://localhost:3000
```

**Features:**
- 📝 Full C code editor with syntax support
- 🧬 Genomics sequence analysis & protein translation
- 🔨 Real-time compilation with GCC
- 📊 Code metrics and memory analysis
- 🔍 Unsafe function detection
- 💾 Save/load projects

**Genomics Capabilities:**
- Analyze DNA sequences (GC content, gene count)
- Translate DNA to protein sequences
- Find open reading frames (ORFs)
- Calculate reverse complement
- Compare sequences (Hamming distance)

### 2. 💻 **CLI Tool (Standalone)**

Terminal-based C development tool for headless environments.

```bash
node bin/gemini-cli.js help
```

**Commands:**
```
gemini init [name]              Create new project
gemini create <name>            Create C file
gemini build                     Build with gcc
gemini run [binary]              Execute program
gemini template <type>           Generate code
gemini analyze <file>            Analyze metrics
gemini memory-check <file>       Memory safety
gemini unsafe-scan <file>        Unsafe functions
```

**Templates:**
- `main` - Main function
- `struct` - Structure definition
- `malloc` - Memory allocation
- `file-io` - File operations
- `linked-list` - Linked list
- `hash-table` - Hash table
- `binary-tree` - Binary tree
- `thread` - Pthreads
- `queue` - Queue data structure
- `socket` - Network socket

### 3. 📚 **C Data Structure Library**

Production-grade C modules.

```bash
cd c-library
make
./advanced_c_demo
```

**Included:**
- Dynamic array
- Linked list
- Hash table (with collision handling)
- Binary search tree
- Safe string utilities

---

## 🌐 REST API Endpoints

### Genomics Analysis

**Analyze DNA sequence:**
```bash
curl -X POST http://localhost:3000/api/genomics/analyze \
  -H "Content-Type: application/json" \
  -d '{"sequence": "ATCGATCGATCG"}'
```

Response:
```json
{
  "length": 12,
  "gcContent": "50.00",
  "geneCount": 0
}
```

**Translate DNA to protein:**
```bash
curl -X POST http://localhost:3000/api/genomics/translate \
  -H "Content-Type: application/json" \
  -d '{"sequence": "ATGAAATAG"}'
```

Response:
```json
{
  "protein": "MK*",
  "length": 3
}
```

**Find open reading frames:**
```bash
curl -X POST http://localhost:3000/api/genomics/find-orfs \
  -H "Content-Type: application/json" \
  -d '{"sequence": "ATGAAATAG..."}'
```

### C Code Development

**Compile code:**
```bash
curl -X POST http://localhost:3000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code": "#include <stdio.h>\nint main(){ printf(\"Hello\"); return 0; }", "filename": "test.c"}'
```

**Analyze code:**
```bash
curl -X POST http://localhost:3000/api/analyze-code \
  -H "Content-Type: application/json" \
  -d '{"code": "#include <stdio.h>...."}'
```

---

## ⚡ Quick Start

### Setup
```bash
cd extensions/gemini-assistant
npm install
```

### Graphical Mode
```bash
node bin/graphical-server.js
# Open browser to http://localhost:3000
```

### CLI Mode
```bash
gemini init my-project
cd my-project
gemini template main
gemini build
gemini run my-project_bin
```

### Library Mode
```bash
cd c-library
make
./advanced_c_demo
```

---

## 🧬 Genomics Features

**Sequence Analysis:**
- Length calculation
- GC content percentage
- Gene detection (ATG start codons)
- Mutation detection

**Protein Translation:**
- Standard genetic code table
- 64 codon mappings
- Stop codon detection

**DNA Operations:**
- Reverse complement calculation
- Hamming distance (sequence similarity)
- Open reading frame detection
- Frame shift analysis

**Data Export:**
- JSON format
- FASTA format
- CSV metrics

---

## 🔒 Security Features

- Detects unsafe C functions: `strcpy`, `gets`, `sprintf`, `scanf`, `strcat`
- Memory leak detection (malloc/free imbalance)
- Code metrics and complexity analysis
- Sandboxed compilation in `/tmp`
- Input validation on all APIs

---

## 🎯 Use Cases

**For C Development:**
- Rapid prototyping
- Teaching/learning C
- Code generation from templates
- Memory safety analysis
- Quick builds and testing

**For Genomics:**
- DNA sequence analysis
- Protein translation
- ORF detection
- Sequence comparison
- Bioinformatics research
- Educational tool for molecular biology

---

## 📦 Project Structure

```
gemini-assistant/
├── bin/
│   ├── gemini-cli.js              # CLI tool
│   ├── graphical-server.js        # Web server + API
│   └── standalone-editor.js       # Terminal editor
├── src/
│   ├── graphical-ui.tsx           # React UI
│   ├── genomics-api.tsx           # Genomics panel
│   └── extension.ts               # VS Code extension
├── c-library/
│   ├── dynamic_array.*
│   ├── linked_list.*
│   ├── hash_table.*
│   ├── binary_tree.*
│   ├── string_utils.*
│   ├── advanced_c_demo.c
│   └── Makefile
└── README-ADVANCED.md
```

---

## 🏆 Why Gemini?

✅ **Completely Independent** - No VS Code required
✅ **Fast & Lightweight** - Pure Node.js + C
✅ **Multiple Interfaces** - GUI, CLI, Library
✅ **Genomics Integrated** - DNA/protein analysis
✅ **Production Ready** - Safe, secure, efficient
✅ **Developer Friendly** - Modern APIs, good documentation
✅ **Cross-Platform** - Linux, Windows, macOS, Termux

---

Made for developers who want speed, independence, and advanced features.

**Start developing now:**
```bash
node bin/gemini-cli.js init my-project
node bin/graphical-server.js
```
