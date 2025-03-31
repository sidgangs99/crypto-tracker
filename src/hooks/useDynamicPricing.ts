import {
  CONVERSION_RATE_FEE,
  CURRENCY_TO_COUNTRY_CODE,
  EXCHANGE_CURRENCIES,
} from "@/lib/constants";
import { CurrencyCode } from "@/types/currency";
import { useState } from "react";
import useExchangeRates from "./useExchangeRates";

function useDynamicPricing() {
  const { getExchangeRate } = useExchangeRates();

  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState<CurrencyCode>(
    EXCHANGE_CURRENCIES[0]
  );

  const calculatePrice = (priceStr: string) => {
    const price =
      parseFloat(priceStr) * getExchangeRate(currency) * CONVERSION_RATE_FEE;
    return new Intl.NumberFormat(
      `en-${CURRENCY_TO_COUNTRY_CODE[currency]?.countryCode}`,
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: price > 6 ? 2 : 4,
      }
    ).format(price);
  };

  return {
    exchangeRate,
    setExchangeRate,
    currency,
    setCurrency,
    calculatePrice,
  };
}

export default useDynamicPricing;
