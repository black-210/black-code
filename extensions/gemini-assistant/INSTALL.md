# Installation Guide - Gemini Code Assistant

## Requirements
- **VS Code**: 1.90.0 or higher
- **Node.js**: 16+ (for building)
- **X11 Display Server**: For GUI support (Linux/X11 systems)
- **C/C++ Compiler**: `gcc`, `clang`, or `MSVC` (optional, for C analysis features)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/black-210/black-code.git
cd black-code
git checkout gemini-editor
```

### 2. Install Dependencies
```bash
cd extensions/gemini-assistant
npm install
```

### 3. Compile TypeScript
```bash
npm run compile
```

### 4. Load Extension in VS Code

#### Option A: Development Mode
1. Open the project in VS Code
2. Press `F5` to start debugging
3. The extension will load in a new VS Code window

#### Option B: Install Locally
```bash
vsce package
vsce publish
```

### 5. X11 Configuration (Linux/Unix)

For full X11 support on Linux systems:

```bash
# Ensure X11 is available
export DISPLAY=:0

# Or for remote X11 forwarding via SSH:
ssh -X user@host "code"
```

**X11 Dependencies (Ubuntu/Debian):**
```bash
sudo apt-get install xauth x11-apps libx11-6
```

**X11 Dependencies (Fedora/RHEL):**
```bash
sudo dnf install xauth xdpyinfo libx11
```

**X11 Dependencies (Arch):**
```bash
sudo pacman -S xorg-xauth xorg-xdpyinfo libx11
```

### 6. Verify Installation

```bash
# Check VS Code extension version
code --list-extensions | grep gemini-assistant

# Test the extension
code --new-window
```

Then open the Command Palette (`Ctrl+Shift+P`) and type:
```
Gemini: Open Assistant Panel
```

## Uninstallation

```bash
# Disable the extension
code --disable-extension black-210.gemini-assistant

# Or remove completely
rm -rf ~/.vscode/extensions/black-210.gemini-assistant-*
```

## Troubleshooting

### X11 Display Not Found
```bash
# Check your DISPLAY variable
echo $DISPLAY

# If empty, set it manually
export DISPLAY=:0

# Then launch VS Code
code
```

### Extension Won't Load
```bash
# Rebuild the extension
npm run compile

# Check VS Code logs
code --log=trace
```

### C/C++ Features Not Working
Install the official C/C++ extension:
```bash
code --install-extension ms-vscode.cpptools
```

## Quick Start

1. Open or create a `.c` or `.cpp` file
2. Press `Ctrl+Alt+G` to open the Gemini panel
3. Upload your C files or type a prompt
4. Click "Generate Suggestion" to get code
5. Click "Insert into Editor" to apply

## Support

For issues, see the GitHub repo: https://github.com/black-210/black-code
