import {
  genMultiplicationProblem,
  genDivisionProblem,
  genAdditionProblem,
  genSubtractionProblem,
  genArithmeticProblem,
} from '../../functions/arithmeticFuncs';

describe('genAdd function', () => {
  it('should return a proper equation', () => {
    const result = genAdditionProblem(0, 20);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('+')).toEqual(
      result.simple.length - result.operands[1].toString().length - 1
    );
    expect(result.operands[0] + result.operands[1]).toEqual(result.solution);
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
      operands: [12, 4],
    };

    const result = genAdditionProblem(-99, 99, givenExpression);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)+');
    expect(8 + result.operands[2]).toEqual(result.solution);
    expect(result.operands.length).toEqual(3);
    expect(result.operands[0] === 12);
  });
});

describe('genSub function', () => {
  it('should return a proper equation', () => {
    const result = genSubtractionProblem(0, 20, false);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('-')).toEqual(
      result.simple.length - result.operands[1].toString().length - 1
    );
    expect(result.operands[0] - result.operands[1]).toEqual(result.solution);
  });

  it('should return a proper equation with a nonNegativeOnly solution', () => {
    const result = genSubtractionProblem(0, 20, true);

    expect(result.solution).toBeGreaterThanOrEqual(0);
    expect(result.operands[0] - result.operands[1]).toEqual(result.solution);
  });

  it('should return an equation with parentheses if the second operand is negative', () => {
    const result = genSubtractionProblem(-20, -1, false);

    expect(result.simple[result.simple.length - 1]).toEqual(')');
    expect(result.operands[0] - result.operands[1]).toEqual(result.solution);
  });

  it('should return a proper equation with a given expression', () => {
    const givenExpression = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: [12, 4],
    };

    let result = genSubtractionProblem(-20, 20, false, givenExpression);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)-');
    expect(8 - result.operands[2]).toEqual(result.solution);
    expect(result.operands.length).toEqual(3);
    expect(result.operands[0] === 12);
  });
});

describe('genMult function', () => {
  it('should return a proper equation', () => {
    const result = genMultiplicationProblem(1, 9);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('*')).toEqual(1);
    expect(result.operands[0] * result.operands[1]).toEqual(result.solution);
  });

  it('should return a proper equation with three digits', () => {
    const result = genMultiplicationProblem(100, 999);

    expect(result.simple.indexOf('*')).toEqual(3);
    expect(result.operands[0] * result.operands[1]).toEqual(result.solution);
  });

  it('should return a proper equation with a given expression', () => {
    const givenExpression = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: [12, 4],
    };

    const result = genMultiplicationProblem(1, 99, givenExpression);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)*');
    expect(result.operands[2] * givenExpression.solution).toEqual(
      result.solution
    );
    expect(result.operands.length).toEqual(3);
    expect(result.operands[0] === 12);
  });
});

describe('genDiv function', () => {
  it('should return a proper equation', () => {
    const result = genDivisionProblem(1, 9, true);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('/')).toEqual(result.simple.length - 2);
    expect(result.operands[0] / result.operands[1]).toEqual(result.solution);
  });

  it('should return a proper equation with two digits', () => {
    const result = genDivisionProblem(10, 99, true);

    expect(result.simple.indexOf('/')).toEqual(result.simple.length - 3);
    expect(result.operands[0] / result.operands[1]).toEqual(result.solution);
  });

  it('should return a proper equation with a given dividend expression', () => {
    const dividend = {
      simple: '12-4',
      laTex: '',
      solution: 8,
      operands: [12, 4],
    };

    const result = genDivisionProblem(1, 10, true, dividend);

    expect(result.simple.substring(0, 7)).toEqual('(12-4)/');
    expect(result.solution).toBeLessThanOrEqual(8);
    expect(result.operands[2]).toBeLessThanOrEqual(8);
    expect(8 / result.operands[2]).toEqual(result.solution);
    expect(result.operands.length).toEqual(3);
    expect(result.operands[0] === 12);
  });
});

describe('genArithProblems function', () => {
  it('should return a proper equation with positiveOnly operands', () => {
    const resultA = genArithmeticProblem({
      operands: {
        positiveOnly: true,
        decimalPlaces: 0,
      },
    });
    const resultB = genArithmeticProblem({
      min: 1,
      max: 30,
      operands: {
        positiveOnly: true,
        decimalPlaces: 0,
      },
    });

    const regex = /\/|-|\*|\+/g;

    expect(resultA.simple.match(regex)).toHaveProperty('length', 1);
    expect(resultB.simple.match(regex)).toHaveProperty('length', 1);
  });

  it('should recursively return a proper equation when number of steps > 1', () => {
    const result = genArithmeticProblem({
      operands: {
        positiveOnly: true,
        decimalPlaces: 0,
      },
      steps: 5,
    });

    const regex = /\/|-|\*|\+/g;

    expect(result.simple.match(regex)).toHaveProperty('length', 5);
    expect(result.operands.length).toEqual(6);
  });

  it('should return an equation with only addition', () => {
    const result = genArithmeticProblem({
      operands: {
        positiveOnly: false,
        decimalPlaces: 0,
      },
      steps: 4,
      operations: ['addition'],
    });

    const regex = /\+/g;

    expect(result.simple.match(regex)).toHaveProperty('length', 4);
    expect(result.operands.length).toEqual(5);
  });

  it('should return a proper equation with rational numbers in decimal form', () => {
    const result = genArithmeticProblem({
      operands: {
        positiveOnly: false,
        decimalPlaces: 3,
      },
      steps: 3,
      operations: ['addition', 'subtraction', 'multiplication'],
    });

    expect(result.operands[0].toString().split('.')[1]).toHaveProperty(
      'length',
      3
    );
    expect(result.solution.toString().split('.')[1]).toHaveProperty(
      'length',
      3
    );
  });
});
