export interface ConflictMatrix {
  [subject: string]: {
    [otherSubject: string]: boolean;
  };
}

export interface ParseResult {
  success: boolean;
  matrix?: ConflictMatrix;
  subjects?: string[];
  error?: string;
}

export type AnalysisMode = 'single' | 'multi';
