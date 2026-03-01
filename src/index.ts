/**
 * pi-undo
 * Undo extension for Pi coding agent
 *
 * Provides the ability to revert file changes made by the agent's tools
 * (write, edit, bash) and restore previous file states.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  // Extension initialization
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("pi-undo extension loaded", "info");
  });
}
