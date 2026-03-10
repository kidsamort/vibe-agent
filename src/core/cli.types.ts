export interface Step {
  id: string;
  title: string;
  prompt: string;
  validate: (input: any) => boolean | string;
  action: (input: any) => Promise<void>;
}
