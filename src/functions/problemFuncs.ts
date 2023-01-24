import * as math from 'mathjs';
import {getRandomFactor, randomIntFromInterval} from './utilFuncs';

// problem interfaces
interface MathProblem {
  simple: string;
  laTex: string;
  solution: number;
  operands: string[];
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

// TODO: write out logic for other operations
// TODO: use recursion to generate multistep problems
export const genArithmeticProblem = (params: ArithmeticParams): MathProblem => {
  let min = params.min || 1,
    max = params.max || 15,
    // steps = params.steps || 1,
    operations = params.operations || defaultOperations;
  if (!params.positiveOnly && min > 0) min = -max;

  // set operation randomly
  const operation = operations[~~(Math.random() * operations.length)];

  // if division, then run separate division generator function
  if (operation.symbol === '/')
    return genDivisionProblem(min, max, params.integerOnly);

  const operands: number[] = [
    randomIntFromInterval(max, min),
    randomIntFromInterval(max, min),
  ];

  return {
    laTex: 'ba',
    simple: 'ba',
    solution: 2,
    operands: [operands[0].toString(), operands[1].toString()],
  };
};

// export const genAdditionProblem = (): MathProblem => {

// };

// export const genSubtractionProblem = (): MathProblem => {};

export const genMultiplicationProblem = (
  min: number,
  max: number,
  givenExpression?: MathProblem
): MathProblem => {
  let operands = [];
  if (givenExpression) operands.push(givenExpression.simple);
  while (operands.length < 2)
    operands.push(randomIntFromInterval(min, max).toString());

  let solution = givenExpression
    ? givenExpression.solution * Number.parseInt(operands[1])
    : Number.parseInt(operands[0]) * Number.parseInt(operands[1]);

  let simple = givenExpression
    ? `${givenExpression.simple}*${operands[1]}`
    : `${operands[0]}*${operands[1]}`;

  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: operands,
  };
};

// TODO: switch operands order to [Dividend, Divisor]
// TODO: enable non-integer rational numbers
export const genDivisionProblem = (
  min: number,
  max: number,
  integerOnly: boolean,
  givenExpression?: MathProblem
): MathProblem => {
  if (givenExpression) {
    const dividend = givenExpression.solution,
      divisor = getRandomFactor(dividend),
      solution = dividend / divisor;

    const simple = `(${givenExpression.simple})/${divisor}`;

    return {
      simple: simple,
      laTex: math.parse(simple).toTex(),
      solution: solution,
      operands: [divisor.toString(), givenExpression.simple],
    };
  }

  if (integerOnly) {
    const operands: number[] = [randomIntFromInterval(min, max)],
      solution: number = randomIntFromInterval(min, max);

    operands.push(solution * operands[0]);

    let simple = `${operands[1]}/${operands[0]}`;

    return {
      simple: simple,
      laTex: math.parse(simple).toTex(),
      solution: solution,
      operands: [operands[0].toString(), operands[1].toString()],
    };
  }

  // TODO: if rationals are allowed
  return {
    laTex: 'ba',
    simple: '',
    solution: 2,
    operands: ['2', '4'],
  };
};

export const getProblems = () => {};
