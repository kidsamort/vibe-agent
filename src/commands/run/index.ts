import { consola } from "consola";
import { SkillRunner } from "@/services/skill.runner";

export async function runCommand(args: string[]) {
  if (args.length === 0) {
    consola.error("Usage: vibe run <skillName> [args...]");
    process.exit(1);
  }

  const skillName = args[0];
  const skillArgs = args.slice(1);

  await SkillRunner.run(skillName, skillArgs);
}
