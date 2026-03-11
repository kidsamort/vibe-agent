import { Plugin } from '@/core/plugin.types';
import { ConfigService } from '@/services/config.service';
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
          const basePath = path.join(pluginsDir, entry.name);
          const pluginJsonPath = path.join(basePath, 'plugin.json');

          try {
            const fileStats = await fs.stat(pluginJsonPath);
            if (fileStats.isFile()) {
              const fileContent = await fs.readFile(pluginJsonPath, 'utf-8');
              const pluginData = JSON.parse(fileContent) as Plugin;
              pluginData.basePath = basePath;

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

    // Read explicit plugins from configuration
    const config = ConfigService.read();
    const explicitPlugins = config?.plugins || [];

    const nodeModulesDir = path.join(process.cwd(), 'node_modules');
    const externalPluginDirs: string[] = [];

    try {
      const nodeModulesEntries = await fs.readdir(nodeModulesDir, { withFileTypes: true });

      for (const entry of nodeModulesEntries) {
        if (entry.isDirectory()) {
          if (entry.name.startsWith('vibe-plugin-') || explicitPlugins.includes(entry.name)) {
            externalPluginDirs.push(path.join(nodeModulesDir, entry.name));
          } else if (entry.name.startsWith('@')) {
            // Check scoped packages
            const scopeDir = path.join(nodeModulesDir, entry.name);
            try {
              const scopeEntries = await fs.readdir(scopeDir, { withFileTypes: true });
              for (const scopeEntry of scopeEntries) {
                if (scopeEntry.isDirectory()) {
                  const packageName = `${entry.name}/${scopeEntry.name}`;
                  if (scopeEntry.name.startsWith('vibe-plugin-') || explicitPlugins.includes(packageName)) {
                    externalPluginDirs.push(path.join(scopeDir, scopeEntry.name));
                  }
                }
              }
            } catch (err) {
              // Ignore scope read errors
            }
          }
        }
      }
    } catch (error) {
      // It's possible node_modules doesn't exist, ignore
    }

    for (const pluginDir of externalPluginDirs) {
      const pluginJsonPath = path.join(pluginDir, 'plugin.json');
      try {
        const fileStats = await fs.stat(pluginJsonPath);
        if (fileStats.isFile()) {
          const fileContent = await fs.readFile(pluginJsonPath, 'utf-8');
          const pluginData = JSON.parse(fileContent) as Plugin;
          pluginData.basePath = pluginDir;

          try {
            // Attempt to dynamically import module for exported logic/actions
            const moduleName = pluginData.name;
            const moduleExports = await import(moduleName);
            pluginData.actions = moduleExports;
          } catch (importErr) {
            // It's acceptable if an external plugin doesn't export any loadable script logic
            // or if the import fails
          }

          plugins.push(pluginData);
        }
      } catch (err) {
        // Skip if plugin.json doesn't exist in the package
        continue;
      }
    }

    return plugins;
  },

  async getTemplateDirs(): Promise<string[]> {
    const templateDirs: string[] = [];
    const plugins = await this.scanPlugins();

    for (const plugin of plugins) {
      if (!plugin.basePath) continue;

      const templatesDir = path.join(plugin.basePath, 'templates');
      try {
        const templateStats = await fs.stat(templatesDir);
        if (templateStats.isDirectory()) {
          templateDirs.push(templatesDir);
        }
      } catch (err) {
        // templates directory does not exist, skip
      }
    }

    return templateDirs;
  },

  async getTemplate(pluginName: string, templateName: string): Promise<string | null> {
    const plugins = await this.scanPlugins();
    const plugin = plugins.find(p => p.name === pluginName);

    if (!plugin || !plugin.basePath) {
      return null;
    }

    const templatePath = path.join(plugin.basePath, 'templates', templateName);

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
