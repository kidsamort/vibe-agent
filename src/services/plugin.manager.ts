import { Plugin } from '@/core/plugin.types';
import fs from 'node:fs/promises';
import path from 'node:path';

export const PluginManager = {
  async scanPlugins(): Promise<Plugin[]> {
    const pluginsDir = path.join(process.cwd(), '.agents', 'plugins');

    // Ensure the directory exists
    try {
      await fs.mkdir(pluginsDir, { recursive: true });
    } catch (error) {
      console.error(`Error creating plugins directory:`, error);
    }

    const plugins: Plugin[] = [];

    try {
      const entries = await fs.readdir(pluginsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pluginJsonPath = path.join(pluginsDir, entry.name, 'plugin.json');

          try {
            const fileStats = await fs.stat(pluginJsonPath);
            if (fileStats.isFile()) {
              const fileContent = await fs.readFile(pluginJsonPath, 'utf-8');
              const pluginData = JSON.parse(fileContent) as Plugin;

              plugins.push(pluginData);
            }
          } catch (err) {
            // plugin.json might not exist, skip this directory
            continue;
          }
        }
      }
    } catch (error) {
      console.error(`Error reading plugins directory:`, error);
    }

    return plugins;
  }
};
