import {FractionProblem, FractionParams, Operation} from './Types';
import {
  randomIntFromInterval,
  simplifyFraction,
  getLCM,
  convertStringToLatex,
} from './utilFuncs';

const defaultOperations: Operation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
];

// implement given expression
export const genFractionProblem = (
  params: FractionParams = {
    min: 1,
    max: 9,
    steps: 1,
    operations: defaultOperations,
    operands: {
      positiveOnly: true,
      mixedNumbersAllowed: false,
      sameDenom: false,
      simplified: true,
      numeratorScaler: 5,
    },
  },
  givenExpression?: FractionProblem
): FractionProblem => {
  let min = params.min || 1,
    max = params.min || 9,
    steps = params.steps || 1,
    operations = params.operations || defaultOperations,
    positiveOnly = params.operands.positiveOnly,
    mixedNumbersAllowed = params.operands.mixedNumbersAllowed || false,
    sameDenom = params.operands.sameDenom || false,
    simplified = params.operands.simplified,
    numeratorScaler = params.operands.numeratorScaler || 5;

  // set operation randomly
  const operation = operations[~~Math.random() * operations.length];

  // set operands
  const denominators: number[] = [];
  if (givenExpression) {
    denominators.push(givenExpression.solutionSplit[1] || 1);
  } else {
    denominators.push(randomIntFromInterval(min, max, true));
  }

  sameDenom
    ? denominators.push(denominators[0])
    : denominators.push(randomIntFromInterval(min, max, true));

  const numerators: number[] = givenExpression
    ? [givenExpression.solutionSplit[0]]
    : [randomIntFromInterval(min, max * numeratorScaler)];

  numerators[1] =
    positiveOnly && operation === 'subtraction'
      ? randomIntFromInterval(min, numerators[0])
      : randomIntFromInterval(min, max * numeratorScaler);

  const operands: number[][] | number = simplified
    ? [
        simplifyFraction(numerators[0], denominators[0]),
        simplifyFraction(numerators[0], denominators[0]),
      ]
    : [
        [numerators[0], denominators[0]],
        [numerators[1], denominators[1]],
      ];

  const problem = buildFracProblem(
    operands,
    operation,
    mixedNumbersAllowed,
    givenExpression
  );

  if (steps > 1)
    return genFractionProblem({...params, steps: steps - 1}, problem);

  return problem;
};

export const buildFracProblem = (
  operands: number[][],
  operation: Operation,
  mixedNumbersAllowed: boolean,
  givenExpression?: FractionProblem
): FractionProblem => {
  const operandStrings: string[] = [];
  givenExpression
    ? operandStrings.push(givenExpression.simple)
    : operandStrings.push(stringifyFraction(operands[0], mixedNumbersAllowed));
  operandStrings.push(stringifyFraction(operands[1], mixedNumbersAllowed));

  const simple = buildFracSimpleString(
    operands,
    operandStrings,
    operation,
    givenExpression
  );

  const solution = ((): number[] => {
    switch (operation) {
      case 'multiplication':
        return solveFractionMult(operands[0], operands[1]);
      case 'division':
        return solveFractionDiv(operands[0], operands[1]);
      default:
        return solveFractionAddOrSub(operands[0], operands[1], operation);
    }
  })();

  const laTex =
    operation !== 'division'
      ? convertStringToLatex(simple)
      : convertStringToLatex(operandStrings[0]) +
        '\\div' +
        convertStringToLatex(operandStrings[1]);

  return new FractionProblem(
    simple,
    laTex,
    solution.join('/'),
    solution,
    operandStrings,
    operands,
    mixedNumbersAllowed
  );
};

export const buildFracSimpleString = (
  operands: number[][],
  operandStrings: string[],
  operation: Operation,
  givenExpression?: FractionProblem
): string => {
  const operationSymbols = {
    addition: '+',
    subtraction: '-',
    multiplication: '*',
    division: '/',
  };

  const firstHalfString =
    givenExpression || operation === 'division'
      ? `(${operandStrings[0]})`
      : operandStrings[0];
  const secondHalfString =
    operands[1][0] < 0 || operands[1][1] < 0 || operation === 'division'
      ? `(${operandStrings[1]})`
      : operandStrings[1];

  return `${firstHalfString}${operationSymbols[operation]}${secondHalfString}`;
};

export const solveFractionAddOrSub = (
  first: number[],
  second: number[],
  operation: 'addition' | 'subtraction'
): number[] => {
  if (first.length < 2) first.push(1);
  if (second.length < 2) second.push(1);

  const commonDenom = getLCM(first[1], second[1]);
  const multipliers = [commonDenom / first[1], commonDenom / second[1]];

  const result =
    operation === 'addition'
      ? first[0] * multipliers[0] + second[0] * multipliers[1]
      : first[0] * multipliers[0] - second[0] * multipliers[1];

  return simplifyFraction(result, commonDenom);
};

export const solveFractionMult = (
  first: number[],
  second: number[]
): number[] => {
  const numerator = first[0] * second[0];
  const denominator = (first[1] || 1) * (second[1] || 1);
  return simplifyFraction(numerator, denominator);
};

export const solveFractionDiv = (
  first: number[],
  second: number[]
): number[] => {
  const numerator = first[0] * (second[1] || 1);
  const denominator = (first[1] || 1) * second[0];
  return simplifyFraction(numerator, denominator);
};

export const stringifyFraction = (
  fraction: number[],
  mixedNumbersAllowed: boolean
): string => {
  return mixedNumbersAllowed && fraction.length > 1
    ? buildMixedNumber(fraction[0], fraction[1])
    : fraction.join('/');
};

export const buildMixedNumber = (
  numerator: number,
  denominator: number
): string => {
  if (numerator <= denominator) return `${numerator}/${denominator}`;

  const newNumerator = numerator % denominator;
  const coefficient = (numerator - newNumerator) / denominator;

  return `${coefficient} ${newNumerator}/${denominator}`;
};
