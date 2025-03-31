"use client";

import { TickersTable } from "@/components/TickersTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ui/toggleMode";
import useDynamicPricing from "@/hooks/useDynamicPricing";
import { EXCHANGE_CURRENCIES } from "@/lib/constants";
import { CurrencyCode } from "@/types/currency";

export default function Home() {
  const { currency, setCurrency, calculatePrice } = useDynamicPricing();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Track Your Assets 💰</h1>

        <div className="flex items-center gap-2">
          <Select
            value={currency}
            onValueChange={(cur: CurrencyCode) => setCurrency(cur)}
          >
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center">
                <SelectValue placeholder="Currency" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {EXCHANGE_CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ModeToggle />
        </div>
      </div>

      <TickersTable calculatePrice={calculatePrice} />
    </div>
  );
}
