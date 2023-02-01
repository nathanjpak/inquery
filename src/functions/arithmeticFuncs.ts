import {
  convertStringToLatex,
  getRandomFactor,
  randomFloatFromInterval,
  randomIntFromInterval,
} from './utilFuncs';

import {ArithmeticParams, ArithmeticProblem, Operation} from './Types';

const defaultOperations: Operation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
];

// TODO: enable non-integer rational numbers in decimal or fraction form

export const genArithmeticProblem = (
  params: ArithmeticParams,
  givenExpression?: ArithmeticProblem
): ArithmeticProblem => {
  let min = params.min || 1,
    max = params.max || 15,
    steps = params.steps || 1,
    operations: Operation[] = params.operations || defaultOperations,
    positiveOnly = params.operands.positiveOnly,
    decimalPlaces = params.operands.decimalPlaces;
  if (!positiveOnly && min > 0) min = -max;

  // set operation randomly
  const operation = operations[~~(Math.random() * operations.length)];

  const getProblem = (operation: Operation) => {
    switch (operation) {
      case 'addition':
        return genAdditionProblem(min, max, decimalPlaces, givenExpression);
      case 'subtraction':
        return genSubtractionProblem(
          min,
          max,
          positiveOnly,
          decimalPlaces,
          givenExpression
        );
      case 'multiplication':
        return genMultiplicationProblem(
          min,
          max,
          decimalPlaces,
          givenExpression
        );
      default:
        return genDivisionProblem(
          min,
          max,
          decimalPlaces === 0,
          givenExpression
        );
    }
  };

  const problem = getProblem(operation);

  if (steps > 1)
    return genArithmeticProblem({...params, steps: steps - 1}, problem);

  return problem;
};

export const genAdditionProblem = (
  min: number,
  max: number,
  decimalPlaces: number,
  givenExpression?: ArithmeticProblem
): ArithmeticProblem => {
  const operands = givenExpression
    ? [
        ...givenExpression.operands,
        randomFloatFromInterval(min, max, decimalPlaces),
      ]
    : [
        randomFloatFromInterval(min, max, decimalPlaces),
        randomFloatFromInterval(min, max, decimalPlaces),
      ];

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
    laTex: convertStringToLatex(simple),
    solution: Number(solution.toFixed(decimalPlaces)),
    operands: operands,
  };
};

export const genSubtractionProblem = (
  min: number,
  max: number,
  nonNegativeSolutionOnly: boolean,
  decimalPlaces: number,
  givenExpression?: ArithmeticProblem
): ArithmeticProblem => {
  // determining the first operand reduces randomness but is more performant
  const operands = givenExpression
    ? [...givenExpression.operands]
    : [randomFloatFromInterval(min, max, decimalPlaces)];

  nonNegativeSolutionOnly
    ? operands.push(
        randomFloatFromInterval(
          min,
          operands[operands.length - 1],
          decimalPlaces
        )
      )
    : operands.push(randomFloatFromInterval(min, max, decimalPlaces));

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
    laTex: convertStringToLatex(simple),
    solution: Number(solution.toFixed(decimalPlaces)),
    operands: operands,
  };
};

// TODO: enable rounding of answers
export const genMultiplicationProblem = (
  min: number,
  max: number,
  decimalPlaces: number,
  givenExpression?: ArithmeticProblem
): ArithmeticProblem => {
  let operands = givenExpression
    ? [
        ...givenExpression.operands,
        randomFloatFromInterval(min, max, decimalPlaces),
      ]
    : [
        randomFloatFromInterval(min, max, decimalPlaces),
        randomFloatFromInterval(min, max, decimalPlaces),
      ];

  const solution = givenExpression
    ? givenExpression.solution * operands[operands.length - 1]
    : operands[0] * operands[1];

  const simple = givenExpression
    ? `(${givenExpression.simple})*${operands[operands.length - 1]}`
    : `${operands[0]}*${operands[1]}`;

  return {
    simple: simple,
    laTex: convertStringToLatex(simple),
    solution: Number(solution.toFixed(decimalPlaces)),
    operands: operands,
  };
};

// TODO: enable non-integer rational numbers
export const genDivisionProblem = (
  min: number,
  max: number,
  integerOnly = true,
  givenExpression?: ArithmeticProblem
): ArithmeticProblem => {
  if (givenExpression) {
    const dividend = givenExpression.solution,
      divisor = integerOnly
        ? getRandomFactor(dividend)
        : randomIntFromInterval(min, max, true),
      solution = dividend / divisor;

    const simple = `(${givenExpression.simple})/${divisor}`;

    return {
      simple: simple,
      laTex: convertStringToLatex(simple),
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
    laTex: convertStringToLatex(simple),
    solution: solution,
    operands: operands,
  };
};
