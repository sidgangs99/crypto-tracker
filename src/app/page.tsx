import { Top50Tickers } from "@/components/Top50Tickers";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Top 50 Cryptocurrencies (Binance)
      </h1>
      <Top50Tickers />
    </div>
  );
}
