"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBinance } from "@/hooks/useBinance";
import { CONVERSION_RATE_FEE, CURRENCY_TO_COUNTRY_CODE } from "@/lib/constants";
import { CurrencyCode } from "@/types/currency";
import Image from "next/image";

const formatPrice = (
  priceStr: string,
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

export function TickersTable({
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
    <>
      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
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
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-default"
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
                      {formatPrice(
                        ticker.close,
                        exchangeRate,
                        selectedCurrency
                      )}
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
    </>
  );
}
