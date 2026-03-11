import { consola } from "consola";
import { initCommand } from "@/commands/init";
import { runCommand } from "@/commands/run";

consola.box("vibe-agent CLI initialized");

/**
 * Main entry point
 * 
 * ВАЖНО: Агенты будут расширять этот файл, добавляя команды 
 * через регистратор в фазе Спринта 2.
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "init") {
    await initCommand();
  } else if (command === "run") {
    await runCommand(args.slice(1));
  } else {
    consola.info("Available commands: init, run");
  }
}

main().catch(err => {
  consola.error("Fatal error:", err);
  process.exit(1);
});
