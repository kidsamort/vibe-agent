import { consola } from "consola";
import type { Step } from "@/core/cli.types";

export const configureTrackingStep: Step = {
  id: "configure-tracking",
  title: "Интеграция с трекерами",
  prompt: "Хотите подключить канбан-доски (Jira/Trello)?",
  validate: (input: unknown) => {
    if (typeof input !== "boolean") {
      return "Ответ должен быть да или нет";
    }
    return true;
  },
  action: async (input: unknown) => {
    // No-op for now, just demonstrating safe type usage
  }
};

export async function runConfigureTrackingStep(): Promise<boolean> {
  const answer = await consola.prompt(configureTrackingStep.prompt, {
    type: "confirm",
  });

  const validationResult = configureTrackingStep.validate(answer);
  if (validationResult !== true) {
    consola.error(validationResult as string);
    return runConfigureTrackingStep(); // Retry on failure
  }

  await configureTrackingStep.action(answer);
  return answer as boolean;
}
