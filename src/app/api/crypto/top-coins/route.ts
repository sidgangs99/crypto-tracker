import { BINANCE_API, COIN_GECKO_API } from "@/lib/constants";
import { BinanceTicker, CoinGeckoCoin } from "@/types/binance";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;

    const [cgResponse, bnResponse] = await Promise.all([
      fetch(
        `${COIN_GECKO_API}/coins/markets?vs_currency=usd&per_page=${limit}`
      ),
      fetch(`${BINANCE_API}/ticker/24hr`),
    ]);

    const cgCoins: CoinGeckoCoin[] = await cgResponse.json();
    const bnTickers: BinanceTicker[] = await bnResponse.json();

    return NextResponse.json({ cgCoins, bnTickers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top 50 coins" },
      { status: 500 }
    );
  }
}
