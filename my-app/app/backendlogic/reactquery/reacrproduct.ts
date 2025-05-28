import { useInfiniteQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Product } from "@/interfaces/interface";

type productres = {
    response : Product[],
    nextcursor : string | null
}

export function useInfiniteProductsid(productid : string){
    return useInfiniteQuery<productres , Error , productres , [string , string] , string|null>({
        queryKey : ["productid" , productid],
        queryFn : async({pageParam = null }) => {
            const params : Record<string , string> = {};
            if(productid) params.product = productid;
            if(pageParam) params.pageparam = pageParam;

            const res  = await  axios.get<productres>("http://localhost:3000/product", {params});
            return res.data;
        },
        getNextPageParam:(lastpage) => lastpage.nextcursor ?? undefined,
        initialPageParam : null
    })
}