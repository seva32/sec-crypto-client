import { ETH_URL, ETH_KEY } from "./constants";

export function balancemulti(addresses: string[] = []) {
  return `${ETH_URL}?module=account&action=balancemulti&address=${addresses.join()}&tag=earliest&apikey=${ETH_KEY}`;
}

export const ethprice = `${ETH_URL}?module=stats&action=ethprice&apikey=${ETH_KEY}`;

export function txlist(address: string) {
  return `${ETH_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETH_KEY}`;
}

export const conversionURL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/usd.json";
