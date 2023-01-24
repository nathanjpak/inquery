// TODO: enable negatives
export const getRandomFactor = (
  num: number,
  options?: {
    min?: number;
    max?: number;
    negativesAllowed?: boolean;
  }
): number => {
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
    )
      factors.push(complement);
  }

  // if (!options || !options.max || options.max >= num) factors.push(num);
  // if (options?.negativesAllowed) factors.push(-num);

  return factors[~~(Math.random() * factors.length)];
};
