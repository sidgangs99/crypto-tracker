"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBinance } from "@/hooks/useBinance";
import { CURRENCY_TO_COUNTRY_CODE } from "@/lib/constants";
import { CurrencyCode } from "@/types/currency";

// Assuming conversion rate is 0.1%
const CONVERSION_RATE_FEE = 0.999;

const formatPrice = (
  priceStr: string,
  symbol: string,
  exchangeRate: number,
  selectedCurrency: CurrencyCode
) => {
  const price = parseFloat(priceStr) * exchangeRate * CONVERSION_RATE_FEE;
  return new Intl.NumberFormat(
    `en-${CURRENCY_TO_COUNTRY_CODE[selectedCurrency]?.countryCode}`,
    {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: price > 6 ? 2 : 4,
    }
  ).format(price);
};

interface Top50TickersProps {
  selectedCurrency: CurrencyCode;
  exchangeRate: number;
}

export function Top50Tickers({
  selectedCurrency,
  exchangeRate,
}: Top50TickersProps) {
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
                  {formatPrice(
                    ticker.lastPrice,
                    ticker.symbol,
                    exchangeRate,
                    selectedCurrency
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
