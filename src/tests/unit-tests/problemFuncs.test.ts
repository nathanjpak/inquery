import {genDiv} from '../../functions/problemFuncs';

describe('genDiv function', () => {
  it('should return a proper equation', () => {
    const result = genDiv(1, 9, true);

    expect(typeof result.simple).toBe('string');
    expect(result.simple.indexOf('/')).toEqual(result.simple.length - 2);
    expect(result.operands[1] / result.operands[0]).toEqual(result.solution);
  });

  it('should return a proper equation with two digits', () => {
    const result = genDiv(10, 99, true);

    expect(result.simple.indexOf('/')).toEqual(result.simple.length - 3);
    expect(result.operands[1] / result.operands[0]).toEqual(result.solution);
  });
});
