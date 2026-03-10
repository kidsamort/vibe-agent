import { consola } from "consola";
import { runGetProjectNameStep } from "@/commands/init/steps/get-project-name";

export async function runInitLogic() {
  consola.start("Начинаем инициализацию проекта...");

  const projectName = await runGetProjectNameStep();

  consola.success(`Проект "${projectName}" успешно инициализирован (пока только в памяти).`);

  return {
    projectName
  };
}
