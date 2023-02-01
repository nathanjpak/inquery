// problem interfaces
// solution is a string to account for
// export interface MathProblem {
//   simple: string;
//   laTex: string;
//   solution: string;
//   operands: number[];
//   variables?: string[];
// }

export class MathProblem {
  simple: string;
  laTex: string;
  constructor(simple: string, laTex: string) {
    this.simple = simple;
    this.laTex = laTex;
  }
}

export class ArithmeticProblem extends MathProblem {
  solution: number;
  operands: number[];
  constructor(
    simple: string,
    laTex: string,
    solution: number,
    operands: number[]
  ) {
    super(simple, laTex);
    this.solution = solution;
    this.operands = operands;
  }
}

// param interaces
export interface ArithmeticParams {
  min?: number;
  max?: number;
  steps?: number;
  operations?: Operation[];
  operands: {
    positiveOnly: boolean;
    decimalPlaces: number;
  };
}

export interface FractionParams {
  min?: number;
  max?: number;
  steps?: number;
  operations?: Operation[];
  operands: {
    positiveOnly: boolean;
    mixedNumbersAllowed: boolean;
    sameDenom: boolean;
    simplified: boolean;
    numeratorScaler: number;
  };
}

// misc interfaces
export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';
