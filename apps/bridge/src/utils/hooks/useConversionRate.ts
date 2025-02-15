import { useQuery } from 'react-query';
import { request } from 'apps/bridge/src/http/fetchJSON';

type UseConversionRateParams = {
  asset: string;
};

type CoinGeckoResponseType = Record<
string,
{
  usd: number;
}
>;

export function useConversionRate({ asset }: UseConversionRateParams): number | undefined {
  const { data } = useQuery(
    asset,
    async () => {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd`;
      const response = await request<CoinGeckoResponseType>(url, undefined, 'get');
      if (!response.body) {
        throw new Error('Network response was not ok');
      }
      return response.body[asset]?.usd;
    },
    {
      suspense: false,
      staleTime: 15000,
      refetchInterval: 1000 * 30,
    },
  );

  return data;
}
