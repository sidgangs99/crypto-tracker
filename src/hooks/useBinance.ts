import { binancePriceTracker } from "@/lib/binance-ws";
import { useEffect, useMemo, useState } from "react";

interface Ticker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

export const useBinance = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const coins = useMemo(
    () => binancePriceTracker.getCoins(),
    [binancePriceTracker.getCoins()]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const initialTickers = await binancePriceTracker.topCoins();
        setTickers(initialTickers);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize top 50:", error);
      }
    };

    loadData();

    const handleUpdate = (updatedTickers: Ticker[]) => {
      setTickers((current) =>
        current.map((ticker) => {
          const updated = updatedTickers.find(
            (t) => t.symbol === ticker.symbol
          );
          return updated || ticker;
        })
      );
    };

    const unsubscribe = binancePriceTracker.subscribe(handleUpdate);
    return unsubscribe;
  }, []);

  return { tickers, isLoading, coins };
};
