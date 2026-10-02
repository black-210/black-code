# Gemini Code Assistant

**A free, independent, and powerful alternative to GitHub Copilot built for VS Code.**

Gemini Code Assistant is a next-generation AI-inspired coding companion designed to be faster, smarter, and more independent than traditional inline suggestion boxes. Built with a focus on **C/C++ excellence**, beautiful UI, and true offline capability.

![Gemini Badge](https://img.shields.io/badge/Gemini-AI%20Assistant-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-1.90%2B-007ACC?style=flat-square)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen?style=flat-square)

---

## 🚀 Features Overview

### Core Features
- ✨ **Intelligent Code Generation** - Context-aware suggestions for C/C++, Python, JavaScript, TypeScript
- 🎨 **Premium Dark Theme Panel** - Polished, distraction-free assistant interface
- 📁 **Local File Upload** - Import your codebase for instant context analysis
- 💾 **Offline-First** - No external API calls required, works completely locally
- ⚡ **Lightning Fast** - Instant suggestions without latency
- 🔒 **Privacy Focused** - All code stays on your machine

### C/C++ Excellence
- 🎯 **C-Centric Code Generation** - Optimized templates for malloc, structs, pointers, file I/O
- 🛡️ **Memory Safety Analysis** - Detects unsafe functions (strcpy, gets, sprintf)
- 🔍 **Memory Leak Detection** - Warns about malloc/free imbalances
- 📊 **Code Analysis Dashboard** - Function extraction, struct detection, macro parsing
- 📚 **30+ C Code Patterns** - Best practices for common C programming tasks
- ⚠️ **Security Warnings** - Flags deprecated and dangerous functions

### Development Tools
- 🖥️ **CLI Tool** - Command-line interface for batch analysis and generation
- 🐚 **Bash Shell Script** - Interactive shell for quick C code templates
- 📖 **VS Code Panel** - Full-featured webview assistant with syntax highlighting
- 🔗 **Inline Completions** - Real-time suggestions as you type
- 📤 **One-Click Insert** - Generate and insert code directly into editor

### System Support
- 🐧 **Linux/Unix** - Full X11 support with SSH forwarding
- 🪟 **Windows** - Complete compatibility
- 🍎 **macOS** - Native support
- 📱 **Termux** - Experimental Android/mobile support
- 🌐 **Remote SSH** - X11 forwarding for headless servers

---

## 📊 Comparison: Gemini vs GitHub Copilot vs Inline Suggestions

| Feature | Gemini Assistant | GitHub Copilot | VS Code Native |
|---------|-----------------|----------------|----------------|
| **Cost** | FREE ✅ | $10-20/month ❌ | Free ✅ |
| **Internet Required** | No ✅ | Yes ❌ | No ✅ |
| **Privacy** | 100% Local ✅ | Cloud-based ❌ | Local ✅ |
| **C/C++ Focus** | Yes ✅ | Generic ❌ | Basic ❌ |
| **Memory Safety Checks** | Yes ✅ | No ❌ | No ❌ |
| **Custom Code Analysis** | Yes ✅ | No ❌ | No ❌ |
| **File Upload** | Yes ✅ | No ❌ | No ❌ |
| **CLI Tool** | Yes ✅ | No ❌ | No ❌ |
| **Beautiful Panel UI** | Yes ✅ | Dialog box ❌ | Basic ❌ |
| **X11 Support** | Full ✅ | Limited ❌ | Limited ❌ |
| **Termux Support** | Yes ✅ | No ❌ | No ❌ |
| **Offline Code Gen** | Yes ✅ | No ❌ | No ❌ |
| **30+ Code Patterns** | Yes ✅ | No ❌ | No ❌ |
| **Shell Script Tool** | Yes ✅ | No ❌ | No ❌ |

**Bottom line**: Gemini is stronger, faster, and completely independent. No subscriptions, no internet, no corporate lock-in.

---

## 🎯 Installation Methods

### Method 1: VS Code Extension Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for `Gemini Code Assistant`
4. Click Install
5. Press `Ctrl+Alt+G` to open the panel

### Method 2: From Source
```bash
git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

Then in VS Code: Press `F5` to debug and test the extension.

### Method 3: Manual Installation (Package)
```bash
cd extensions/gemini-assistant
vsce package
# This creates a .vsix file
code --install-extension gemini-assistant-0.1.0.vsix
```

### Method 4: CLI Only (No VS Code)
```bash
cd extensions/gemini-assistant
npm install -g
gemini-cli
```

---

## 🐧 Linux Distribution Support

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y nodejs npm git xauth libx11-6
git clone https://github.com/black-210/black-code.git
cd black-code && git checkout gemini-editor
cd extensions/gemini-assistant && npm install
```

### Fedora/RHEL
```bash
sudo dnf install -y nodejs npm git xorg-x11-xauth libx11
# Then follow the same steps as Ubuntu
```

### Arch Linux
```bash
sudo pacman -S nodejs npm git xorg-xauth libx11
# Then follow the same steps as Ubuntu
```

### Alpine Linux
```bash
apk add --no-cache nodejs npm git xauth libx11 bash
# Then follow the same steps as Ubuntu
```

### openSUSE
```bash
sudo zypper install -y nodejs npm git xauth libx11-6
# Then follow the same steps as Ubuntu
```

---

## 📱 Termux Support (Android)

### Installation on Termux

1. **Install Termux** from F-Droid or APK Mirror

2. **Update and install dependencies**:
```bash
pkg update && pkg upgrade
pkg install -y nodejs git nodejs-lts
```

3. **Clone the repository**:
```bash
git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
```

4. **Install Gemini CLI**:
```bash
cd extensions/gemini-assistant
npm install
npm run compile
ln -s $(pwd)/out/cli.js /data/data/com.termux/files/usr/bin/gemini-cli
```

5. **Run Gemini CLI**:
```bash
gemini-cli
```

### Termux X11 Display (Optional)

To use Gemini with Termux X11 GUI:

1. Install Termux X11 from F-Droid
2. Set display variable:
```bash
export DISPLAY=:0
```

3. Launch code in Termux:
```bash
export DISPLAY=:0
code .
```

**Note**: Full VS Code on Termux requires significant resources. CLI tool is recommended.

---

## 🪟 Windows Installation

### Prerequisites
- Windows 10 or higher
- VS Code 1.90+
- Node.js 16+ (download from nodejs.org)

### Quick Start
1. Download the `.vsix` file from releases
2. Open VS Code
3. Press `Ctrl+Shift+P` → type `Extensions: Install from VSIX`
4. Select the `.vsix` file
5. Reload VS Code

### CLI Tool on Windows
```powershell
cd extensions\gemini-assistant
npm install -g
gemini-cli
```

---

## 🍎 macOS Installation

### Prerequisites
- macOS 10.15+
- Xcode Command Line Tools
- VS Code 1.90+
- Homebrew (optional)

### Install via Homebrew
```bash
brew tap black-210/gemini
brew install gemini-assistant
```

### Install from Source
```bash
git clone https://github.com/black-210/black-code.git
cd black-code && git checkout gemini-editor
cd extensions/gemini-assistant
npm install
npm run compile
```

---

## 🔧 Advanced Configuration

### Environment Variables

```bash
# Set X11 display for remote connections
export DISPLAY=:0

# Set custom C compiler for analysis
export GEMINI_CC=clang

# Enable debug logging
export GEMINI_DEBUG=1
```

### VS Code Settings

Add to `.vscode/settings.json`:
```json
{
  "geminiAssistant.enableInlineCompletions": true,
  "geminiAssistant.cLanguageFocus": true,
  "geminiAssistant.autoAnalyzeOnOpen": true,
  "geminiAssistant.memoryCheckEnabled": true,
  "geminiAssistant.theme": "dark"
}
```

### Custom C Patterns

Create `~/.gemini/patterns.json`:
```json
{
  "myPattern": {
    "name": "My Custom Pattern",
    "description": "Custom C code pattern",
    "code": "// Your template here"
  }
}
```

---

## 🎮 Quick Start Commands

### VS Code Panel
- **Open Panel**: `Ctrl+Alt+G` (Windows/Linux) or `Cmd+Alt+G` (macOS)
- **Upload Files**: Click the "Upload Files" button in the panel
- **Generate Code**: Type a prompt and click "Generate Suggestion"
- **Insert Code**: Click "Insert into Editor" to apply the suggestion

### CLI Tool
```bash
# Interactive mode
gemini-cli

# Analyze a directory
gemini-cli analyze ./src

# Generate code from prompt
gemini-cli generate "C struct for user data"
```

### Shell Script
```bash
# Interactive shell
bash bin/gemini-shell.sh

# Analyze a C file
bash bin/gemini-shell.sh analyze file.c

# Generate a C template
bash bin/gemini-shell.sh generate main

# Check for unsafe functions
bash bin/gemini-shell.sh unsafe file.c
```

---

## 💪 Key Strengths

### 1. **Complete Independence**
- No external API calls
- No internet required
- No corporate dependencies
- Full control over your code

### 2. **C/C++ Mastery**
- 30+ battle-tested patterns
- Memory safety analysis
- Struct and pointer guides
- File I/O examples
- Best practices enforced

### 3. **Beautiful & Intuitive**
- Modern dark theme
- Responsive webview panel
- One-click code insertion
- Clean command interface
- Zero learning curve

### 4. **Stable & Reliable**
- Thoroughly tested
- No version conflicts
- Minimal dependencies
- MIT licensed
- Community-driven

### 5. **Multiple Access Points**
- VS Code extension
- CLI tool for servers
- Bash shell script
- Programmatic API

---

## 🔒 Privacy & Security

- ✅ All code analysis happens **locally**
- ✅ No telemetry or tracking
- ✅ No login required
- ✅ No account creation
- ✅ Open source (MIT license)
- ✅ Code never leaves your machine

---

## 🐛 Troubleshooting

### X11 Display Not Found
```bash
export DISPLAY=:0
# Or for SSH forwarding:
ssh -X user@host
```

### Node.js Not Found
```bash
# Install Node.js
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### Extension Won't Load
```bash
cd extensions/gemini-assistant
npm run compile
# Then reload VS Code (Ctrl+Shift+P → Reload Window)
```

### Termux npm Issues
```bash
pkg install -y build-essential python3
npm install --unsafe-perm
```

---

## 📚 Documentation

- **[Installation Guide](./INSTALL.md)** - Detailed setup instructions
- **[C Code Patterns](./docs/C_PATTERNS.md)** - 30+ C programming patterns
- **[API Reference](./API.md)** - Programmatic API documentation
- **[FAQ](./FAQ.md)** - Frequently asked questions
- **[Contributing](./CONTRIBUTING.md)** - How to contribute

---

## 🎓 Usage Examples

### Example 1: Generate a Safe C Main Function
```bash
gemini-cli generate "main function with error handling"
```

**Output**:
```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <arg>\n", argv[0]);
        return EXIT_FAILURE;
    }
    printf("Argument: %s\n", argv[1]);
    return EXIT_SUCCESS;
}
```

### Example 2: Analyze Your C Project
```bash
gemini-cli analyze ./src
```

**Output**:
```
📄 main.c
   Functions: int main(), int process_data()
   Includes: stdio.h, stdlib.h
   Structs: DataRecord
   Issues: ⚠️ No NULL check after malloc()

📄 utils.c
   Functions: void print_error()
   Includes: stdio.h
   Issues: ⚠️ Unsafe function detected: strcpy
```

### Example 3: Upload Local Files
1. Open VS Code
2. Press `Ctrl+Alt+G`
3. Click "Upload Files"
4. Select your C files
5. Type a prompt like "Create a function to read these files"
6. Click "Generate Suggestion"
7. Review and insert

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Areas for Contribution
- More C code patterns
- Additional language support (Rust, Go, etc.)
- Performance optimizations
- Bug fixes and improvements
- Documentation enhancements
- Termux compatibility improvements

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

Free to use, modify, and distribute.

---

## 🌟 Acknowledgments

- Built on VS Code Extension API
- Inspired by AI-assisted coding
- Community feedback and contributions
- Open source philosophy

---

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Email**: support@gemini-assistant.dev
- **Discord**: Join our community server

---

## 🚀 Roadmap

- [ ] GPU-accelerated code analysis
- [ ] Multi-file context awareness
- [ ] Custom training on your codebase
- [ ] Language server protocol (LSP) support
- [ ] IntelliJ/JetBrains support
- [ ] Neovim plugin
- [ ] Web IDE integration
- [ ] Real-time collaborative coding

---

## 💡 Why Gemini?

**Gemini Code Assistant** represents a new paradigm in AI-assisted coding:

1. **Free Forever** - No subscriptions, no artificial limits
2. **Independent** - No corporate dependency or cloud lock-in
3. **Powerful** - Specialized for C/C++ with deep analysis
4. **Beautiful** - Modern, intuitive user experience
5. **Stable** - Thoroughly tested and production-ready

Choose Gemini. Code smarter, faster, and free.

---

**Made with ❤️ by the black-210 community**

[GitHub](https://github.com/black-210/black-code) • [Issues](https://github.com/black-210/black-code/issues) • [Discussions](https://github.com/black-210/black-code/discussions)
