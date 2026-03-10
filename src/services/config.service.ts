import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import type { VibeConfig } from '@/core/config.types';

const CONFIG_FILE_NAME = 'agent.config.yml';
const CONFIG_FILE_PATH = path.resolve(process.cwd(), CONFIG_FILE_NAME);

export const ConfigService = {
  /**
   * Reads the configuration from the agent.config.yml file.
   * If the file does not exist, returns null.
   */
  read(): VibeConfig | null {
    try {
      if (!fs.existsSync(CONFIG_FILE_PATH)) {
        return null;
      }
      const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return yaml.parse(fileContent) as VibeConfig;
    } catch (error) {
      console.error(`Error reading ${CONFIG_FILE_NAME}:`, error);
      return null;
    }
  },

  /**
   * Writes the configuration to the agent.config.yml file.
   */
  write(config: VibeConfig): void {
    try {
      const fileContent = yaml.stringify(config);
      fs.writeFileSync(CONFIG_FILE_PATH, fileContent, 'utf-8');
    } catch (error) {
      console.error(`Error writing ${CONFIG_FILE_NAME}:`, error);
      throw error;
    }
  },
};
