import { runInitLogic } from "@/commands/init/logic";

export async function initCommand() {
  await runInitLogic();
}
