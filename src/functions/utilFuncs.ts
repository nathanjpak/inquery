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
