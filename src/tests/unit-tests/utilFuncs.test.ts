import {
  convertStringToLatex,
  getRandomFactor,
  randomFloatFromInterval,
  simplifyFraction,
} from '../../functions/utilFuncs';

describe('getRandomFactor', () => {
  it('should return a proper factor of a number', () => {
    const resultA = getRandomFactor(300);
    const resultB = getRandomFactor(200);
    const resultC = getRandomFactor(9);
    const resultD = getRandomFactor(0);

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);
    expect(resultD).toEqual(1);
  });

  it('should return a proper factor given a max', () => {
    const resultA = getRandomFactor(300, {max: 30});
    const resultB = getRandomFactor(200, {max: 20});
    const resultC = getRandomFactor(9, {max: 1});
    const resultD = getRandomFactor(0, {max: 5});

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);
    expect(0 % resultD).toEqual(0);

    expect(resultA).toBeLessThanOrEqual(30);
    expect(resultB).toBeLessThanOrEqual(20);
    expect(resultC).toEqual(1);
    expect(1 <= resultD && resultD <= 5).toBeTruthy;
  });

  it('should return a proper factor given a min', () => {
    const resultA = getRandomFactor(300, {min: 30});
    const resultB = getRandomFactor(200, {min: 20});
    const resultC = getRandomFactor(9, {min: 9});
    const resultD = getRandomFactor(0, {min: -5});
    const resultE = getRandomFactor(0, {min: -1, max: 1});

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);

    expect(resultA).toBeGreaterThanOrEqual(30);
    expect(resultB).toBeGreaterThanOrEqual(20);
    expect(resultC).toEqual(9);
    expect(resultD >= -5 && resultD <= -1).toBeTruthy;
    expect(resultE === 1 || resultE === -1).toBeTruthy;
  });

  // it('should return a proper factor when allowing negatives', () => {
  //   const resultA = getRandomFactor(300, {negativesAllowed: true});
  //   const resultB = getRandomFactor(200, {max: 0, negativesAllowed: true});
  //   const resultC = getRandomFactor(9, {
  //     min: -3,
  //     max: -3,
  //     negativesAllowed: true,
  //   });
  //   const resultD = getRandomFactor(100, {min: 0, negativesAllowed: true});
  //   const resultE = getRandomFactor(30, {max: -30, negativesAllowed: true});
  //   const resultF = getRandomFactor(-10, {negativesAllowed: true});

  //   expect(300 % resultA).toEqual(0);
  //   expect(200 % resultB).toEqual(0);
  //   expect(9 % resultC).toEqual(0);
  //   expect(100 % resultD).toEqual(0);
  //   expect(30 % resultE).toEqual(0);
  //   expect(-10 % resultF).toEqual(0);

  //   expect(resultB).toBeLessThan(0);
  //   expect(resultC).toEqual(-3);
  //   expect(resultD).toBeGreaterThan(0);
  //   expect(resultE).toEqual(-30);
  // });
});

describe('convertStringToLatex', () => {
  it('should convert a basic expression', () => {
    const result = convertStringToLatex('3*12/4', false);

    expect(result).toEqual('3\\cdot12\\div4');
  });

  it('should convert an expression with parentheses', () => {
    const result = convertStringToLatex('(2+3)/5', false);

    expect(result).toEqual('\\left(2+3\\right)\\div5');
  });

  it('should convert an expression with fractions', () => {
    const resultA = convertStringToLatex('1/2+3/4');
    const resultB = convertStringToLatex('(1+2)/3+4/(5+6)');
    const resultC = convertStringToLatex('12/26');
    const resultD = convertStringToLatex('100/900000+1/2');

    expect(resultA).toEqual('\\frac{1}{2}+\\frac{3}{4}');
    expect(resultB).toEqual('\\frac{1+2}{3}+\\frac{4}{5+6}');
    expect(resultC).toEqual('\\frac{12}{26}');
    expect(resultD).toEqual('\\frac{100}{900000}+\\frac{1}{2}');
  });

  it('should handle nested parentheses and fractions', () => {
    const resultA = convertStringToLatex('(1+(2+3))/((4+5)+6)');
    const resultB = convertStringToLatex('2/((1/2)+3)');

    expect(resultA).toEqual(
      '\\frac{1+\\left(2+3\\right)}{\\left(4+5\\right)+6}'
    );
    expect(resultB).toEqual('\\frac{2}{\\left(\\frac{1}{2}\\right)+3}');
  });

  it('should handle square roots', () => {
    const resultA = convertStringToLatex('1+sqrt(2)');
    const resultB = convertStringToLatex('sqrt(1+(x+3))');
    const resultC = convertStringToLatex('sqrt(2/3)');

    expect(resultA).toEqual('1+\\sqrt{2}');
    expect(resultB).toEqual('\\sqrt{1+\\left(x+3\\right)}');
    expect(resultC).toEqual('\\sqrt{\\frac{2}{3}}');
  });
});

describe('randomFloatFromInt', () => {
  it('should get an integer', () => {
    const integer = randomFloatFromInterval(-10, 10, 0, false);
    expect(integer).toBeGreaterThanOrEqual(-10);
    expect(integer).toBeLessThanOrEqual(10);
    expect(integer.toString().match(/\./)).toBe(null);
  });

  it('should get a float with 3 decimal places', () => {
    const three = randomFloatFromInterval(-10, 10, 3, false);

    expect(three.toString().split('.')[1]).toHaveProperty('length', 3);
  });

  it('should get a negative number', () => {
    const negative = randomFloatFromInterval(-10, -1, 3, false);

    expect(negative).toBeLessThan(-1);
    expect(negative.toString().split('.')[1]).toHaveProperty('length', 3);
  });

  it('should be nonzero', () => {
    const nonzero = randomFloatFromInterval(-1, 1, 0, true);

    expect(nonzero === 1 || nonzero === -1);
  });
});

describe('simplifyFraction', () => {
  it('should simplify fractions with integer components', () => {
    const one = simplifyFraction('11/11'),
      simpleExample = simplifyFraction('3/27'),
      wholeNumber = simplifyFraction('100/25'),
      negDenominator = simplifyFraction('30/-50'),
      bothNegative = simplifyFraction('-9/-5');

    expect(one).toEqual('1');
    expect(simpleExample).toEqual('1/9');
    expect(wholeNumber).toEqual('4');
    expect(negDenominator).toEqual('-3/5');
    expect(bothNegative).toEqual('9/5');
  });
});
