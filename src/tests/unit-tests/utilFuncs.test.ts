import {convertStringToLatex, getRandomFactor} from '../../functions/utilFuncs';

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

    expect(resultA).toEqual('\\frac{1}{2}+\\frac{3}{4}');
    expect(resultB).toEqual('\\frac{1+2}{3}+\\frac{4}{5+6}');
  });

  it('should handle nested parentheses and fractions', () => {
    const resultA = convertStringToLatex('(1+(2+3))/((4+5)+6)');
    const resultB = convertStringToLatex('2/((1/2)+3)');

    expect(resultA).toEqual(
      '\\frac{1+\\left(2+3\\right)}{\\left(4+5\\right)+6}'
    );
    expect(resultB).toEqual('\\frac{2}{\\left(\\frac{1}{2}\\right)+3}');
  });
});
