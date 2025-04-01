import { COIN_GECKO_API } from "@/lib/constants";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const { data } = await axios.get(`${COIN_GECKO_API}/search?query=${query}`);

    return NextResponse.json({
      data: data.coins.slice(0, 10).map((coin: any) => ({
        symbol: coin.symbol,
        image: coin.thumb,
        name: coin.name,
        id: coin.id,
        market_cap_rank: coin.market_cap_rank ?? "N/A",
      })),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top coins" },
      { status: 500 }
    );
  }
}
