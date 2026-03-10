import { consola } from "consola";
import type { Step } from "@/core/cli.types";

export const getProjectNameStep: Step = {
  id: "get-project-name",
  title: "Название проекта",
  prompt: "Введите название вашего проекта:",
  validate: (input: any) => {
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return "Название проекта не может быть пустым";
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(input.trim())) {
      return "Название может содержать только латинские буквы, цифры, дефис и подчеркивание";
    }
    return true;
  },
  action: async (input: any) => {
    // В будущем тут будет логика сохранения в стейт или конфиг
    return input.trim();
  }
};

export async function runGetProjectNameStep(): Promise<string> {
  const answer = await consola.prompt(getProjectNameStep.prompt, {
    type: "text",
  });

  const validationResult = getProjectNameStep.validate(answer);
  if (validationResult !== true) {
    consola.error(validationResult as string);
    return runGetProjectNameStep(); // Retry on failure
  }

  const result = await getProjectNameStep.action(answer);
  return typeof result === 'string' ? result : answer.trim();
}
