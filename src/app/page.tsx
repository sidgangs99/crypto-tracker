"use client";

import { TickersTable } from "@/components/TickersTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useExchangeRates from "@/hooks/useExchangeRates";
import { EXCHANGE_CURRENCIES } from "@/lib/constants";
import { CurrencyCode } from "@/types/currency";
import { useEffect, useState } from "react";

export default function Home() {
  const { getExchangeRate } = useExchangeRates();
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState<CurrencyCode>(
    EXCHANGE_CURRENCIES[0]
  );

  useEffect(() => {
    setExchangeRate(getExchangeRate(currency));
  }, [currency, getExchangeRate]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Track Your Assets 💰</h1>

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
              {EXCHANGE_CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TickersTable selectedCurrency={currency} exchangeRate={exchangeRate} />
    </div>
  );
}
