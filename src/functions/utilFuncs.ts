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
  nonZero?: boolean
): number => {
  if (nonZero && min < 0 && max > 0) {
    // configure weighted probability
    const totalValues = min + max - 1;
    const positiveProbability = max / totalValues;
    const negativeProbability = 1 - positiveProbability;

    const positiveOrNegative = Math.random();

    if (positiveOrNegative > negativeProbability) {
      return Math.floor(Math.random() * max) + 1;
    } else {
      return Math.floor(Math.random() * (-1 - min + 1)) + min;
    }
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
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
      newStringCharacters[fractionsToConvertIndices[0] - 1] = `\\frac{${
        newStringCharacters[fractionsToConvertIndices[0] - 1]
      }}`;
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
      newStringCharacters[fractionsToConvertIndices[0]] = `{${
        newStringCharacters[fractionsToConvertIndices[0]]
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
