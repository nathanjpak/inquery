import {getRandomFactor} from '../../functions/utilFuncs';

describe('getRandomFactor', () => {
  it('should return a proper factor of a number', () => {
    const resultA = getRandomFactor(300);
    const resultB = getRandomFactor(200);
    const resultC = getRandomFactor(9);

    expect(300 % resultA).toEqual(0);
    expect(200 & resultB).toEqual(0);
    expect(9 % resultC).toEqual(0);
  });
});
