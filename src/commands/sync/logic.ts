import fs from 'fs';
import path from 'path';
import { consola } from 'consola';
import { ConfigService } from '@/services/config.service';
import { TemplateEngine } from '@/services/template.engine';

export async function runSyncLogic() {
  consola.start('Начинаем синхронизацию документации...');

  const config = ConfigService.read();
  if (!config) {
    consola.error('Файл конфигурации (agent.config.yml) не найден. Выполните vibe init.');
    return;
  }

  const docsDir = path.resolve(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    consola.error('Директория docs/ не найдена. Создайте её и добавьте MDX файлы.');
    return;
  }

  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.mdx'));

  if (files.length === 0) {
    consola.info('В директории docs/ нет MDX файлов для синхронизации.');
    return;
  }

  const templateData: Record<string, string> = {
    // defaults
    projectOwner: 'User',
    projectDescription: 'Описание проекта',
    targetAudience: 'Целевая аудитория',
    solvedProblem: 'Решаемая проблема',
    keyValue: 'Ключевая ценность',
    currentCycle: 'Спринт 1',
    objective1: 'Цель 1',
    kr1_1: 'KR 1.1',
    kr1_2: 'KR 1.2',
    kr1_3: 'KR 1.3',
    objective2: 'Цель 2',
    kr2_1: 'KR 2.1',
    kr2_2: 'KR 2.2',
    kr2_3: 'KR 2.3',
    // overridden by config
    ...(config.variables || {}),
    projectName: config.project.name
  };

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const templatePath = file; // We assume the filename in docs/ matches templates/base/

    let hydratedContent: string;
    try {
      hydratedContent = TemplateEngine.hydrate(templatePath, templateData);
    } catch (e) {
      consola.warn(`Шаблон для ${file} не найден в templates/base/. Пропускаем...`);
      continue;
    }

    const currentContent = fs.readFileSync(filePath, 'utf-8');

    if (currentContent !== hydratedContent) {
      consola.warn(`Файл ${file} был изменен или не синхронизирован ("грязный" файл).`);
      const shouldOverwrite = await consola.prompt(`Перезаписать файл ${file}?`, {
        type: 'confirm',
        initial: false
      });

      if (shouldOverwrite) {
        fs.writeFileSync(filePath, hydratedContent, 'utf-8');
        consola.success(`Файл ${file} успешно обновлен.`);
      } else {
        consola.info(`Файл ${file} пропущен.`);
      }
    } else {
      consola.success(`Файл ${file} актуален.`);
    }
  }

  consola.success('Синхронизация завершена.');
}
