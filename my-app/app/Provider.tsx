"use client"

import { SessionProvider } from "next-auth/react"
import {RecoilRoot} from "recoil";
import {QueryClient , QueryClientProvider} from '@tanstack/react-query';
import { useState } from "react";

export const Providers = ({children}:{children:React.ReactNode})=>{
    const [queryclient] = useState(()=> new QueryClient)
    return <RecoilRoot>
       <SessionProvider>
        <QueryClientProvider client={queryclient}>
           {children}
        </QueryClientProvider>
       </SessionProvider>
    </RecoilRoot>
}