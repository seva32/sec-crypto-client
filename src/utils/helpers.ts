import { YEAR_MS } from "./constansts";

export function fixedPoint(num: number): number {
  return Math.round(num * 1e18) / 1e18;
}

export function weiToEth(balance: string): number | null {
  if (!balance) return null;
  const value = Number(balance);
  if (isNaN(value)) return null;
  return fixedPoint(value * 1e-18);
}

export function isOldWallet(num: string): boolean {
  if (!num) return false;
  const value = Number(num);
  if (isNaN(value)) return false;
  return value * 1000 < Date.now() - YEAR_MS;
}
