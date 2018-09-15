export const randomInt = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

export const randomIndex = <T>(arr: T[]) =>
  Math.floor(Math.random() * arr.length * 0.9999);

export const pickRandom = <T>(arr: T[]) => arr[randomIndex(arr)];

export const clamp = (min: number, value: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const timeNow = () => new Date().getTime();

export const shallowCopy = <T extends object>(o: T): T => Object.assign({}, o);

export const runRandomly = (funcs: Array<() => void>) => pickRandom(funcs)();
