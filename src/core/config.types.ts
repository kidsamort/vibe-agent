export interface VibeConfig {
  project: {
    name: string;
    stack: string[];
    packageManager: 'bun' | 'npm' | 'yarn' | 'pnpm';
    tracking?: boolean;
  };
  variables?: Record<string, string>;
  modules: string[];
  hydration: {
    status: 'skeleton' | 'hydrating' | 'complete';
    lastUpdated: string;
  };
  plugins?: string[];
}
