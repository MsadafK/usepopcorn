export function average(arr: number[]): number {
  return arr.length === 0
    ? 0
    : arr.reduce((acc, cur) => acc + cur / arr.length, 0);
}
