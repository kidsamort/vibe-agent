import fs from 'fs';
import path from 'path';
import { consola } from 'consola';
import { ConfigService } from '@/services/config.service';

const SKILLS_DIR = path.resolve(process.cwd(), '.agents/skills');

export const SkillRunner = {
  /**
   * Runs a specified skill by looking up a matching .ts or .js file in the .agents/skills/ directory.
   */
  async run(skillName: string, args: string[]) {
    try {
      if (!fs.existsSync(SKILLS_DIR)) {
        consola.error(`Skills directory not found at ${SKILLS_DIR}.`);
        process.exit(1);
      }

      const tsSkillPath = path.join(SKILLS_DIR, `${skillName}.ts`);
      const jsSkillPath = path.join(SKILLS_DIR, `${skillName}.js`);

      let skillPath: string | null = null;
      if (fs.existsSync(tsSkillPath)) {
        skillPath = tsSkillPath;
      } else if (fs.existsSync(jsSkillPath)) {
        skillPath = jsSkillPath;
      }

      if (!skillPath) {
        consola.error(`Skill "${skillName}" not found. Looked for ${tsSkillPath} and ${jsSkillPath}`);
        process.exit(1);
      }

      const config = ConfigService.read();

      const env = {
        ...process.env,
      };

      if (config) {
        env.VIBE_PROJECT_CONFIG = JSON.stringify(config);
      }

      consola.info(`Executing skill: ${skillName}`);

      const proc = Bun.spawn({
        cmd: ["bun", "run", skillPath, ...args],
        env,
        stdio: ["inherit", "inherit", "inherit"],
      });

      const exitCode = await proc.exited;

      if (exitCode !== 0) {
        consola.error(`Skill "${skillName}" exited with code ${exitCode}`);
        process.exit(exitCode);
      } else {
        consola.success(`Skill "${skillName}" completed successfully.`);
      }

    } catch (error) {
      consola.error(`Failed to run skill "${skillName}":`, error);
      process.exit(1);
    }
  }
};
