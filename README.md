# pi-undo

> WARNING: You should probably just use the built-in command `/tree` for this instead. It is much more flexible.

> A simple `/undo` extension/command for Pi coding agent: Navigate back in conversation history.

A plugin for [Pi](https://github.com/badlogic/pi-mono) that provides context undo functionality. Allows you to back up to previous messages in the conversation, keeping the context window clean when the agent goes in the wrong direction.

## Features

- Context navigation: go back to previous messages in the conversation
- Simple undo command: quickly back up one step without visual UI
- Clean context: remove unwanted turns from the active conversation

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
| `/undo` | Go back to the previous message in the conversation |

## How It Works

The `/undo` command navigates the session tree to a previous point in the conversation. Unlike `/tree` which shows a visual selector, `/undo` immediately goes back one step.

For example, if the conversation is:
1. User: "Add a feature"
2. Assistant: [response + tool calls]
3. User: "/undo"

The context reverts to just before message #2, effectively removing the assistant's response from the active conversation.
