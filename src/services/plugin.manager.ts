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
  },

  async getTemplateDirs(): Promise<string[]> {
    const pluginsDir = path.join(process.cwd(), '.agents', 'plugins');
    const templateDirs: string[] = [];

    try {
      const entries = await fs.readdir(pluginsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pluginJsonPath = path.join(pluginsDir, entry.name, 'plugin.json');

          try {
            const fileStats = await fs.stat(pluginJsonPath);
            if (fileStats.isFile()) {
              const templatesDir = path.join(pluginsDir, entry.name, 'templates');
              try {
                const templateStats = await fs.stat(templatesDir);
                if (templateStats.isDirectory()) {
                  templateDirs.push(templatesDir);
                }
              } catch (err) {
                // templates directory does not exist, skip
              }
            }
          } catch (err) {
            // plugin.json does not exist, skip
          }
        }
      }
    } catch (error) {
      console.error(`Error reading plugins directory for templates:`, error);
    }

    return templateDirs;
  },

  async getTemplate(pluginName: string, templateName: string): Promise<string | null> {
    const templatePath = path.join(
      process.cwd(),
      '.agents',
      'plugins',
      pluginName,
      'templates',
      templateName
    );

    try {
      const fileStats = await fs.stat(templatePath);
      if (fileStats.isFile()) {
        return templatePath;
      }
    } catch (err) {
      // Template not found or inaccessible
      return null;
    }

    return null;
  }
};
