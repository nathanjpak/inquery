import * as math from 'mathjs';

// problem interfaces
interface MathProblem {
  simple: string;
  laTex: string;
  solution: number;
  operands: number[];
  variables?: string[];
}

// param interaces
interface ArithmeticParams {
  min?: number;
  max?: number;
  steps?: number;
  operations?: operation[];
  positiveOnly: boolean;
  integerOnly: boolean;
}

// misc interfaces
interface operation {
  symbol: string;
  verb: string;
}

const defaultOperations = [
  {
    symbol: '+',
    verb: 'add',
  },
  {
    symbol: '-',
    verb: 'minus',
  },
  {
    symbol: '*',
    verb: 'times',
  },
  {
    symbol: '/',
    verb: 'divided by',
  },
];

export const genArithmetic = (params: ArithmeticParams): MathProblem => {
  let min = params.min || 1,
    max = params.max || 15,
    // steps = params.steps || 1,
    operations = params.operations || defaultOperations;
  if (!params.positiveOnly && min > 0) min = -max;

  // set operation randomly
  const operation = operations[~~(Math.random() * operations.length)];

  // if division, then run separate division generator function
  if (operation.symbol === '/') return genDiv(min, max, params.integerOnly);

  return {
    laTex: 'ba',
    simple: 'ba',
    solution: 2,
    operands: [2, 4],
  };
};

export const genDiv = (
  min: number,
  max: number,
  integerOnly: boolean
  // preset?: {
  //   divisor?: number;
  //   dividend?: number;
  //   solution?: number;
  // }
): MathProblem => {
  if (integerOnly) {
    const operands: number[] = [~~(Math.random() * (max - min) + min)],
      solution: number = ~~(Math.random() * (max - min) + min);

    operands.push(solution * operands[0]);

    let simple = `${operands[1]}/${operands[0]}`;

    return {
      simple: simple,
      laTex: math.parse(simple).toTex(),
      solution: solution,
      operands: operands,
    };
  }

  // if rationals are allowed
  return {
    laTex: 'ba',
    simple: '',
    solution: 2,
    operands: [2, 4],
  };
};

export const getProblems = () => {};
