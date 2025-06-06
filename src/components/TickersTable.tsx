"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Ticker } from "@/types/binance";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { TickerDetailsDialog } from "./TickerDetailsDialog";

interface Top50TickersProps {
  calculatePrice: (price: number) => string;
  tickers: Ticker[];
  isLoading: boolean;
  coins: Map<string, any>;
  setHistory: Dispatch<SetStateAction<Ticker[]>>;
}

export function TickersTable({
  calculatePrice,
  coins,
  isLoading,
  tickers,
  setHistory,
}: Top50TickersProps) {
  const [selectedTicker, setSelectedTicker] = useState<null | Ticker>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((ticker: any) => {
                const extractedSymbolKey = ticker.symbol
                  .replace("USDT", "")
                  .toLowerCase();
                const coin = coins.get(extractedSymbolKey);

                return (
                  <tr
                    key={ticker.symbol}
                    className="border-t hover:bg-gray-50 dark:hover:bg-neutral-900 cursor-pointer"
                    onClick={() => {
                      setHistory((prev: Ticker[]) => [ticker, ...prev]);
                      setSelectedTicker(ticker);
                    }}
                  >
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6 rounded-full"
                        width={40}
                        height={40}
                      />
                      <span>{coin.name}</span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {calculatePrice(ticker.close)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-mono ${
                        parseFloat(ticker.priceChangePercent) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {parseFloat(ticker.priceChangePercent).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <TickerDetailsDialog
        ticker={selectedTicker}
        onClose={() => setSelectedTicker(null)}
        calculatePrice={calculatePrice}
        isLoading={false}
      />
    </>
  );
}
