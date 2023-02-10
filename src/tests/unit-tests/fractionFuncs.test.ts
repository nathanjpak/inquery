import {
  genFractionAddition,
  genFractionMultiplication,
  genFractionSubtraction,
} from '../../functions/fractionsFuncs';

describe('gen Frac Addition', () => {
  // TODO: Check functionality with a given expression
  // TODO: Check functionality with negative operands and solution
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

    expect(sameDenom.solutionString).toEqual('3/4');
    expect(wholeNumberSolution.solutionString).toEqual('1');
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

describe('gen Frac Subtraction', () => {
  it('should return a simple example', () => {
    const sameDenom = genFractionSubtraction(
      [
        [2, 4],
        [1, 4],
      ],
      false
    );
    const wholeNumberSolution = genFractionSubtraction(
      [
        [5, 4],
        [1, 4],
      ],
      false
    );
    const wholeNumberOperand = genFractionSubtraction([[2], [1, 2]], false);

    expect(sameDenom.solutionSplit).toEqual([1, 4]);
    expect(wholeNumberSolution.solutionSplit).toEqual([1]);
    expect(wholeNumberOperand.solutionSplit).toEqual([1, 2]);

    expect(sameDenom.simple).toEqual('2/4-1/4');
    expect(sameDenom.laTex).toEqual('\\frac{2}{4}-\\frac{1}{4}');
    expect(wholeNumberOperand.simple).toEqual('2-1/2');
    expect(wholeNumberOperand.laTex).toEqual('2-\\frac{1}{2}');

    expect(sameDenom.solutionString).toEqual('1/4');
    expect(wholeNumberSolution.solutionString).toEqual('1');
  });

  it('should work with mixed numbers', () => {
    const first = genFractionSubtraction(
      [
        [5, 3],
        [1, 3],
      ],
      true
    );
    const both = genFractionSubtraction(
      [
        [7, 2],
        [3, 2],
      ],
      true
    );

    expect(first.solutionSplit).toEqual([4, 3]);
    expect(first.solutionString).toEqual('1 1/3');
    expect(first.simple).toEqual('1 2/3-1/3');
    expect(first.laTex).toEqual('1 \\frac{2}{3}-\\frac{1}{3}');

    expect(both.solutionSplit).toEqual([2]);
    expect(both.simple).toEqual('3 1/2-1 1/2');
    expect(both.laTex).toEqual('3 \\frac{1}{2}-1 \\frac{1}{2}');
  });
});

describe('gen Fraction Multiplication', () => {
  it('should work with simple examples', () => {
    const simple = genFractionMultiplication([
      [1, 2],
      [1, 3],
    ]);
    const wholeNumberSolution = genFractionMultiplication([
      [2, 3],
      [3, 2],
    ]);
    const wholeNumberOperand = genFractionMultiplication([[2], [3, 4]]);

    expect(simple.solutionSplit).toEqual([1, 6]);
    expect(wholeNumberSolution.solutionSplit).toEqual([1]);
    expect(wholeNumberOperand.solutionSplit).toEqual([3, 2]);

    expect(simple.simple).toEqual('1/2*1/3');
    expect(simple.laTex).toEqual('\\frac{1}{2}\\cdot\\frac{1}{3}');
    expect(wholeNumberOperand.simple).toEqual('2*3/4');
    expect(wholeNumberOperand.laTex).toEqual('2\\cdot\\frac{3}{4}');

    expect(simple.solutionString).toEqual('1/6');
    expect(wholeNumberSolution.solutionString).toEqual('1');
  });

  it('should work with mixed numbers', () => {
    const first = genFractionMultiplication(
      [
        [3, 2],
        [1, 2],
      ],
      true
    );
    const both = genFractionMultiplication(
      [
        [5, 4],
        [11, 2],
      ],
      true
    );

    expect(first.solutionSplit).toEqual([3, 4]);
    expect(first.simple).toEqual('1 1/2*1/2');
    expect(first.laTex).toEqual('1 \\frac{1}{2}\\cdot\\frac{1}{2}');

    expect(both.solutionSplit).toEqual([55, 8]);
    expect(both.solutionString).toEqual('6 7/8');
    expect(both.simple).toEqual('1 1/4*5 1/2');
    expect(both.laTex).toEqual('1 \\frac{1}{4}\\cdot5 \\frac{1}{2}');
  });
});

// TODO: test division
