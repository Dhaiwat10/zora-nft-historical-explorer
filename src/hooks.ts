import {
  MintsQuery,
  SalesQuery,
  TokenQuery,
} from '@zoralabs/zdk/dist/queries/queries-sdk';
import { useEffect, useState } from 'react';
import { getMintData, getNftData, getSalesData } from './api';

export const useSales = (collectionAddress: string, tokenId: string) => {
  const [sales, setSales] = useState<SalesQuery>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const sales = await getSalesData(collectionAddress, tokenId);
        setSales(sales);
      } catch (e) {
        setError(e as Error);
      }
      setLoading(false);
    };
    fetchSales();
  }, [collectionAddress, tokenId]);

  return { sales, loading, error };
};

export const useMintData = (collectionAddress: string, tokenId: string) => {
  const [mintData, setMintData] = useState<MintsQuery>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMintData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMintData(collectionAddress, tokenId);
        setMintData(data);
      } catch (e) {
        setError(e as Error);
      }
      setLoading(false);
    };
    fetchMintData();
  }, [collectionAddress, tokenId]);

  return { mintData, loading, error };
};

export const useNftData = (collectionAddress: string, tokenId: string) => {
  const [nftData, setNftData] = useState<TokenQuery>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNftData = async () => {
      setLoading(true);
      setError(null);
      try {
        const mints = await getNftData(collectionAddress, tokenId);
        setNftData(mints);
      } catch (e) {
        setError(e as Error);
      }
      setLoading(false);
    };
    fetchNftData();
  }, [collectionAddress, tokenId]);

  return { nftData, loading, error };
};
