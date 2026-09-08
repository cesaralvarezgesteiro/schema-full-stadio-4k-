
export enum Scenario {
  RESULTS = 'results',
  PREVIEW = 'preview',
  MATCH = 'match',
  PREVIEW_CHRONICLE = 'preview_chronicle',
  RESULTS_CHRONICLE = 'results_chronicle'
}

export interface GeneratedCode {
  css: string;
  html: string;
  js: string;
}
