import { BINANCE_API } from "@/lib/constants";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await axios.get(`${BINANCE_API}/exchangeInfo`);

    return NextResponse.json({
      data: data.symbols
        .filter((s: any) => s.status === "TRADING")
        .filter((s: any) => ["USDT", "USD"].includes(s.quoteAsset)),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top coins" },
      { status: 500 }
    );
  }
}
