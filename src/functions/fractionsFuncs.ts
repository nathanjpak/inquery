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

  if (!positiveOnly && min > 0) min = -max;

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

  const getProblem = (operation: Operation): FractionProblem => {
    switch (operation) {
      default:
        return genFractionAddition(
          operands,
          mixedNumbersAllowed,
          givenExpression
        );
    }
  };

  const problem = getProblem(operation);

  if (steps > 1)
    return genFractionProblem({...params, steps: steps - 1}, problem);

  return problem;
};

// TODO: implement negative operands
// TODO: implement given expression
export const genFractionAddition = (
  operands: number[][],
  mixedNumbersAllowed = false,
  givenExpression?: FractionProblem
): FractionProblem => {
  if (givenExpression) console.log('TBD');

  const numerators: number[] = [],
    denominators: number[] = [];
  operands.forEach(fraction => {
    fraction.length < 2 ? denominators.push(1) : denominators.push(fraction[1]);
    numerators.push(fraction[0]);
  });

  const commonDenom = getLCM(denominators[0], denominators[1]);
  const multipliers = [
    commonDenom / denominators[0],
    commonDenom / denominators[1],
  ];

  const sum = numerators[0] * multipliers[0] + numerators[1] * multipliers[1];

  const solutionSplit: number[] = simplifyFraction(sum, commonDenom);
  let solutionString = `${solutionSplit[0]}/${solutionSplit[1]}`;

  if (mixedNumbersAllowed && solutionSplit[0] > solutionSplit[1]) {
    solutionString = buildMixedNumber(solutionSplit[0], solutionSplit[1]);
  }

  const simple = buildFractionString(operands, '+', mixedNumbersAllowed);

  return {
    simple: simple,
    laTex: convertStringToLatex(simple),
    solutionString: solutionString,
    solutionSplit: solutionSplit,
    operands: simple.split('+'),
    operandsSplit: operands,
    mixedNumbersAllowed: mixedNumbersAllowed,
  };
};

const buildFractionString = (
  operands: number[][],
  operation: string,
  mixedNumbersAllowed: boolean
): string => {
  const operandStrings: string[] = [];

  operands.forEach(fraction => {
    if (mixedNumbersAllowed && fraction.length > 1) {
      operandStrings.push(buildMixedNumber(fraction[0], fraction[1]));
    } else {
      operandStrings.push(fraction.join('/'));
    }
  });

  return `${operandStrings[0]}${operation}${operandStrings[1]}`;
};

const buildMixedNumber = (numerator: number, denominator: number): string => {
  if (numerator <= denominator) return `${numerator}/${denominator}`;

  const newNumerator = numerator % denominator;
  const coefficient = (numerator - newNumerator) / denominator;

  return `${coefficient} ${newNumerator}/${denominator}`;
};
