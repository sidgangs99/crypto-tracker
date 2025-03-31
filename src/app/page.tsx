"use client";

import { Top50Tickers } from "@/components/Top50Tickers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useExchangeRates from "@/hooks/useExchangeRates";
import { ExchangeCurrencies } from "@/lib/constants";
import { CurrencyCode } from "@/types/currency";
import { useEffect, useState } from "react";

export default function Home() {
  const { getExchangeRate } = useExchangeRates();

  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState<CurrencyCode>(ExchangeCurrencies[0]);

  useEffect(() => {
    setExchangeRate(getExchangeRate(currency));
  }, [currency, getExchangeRate]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Top 50 Cryptocurrencies (Binance)
        </h1>

        <div className="flex items-center gap-2">
          <Select
            value={currency}
            onValueChange={(cur: CurrencyCode) => setCurrency(cur)}
          >
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center">
                <SelectValue placeholder="Currency" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {ExchangeCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Top50Tickers selectedCurrency={currency} exchangeRate={exchangeRate} />
    </div>
  );
}
