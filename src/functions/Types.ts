// problem interfaces
export interface MathProblem {
  simple: string;
  laTex: string;
  solution: number;
  operands: number[];
  variables?: string[];
}

// param interaces
export interface ArithmeticParams {
  min?: number;
  max?: number;
  steps?: number;
  operations?: operation[];
  operands: {
    positiveOnly: boolean;
    decimalPlaces: number;
  };
}

// misc interfaces
export type operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';
