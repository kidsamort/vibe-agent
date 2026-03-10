export interface VibeConfig {
  project: {
    name: string;
    stack: string[];
    packageManager: 'bun' | 'npm' | 'yarn' | 'pnpm';
    tracking?: boolean;
  };
  modules: string[];
  hydration: {
    status: 'skeleton' | 'hydrating' | 'complete';
    lastUpdated: string;
  };
}
