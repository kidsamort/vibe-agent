import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { TemplateEngine } from "./template.engine";
import fs from "fs";
import path from "path";

describe("TemplateEngine", () => {
  const originalCwd = process.cwd;
  const originalReadFileSync = fs.readFileSync;
  const originalExistsSync = fs.existsSync;

  beforeEach(() => {
    // Mock process.cwd()
    process.cwd = mock(() => "/mock/project/root");
  });

  afterEach(() => {
    // Restore mocks
    process.cwd = originalCwd;
    fs.readFileSync = originalReadFileSync;
    fs.existsSync = originalExistsSync;
    mock.restore();
  });

  it("should successfully hydrate a template with provided data", () => {
    const templatePath = "01-vision.mdx";
    const expectedFullPath = path.resolve("/mock/project/root", "templates", "base", templatePath);
    const mockContent = "Project: {projectName}\nOwner: {projectOwner}";

    fs.existsSync = mock((p: fs.PathLike) => {
      if (p.toString() === expectedFullPath) return true;
      return false;
    });

    fs.readFileSync = mock((p: fs.PathOrFileDescriptor, options?: any) => {
      if (p.toString() === expectedFullPath) return mockContent;
      throw new Error(`Unexpected file read: ${p}`);
    });

    const data = {
      projectName: "SuperApp",
      projectOwner: "Alice"
    };

    const result = TemplateEngine.hydrate(templatePath, data);

    expect(result).toBe("Project: SuperApp\nOwner: Alice");
  });

  it("should leave placeholders intact if data is missing", () => {
    const templatePath = "test.mdx";
    const expectedFullPath = path.resolve("/mock/project/root", "templates", "base", templatePath);
    const mockContent = "Hello, {name}! Your age is {age}.";

    fs.existsSync = mock((p: fs.PathLike) => {
      if (p.toString() === expectedFullPath) return true;
      return false;
    });

    fs.readFileSync = mock((p: fs.PathOrFileDescriptor, options?: any) => {
      if (p.toString() === expectedFullPath) return mockContent;
      throw new Error(`Unexpected file read: ${p}`);
    });

    const data = {
      name: "Bob"
    };

    const result = TemplateEngine.hydrate(templatePath, data);

    expect(result).toBe("Hello, Bob! Your age is {age}.");
  });

  it("should throw an error if the template file does not exist", () => {
    const templatePath = "non-existent.mdx";

    fs.existsSync = mock(() => false);

    expect(() => {
      TemplateEngine.hydrate(templatePath, {});
    }).toThrow(/Template not found at:/);
  });
});
