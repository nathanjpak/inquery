/* We should never get 0 as a return value */
// TODO: enable negatives
export const getRandomFactor = (
  num: number,
  options?: {
    min?: number;
    max?: number;
    negativesAllowed?: boolean;
  }
): number => {
  // first handle the case when num = 0
  if (num === 0) {
    let min = options?.min ? options.min : 1;
    // if the minimum is negative, then the max should be negative to avoid getting 0
    let max = options?.max ? options.max : min > 0 ? 1 : -1;

    return randomIntFromInterval(min, max, true);
  }

  const min = options?.min ? options.min : 1;
  let max = options?.max
    ? Math.min(options.max, Math.sqrt(num))
    : Math.sqrt(num);

  if (min > max) max = num;

  const isEven: boolean = num % 2 === 0;
  const increment = isEven ? 1 : 2;
  const factors: number[] = [];

  for (
    let currentFactor = min;
    currentFactor <= max;
    currentFactor += increment
  ) {
    if (num % currentFactor !== 0) continue;

    factors.push(currentFactor);

    let complement = num / currentFactor;
    if (
      complement !== currentFactor &&
      (!options?.max || complement <= options.max) &&
      (!options?.min || complement >= options.min)
    ) {
      factors.push(complement);
    }
  }

  // if (!options || !options.max || options.max >= num) factors.push(num);
  // if (options?.negativesAllowed) factors.push(-num);

  return factors[~~(Math.random() * factors.length)];
};

export const randomIntFromInterval = (
  min: number,
  max: number,
  nonZero = false
): number => {
  if (nonZero && min < 0 && max > 0) {
    // configure weighted probability
    const totalValues = min + max - 1;
    const positiveProbability = max / totalValues;

    const positiveOrNegative = Math.random();

    if (positiveOrNegative < positiveProbability) {
      return Math.floor(Math.random() * max) + 1;
    } else {
      return Math.floor(Math.random() * (min - 1));
    }
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// DEBUG: min and max don't work as expected, esp with negatives
export const randomFloatFromInterval = (
  min: number,
  max: number,
  decimalPlaces = 2,
  nonZero = false
): number => {
  const multiplier = Math.pow(10, decimalPlaces);

  if (nonZero && min < 0 && max > 0) {
    // configure weighted probability
    const totalValues = min + max - 1;
    const positiveProbability = max / totalValues;

    const positiveOrNegative = Math.random();

    if (positiveOrNegative < positiveProbability) {
      return Math.floor((Math.random() * max + 1) * multiplier) / multiplier;
    } else {
      return Math.floor((Math.random() * min - 1) * multiplier) / multiplier;
    }
  }

  return (
    Math.floor((Math.random() * (max - min + 1) + min) * multiplier) /
    multiplier
  );
};

// TODO: implement square roots
export const convertStringToLatex = (
  expression: string,
  preferFractions = true
): string => {
  const keyMap: {[key: string]: string} = {
    '*': '\\cdot',
    '/': '\\div',
    '(': '\\left(',
    ')': '\\right)',
  };

  if (preferFractions) {
    delete keyMap['/'];
  }

  const newStringCharacters: string[] = [];
  const fractionsToConvertIndices: number[] = [];
  const radicalsToConvertIndices: number[] = [];

  for (let index = 0; index < expression.length; index++) {
    if (keyMap[expression[index]] !== undefined) {
      newStringCharacters.push(keyMap[expression[index]]);
      continue;
    } else if (expression[index] === '/') {
      fractionsToConvertIndices.push(newStringCharacters.length);
      continue;
    } else if (expression[index] === 's') {
      if (expression.slice(index, index + 4) === 'sqrt') {
        radicalsToConvertIndices.push(newStringCharacters.length);
        index += 3;
        continue;
      }
    }

    newStringCharacters.push(expression[index]);
  }

  // CANNOT change number of indices or length of newStringCharacters
  while (fractionsToConvertIndices.length > 0) {
    // check left
    if (newStringCharacters[fractionsToConvertIndices[0] - 1] === '\\right)') {
      newStringCharacters[fractionsToConvertIndices[0] - 1] = '}';

      const unclosedParenthesesStack = [')'];
      let currentIndex = fractionsToConvertIndices[0] - 2;

      while (unclosedParenthesesStack.length > 0 && currentIndex > 0) {
        switch (newStringCharacters[currentIndex]) {
          case '\\left(':
            unclosedParenthesesStack.pop();
            if (unclosedParenthesesStack.length > 0) currentIndex--;
            break;
          case '\\right)':
            unclosedParenthesesStack.push(')');
            currentIndex--;
            break;
          default:
            currentIndex--;
        }
      }

      newStringCharacters[currentIndex] = '\\frac{';
    } else {
      let prevIndex = fractionsToConvertIndices[0] - 2;

      while (prevIndex >= 0 && newStringCharacters[prevIndex].match(/[0-9]/)) {
        prevIndex--;
      }

      newStringCharacters[fractionsToConvertIndices[0] - 1] = `${
        newStringCharacters[fractionsToConvertIndices[0] - 1]
      }}`;

      newStringCharacters[prevIndex + 1] = `\\frac{${
        newStringCharacters[prevIndex + 1]
      }`;
    }

    // check right
    if (newStringCharacters[fractionsToConvertIndices[0]] === '\\left(') {
      newStringCharacters[fractionsToConvertIndices[0]] = '{';

      const unclosedParenthesesStack = ['('];
      let currentIndex = fractionsToConvertIndices[0] + 1;

      while (
        unclosedParenthesesStack.length > 0 &&
        currentIndex < newStringCharacters.length - 1
      ) {
        switch (newStringCharacters[currentIndex]) {
          case '\\right)':
            unclosedParenthesesStack.pop();
            if (unclosedParenthesesStack.length > 0) currentIndex++;
            break;
          case '\\left(':
            unclosedParenthesesStack.push('(');
            currentIndex++;
            break;
          default:
            currentIndex++;
        }
      }

      newStringCharacters[currentIndex] = '}';
    } else {
      let nextIndex = fractionsToConvertIndices[0] + 1;

      while (
        nextIndex < newStringCharacters.length &&
        newStringCharacters[nextIndex].match(/[0-9]/)
      ) {
        nextIndex++;
      }

      newStringCharacters[fractionsToConvertIndices[0]] = `{${
        newStringCharacters[fractionsToConvertIndices[0]]
      }`;

      newStringCharacters[nextIndex - 1] = `${
        newStringCharacters[nextIndex - 1]
      }}`;
    }

    fractionsToConvertIndices.shift();
  }

  while (radicalsToConvertIndices.length > 0) {
    newStringCharacters[radicalsToConvertIndices[0]] = '\\sqrt{';

    const unclosedParenthesesStack = ['('];
    let currentIndex = radicalsToConvertIndices[0] + 1;

    while (
      unclosedParenthesesStack.length > 0 &&
      currentIndex < newStringCharacters.length - 1
    ) {
      switch (newStringCharacters[currentIndex]) {
        case '\\right)':
          unclosedParenthesesStack.pop();
          if (unclosedParenthesesStack.length > 0) currentIndex++;
          break;
        case '\\left(':
          unclosedParenthesesStack.push('(');
          currentIndex++;
          break;
        default:
          currentIndex++;
      }
    }

    newStringCharacters[currentIndex] = '}';

    radicalsToConvertIndices.shift();
  }

  return newStringCharacters.join('');
};

// TODO: implement floating decimal components?
// For now, it assumes integer components
export const simplifyFraction = (
  numerator: number,
  denominator: number
): number[] => {
  if (!denominator) return [numerator];

  if (numerator % denominator === 0) return [numerator / denominator];

  const [low, high] =
    Math.abs(numerator) < Math.abs(denominator)
      ? [Math.abs(numerator), Math.abs(denominator)]
      : [Math.abs(numerator), Math.abs(denominator)];

  const getGCF = (num1: number, num2: number): number =>
    num1 ? getGCF(num2 % num1, num1) : num2;

  const gcf = getGCF(low, high);

  let newNumerator =
    numerator * denominator < 0
      ? -Math.abs(numerator) / gcf
      : Math.abs(numerator) / gcf;
  let newDenominator = Math.abs(denominator) / gcf;

  return [newNumerator, newDenominator];
};

export const getLCM = (num1: number, num2: number) => {
  if (num1 === num2) return num1;

  let [low, high] = num1 < num2 ? [num1, num2] : [num2, num1];

  if (high % low === 0) return high;

  const getGCF = (num1: number, num2: number): number =>
    num1 ? getGCF(num2 % num1, num1) : num2;

  const gcf = getGCF(low, high);

  return (num1 * num2) / gcf;
};

export const getSortedFactors = (num: number): number[] => {
  const max = Math.sqrt(num);
  const increment = num % 2 === 0 ? 1 : 2;

  const factors = [],
    complements = [];

  for (
    let currentFactor = 1;
    currentFactor <= max;
    currentFactor += increment
  ) {
    if (num % currentFactor !== 0) continue;
    factors.push(currentFactor);
    let complement = num / currentFactor;
    if (complement !== currentFactor) complements.unshift(complement);
  }

  factors.push(...complements);

  return factors;
};

export const getPrimeFactorization = (num: number): number[] => {
  if (num === 1) return [1];

  const primeFactors: number[] = [];

  let divisor = 2;

  while (num >= 2) {
    if (num % divisor === 0) {
      primeFactors.push(divisor);
      num = num / divisor;
    } else {
      divisor++;
    }
  }

  return primeFactors;
};
