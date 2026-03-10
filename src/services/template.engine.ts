import fs from 'fs';
import path from 'path';

export const TemplateEngine = {
  /**
   * Reads an MDX file from templates/base/ and replaces all {variableName}
   * occurrences with the corresponding value from the data record.
   */
  hydrate(templatePath: string, data: Record<string, string>): string {
    const fullPath = path.resolve(process.cwd(), 'templates', 'base', templatePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Template not found at: ${fullPath}`);
    }

    let content = fs.readFileSync(fullPath, 'utf-8');

    // Replace all {variableName} placeholders
    content = content.replace(/{([^}]+)}/g, (match, key) => {
      // If the key exists in data, replace it. Otherwise, keep the original {key}
      return data[key] !== undefined ? data[key] : match;
    });

    return content;
  }
};
