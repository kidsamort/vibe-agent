import { runSyncLogic } from "@/commands/sync/logic";

export async function syncCommand() {
  await runSyncLogic();
}
