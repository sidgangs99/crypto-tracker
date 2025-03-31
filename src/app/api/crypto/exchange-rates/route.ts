import { CURRENCY_EXCHANGE_API } from "@/lib/constants";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await axios.get(
      `${CURRENCY_EXCHANGE_API}/${process.env.CURRENCY_EXCHANGE_API_KEY}/latest/USD`
    );

    const {
      conversion_rates,
      base_code,
      time_last_update_unix,
      time_next_update_unix,
    } = data;

    return NextResponse.json({
      conversion_rates,
      base_code,
      time_last_update_unix,
      time_next_update_unix,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
