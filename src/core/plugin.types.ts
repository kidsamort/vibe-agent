export interface Plugin {
  name: string;
  version: string;
  templates: string[];
  skills: string[];
  basePath?: string;
  actions?: Record<string, unknown>;
}
