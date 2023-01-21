export const getRandomFactor = (num: number): number => {
  const isEven: boolean = num % 2 === 0;
  const root = Math.sqrt(num);
  const increment = isEven ? 1 : 2;
  const factors = [1, num];

  for (
    let currentFactor = isEven ? 2 : 3;
    currentFactor <= root;
    currentFactor += increment
  ) {
    if (num % currentFactor !== 0) continue;
    factors.push(currentFactor);
    let complement = num / currentFactor;
    if (complement !== currentFactor) factors.push(complement);
  }

  return factors[~~(Math.random() * factors.length)];
};
