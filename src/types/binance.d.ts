import { WsKey } from "binance";

export interface MiniTicker {
  symbol: string;
  lastPrice: string;
  quoteVolume: string;
  marketCap?: string;
}

export interface BinanceTicker {
  s: string;
  c: string;
  P: string;
  q: string;
  [key: string]: any;
}

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  circulating_supply: number;
  market_cap: number;
  [key: string]: any;
}

export interface BinanceWebSocketError {
  wsKey: WsKey;
  error: any;
  rawEvent?: string;
}

export type TickerCallback = (tickers: MiniTicker[]) => void;
