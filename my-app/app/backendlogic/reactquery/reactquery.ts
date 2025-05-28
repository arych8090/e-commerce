'use client';
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useInfiniteProducts(searchitem: string) {
  return useInfiniteQuery({
    queryKey: ['product', searchitem],
    queryFn: async ({ pageParam = null }) => {

      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      if (searchitem) params.search = searchitem;

   
      const res = await axios.get("http://localhost:3000/search", { params });

      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextcursor ?? undefined,
    initialPageParam: null,
  });
}
