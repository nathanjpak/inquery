import {
  genMultiplicationProblem,
  genDivisionProblem,
  genAdditionProblem,
  genSubtractionProblem,
} from '../../functions/problemFuncs';

describe('genAdd function', () => {
  it('should return a proper equation', () => {
    const result = genAdditionProblem(0, 20);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('+')).toEqual(
      result.simple.length - result.operands[1].length - 1
    );
    expect(
      Number.parseInt(result.operands[0]) + Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return an equation with parentheses if the second operand is negative', () => {
    const result = genAdditionProblem(-20, -1);

    expect(result.simple[0]).toEqual('-');
    expect(result.simple[result.simple.length - 1]).toEqual(')');
  });

  it('should return a proper equation with a given expression', () => {
    const givenExpression = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: ['4', '12'],
    };

    const result = genAdditionProblem(-99, 99, givenExpression);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)+');
    expect(8 + Number.parseInt(result.operands[1])).toEqual(result.solution);
  });
});

describe('genSub function', () => {
  it('should return a proper equation', () => {
    const result = genSubtractionProblem(0, 20, false);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('-')).toEqual(
      result.simple.length - result.operands[1].length - 1
    );
    expect(
      Number.parseInt(result.operands[0]) - Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return a proper equation with a nonNegativeOnly solution', () => {
    const result = genSubtractionProblem(0, 20, true);

    expect(result.solution).toBeGreaterThanOrEqual(0);
    expect(
      Number.parseInt(result.operands[0]) - Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return an equation with parentheses if the second operand is negative', () => {
    const result = genSubtractionProblem(-20, -1, false);

    expect(result.simple[result.simple.length - 1]).toEqual(')');
    expect(
      Number.parseInt(result.operands[0]) - Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return a proper equation with a given expression', () => {
    const givenExpression = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: ['4', '12'],
    };

    let result = genSubtractionProblem(-20, 20, false, givenExpression);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)-');
    expect(8 - Number.parseInt(result.operands[1])).toEqual(result.solution);
  });
});

describe('genMult function', () => {
  it('should return a proper equation', () => {
    const result = genMultiplicationProblem(1, 9);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('*')).toEqual(1);
    expect(
      Number.parseInt(result.operands[0]) * Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return a proper equation with three digits', () => {
    const result = genMultiplicationProblem(100, 999);

    expect(result.simple.indexOf('*')).toEqual(3);
    expect(
      Number.parseInt(result.operands[0]) * Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return a proper equation with a given expression', () => {
    const givenExpression = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: ['4', '12'],
    };

    const result = genMultiplicationProblem(1, 99, givenExpression);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)*');
    expect(
      Number.parseInt(result.operands[1]) * givenExpression.solution
    ).toEqual(result.solution);
  });
});

describe('genDiv function', () => {
  it('should return a proper equation', () => {
    const result = genDivisionProblem(1, 9, true);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('/')).toEqual(result.simple.length - 2);
    expect(
      Number.parseInt(result.operands[0]) / Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return a proper equation with two digits', () => {
    const result = genDivisionProblem(10, 99, true);

    expect(result.simple.indexOf('/')).toEqual(result.simple.length - 3);
    expect(
      Number.parseInt(result.operands[0]) / Number.parseInt(result.operands[1])
    ).toEqual(result.solution);
  });

  it('should return a proper equation with a given dividend expression', () => {
    const dividend = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: ['4', '12'],
    };

    const result = genDivisionProblem(1, 10, true, dividend);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)/');
    expect(result.solution).toBeLessThanOrEqual(8);
    expect(Number.parseInt(result.operands[1])).toBeLessThanOrEqual(8);
    expect(8 / Number.parseInt(result.operands[1])).toEqual(result.solution);
  });
});
