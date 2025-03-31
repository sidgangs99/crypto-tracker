"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticker } from "@/types/binance";
import { ArrowDown, ArrowUp, BarChart2, Clock, DollarSign } from "lucide-react";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

export function TickerDetailsDialog({
  ticker,
  onClose,
  calculatePrice,
}: {
  ticker: Ticker;
  onClose: () => void;
  calculatePrice: (price: string) => string;
}) {
  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;
  const priceChange = parseFloat(ticker.priceChangePercent);
  const volume = parseFloat(ticker.volume24h);

  return (
    <Dialog open={Boolean(ticker)} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Image
              src={ticker.image}
              alt={ticker.name}
              width={48}
              height={48}
              className="rounded-full border"
            />
            <div>
              <DialogTitle className="text-left">{ticker.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {ticker.binanceSymbol}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Price Section */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-2xl font-bold",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {calculatePrice(String(ticker.close))}
            </span>
            <span
              className={`flex items-center ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <Progress
            value={Math.abs(priceChange)}
            className={`h-2 ${isPositive ? "bg-green-500" : "bg-red-500"}`}
          />

          <Separator />

          {/* Market Data Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <BarChart2 className="h-4 w-4 mr-2" />
                24h Range
              </div>
              <div className="font-medium">
                ${ticker.low24h.toLocaleString()} - $
                {ticker.high24h.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                24h Volume
              </div>
              <div className="font-medium">${volume.toLocaleString()}</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Recent Performance
            </div>
            <div className="flex gap-2">
              <div
                className={`flex-1 p-2 rounded text-center ${
                  isPositive ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <div className="text-xs text-muted-foreground">1h</div>
                <div
                  className={`font-medium ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {priceChange.toFixed(2)}%
                </div>
              </div>
              <div className="flex-1 p-2 rounded text-center bg-muted">
                <div className="text-xs text-muted-foreground">24h</div>
                <div className="font-medium">
                  {ticker.priceChangePercentage24h?.toFixed(2) || "N/A"}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
