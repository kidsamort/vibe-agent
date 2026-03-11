import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import fs from 'fs';
import path from 'path';
import { runSyncLogic } from './logic';
import { ConfigService } from '@/services/config.service';
import type { VibeConfig } from '@/core/config.types';

// Mock ConfigService
const mockConfig: VibeConfig = {
  project: {
    name: "Test Project",
    stack: ["bun"],
    packageManager: "bun"
  },
  variables: {
    projectDescription: "A test description from config",
    targetAudience: "Developers",
    currentCycle: "Sprint 2"
  },
  modules: [],
  hydration: {
    status: "complete",
    lastUpdated: new Date().toISOString()
  }
};

const originalRead = ConfigService.read;

// We will mock consola as well to avoid prompts hanging during tests
import { consola } from 'consola';
let promptAnswers: boolean[] = [];
let promptCallCount = 0;

const originalPrompt = consola.prompt;
const originalSuccess = consola.success;
const originalWarn = consola.warn;
const originalInfo = consola.info;
const originalStart = consola.start;

describe("Sync Command", () => {
  const docsDir = path.resolve(process.cwd(), 'docs');

  beforeAll(() => {
    ConfigService.read = () => mockConfig;
    consola.prompt = (async () => {
      const answer = promptAnswers[promptCallCount];
      promptCallCount++;
      return answer;
    }) as any;
    consola.success = () => {};
    consola.warn = () => {};
    consola.info = () => {};
    consola.start = () => {};

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }
  });

  afterAll(() => {
    ConfigService.read = originalRead;
    consola.prompt = originalPrompt;
    consola.success = originalSuccess;
    consola.warn = originalWarn;
    consola.info = originalInfo;
    consola.start = originalStart;

    if (fs.existsSync(docsDir)) {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });

  test("should hydrate template using variables from config", async () => {
    // Setup initial dirty file
    const filePath = path.join(docsDir, '01-vision.mdx');
    fs.writeFileSync(filePath, "Old content", "utf-8");

    // Tell mock to answer YES to prompt
    promptAnswers = [true];
    promptCallCount = 0;

    await runSyncLogic();

    const newContent = fs.readFileSync(filePath, "utf-8");
    expect(newContent).toContain("Test Project"); // projectName
    expect(newContent).toContain("A test description from config"); // variables.projectDescription
    expect(newContent).toContain("Developers"); // variables.targetAudience

    // Check fallback was used for keys missing in variables
    expect(newContent).toContain("Решаемая проблема"); // solvedProblem fallback
  });
});
