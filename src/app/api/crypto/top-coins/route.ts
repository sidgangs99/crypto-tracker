import { BINANCE_API, COIN_GECKO_API } from "@/lib/constants";
import { BinanceMarketsResponse, CoinGeckoResponse } from "@/types/binance";
import axios from "axios";
import { NextResponse } from "next/server";

let binanceSymbolsCache: any[] = [];
let lastCacheUpdate = 0;

async function fetchBinanceSymbols() {
  const now = Date.now();
  if (now - lastCacheUpdate < 3600000 && binanceSymbolsCache.length > 0) {
    return binanceSymbolsCache;
  }

  try {
    const response = await axios.get(`${BINANCE_API}/exchangeInfo`);
    binanceSymbolsCache = response.data.symbols
      .filter((s: any) => s.status === "TRADING")
      .filter((s: any) => ["USDT", "USD"].includes(s.quoteAsset));
    lastCacheUpdate = now;
    return binanceSymbolsCache;
  } catch (error) {
    console.error("Failed to fetch Binance symbols:", error);
    return [];
  }
}

function findBestBinanceSymbol(coinSymbol: string, binanceSymbols: any[]) {
  const lowerSymbol = coinSymbol.toLowerCase();

  const symbolMap = binanceSymbols.reduce((acc, symbolInfo) => {
    acc[symbolInfo.baseAsset.toLowerCase()] = symbolInfo.symbol;
    return acc;
  }, {} as Record<string, string>);

  if (symbolMap[lowerSymbol]) {
    return symbolMap[lowerSymbol];
  }

  const variations = [
    lowerSymbol,
    `${lowerSymbol}2`,
    lowerSymbol.replace(" ", ""),
    lowerSymbol.replace("-", ""),
    lowerSymbol.split("-")[0],
  ];

  for (const variation of variations) {
    if (symbolMap[variation]) {
      return symbolMap[variation];
    }
  }

  return `${coinSymbol.toUpperCase()}USDT`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 100;

    const [binanceSymbols, cgResponse, bnResponse] = await Promise.all([
      fetchBinanceSymbols(),
      axios.get(`${COIN_GECKO_API}/coins/markets`, {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit + 50,
          sparkline: false,
        },
      }),
      axios.get(`${BINANCE_API}/ticker/24hr`),
    ]);

    const cgCoins: CoinGeckoResponse[] = cgResponse.data;
    const bnTickers: BinanceMarketsResponse[] = bnResponse.data;

    const mappedCoins = cgCoins
      .map((coin) => {
        const binanceSymbol = findBestBinanceSymbol(
          coin.symbol,
          binanceSymbols
        );
        const bnTicker = bnTickers.find((t) => t.symbol === binanceSymbol);

        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          binanceSymbol,
          close: bnTicker?.lastPrice || null,
          priceChangePercent: bnTicker?.priceChangePercent || null,
          volume24h: bnTicker?.quoteVolume || null,
          marketCap: coin.market_cap,
          image: coin.image,
          priceChangePercentage24h: coin.price_change_percentage_24h,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
          lastUpdated: coin.last_updated,
        };
      })
      .filter((coin) => coin.close !== null);

    return NextResponse.json({
      data: mappedCoins.slice(0, limit),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top coins" },
      { status: 500 }
    );
  }
}
