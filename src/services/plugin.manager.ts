import { Plugin } from '@/core/plugin.types';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ConfigService } from '@/services/config.service';

async function getExternalPluginDirs(): Promise<string[]> {
  const dirs: string[] = [];
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');

  try {
    const entries = await fs.readdir(nodeModulesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('vibe-plugin-')) {
        dirs.push(path.join(nodeModulesPath, entry.name));
      }
    }
  } catch (err) {
    // node_modules might not exist
  }

  const config = ConfigService.read();
  if (config && config.modules) {
    for (const mod of config.modules) {
      const modPath = path.join(nodeModulesPath, mod);
      if (!dirs.includes(modPath)) {
        dirs.push(modPath);
      }
    }
  }

  return dirs;
}

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
    const pluginDirsToScan: string[] = [];

    try {
      const entries = await fs.readdir(pluginsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          pluginDirsToScan.push(path.join(pluginsDir, entry.name));
        }
      }
    } catch (error) {
      console.error(`Error reading plugins directory:`, error);
    }

    const externalDirs = await getExternalPluginDirs();
    pluginDirsToScan.push(...externalDirs);

    for (const dir of pluginDirsToScan) {
      const pluginJsonPath = path.join(dir, 'plugin.json');

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

    return plugins;
  },

  async getTemplateDirs(): Promise<string[]> {
    const pluginsDir = path.join(process.cwd(), '.agents', 'plugins');
    const templateDirs: string[] = [];
    const pluginDirsToScan: string[] = [];

    try {
      const entries = await fs.readdir(pluginsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          pluginDirsToScan.push(path.join(pluginsDir, entry.name));
        }
      }
    } catch (error) {
      console.error(`Error reading plugins directory for templates:`, error);
    }

    const externalDirs = await getExternalPluginDirs();
    pluginDirsToScan.push(...externalDirs);

    for (const dir of pluginDirsToScan) {
      const pluginJsonPath = path.join(dir, 'plugin.json');

      try {
        const fileStats = await fs.stat(pluginJsonPath);
        if (fileStats.isFile()) {
          const templatesDir = path.join(dir, 'templates');
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

    return templateDirs;
  },

  async getTemplate(pluginName: string, templateName: string): Promise<string | null> {
    const localTemplatePath = path.join(
      process.cwd(),
      '.agents',
      'plugins',
      pluginName,
      'templates',
      templateName
    );

    try {
      const fileStats = await fs.stat(localTemplatePath);
      if (fileStats.isFile()) {
        return localTemplatePath;
      }
    } catch (err) {
      // Local template not found, try external
      const externalTemplatePath = path.join(
        process.cwd(),
        'node_modules',
        pluginName,
        'templates',
        templateName
      );

      try {
        const externalFileStats = await fs.stat(externalTemplatePath);
        if (externalFileStats.isFile()) {
          return externalTemplatePath;
        }
      } catch (extErr) {
        return null;
      }
    }

    return null;
  },

  async loadAction(pluginName: string, actionName: string): Promise<any> {
    try {
      const module = await import(pluginName);
      if (module && typeof module[actionName] === 'function') {
        return module[actionName];
      }
      return null;
    } catch (err) {
      console.error(`Error loading action ${actionName} from plugin ${pluginName}:`, err);
      return null;
    }
  }
};
