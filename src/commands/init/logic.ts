import { consola } from "consola";
import { runGetProjectNameStep } from "@/commands/init/steps/get-project-name";
import { runSelectStackStep } from "@/commands/init/steps/select-stack";
import { runConfigureTrackingStep } from "@/commands/init/steps/configure-tracking";
import { ConfigService } from "@/services/config.service";
import type { VibeConfig } from "@/core/config.types";

export async function runInitLogic() {
  consola.start("Начинаем инициализацию проекта...");

  const projectName = await runGetProjectNameStep();
  const stack = await runSelectStackStep();
  const tracking = await runConfigureTrackingStep();

  const config: VibeConfig = {
    project: {
      name: projectName,
      stack: [stack],
      packageManager: "bun",
      tracking: tracking
    },
    modules: [],
    hydration: {
      status: "skeleton",
      lastUpdated: new Date().toISOString()
    }
  };

  ConfigService.write(config);

  consola.success(`Проект "${projectName}" успешно инициализирован и сохранен в agent.config.yml.`);

  return config;
}
