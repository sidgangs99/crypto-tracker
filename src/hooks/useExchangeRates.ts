import { EXCHANGE_RATES } from "@/lib/api";
import axios from "axios";
import { useEffect, useState } from "react";

function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const { data } = await axios.get(EXCHANGE_RATES);
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  const getExchangeRate = (currency: string) => {
    if (exchangeRates?.[currency]) return exchangeRates[currency];
    return 1;
  };

  return { getExchangeRate };
}

export default useExchangeRates;
