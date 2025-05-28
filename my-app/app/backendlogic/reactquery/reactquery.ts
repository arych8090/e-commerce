'use client';
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { searchcall } from "@/interfaces/interface";

type productresponse = {
    result : searchcall ,
    nextcursor : string | null 
}

export function useInfiniteProducts(searchitem: string) {
  return useInfiniteQuery<productresponse , Error , productresponse , [string , string] , string|null >({
    queryKey: ['product', searchitem],
    queryFn: async ({ pageParam = null }) => {

      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      if (searchitem) params.search = searchitem;

   
      const res = await axios.get<productresponse>("http://localhost:3000/search", { params });

      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextcursor ?? undefined,
    initialPageParam: null,

  });
}
