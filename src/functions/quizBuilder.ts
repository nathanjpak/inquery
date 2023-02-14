import {genArithmeticProblem} from './arithmeticFuncs';
import {genFractionProblem} from './fractionsFuncs';
import {
  ArithmeticParams,
  FractionParams,
  MathProblem,
  Operation,
  ProblemType,
} from './Types';

interface QueryParams {
  problemsCount: number;
  problemType?: ProblemType;
  operations?: Operation[];
  steps?: number | number[];
  params?: {
    min?: number;
    max?: number;
    positiveOnly?: boolean;
    decimalPlaces?: number;
    mixedNumbersAllowed?: boolean;
    sameDenom?: boolean;
    simplifyFractions?: boolean;
    numeratorScaler?: number;
  };
}

const problemTypes: ProblemType[] = ['Arithmetic', 'Fraction'];
const defaultOperations: Operation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
];

export const quizBuilder = (query: QueryParams): MathProblem[] => {
  const problems: MathProblem[] = [];
  const operations = query.operations || defaultOperations;
  let problemType = query.problemType;
  let count = query.problemsCount;

  for (let i = 0; i < count; i++) {
    if (!problemType)
      problemType = problemTypes[~~(Math.random() * problemTypes.length)];

    let steps = query.steps ? query.steps : 2;
    if (typeof steps !== 'number' && typeof steps == 'object')
      steps = steps[~~(Math.random() * steps.length)];

    switch (problemType) {
      case 'Fraction':
        let fractionParams: FractionParams = {
          min: query.params?.min,
          max: query.params?.max,
          operations: operations,
          operands: {
            positiveOnly: query.params?.positiveOnly || true,
            mixedNumbersAllowed: query.params?.mixedNumbersAllowed || false,
            sameDenom: query.params?.sameDenom || false,
            simplified: query.params?.simplifyFractions || false,
            numeratorScaler: query.params?.numeratorScaler || 5,
          },
        };
        problems.push(genFractionProblem(fractionParams));
      default:
        let arithmeticParams: ArithmeticParams = {
          steps: steps,
          min: query.params?.min,
          max: query.params?.max,
          operations: operations,
          operands: {
            positiveOnly: query.params?.positiveOnly || true,
            decimalPlaces: query.params?.decimalPlaces || 0,
          },
        };
        problems.push(genArithmeticProblem(arithmeticParams));
    }
  }

  return problems;
};
