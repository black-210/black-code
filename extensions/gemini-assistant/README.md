# Gemini Code Assistant

A free, independent, and powerful AI-inspired coding assistant for VS Code, built for developers who want a strong C/C++ workflow, clean UI, local code analysis, and no dependency on GitHub Copilot or cloud-based paid services.

This project is designed to be a practical local alternative to traditional code assistant experiences. It supports VS Code extension usage, command-line usage, shell-based helpers, and C-focused analysis features for memory safety, file I/O, pointers, structs, dynamic memory, and more.

![Gemini AI Assistant](https://img.shields.io/badge/Gemini-AI%20Assistant-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-1.90%2B-007ACC?style=flat-square)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen?style=flat-square)
![C Focus](https://img.shields.io/badge/C%20Focus-Strong-orange?style=flat-square)

Table of contents:
- Overview
- Why this project exists
- Features list
- Feature comparison
- Supported platforms
- Installation
- Quick start
- Usage examples
- CLI usage
- Shell usage
- X11 and display support
- Termux support
- Architecture and project structure
- Security and privacy
- Configuration
- Troubleshooting
- Roadmap
- Contributing
- License

---

## Overview

Gemini Code Assistant is a multi-access coding toolkit with three major interfaces:

1. VS Code extension panel
2. Local CLI helper for code generation and analysis
3. Bash shell helper for quick C-focused workflows

It is focused on providing a robust and stable AI-like coding experience without requiring paid subscriptions or external API lock-in. It is especially useful for C and system-programming tasks, but it also supports JavaScript, TypeScript, Python, Markdown, and general code generation workflows.

This project aims to deliver:
- local-first design
- free usage
- clean UI
- stronger C tooling
- strong developer ergonomics
- cross-platform support
- practical analysis and code generation

---

## Why this project exists

Many developers want a coding assistant that is:
- free
- independent
- privacy-preserving
- stable on C-focused projects
- not tied to GitHub Copilot
- usable even on Linux, SSH, and mobile environments

This project fills that need by combining:
- VS Code extension support
- command-line generation
- local file upload and inspection
- static code analysis patterns
- focused C best-practice generation

---

## Features

### Core features
- local and offline-first code generation
- premium dark UI panel for VS Code
- C/C++ code generation tuned for common patterns
- file upload from your machine into the assistant context
- direct insertion into the active editor
- command palette support
- CLI processing for quick generation and analysis
- Bash helper for terminal-based generation
- local memory and syntax-focused analysis

### C-focused features
- safe malloc/free suggestions
- warning detection for unsafe functions such as strcpy, gets, sprintf, scanf
- analysis for potential memory leaks
- struct and typedef generation
- pointer and array examples
- file I/O templates
- dynamic memory patterns
- common algorithm templates (linked list, queue, tree, hash table, sorting)
- complexity analysis and issue detection

### Developer productivity features
- one-click insert into active file
- quick prompt-based generation
- project analysis for directory scanning
- shell automation support
- multi-platform compatibility
- clean command usage with minimal dependencies
- support for code generation in C, C++, JavaScript, TypeScript, Python

### UI features
- modern dark panel design
- responsive layout
- metrics panel for complexity and memory risk
- generated code preview
- insert code directly into editor
- command-based access from VS Code

---

## Feature comparison

| Feature | Gemini Code Assistant | GitHub Copilot | VS Code Native Suggestions |
|--------|----------------------|----------------|---------------------------|
| Cost | Free | Paid | Free |
| Local-first | Yes | No | Yes |
| C/C++ focus | Strong | Generic | Basic |
| Memory safety analysis | Yes | No | No |
| Project file upload | Yes | No | No |
| CLI tool | Yes | No | No |
| Shell automation | Yes | No | No |
| X11/Linux support | Yes | Limited | Limited |
| Termux support | Yes (CLI + experimental) | No | No |
| Offline generation | Yes | No | Yes |
| Fast local suggestions | Yes | Usually cloud-based | Yes |
| Beautiful custom panel | Yes | Limited | Basic |
| Privacy | High | Cloud | High |
| Platform independence | High | Moderate | Moderate |

This project aims to be a strong free and independent alternative for developers who want more control, cleaner local workflows, and better C-centric support.

---

## Supported platforms

### Desktop operating systems
- Linux
- Ubuntu/Debian
- Fedora/RHEL
- Arch Linux
- openSUSE
- Alpine Linux
- Windows 10/11
- macOS

### Remote and headless environments
- SSH-based remote development
- headless servers
- X11 forwarding
- WSL (Windows Subsystem for Linux) with caveats

### Mobile and special environments
- Termux on Android (CLI-focused, experimental GUI support)
- minimal-resource environments

### Display support
- X11 display support for desktop Linux
- remote X11 forwarding via SSH
- headless mode for terminal-only workflows
- GUI mode when display environment is available

---

## Installation

### Method 1: VS Code extension (recommended)

1. Open VS Code.
2. Open Extensions (`Ctrl+Shift+X`).
3. Search for `Gemini Code Assistant`.
4. Install the extension if available in your local environment.
5. Use the command palette and run:
   - `Gemini: Open Assistant Panel`
   - `Gemini: Upload Local Files`
   - `Gemini: Generate Suggestion from Prompt`

### Method 2: Install from source

```bash
git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

Then launch the extension in VS Code with `F5` to run the extension host.

### Method 3: Install via VSIX package

```bash
cd extensions/gemini-assistant
npm install
npm run compile
npx vsce package
```

Then install the generated `.vsix` file:

```bash
code --install-extension gemini-assistant-0.1.0.vsix
```

### Method 4: CLI-only installation

```bash
cd extensions/gemini-assistant
npm install
npm run compile
npm link
```

Then run:

```bash
gemini-cli
```

### Method 5: Global install for Node-based environments

```bash
cd extensions/gemini-assistant
npm install -g
```

---

## Linux installation support

### Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm git xauth libx11-6

git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

### Fedora / RHEL

```bash
sudo dnf install -y nodejs npm git xorg-x11-xauth libx11
```

Then continue with the source install steps above.

### Arch Linux

```bash
sudo pacman -S nodejs npm git xorg-xauth libx11
```

### Alpine Linux

```bash
apk add --no-cache nodejs npm git xauth libx11 bash
```

### openSUSE

```bash
sudo zypper install -y nodejs npm git xauth libx11-6
```

---

## Windows installation

### Requirements
- Windows 10 or higher
- VS Code 1.90+
- Node.js 18+ recommended

### Install from source

```powershell
git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

### Install `.vsix` file

1. Build the package with `vsce`.
2. Open VS Code.
3. Use `Extensions: Install from VSIX`.
4. Select the `.vsix` file.

---

## macOS installation

### Requirements
- VS Code 1.90+
- Node.js 18+
- Xcode Command Line Tools recommended

### Install from source

```bash
git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

---

## X11 requirements and support

X11 support matters for GUI-based tooling on Linux and remote desktop environments.

### Check if X11 is available

```bash
echo $DISPLAY
xdpyinfo
```

If `DISPLAY` is empty, you may be running in headless mode.

### Typical Linux usage

```bash
export DISPLAY=:0
code .
```

### SSH with X11 forwarding

```bash
ssh -X user@host
code .
```

### install X11 packages on Debian/Ubuntu

```bash
sudo apt-get install xauth x11-apps libx11-6
```

### install X11 packages on Fedora/RHEL

```bash
sudo dnf install xauth xdpyinfo libx11
```

### install X11 packages on Arch

```bash
sudo pacman -S xorg-xauth xorg-xdpyinfo libx11
```

### Notes
- GUI features work best when `DISPLAY` is correctly set.
- Headless terminals can still use the CLI and shell tools.
- Remote servers can use SSH `-X` forwarding when supported.

---

## Termux support

Termux is supported mainly through the CLI and shell helper tools. Full VS Code GUI support is possible only with the right X11 environment and enough system resources.

### Install on Termux

```bash
pkg update && pkg upgrade
pkg install -y nodejs git nodejs-lts

git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

### Run CLI in Termux

```bash
gemini-cli
```

### Optional Termux X11 support

Install Termux X11 and then:

```bash
export DISPLAY=:0
code .
```

### Termux notes
- CLI is the recommended way for a stable mobile experience.
- GUI support is experimental and depends on display availability and device resources.
- For heavy editing and large codebases, a desktop Linux/macOS/Windows environment remains better.

---

## Quick start

### VS Code Panel
Open command palette and run:

```text
Gemini: Open Assistant Panel
```

Then:
- type a prompt
- upload local files
- generate code
- insert code into the editor

### Inline generation
Open a `.c`, `.cpp`, `.ts`, `.js`, or `.py` file and use the assistant features from the extension context.

### CLI interactive mode

```bash
cd extensions/gemini-assistant
npm install
npm run compile
node out/cli.js
```

or after linking:

```bash
gemini-cli
```

### Bash shell helper

```bash
cd extensions/gemini-assistant
bash bin/gemini-shell.sh
```

---

## CLI usage examples

### Interactive mode

```bash
gemini-cli
```

### Analyze a directory

```bash
gemini-cli analyze ./src
```

### Generate C code from a prompt

```bash
gemini-cli generate "unsafe file handling in C"
```

### Generate a linked list implementation

```bash
gemini-cli generate "linked list implementation in C"
```

### Analyze a single file

```bash
gemini-cli analyze ./main.c
```

### Memory-check pattern

```bash
gemini-cli memory-check main.c
```

---

## Shell helper usage

### Main menu

```bash
bash bin/gemini-shell.sh
```

### Analyze a file

```bash
bash bin/gemini-shell.sh analyze myfile.c
```

### Generate a template

```bash
bash bin/gemini-shell.sh generate main
bash bin/gemini-shell.sh generate struct
bash bin/gemini-shell.sh generate malloc
```

### Unsafe function scan

```bash
bash bin/gemini-shell.sh unsafe myfile.c
```

---

## Configuration

The extension can be configured with the following kinds of behavior:
- enable/disable inline completions
- C-language-first mode
- auto-analyze open files
- memory-check behavior
- theme selection

Example settings:

```json
{
  "geminiAssistant.enableInlineCompletions": true,
  "geminiAssistant.cLanguageFocus": true,
  "geminiAssistant.autoAnalyzeOnOpen": true,
  "geminiAssistant.memoryCheckEnabled": true,
  "geminiAssistant.theme": "dark"
}
```

Environment variables:

```bash
export DISPLAY=:0
export GEMINI_DEBUG=1
export GEMINI_CC=clang
```

---

## Project structure

```text
extensions/
  gemini-assistant/
    README.md
    INSTALL.md
    API.md
    package.json
    tsconfig.json
    src/
      extension.ts
      extension-pro.ts
      cli.ts
    bin/
      gemini-cli.ts
      gemini-shell.sh
    docs/
      C_PATTERNS.md
    sample/
      hello.c
```

---

## Example generated code for C

### Safe main function

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <argument>\n", argv[0]);
        return EXIT_FAILURE;
    }

    printf("Argument: %s\n", argv[1]);
    return EXIT_SUCCESS;
}
```

### Safe memory allocation

```c
int *ptr = (int *)malloc(sizeof(int) * 10);
if (ptr == NULL) {
    fprintf(stderr, "Memory allocation failed\n");
    return EXIT_FAILURE;
}

// use ptr
free(ptr);
ptr = NULL;
```

### Struct example

```c
typedef struct {
    int id;
    char name[64];
    double score;
} Student;
```

---

## Security and privacy

This project is designed to be privacy-respecting and local-first.

- no mandatory cloud account required
- no forced login
- no cloud-only processing required
- no external API dependency required
- local file upload stays local in the workspace context
- code analysis is local and deterministic

This is especially valuable for developers working on private repositories, internal systems, or C codebases where confidentiality matters.

---

## Troubleshooting

### 1. X11 display not found

```bash
export DISPLAY=:0
```

If you are on a remote server, use SSH with X11 forwarding:

```bash
ssh -X user@host
```

### 2. Node not found

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 18
```

### 3. Extension not loading

```bash
cd extensions/gemini-assistant
npm install
npm run compile
```

Then reload VS Code with:

```text
Developer: Reload Window
```

### 4. C compilation issues

```bash
gcc -Wall -Wextra -Werror yourfile.c -o yourfile
```

### 5. Termux issues

```bash
pkg install -y build-essential python3 nodejs-lts
npm install --unsafe-perm
```

---

## Roadmap

Planned work includes:
- richer multi-file project analysis
- advanced C static analysis
- better memory safety scoring
- more algorithm templates
- deeper pattern library
- stable release packaging for Linux/macOS/Windows
- better Termux compatibility
- support for more languages and frameworks
- codebase awareness and context accumulation

---

## Contributing

Contributions are welcome.

Ways to participate:
- improve C checksum and memory safety checks
- add more templates for algorithms and data structures
- improve the CLI and shell helper behavior
- fix cross-platform issues
- improve documentation
- add test coverage

Please open a pull request and keep changes focused.

---

## License

MIT License.

This project is open-source and can be used, modified, and redistributed under the terms of the MIT license.

---

## Acknowledgments

This project is inspired by:
- modern AI coding assistants
- VS Code extension ecosystem
- C memory-safety awareness
- practical developer tooling
- open-source contribution culture

---

## Summary

Gemini Code Assistant is a practical, free, local-first AI-inspired tool built to help developers work faster with C and general coding tasks. It delivers:
- premium UI
- better C support
- local file-based context
- secure privacy model
- CLI support
- stable multi-platform installation
- X11 and Termux flexibility

If you want a strong, independent alternative to the common cloud-based assistant experience, this project is built for that purpose.

---

Project repo:
- https://github.com/black-210/black-code

Issues / discussions:
- https://github.com/black-210/black-code/issues
- https://github.com/black-210/black-code/discussions

Made with care for developers who value speed, control, privacy, and strong C/C++ tooling.
