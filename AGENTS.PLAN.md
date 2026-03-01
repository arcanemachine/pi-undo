# Plan: pi-undo Extension

## Goal

Implement `/undo` command that allows users to back up to previous messages in the agent's conversation history. This keeps the context window clean by effectively removing or skipping recent messages that may have gone in the wrong direction.

## Core Concept

Unlike file-based undo (reverting file changes), this **context undo** navigates the session tree to a previous point in the conversation. It's similar to `/tree` navigation but streamlined for the common case of "go back one step."

## Key Insight

Pi sessions are stored as a tree structure where:
- Each entry has an `id` and `parentId`
- The current conversation branch is a linear path through the tree
- `/undo` navigates to the parent entry, effectively "undoing" the last message

## Relevant Pi Code References

### Session Management
- `/usr/local/share/npm-global/lib/node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.d.ts`
  - `SessionManager` class - provides `getBranch()`, `getLeafId()`, `getEntries()`
  - `SessionEntry` types - understanding message/entry structure

### Extension Events for Navigation
- `/usr/local/share/npm-global/lib/node_modules/@mariozechner/pi-coding-agent/dist/core/extensions/types.d.ts`
  - `SessionBeforeTreeEvent` - fired before tree navigation, can be cancelled
  - `SessionTreeEvent` - fired after navigation
  - `TreePreparation` - contains `targetId`, `oldLeafId`, navigation data

### Navigation API (ExtensionCommandContext)
- `/usr/local/share/npm-global/lib/node_modules/@mariozechner/pi-coding-agent/dist/core/extensions/types.d.ts`
  - `ctx.navigateTree(targetId, options)` - programmatic tree navigation
  - Options: `summarize`, `customInstructions`, `replaceInstructions`, `label`

### Example: Tree Navigation
- `/usr/local/share/npm-global/lib/node_modules/@mariozechner/pi-coding-agent/examples/extensions/` (look for tree/session navigation patterns)

## Proposed Implementation

### Data Model
```typescript
// No persistent state needed - uses session tree directly
// The session itself IS the undo history
```

### Commands

#### `/undo`
- Navigate to the parent entry of the current leaf
- If current leaf is a user message, go back to the assistant message before it
- If current leaf is an assistant message, go back to the user message that prompted it
- Effect: "Remove" the last exchange from context

#### `/undo [n]` (future)
- Navigate back N steps in the conversation

#### `/undo list` (future)
- Show recent entries that can be undone to

### Implementation Steps

1. **Get current branch** via `ctx.sessionManager.getBranch()`
2. **Find target entry** - identify the parent entry to navigate to
3. **Call navigateTree** with the target entry ID
4. **Handle navigation** - session switches to the target point in history

### Key Considerations

1. **What counts as one "undo"?**
   - Option A: Each entry (user message, assistant message, tool result) = one undo
   - Option B: Each "turn" (user message + all following until next user) = one undo
   - Recommendation: Start with Option A (simpler), consider Option B for UX

2. **Navigation behavior**:
   - Should we summarize the abandoned branch? (like `/tree` does)
   - Should undo create a new branch or navigate in-place?
   - Recommendation: Navigate in-place (no new branch), no summary for quick undo

3. **Edge cases**:
   - At the beginning of session (nothing to undo)
   - During streaming (wait for idle or cancel?)
   - After compaction (entries may be summarized)

### API Usage Example

```typescript
pi.registerCommand("undo", {
  handler: async (_args, ctx) => {
    const branch = ctx.sessionManager.getBranch();
    const currentLeafId = ctx.sessionManager.getLeafId();
    
    // Find parent entry
    const currentIndex = branch.findIndex(e => e.id === currentLeafId);
    if (currentIndex <= 0) {
      ctx.ui.notify("Nothing to undo", "warning");
      return;
    }
    
    const targetEntry = branch[currentIndex - 1];
    
    // Navigate to parent (no summary, in-place)
    await ctx.navigateTree(targetEntry.id, { 
      summarize: false 
    });
  }
});
```

## Comparison to Existing Features

| Feature | Purpose | Difference |
|---------|---------|------------|
| `/tree` | Navigate to any point in history | Visual selector, can go anywhere |
| `/undo` | Quick "go back one step" | Command-based, streamlined, no UI |
| `/fork` | Branch from a point | Creates new session file |
| `/compact` | Summarize old context | Keeps history but reduces tokens |

## Future Enhancements

- `/redo` - Navigate forward if user undid too far (would need separate stack)
- Visual indicator showing "undo depth" in status line
- Confirmation before undoing large sections

## References

- Pi session docs: `/usr/local/share/npm-global/lib/node_modules/@mariozechner/pi-coding-agent/docs/session.md`
- Pi extensions docs: `/usr/local/share/npm-global/lib/node_modules/@mariozechner/pi-coding-agent/docs/extensions.md`
