# Gemini - Semi-Independent C Development Platform

## Overview

Gemini is now a **semi-independent** C development ecosystem with:
- 🖥️ **GUI Editor** - Modern web-based interface
- 📺 **TUI Editor** - Terminal UI for SSH/headless
- 💻 **CLI Master** - Command-line orchestration
- 🧬 **Genomics API** - GraphQL-based genome analysis
- 🔧 **C Library** - Reusable data structures

## Independent Features

### No VS Code Required
- Launch GUI editor independently
- Run TUI editor over SSH
- Full CLI control
- Works on any platform with Node.js and GCC

### Project Management
```bash
gemini init myproject      # Initialize new project
gemini build               # Compile with GCC
gemini test                # Run tests
gemini analyze             # Analyze codebase
```

### Code Generation
```bash
gemini generate main       # Generate main.c
gemini generate struct     # Generate struct template
gemini generate malloc     # Generate safe malloc pattern
gemini generate thread     # Generate threading example
```

### GUI Editor
```bash
gemini gui                 # Launch web-based editor
```
Then open browser to `http://localhost:3000`
- File management
- Real-time analysis
- Code compilation
- Genomics integration

### TUI Editor
```bash
gemini tui                 # Launch terminal editor
```
Shortcuts:
- `c` - Compile
- `a` - Analyze
- `s` - Save
- `t` - Template
- `g` - Genomics

## Genomics API

### GraphQL Endpoint
```
http://localhost:4000/graphql
```

### Example Queries

#### Add Gene
```graphql
mutation {
  addGene(
    id: "BRCA1"
    name: "Breast Cancer Susceptibility"
    sequence: "ATGCGATCG..."
    chromosome: "17"
    position: 41196312
    geneType: "protein_coding"
  ) {
    id
    name
    length
  }
}
```

#### Analyze Sequence
```graphql
query {
  analyzeSequence(sequence: "ATGCGATCGATCG") {
    sequenceLength
    gcContent
    codingRegions
    mutations {
      position
      type
      impact
    }
  }
}
```

#### Detect Mutations
```graphql
query {
  detectMutations(
    reference: "ATGCGATCG"
    sample: "ATGCGATAG"
  ) {
    position
    original
    variant
    impact
    type
  }
}
```

#### Get GC Content
```graphql
query {
  gcContent(sequence: "ATGCGATCGATCGATCG")
}
```

## CLI Commands

```bash
gemini init <name>                # Create new project
gemini build                       # Compile project
gemini test                        # Run tests
gemini analyze                     # Analyze code
gemini generate <template>         # Generate code from template
gemini genomics add-gene           # Add gene to database
gemini genomics list-genes         # List all genes
gemini genomics analyze-seq        # Analyze DNA sequence
gemini genomics detect-mut         # Detect mutations
gemini gui                         # Launch GUI editor
gemini tui                         # Launch TUI editor
gemini help                        # Show help
gemini exit                        # Exit CLI
```

## Installation

```bash
cd extensions/gemini-assistant
npm install
npm run build

# Make CLI available globally
npm link

# Start using
gemini init my-project
gemini gui
```

## Architecture

```
gemini-assistant/
├── src/
│   ├── gui-editor.ts           # Web-based editor
│   ├── graphql-genomics-api.ts # Genomics GraphQL API
│   └── standalone-editor.ts    # Standalone CLI editor
├── bin/
│   ├── cli-master.ts           # Master CLI controller
│   ├── tui-editor.js           # Terminal UI editor
│   └── standalone-editor.js    # CLI-only editor
├── c-library/
│   ├── dynamic_array.c/h       # Dynamic arrays
│   ├── linked_list.c/h         # Linked lists
│   ├── hash_table.c/h          # Hash tables
│   ├── binary_tree.c/h         # Binary trees
│   ├── string_utils.c/h        # String utilities
│   └── Makefile                # Build C library
└── README.md                   # This file
```

## Features

### GUI
- Modern dark theme
- Multi-file editing
- Real-time syntax analysis
- Code templates
- Genomics integration
- Live compilation feedback

### TUI
- Works over SSH
- Keyboard shortcuts
- Minimal dependencies
- Works on any terminal

### CLI
- Project scaffolding
- Build management
- Code generation
- Genomics operations
- Editor launching

### Genomics API
- GraphQL interface
- Gene database
- Sequence analysis
- Mutation detection
- GC content calculation
- Codon detection

## Why Semi-Independent?

✅ **No GitHub Copilot required**
✅ **Works without VS Code**
✅ **Complete offline support**
✅ **Your own Genomics API**
✅ **Multiple interface options**
✅ **Full project control**
✅ **Terminal or browser - your choice**

## Next Steps

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Start CLI: `gemini`
4. Launch GUI: `gemini gui`
5. Start Genomics API: `node src/graphql-genomics-api.ts`

## License

MIT License - Free and open-source.
