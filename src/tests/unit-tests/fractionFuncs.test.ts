import {genFractionAddition} from '../../functions/fractionsFuncs';

describe('gen Frac Addition', () => {
  // TODO: Check given expression functionality
  it('should return a simple example', () => {
    const sameDenom = genFractionAddition(
      [
        [1, 4],
        [2, 4],
      ],
      false
    );
    const wholeNumberSolution = genFractionAddition(
      [
        [1, 4],
        [3, 4],
      ],
      false
    );
    const wholeNumberOperand = genFractionAddition([[2], [1, 2]], false);

    expect(sameDenom.solutionSplit).toEqual([3, 4]);
    expect(wholeNumberSolution.solutionSplit).toEqual([1]);
    expect(wholeNumberOperand.solutionSplit).toEqual([5, 2]);

    expect(sameDenom.simple).toEqual('1/4+2/4');
    expect(sameDenom.laTex).toEqual('\\frac{1}{4}+\\frac{2}{4}');
    expect(wholeNumberOperand.simple).toEqual('2+1/2');
    expect(wholeNumberOperand.laTex).toEqual('2+\\frac{1}{2}');
  });

  it('should work with mixed numbers', () => {
    const first = genFractionAddition(
      [
        [4, 3],
        [1, 3],
      ],
      true
    );
    const both = genFractionAddition(
      [
        [3, 2],
        [7, 2],
      ],
      true
    );

    expect(first.solutionSplit).toEqual([5, 3]);
    expect(first.solutionString).toEqual('1 2/3');
    expect(first.simple).toEqual('1 1/3+1/3');
    expect(first.laTex).toEqual('1 \\frac{1}{3}+\\frac{1}{3}');

    expect(both.solutionSplit).toEqual([5]);
    expect(both.simple).toEqual('1 1/2+3 1/2');
    expect(both.laTex).toEqual('1 \\frac{1}{2}+3 \\frac{1}{2}');
  });
});
