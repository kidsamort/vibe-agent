import { readdir, stat, readFile } from 'fs/promises';
import { join, relative } from 'path';

const IGNORED_DIRS = new Set(['.git', '.agents', 'node_modules', 'dist', 'build', 'legacy-template']);
const INCLUDED_EXTS = new Set(['.ts', '.md', '.json', '.yaml', '.yml']);

async function getStructure(dir: string, prefix = ''): Promise<string> {
  let structure = '';
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    // Filter ignored directories early
    const filteredEntries = entries.filter(
      (dirent) => !IGNORED_DIRS.has(dirent.name) && !dirent.name.startsWith('.')
    );

    // Sort to have consistent output
    filteredEntries.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < filteredEntries.length; i++) {
      const dirent = filteredEntries[i];
      const isLast = i === filteredEntries.length - 1;
      const marker = isLast ? '└── ' : '├── ';
      structure += `${prefix}${marker}${dirent.name}\n`;

      if (dirent.isDirectory()) {
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        structure += await getStructure(join(dir, dirent.name), nextPrefix);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  return structure;
}

async function getFiles(dir: string, baseDir: string, fileList: string[] = []): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const dirent of entries) {
      if (IGNORED_DIRS.has(dirent.name) || dirent.name.startsWith('.')) {
        continue;
      }
      const fullPath = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        await getFiles(fullPath, baseDir, fileList);
      } else {
        const ext = fullPath.slice(fullPath.lastIndexOf('.'));
        if (INCLUDED_EXTS.has(ext)) {
          fileList.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  return fileList;
}

async function main() {
  const rootDir = process.cwd();

  const structure = await getStructure(rootDir);

  let xmlOutput = '<context>\n';
  xmlOutput += `  <project_structure>\n${structure}  </project_structure>\n`;

  xmlOutput += `  <files>\n`;
  const filePaths = await getFiles(rootDir, rootDir);

  for (const filePath of filePaths) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const relPath = relative(rootDir, filePath);
      xmlOutput += `    <file path="${relPath}">\n<![CDATA[\n${content}\n]]>\n    </file>\n`;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(`<error>${message}</error>\n`);
      process.exit(1);
    }
  }
  xmlOutput += `  </files>\n`;
  xmlOutput += '</context>\n';

  console.log(xmlOutput);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
