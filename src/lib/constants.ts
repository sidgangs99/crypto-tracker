import { CurrencyCode } from "@/types/currency";

export const COIN_GECKO_API = "https://api.coingecko.com/api/v3";
export const BINANCE_API = "https://api.binance.com/api/v3";
export const CURRENCY_EXCHANGE_API = "https://v6.exchangerate-api.com/v6";

export const CURRENCY_TO_COUNTRY_CODE: Record<CurrencyCode, any> = {
  USD: { countryCode: "US" },
  INR: { countryCode: "IN" },
  EUR: { countryCode: "FR" },
  CHF: { countryCode: "CH" },
  GBP: { countryCode: "GB" },
};

export const EXCHANGE_CURRENCIES: CurrencyCode[] = [
  "USD",
  "INR",
  "EUR",
  "CHF",
  "GBP",
];

export const CONVERSION_RATE_FEE = 0.999;
