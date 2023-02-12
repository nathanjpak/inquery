import {
  buildFracProblem,
  buildFracSimpleString,
  solveFractionAddOrSub,
  solveFractionDiv,
  solveFractionMult,
  // genFractionAddition,
  // genFractionMultiplication,
  // genFractionSubtraction,
  stringifyFraction,
} from '../../functions/fractionsFuncs';
import {FractionProblem} from '../../functions/Types';

describe('build Frac Simple Expression String', () => {
  it('should return work with a simple examples', () => {
    const operands = [
      [1, 2],
      [3, 4],
    ];
    const operandStrings = [
      stringifyFraction(operands[0], false),
      stringifyFraction(operands[1], false),
    ];

    const simpleAddition = buildFracSimpleString(
      operands,
      operandStrings,
      'addition'
    );
    const simpleSubtraction = buildFracSimpleString(
      operands,
      operandStrings,
      'subtraction'
    );
    const simpleMultiplication = buildFracSimpleString(
      operands,
      operandStrings,
      'multiplication'
    );
    const simpleDivision = buildFracSimpleString(
      operands,
      operandStrings,
      'division'
    );

    expect(simpleAddition).toEqual('1/2+3/4');
    expect(simpleSubtraction).toEqual('1/2-3/4');
    expect(simpleMultiplication).toEqual('1/2*3/4');
    expect(simpleDivision).toEqual('(1/2)/(3/4)');
  });

  it('should wrap the second fraction given a negative', () => {
    const negNumerator = [
      [1, 2],
      [-3, 4],
    ];
    const negDenominator = [
      [1, 2],
      [3, -4],
    ];
    const negNumeratorStrings = [
      stringifyFraction(negNumerator[0], false),
      stringifyFraction(negNumerator[1], false),
    ];
    const negDenominatorStrings = [
      stringifyFraction(negDenominator[0], false),
      stringifyFraction(negDenominator[1], false),
    ];

    const negAddition = buildFracSimpleString(
      negNumerator,
      negNumeratorStrings,
      'addition'
    );
    const negSubtraction = buildFracSimpleString(
      negDenominator,
      negDenominatorStrings,
      'subtraction'
    );
    const negMultiplication = buildFracSimpleString(
      negNumerator,
      negNumeratorStrings,
      'multiplication'
    );
    const negDivision = buildFracSimpleString(
      negDenominator,
      negDenominatorStrings,
      'division'
    );

    expect(negAddition).toEqual('1/2+(-3/4)');
    expect(negSubtraction).toEqual('1/2-(3/-4)');
    expect(negMultiplication).toEqual('1/2*(-3/4)');
    expect(negDivision).toEqual('(1/2)/(3/-4)');
  });

  it('should work with mixed numbers', () => {
    const mixedOperands = [
      [4, 3],
      [5, 2],
    ];
    const mixedOperandStrings = [
      stringifyFraction(mixedOperands[0], true),
      stringifyFraction(mixedOperands[1], true),
    ];

    const addMixedOperands = buildFracSimpleString(
      mixedOperands,
      mixedOperandStrings,
      'addition'
    );
    const divMixedOperands = buildFracSimpleString(
      mixedOperands,
      mixedOperandStrings,
      'division'
    );

    expect(addMixedOperands).toEqual('1 1/3+2 1/2');
    expect(divMixedOperands).toEqual('(1 1/3)/(2 1/2)');
  });

  it('should work with a given expression', () => {
    const simple = '1/2+3/4';
    const laTex = '\\frac{1}{2}+\\frac{3}{4}';
    const solutionString = '5/4';
    const solutionSplit = [5, 4];
    const operands = ['1/2', '3/4'];
    const operandsSplit = [
      [1, 2],
      [3, 4],
    ];

    const givenExpression = new FractionProblem(
      simple,
      laTex,
      solutionString,
      solutionSplit,
      operands,
      operandsSplit,
      false
    );

    const addGiven = buildFracSimpleString(
      [solutionSplit, [1, 2]],
      [simple, '1/2'],
      'addition',
      givenExpression
    );
    const subtractGiven = buildFracSimpleString(
      [solutionSplit, [-1, 2]],
      [simple, '-1/2'],
      'subtraction',
      givenExpression
    );
    const divGiven = buildFracSimpleString(
      [solutionSplit, [1, 2]],
      [simple, '1/2'],
      'division',
      givenExpression
    );

    expect(addGiven).toEqual(`(${simple})+1/2`);
    expect(subtractGiven).toEqual(`(${simple})-(-1/2)`);
    expect(divGiven).toEqual(`(${simple})/(1/2)`);
  });
});

describe('fraction add/sub solver', () => {
  it('should work with simple operands', () => {
    const operands = [
      [1, 2],
      [3, 4],
    ];
    const sum = solveFractionAddOrSub(operands[0], operands[1], 'addition');
    const diff = solveFractionAddOrSub(operands[0], operands[1], 'subtraction');

    expect(sum).toEqual([5, 4]);
    expect(diff).toEqual([-1, 4]);
  });

  it('should work with whole numbers', () => {
    const operands = [[2], [3, 4]];
    const sum = solveFractionAddOrSub(operands[0], operands[1], 'addition');
    const diff = solveFractionAddOrSub(operands[0], operands[1], 'subtraction');

    expect(sum).toEqual([11, 4]);
    expect(diff).toEqual([5, 4]);
  });

  it('should work with negative numbers', () => {
    const operands = [[2], [-3, 4]];
    const sum = solveFractionAddOrSub(operands[0], operands[1], 'addition');
    const diff = solveFractionAddOrSub(operands[0], operands[1], 'subtraction');

    expect(sum).toEqual([5, 4]);
    expect(diff).toEqual([11, 4]);
  });
});

describe('fraction mult/div solvers', () => {
  it('should work with simple operands', () => {
    const operands = [
      [1, 2],
      [3, 4],
    ];
    const product = solveFractionMult(operands[0], operands[1]);
    const quotient = solveFractionDiv(operands[0], operands[1]);

    expect(product).toEqual([3, 8]);
    expect(quotient).toEqual([2, 3]);
  });

  it('should work with whole numbers', () => {
    const operands = [[2], [3, 4]];
    const product = solveFractionMult(operands[0], operands[1]);
    const quotient = solveFractionDiv(operands[0], operands[1]);

    expect(product).toEqual([3, 2]);
    expect(quotient).toEqual([8, 3]);
  });

  it('should work with negative numbers', () => {
    const operands = [[2], [-3, 4]];
    const product = solveFractionMult(operands[0], operands[1]);
    const quotient = solveFractionDiv(operands[0], operands[1]);

    expect(product).toEqual([-3, 2]);
    expect(quotient).toEqual([-8, 3]);
  });
});

describe('build fraction problems', () => {
  it('should work with simple operands', () => {
    const operands = [
      [1, 2],
      [3, 4],
    ];
    const additionProblem = buildFracProblem(operands, 'addition', false);
    const divisionProblem = buildFracProblem(operands, 'division', false);

    const expectedAddProblem = new FractionProblem(
      '1/2+3/4',
      '\\frac{1}{2}+\\frac{3}{4}',
      '5/4',
      [5, 4],
      ['1/2', '3/4'],
      operands,
      false
    );
    const expectedDivProblem = new FractionProblem(
      '(1/2)/(3/4)',
      '\\left(\\frac{1}{2}\\right)\\div\\left(\\frac{3}{4}\\right)',
      '2/3',
      [2, 3],
      ['1/2', '3/4'],
      operands,
      false
    );

    expect(additionProblem).toEqual(expectedAddProblem);
    expect(divisionProblem).toEqual(expectedDivProblem);
  });

  it('should work with negative operands', () => {
    const operands = [
      [1, 2],
      [3, -4],
    ];
    const subtractionProblem = buildFracProblem(operands, 'subtraction', false);
    const divisionProblem = buildFracProblem(operands, 'division', false);

    const expectedSubProblem = new FractionProblem(
      '1/2-(3/-4)',
      '\\frac{1}{2}-\\left(\\frac{3}{-4}\\right)',
      '5/4',
      [5, 4],
      ['1/2', '3/-4'],
      operands,
      false
    );
    const expectedDivProblem = new FractionProblem(
      '(1/2)/(3/-4)',
      '\\left(\\frac{1}{2}\\right)\\div\\left(\\frac{3}{-4}\\right)',
      '-2/3',
      [-2, 3],
      ['1/2', '3/-4'],
      operands,
      false
    );

    expect(subtractionProblem).toEqual(expectedSubProblem);
    expect(divisionProblem).toEqual(expectedDivProblem);
  });

  it('should work with mixed numbers', () => {
    const operands = [
      [3, 2],
      [5, 4],
    ];

    const additionProblem = buildFracProblem(operands, 'addition', true);
    const multiplicationProblem = buildFracProblem(
      operands,
      'multiplication',
      true
    );
    const divisionProblem = buildFracProblem(operands, 'division', true);

    const expectedAddProblem = new FractionProblem(
      '1 1/2+1 1/4',
      '1 \\frac{1}{2}+1 \\frac{1}{4}',
      '2 3/4',
      [11, 4],
      ['1 1/2', '1 1/4'],
      operands,
      true
    );
    const expectedMultProblem = new FractionProblem(
      '1 1/2*1 1/4',
      '1 \\frac{1}{2}\\cdot1 \\frac{1}{4}',
      '1 7/8',
      [15, 8],
      ['1 1/2', '1 1/4'],
      operands,
      true
    );
    const expectedDivProblem = new FractionProblem(
      '(1 1/2)/(1 1/4)',
      '\\left(1 \\frac{1}{2}\\right)\\div\\left(1 \\frac{1}{4}\\right)',
      '1 1/5',
      [6, 5],
      ['1 1/2', '1 1/4'],
      operands,
      true
    );

    expect(additionProblem).toEqual(expectedAddProblem);
    expect(multiplicationProblem).toEqual(expectedMultProblem);
    expect(divisionProblem).toEqual(expectedDivProblem);
  });

  it('should work with a given expression', () => {
    const givenExpression = buildFracProblem(
      [
        [1, 2],
        [3, 4],
      ],
      'addition',
      false
    );

    const operands = [
      [5, 4],
      [3, 2],
    ];

    const subtractionProblem = buildFracProblem(
      operands,
      'subtraction',
      false,
      givenExpression
    );
    const multiplicationProblem = buildFracProblem(
      operands,
      'multiplication',
      false,
      givenExpression
    );
    const divisionProblem = buildFracProblem(
      operands,
      'division',
      false,
      givenExpression
    );

    const expectedSubProblem = new FractionProblem(
      `(${givenExpression.simple})-3/2`,
      `\\left(${givenExpression.laTex}\\right)-\\frac{3}{2}`,
      '-1/4',
      [-1, 4],
      [givenExpression.simple, '3/2'],
      operands,
      false
    );
    const expectedMultProblem = new FractionProblem(
      `(${givenExpression.simple})*3/2`,
      `\\left(${givenExpression.laTex}\\right)\\cdot\\frac{3}{2}`,
      '15/8',
      [15, 8],
      [givenExpression.simple, '3/2'],
      operands,
      false
    );
    const expectedDivProblem = new FractionProblem(
      `(${givenExpression.simple})/(3/2)`,
      `\\left(${givenExpression.laTex}\\right)\\div\\left(\\frac{3}{2}\\right)`,
      '5/6',
      [5, 6],
      [givenExpression.simple, '3/2'],
      operands,
      false
    );

    expect(subtractionProblem).toEqual(expectedSubProblem);
    expect(multiplicationProblem).toEqual(expectedMultProblem);
    expect(divisionProblem).toEqual(expectedDivProblem);
  });
});
