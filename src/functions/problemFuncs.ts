import * as math from 'mathjs';
import {getRandomFactor, randomIntFromInterval} from './utilFuncs';

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

// TODO: enable non-integer rational numbers in decimal or fraction form

export const genArithmeticProblem = (
  params: ArithmeticParams,
  givenExpression?: MathProblem
): MathProblem => {
  let min = params.min || 1,
    max = params.max || 15,
    steps = params.steps || 1,
    operations = params.operations || defaultOperations;
  if (!params.positiveOnly && min > 0) min = -max;

  // set operation randomly
  const operation = operations[~~(Math.random() * operations.length)];

  const getProblem = (operationSymbol: string) => {
    switch (operationSymbol) {
      case '+':
        return genAdditionProblem(min, max, givenExpression);
      case '-':
        return genSubtractionProblem(
          min,
          max,
          params.positiveOnly,
          givenExpression
        );
      case '*':
        return genMultiplicationProblem(min, max, givenExpression);
      default:
        return genDivisionProblem(
          min,
          max,
          params.integerOnly,
          givenExpression
        );
    }
  };

  const problem = getProblem(operation.symbol);

  if (steps > 1)
    return genArithmeticProblem({...params, steps: steps - 1}, problem);

  return problem;
};

export const genAdditionProblem = (
  min: number,
  max: number,
  givenExpression?: MathProblem
): MathProblem => {
  const operands = givenExpression
    ? [...givenExpression.operands, randomIntFromInterval(min, max)]
    : [randomIntFromInterval(min, max), randomIntFromInterval(min, max)];

  const solution = givenExpression
    ? givenExpression.solution + operands[operands.length - 1]
    : operands[0] + operands[1];

  const simpleStringFirstHalf = givenExpression
    ? `(${givenExpression.simple})`
    : operands[0].toString();
  const simpleStringSecondHalf =
    operands[operands.length - 1] > 0
      ? operands[1].toString()
      : `(${operands[1]})`;

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
  // determining the first operand reduces randomness but is more performant
  const operands = givenExpression
    ? [...givenExpression.operands]
    : [randomIntFromInterval(min, max)];

  nonNegativeSolutionOnly
    ? operands.push(randomIntFromInterval(min, operands[operands.length - 1]))
    : operands.push(randomIntFromInterval(min, max));

  let solution = givenExpression
    ? givenExpression.solution - operands[operands.length - 1]
    : operands[0] - operands[1];

  const simpleStringFirstHalf = givenExpression
    ? `(${givenExpression.simple})`
    : operands[0].toString();
  const simpleStringSecondHalf =
    operands[operands.length - 1] < 0
      ? `(${operands[operands.length - 1]})`
      : operands[operands.length - 1].toString();
  const simple = `${simpleStringFirstHalf}-${simpleStringSecondHalf}`;

  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: operands,
  };
};

export const genMultiplicationProblem = (
  min: number,
  max: number,
  givenExpression?: MathProblem
): MathProblem => {
  let operands = givenExpression
    ? [...givenExpression.operands, randomIntFromInterval(min, max)]
    : [randomIntFromInterval(min, max), randomIntFromInterval(min, max)];

  const solution = givenExpression
    ? givenExpression.solution * operands[operands.length - 1]
    : operands[0] * operands[1];

  const simple = givenExpression
    ? `(${givenExpression.simple})*${operands[operands.length - 1]}`
    : `${operands[0]}*${operands[1]}`;

  return {
    simple: simple,
    laTex: math.parse(simple).toTex(),
    solution: solution,
    operands: operands,
  };
};

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
      operands: [...givenExpression.operands, divisor],
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
    operands: operands,
  };
};

export const getProblems = () => {};
