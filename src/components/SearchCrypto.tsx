"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SEARCH_COINS } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TickerDetailsDialog } from "./TickerDetailsDialog";
import { Skeleton } from "./ui/skeleton";

interface CryptoSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank?: number;
}

export default function SearchCrypto({ calculatePrice }: any) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] =
    useState<CryptoSearchResult | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: results = [], status } = useQuery({
    queryKey: ["cryptoSearch", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const { data } = await axios.get(
        `${SEARCH_COINS}?query=${debouncedQuery}`
      );
      return data.data || [];
    },
    enabled: open && debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const { data: cryptoDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["cryptoDetails", selectedCrypto?.id],
    queryFn: async () => {
      if (!selectedCrypto?.id) return null;
      const { data } = await axios.get(`${SEARCH_COINS}/${selectedCrypto.id}`);
      return data.data;
    },
    enabled: !!selectedCrypto,
    staleTime: 1000 * 60 * 5,
  });

  const renderSkeletons = () => {
    return (
      <div className="flex flex-col gap-y-3 py-6 px-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMessage = (message: string) => (
    <div className="py-6 text-center text-sm text-stone-500 dark:text-stone-400">
      {message}
    </div>
  );

  const renderStateMessages = () => {
    if (results.length > 0) return;

    let message = "";
    switch (true) {
      case query.length === 0:
        message = "Start typing to search...";
        break;

      case status === "success" && results.length === 0:
        message = "No coins found.";
        break;

      default:
        return renderSkeletons();
    }

    return renderMessage(message);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-stone-500 dark:text-stone-400"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cryptocurrency...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search cryptocurrency..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[400px] overflow-y-auto">
            {/* Show loading state if fetching */}
            {renderStateMessages()}

            <CommandGroup heading="Powered by Sid 🚀">
              {Boolean(query.length) &&
                results.map((crypto) => (
                  <CommandItem
                    key={crypto?.id}
                    value={crypto?.id}
                    onSelect={() => {
                      setSelectedCrypto(crypto);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Image
                        src={crypto?.image}
                        alt={crypto?.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{crypto?.name}</span>
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          {crypto?.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {selectedCrypto && (
        <TickerDetailsDialog
          ticker={cryptoDetails}
          isLoading={isDetailsLoading}
          onClose={() => setSelectedCrypto(null)}
          calculatePrice={calculatePrice}
        />
      )}
    </>
  );
}
