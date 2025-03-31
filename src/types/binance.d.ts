import { WsKey } from "binance";

export enum MiniTIckerEventType {
  "24hrMiniTicker",
}

export interface MiniTickerSocketEvent {
  eventType: MiniTIckerEventType;
  eventTime: number;
  symbol: string;
  close: number;
  open: number;
  high: number;
  low: number;
  baseAssetVolume: number;
  quoteAssetVolume: number;
}

export interface MiniTickerEvent extends MiniTickerSocketEvent {
  priceChangePercent: string;
  marketCap: string;
  quoteVolume: number;
  lastUpdated: number;
}

export interface Ticker extends MiniTickerEvent {
  id: string;
  name: string;
  binanceSymbol: string;
  close: number;
  priceChangePercent: string;
  volume24h: string;
  image: string;
  priceChangePercentage24h: number;
  high24h: number;
  low24h: number;
}

export interface BinanceWebSocketError {
  wsKey: WsKey;
  error: any;
  rawEvent?: string;
}

export type TickerCallback = (tickers: MiniTickerEvent[]) => void;

export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export interface BinanceMarketsResponse {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}
