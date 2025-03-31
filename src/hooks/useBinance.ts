import { binancePriceTracker } from "@/lib/binance-ws";
import { MiniTickerEvent, Ticker } from "@/types/binance";
import { useEffect, useMemo, useState } from "react";

export const useBinance = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const coins = useMemo(() => binancePriceTracker.getCoins(), []);

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

    const handleUpdate = (updatedTickers: MiniTickerEvent[]) => {
      setTickers((current: Ticker[]) =>
        current.map((ticker: Ticker) => {
          const updated = updatedTickers.find(
            (t) => t.symbol === ticker.binanceSymbol
          );

          const updatedTicker: Ticker = {
            ...ticker,
            close: updated?.close || ticker?.close,
            priceChangePercent:
              updated?.priceChangePercent || ticker?.priceChangePercent,
            quoteVolume: updated?.quoteVolume || ticker?.quoteVolume,
            lastUpdated: updated?.lastUpdated || ticker?.lastUpdated,
          };

          return updatedTicker;
        })
      );
    };

    const unsubscribe = binancePriceTracker.subscribe(handleUpdate);
    return unsubscribe;
  }, []);

  return { tickers, isLoading, coins };
};
