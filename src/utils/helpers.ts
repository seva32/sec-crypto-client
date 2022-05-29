import { YEAR_MS } from "./constants";

/**
 * (Not the best) Workaround to avoid floating-point manipulation problems in Javascript
 * @param {number}  num - Expression we need to get up to 18 digits
 * @returns {number} Rounded 18 digits value
 */
export function fixedPoint(num: number): number {
  return Math.round(num * 1e18) / 1e18;
}

/**
 * Wei to ETH conversion
 * @param {string}  balance Balance in wei
 * @returns {number | null} Balance in ETH
 */
export function weiToEth(balance: string): number | null {
  if (!balance) return null;
  const value = Number(balance);
  if (isNaN(value)) return null;
  return fixedPoint(value * 1e-18);
}

/**
 * Compares a timestamp from the address to find out if it is older than 1 year
 * @param {number}  num - timestamp in UNIX date
 * @returns {boolean} true value means old waller (>= 1 year)
 */
export function isOldWallet(num: string): boolean {
  if (!num) return false;
  const value = Number(num);
  if (isNaN(value)) return false;
  return value * 1000 < Date.now() - YEAR_MS;
}

/**
 * @param {number}  usd - USD amount to convert
 * @param {number} usdToEur - current usd/eur rate
 * @returns {string} usd/eur rate
 */
export function usdToEurConversor(usd: number, usdToEur: number): string {
  return fixedPoint(usd * usdToEur).toFixed(2);
}
