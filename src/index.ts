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
    description: "Go back n message(s) in the conversation (default: 1)",
    handler: async (args, ctx) => {
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

      // Parse number of steps to undo (default: 1)
      const steps = args.trim() ? parseInt(args.trim(), 10) : 1;
      if (isNaN(steps) || steps < 1) {
        ctx.ui.notify(
          "Invalid argument: please provide a positive number",
          "error",
        );
        return;
      }

      // Calculate target index (can't go before the first entry)
      const targetIndex = Math.max(0, currentIndex - steps);
      const targetEntry = branch[targetIndex];
      const actualSteps = currentIndex - targetIndex;

      await ctx.navigateTree(targetEntry.id, { summarize: false });

      // Notify user how many steps were undone
      if (actualSteps !== steps) {
        ctx.ui.notify(
          `Undid ${actualSteps} step(s) (reached beginning of conversation)`,
          "info",
        );
      }
    },
  });
}
