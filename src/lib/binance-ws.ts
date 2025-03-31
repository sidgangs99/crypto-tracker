import {
  BinanceWebSocketError,
  MiniTickerEvent,
  MiniTickerSocketEvent,
  Ticker,
  TickerCallback,
} from "@/types/binance";
import axios from "axios";
import { DefaultLogger, WebsocketClient } from "binance";
import { TOP_COINS } from "./api";

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

  private processTickers(tickers: MiniTickerSocketEvent[]) {
    const updates = tickers
      .filter((ticker) => this.trackedSymbols.has(ticker.symbol))
      .map((ticker) => this.formatTicker(ticker));

    if (updates.length > 0) this.notifySubscribers(updates);
  }

  private formatTicker(ticker: MiniTickerSocketEvent): MiniTickerEvent {
    const marketCap = this.marketCaps[ticker.symbol]
      ? (this.marketCaps[ticker.symbol] * ticker.close).toString()
      : "0";

    const priceChange = ticker.close - ticker.open;
    const percentChange = (priceChange / ticker.open) * 100;
    return {
      ...ticker,
      symbol: ticker.symbol,
      quoteVolume: ticker.baseAssetVolume,
      priceChangePercent: percentChange.toFixed(2) + "%",
      marketCap,
      lastUpdated: ticker.eventTime,
    };
  }

  private notifySubscribers(tickers: MiniTickerEvent[]) {
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
    const coins: Ticker[] = data.data;
    coins.forEach((coin: Ticker) => {
      this.coins.set(coin.symbol, coin);
      this.trackedSymbols.add(coin.binanceSymbol);
    });

    this.resubscribe();
    return coins;
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
