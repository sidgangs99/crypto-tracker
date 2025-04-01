"use client";

import SearchCrypto from "@/components/SearchCrypto";
import { TickersTable } from "@/components/TickersTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ui/toggleMode";
import { useBinance } from "@/hooks/useBinance";
import useDynamicPricing from "@/hooks/useDynamicPricing";
import { EXCHANGE_CURRENCIES } from "@/lib/constants";
import { Ticker } from "@/types/binance";
import { CurrencyCode } from "@/types/currency";
import { useState } from "react";

export default function Home() {
  const { currency, setCurrency, calculatePrice } = useDynamicPricing();
  const { tickers, isLoading, coins } = useBinance();
  const [history, setHistory] = useState<Ticker[]>([]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold dark:text-neutral-500">
          Track Your Assets 💰
        </h1>

        <div className="flex items-center gap-2 w-2/3 justify-end">
          <div className="w-1/3 overflow-hidden">
            <SearchCrypto
              calculatePrice={calculatePrice}
              history={history}
              setHistory={setHistory}
            />
          </div>
          <Select
            value={currency}
            onValueChange={(cur: CurrencyCode) => setCurrency(cur)}
          >
            <SelectTrigger className="">
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
          <ModeToggle />
        </div>
      </div>

      <TickersTable
        calculatePrice={calculatePrice}
        tickers={tickers}
        isLoading={isLoading}
        coins={coins}
        setHistory={setHistory}
      />
    </div>
  );
}
