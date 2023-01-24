import {getRandomFactor} from '../../functions/utilFuncs';

describe('getRandomFactor', () => {
  it('should return a proper factor of a number', () => {
    const resultA = getRandomFactor(300);
    const resultB = getRandomFactor(200);
    const resultC = getRandomFactor(9);

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);
  });

  it('should return a proper factor given a max', () => {
    const resultA = getRandomFactor(300, {max: 30});
    const resultB = getRandomFactor(200, {max: 20});
    const resultC = getRandomFactor(9, {max: 1});

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);

    expect(resultA).toBeLessThanOrEqual(30);
    expect(resultB).toBeLessThanOrEqual(20);
    expect(resultC).toEqual(1);
  });

  it('should return a proper factor given a min', () => {
    const resultA = getRandomFactor(300, {min: 30});
    const resultB = getRandomFactor(200, {min: 20});
    const resultC = getRandomFactor(9, {min: 9});

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);

    expect(resultA).toBeGreaterThanOrEqual(30);
    expect(resultB).toBeGreaterThanOrEqual(20);
    expect(resultC).toEqual(9);
  });

  it('should return a proper factor when allowing negatives', () => {
    const resultA = getRandomFactor(300, {negativesAllowed: true});
    const resultB = getRandomFactor(200, {max: 0, negativesAllowed: true});
    const resultC = getRandomFactor(9, {
      min: -3,
      max: -3,
      negativesAllowed: true,
    });

    expect(300 % resultA).toEqual(0);
    expect(200 % resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);

    expect(resultB).toBeLessThan(0);
    expect(resultC).toEqual(-3);
  });
});
