export function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a: A) => g(f(a));
}

export function scaleAndRound(value: number, maxFrom: number, maxTo: number): number {
  return scaleAndRoundFull(value, 0, maxFrom, 0, maxTo);
}

export function scaleAndRoundFull(value: number, minFrom: number, maxFrom: number, minTo: number, maxTo: number): number {
  return Math.round((value - minFrom) * (maxTo - minTo) / (maxFrom - minFrom) + minTo);
}
