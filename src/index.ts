/**
 * pi-undo
 * Undo extension for Pi coding agent
 *
 * Provides /undo command to navigate back to previous messages
 * in the conversation history, keeping the context window clean.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("undo", {
    description: "Go back to the previous message in the conversation",
    handler: async (_args, ctx) => {
      const branch = ctx.sessionManager.getBranch();
      const currentLeafId = ctx.sessionManager.getLeafId();

      if (!currentLeafId || branch.length === 0) {
        ctx.ui.notify("Nothing to undo", "warning");
        return;
      }

      const currentIndex = branch.findIndex((e) => e.id === currentLeafId);
      if (currentIndex <= 0) {
        ctx.ui.notify("Nothing to undo", "warning");
        return;
      }

      const targetEntry = branch[currentIndex - 1];
      await ctx.navigateTree(targetEntry.id, { summarize: false });
    },
  });
}
