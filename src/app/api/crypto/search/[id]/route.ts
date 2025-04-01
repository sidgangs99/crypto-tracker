import { COIN_GECKO_API } from "@/lib/constants";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data } = await axios.get(`${COIN_GECKO_API}/coins/${id}`);

    const ticker = {
      baseAssetVolume: data.market_data.total_volume.usd,
      id: data.market_cap_rank,
      name: data.name,
      binanceSymbol: "",
      close: data.market_data.current_price.usd,
      priceChangePercent: data.market_data.price_change_percentage_24h,
      volume24h: data.market_data.market_cap.usd,
      image: data.image.small,
      priceChangePercentage24h: 0,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
      marketCap: "",
      quoteVolume: 0,
      lastUpdated: 0,
      eventType: "24hrMiniTicker",
      eventTime: 0,
      symbol: "",
      open: 0,
      high: 0,
      low: 0,
      quoteAssetVolume: 0,
    };

    return NextResponse.json({
      data: ticker,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search coin by ID" },
      { status: 500 }
    );
  }
}
