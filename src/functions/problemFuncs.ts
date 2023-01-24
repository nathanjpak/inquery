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

export const genAdditionProblem = (
  min: number,
  max: number,
  givenExpression?: MathProblem
): MathProblem => {
  const operands = [];
  if (givenExpression) operands.push(givenExpression.simple);
  while (operands.length < 2)
    operands.push(randomIntFromInterval(min, max).toString());

  const solution = givenExpression
    ? givenExpression.solution + Number.parseInt(operands[1])
    : Number.parseInt(operands[0]) + Number.parseInt(operands[1]);

  const simpleStringFirstHalf = givenExpression
    ? `(${givenExpression.simple})`
    : operands[0];
  const simpleStringSecondHalf =
    operands[1][0] === '-' ? `(${operands[1]})` : operands[1];

  const simple = `${simpleStringFirstHalf}+${simpleStringSecondHalf}`;

  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: operands,
  };
};

export const genSubtractionProblem = (
  min: number,
  max: number,
  nonNegativeSolutionOnly: boolean,
  givenExpression?: MathProblem
): MathProblem => {
  const operands = [];
  // determining the first operand reduces randomness but is more performant
  givenExpression
    ? operands.push(givenExpression.solution)
    : operands.push(randomIntFromInterval(min, max));

  nonNegativeSolutionOnly
    ? operands.push(randomIntFromInterval(min, operands[0]))
    : operands.push(randomIntFromInterval(min, max));

  let solution = operands[0] - operands[1];

  const simpleStringFirstHalf = givenExpression
    ? `(${givenExpression.simple})`
    : operands[0];
  const simpleStringSecondHalf =
    operands[1] < 0 ? `(${operands[1]})` : operands[1];
  const simple = `${simpleStringFirstHalf}-${simpleStringSecondHalf}`;

  if (givenExpression) operands[0] = givenExpression.simple;

  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: [operands[0].toString(), operands[1].toString()],
  };
};

export const genMultiplicationProblem = (
  min: number,
  max: number,
  givenExpression?: MathProblem
): MathProblem => {
  let operands = [];
  givenExpression
    ? operands.push(givenExpression.solution, randomIntFromInterval(min, max))
    : operands.push(
        randomIntFromInterval(min, max),
        randomIntFromInterval(min, max)
      );

  const solution = operands[1] * operands[0];

  if (givenExpression) operands[0] = givenExpression.simple;

  const simple = givenExpression
    ? `(${operands[0]})*${operands[1]}`
    : `${operands[0]}*${operands[1]}`;

  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: [operands[0].toString(), operands[1].toString()],
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
      divisor = integerOnly
        ? getRandomFactor(dividend)
        : randomIntFromInterval(min, max, true),
      solution = dividend / divisor;

    const simple = `(${givenExpression.simple})/${divisor}`;

    return {
      simple: simple,
      laTex: math.parse(simple).toTex(),
      solution: solution,
      operands: [givenExpression.simple, divisor.toString()],
    };
  }

  const operands: number[] = [randomIntFromInterval(min, max)],
    solution: number = randomIntFromInterval(min, max);
  operands.unshift(solution * operands[0]);
  let simple = `${operands[0]}/${operands[1]}`;
  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: [operands[0].toString(), operands[1].toString()],
  };
};

export const getProblems = () => {};
