export interface Step {
  id: string;
  title: string;
  prompt: string;
  validate: (input: unknown) => boolean | string;
  action: (input: unknown) => Promise<void>;
}
