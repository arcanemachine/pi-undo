# pi-undo

> Undo extension for Pi coding agent - revert file changes made by the agent.

A plugin for [Pi](https://github.com/badlogic/pi-mono) that provides undo functionality for file changes. Automatically captures file snapshots before destructive operations and allows you to revert changes when needed.

## Features

- Automatic checkpointing: captures file state before write, edit, and destructive bash operations
- Undo commands: revert changes with simple commands
- Visual status: shows undo depth in the status line
- Session persistence: undo history survives across agent turns

## Installation

### From GitHub (Recommended)

```bash
pi install git:github.com/arcanemachine/pi-undo
```

To update to the latest version:

```bash
pi update git:github.com/arcanemachine/pi-undo
```

### From Local Clone

```bash
git clone https://github.com/arcanemachine/pi-undo.git
cd pi-undo
npm install
pi install /path/to/pi-undo
```

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `/undo` | Undo the last file change |
| `/undo [n]` | Undo the last N changes |
| `/undo list` | Show recent changes that can be undone |
| `/undo status` | Show current undo depth and history info |
| `/undo clear` | Clear all undo history |

### Status Indicator

The extension shows the current undo depth in the status line, e.g. `undo: 3` means 3 changes can be undone.

## How It Works

1. Before any destructive tool call (write, edit, bash that modifies files), the extension captures a snapshot of the affected files
2. After the tool completes successfully, the snapshot is added to the undo stack
3. When you run `/undo`, the extension restores the file to its previous state

## Safety Notes

- Undo history is stored in memory and persists for the session duration
- History is cleared when starting a new session (`/new`)
- The extension warns if you attempt to switch sessions with pending undo history

## License

MIT
