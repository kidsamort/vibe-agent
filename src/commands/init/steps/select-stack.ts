import { consola } from "consola";
import type { Step } from "@/core/cli.types";

export const selectStackStep: Step = {
  id: "select-stack",
  title: "Выбор стека",
  prompt: "Выберите основной стек для проекта:",
  validate: (input: unknown) => {
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return "Стек не может быть пустым";
    }
    const validStacks = ["Next.js", "Vite", "Bun"];
    if (!validStacks.includes(input)) {
      return "Выберите один из предложенных вариантов";
    }
    return true;
  },
  action: async (input: unknown) => {
    // No-op
  }
};

export async function runSelectStackStep(): Promise<string> {
  const answer = await consola.prompt(selectStackStep.prompt, {
    type: "select",
    options: ["Next.js", "Vite", "Bun"],
  });

  const validationResult = selectStackStep.validate(answer);
  if (validationResult !== true) {
    consola.error(validationResult as string);
    return runSelectStackStep(); // Retry on failure
  }

  await selectStackStep.action(answer);
  return answer as string;
}
