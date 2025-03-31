"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBinance } from "@/hooks/useBinance";

const formatPrice = (priceStr: string, symbol: string) => {
  const price = parseFloat(priceStr);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: symbol === "USDT" ? 4 : 8,
  }).format(price);
};

export function Top50Tickers() {
  const { tickers, isLoading, coins } = useBinance();

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
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker) => {
            const extractedSymbolKey = ticker.symbol
              .replace("USDT", "")
              .toLowerCase();
            const coin = coins.get(extractedSymbolKey);

            return (
              <tr key={ticker.symbol} className="border-t">
                <td className="px-4 py-2">{coin.name}</td>
                <td className="px-4 py-2 text-right font-mono">
                  {formatPrice(ticker.lastPrice, ticker.symbol)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
