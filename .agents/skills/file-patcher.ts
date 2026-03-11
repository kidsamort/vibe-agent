import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function walk(dir: string, fileList: string[] = []): Promise<string[]> {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      // Exclude typical non-source directories
      if (file === '.git' || file === '.agents' || file === 'node_modules' || file === 'dist' || file === 'build') {
        continue;
      }
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await walk(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }
  return fileList;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: bun run file-patcher.ts <directory> <search_regex> <replacement>');
    process.exit(1);
  }

  const [targetDir, searchRegexStr, replacement] = args;

  let regex: RegExp;
  if (searchRegexStr.startsWith('/') && searchRegexStr.lastIndexOf('/') > 0) {
    const lastSlash = searchRegexStr.lastIndexOf('/');
    const pattern = searchRegexStr.slice(1, lastSlash);
    const flags = searchRegexStr.slice(lastSlash + 1);
    regex = new RegExp(pattern, flags);
  } else {
    // Default to global replacement if no flags are provided
    regex = new RegExp(searchRegexStr, 'g');
  }

  console.log(`Target Directory: ${targetDir}`);
  console.log(`Search Regex: ${regex.toString()}`);
  console.log(`Replacement: ${replacement}`);

  const files = await walk(targetDir);
  let changedFilesCount = 0;

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const newContent = content.replace(regex, replacement);

      if (newContent !== content) {
        await writeFile(file, newContent, 'utf-8');
        console.log(`[PATCHED] ${file}`);
        changedFilesCount++;
      }
    } catch (e: unknown) {
      // Ignore files that cannot be read as utf-8 (e.g., binaries) or other errors
      // or other errors like permissions issues.
      const message = e instanceof Error ? e.message : String(e);
      // Check for specific error codes if 'e' is an Error object
      if (e instanceof Error && 'code' in e) {
        if (e.code === 'EISDIR' || e.code === 'ENOENT') {
          continue; // Skip directories or non-existent files
        }
      }
      console.error(`Error processing ${file}:`, message);
    }
  }

  console.log(`Done. Patched ${changedFilesCount} file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
