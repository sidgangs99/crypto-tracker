import {
  BinanceTicker,
  BinanceWebSocketError,
  CoinGeckoCoin,
  MiniTicker,
  TickerCallback,
} from "@/types/binance";
import axios from "axios";
import { DefaultLogger, WebsocketClient } from "binance";
import { TOP_COINS } from "./api";
import { formatNumber } from "./helper";

export class BinancePriceTracker {
  private wsClient: WebsocketClient;
  private callbacks: TickerCallback[] = [];
  private trackedSymbols = new Set<string>();
  private coins = new Map<string, any>();
  private isConnected = false;
  private marketCaps: Record<string, number> = {};
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 5000;
  private readonly topCoinsLimit = 50;

  constructor() {
    this.wsClient = new WebsocketClient(
      {
        beautify: true,
        disableHeartbeat: false,
        reconnectTimeout: 10000,
        pongTimeout: 5000,
        pingInterval: 10000,
      },
      {
        ...DefaultLogger,
        silly: () => {},
        debug: () => {},
      }
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.wsClient.on("open", () => this.handleOpen());
    this.wsClient.on("reconnected", () => this.handleReconnect());
    this.wsClient.on("formattedMessage", (data) =>
      this.handleFormattedMessage(data)
    );
    this.wsClient.on("error", (err) => this.handleError(err));
    this.wsClient.on("close", (data) => this.handleClose(data));
  }

  private handleOpen() {
    console.info("WebSocket connected");
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.resubscribe();
  }

  private handleReconnect() {
    console.log("WebSocket reconnected");
    this.resubscribe();
  }

  private handleFormattedMessage(data: any) {
    const tickers = Array.isArray(data) ? data : [data];
    const validTickers = tickers.filter(
      (t) => t.eventType === "24hrMiniTicker"
    );

    if (validTickers.length > 0) {
      this.processTickers(validTickers);
    }
  }

  private handleError(err: BinanceWebSocketError) {
    console.error("WebSocket error:", err);
    this.handleDisconnect();
  }

  private handleClose(data: any) {
    if (!data?.isReconnecting) {
      console.log("WebSocket closed");
      this.handleDisconnect();
    }
  }

  private processTickers(tickers: BinanceTicker[]) {
    const updates = tickers
      .filter((t) => this.trackedSymbols.has(t.symbol))
      .map((t) => this.formatTicker(t));

    if (updates.length > 0) this.notifySubscribers(updates);
  }

  private formatTicker(ticker: BinanceTicker): MiniTicker {
    const marketCap = this.marketCaps[ticker.symbol]
      ? (this.marketCaps[ticker.s] * parseFloat(ticker.close)).toString()
      : "0";

    return {
      symbol: ticker.symbol,
      lastPrice: formatNumber(ticker.close, 8),
      priceChangePercent: formatNumber(ticker.P, 2),
      quoteVolume: formatNumber(ticker.quoteAssetVolume, 2),
      marketCap,
    };
  }

  private notifySubscribers(tickers: MiniTicker[]) {
    this.callbacks.forEach((cb) => {
      try {
        cb(tickers);
      } catch (err) {
        console.error("Callback error:", err);
      }
    });
  }

  private handleDisconnect() {
    if (!this.isConnected) return;

    this.isConnected = false;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    setTimeout(() => {
      this.reconnectAttempts++;
      this.resubscribe();
    }, this.reconnectDelay);
  }

  private resubscribe() {
    if (this.trackedSymbols.size > 0) {
      this.wsClient.subscribeSpotAllMini24hrTickers();
    }
  }

  public getCoins() {
    return this.coins;
  }

  public async topCoins() {
    const { data } = await axios.get(
      `${TOP_COINS}?limit=${this.topCoinsLimit}`
    );
    const { cgCoins, bnTickers } = data;

    this.trackedSymbols = new Set(
      cgCoins.map((coin: CoinGeckoCoin) => {
        const symbol = `${coin.symbol.toUpperCase()}USDT`;
        this.marketCaps[symbol] = coin.circulating_supply;
        return symbol;
      })
    );

    cgCoins.forEach((coin: CoinGeckoCoin) => this.coins.set(coin.symbol, coin));

    this.resubscribe();
    return cgCoins.map((coin: CoinGeckoCoin) =>
      this.createCoinTicker(coin, bnTickers)
    );
  }

  private createCoinTicker(coin: CoinGeckoCoin, bnTickers: any[]) {
    const symbol = `${coin.symbol.toUpperCase()}USDT`;
    const bnTicker = bnTickers.find((t: any) => t.symbol === symbol) || {};

    return {
      symbol,
      lastPrice: bnTicker.lastPrice || "0",
      priceChangePercent: bnTicker.priceChangePercent || "0",
      quoteVolume: bnTicker.quoteVolume || "0",
      marketCap: coin.market_cap.toString(),
    };
  }

  public subscribe(callback: TickerCallback): () => void {
    this.callbacks.push(callback);
    if (!this.isConnected) this.resubscribe();
    return () => this.unsubscribe(callback);
  }

  private unsubscribe(callback: TickerCallback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    if (this.callbacks.length === 0) this.cleanup();
  }

  public cleanup() {
    this.wsClient.closeAll();
    this.trackedSymbols.clear();
    this.callbacks = [];
    this.marketCaps = {};
  }
}

export const binancePriceTracker = new BinancePriceTracker();
