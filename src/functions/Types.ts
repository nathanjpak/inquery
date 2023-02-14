// solution is a string to account for
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

export class FractionProblem extends MathProblem {
  solutionString: string;
  solutionSplit: number[];
  operands: string[];
  operandsSplit: number[][];
  mixedNumbersAllowed: boolean;
  constructor(
    simple: string,
    laTex: string,
    solutionString: string,
    solutionSplit: number[],
    operands: string[],
    operandsSplit: number[][],
    mixedNumbersAllowed: boolean
  ) {
    super(simple, laTex);
    this.solutionString = solutionString;
    this.solutionSplit = solutionSplit;
    this.operands = operands;
    this.operandsSplit = operandsSplit;
    this.mixedNumbersAllowed = mixedNumbersAllowed;
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

export type ProblemType = 'Arithmetic' | 'Fraction';
