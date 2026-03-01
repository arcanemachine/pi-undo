/**
 * pi-undo
 * Undo extension for Pi coding agent
 *
 * Provides /undo command to navigate back to previous messages
 * in the conversation history, keeping the context window clean.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  // TODO: Implement /undo command
  // - Get current branch via ctx.sessionManager.getBranch()
  // - Find parent entry of current leaf
  // - Navigate to parent via ctx.navigateTree(targetId, { summarize: false })

  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("pi-undo extension loaded", "info");
  });
}
