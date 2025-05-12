"use client"
import { useState } from "react";
import { Verifiaction } from "./verification";

export const Verficationpage = ()=>{
    const [userotp , setuserotp] = useState<number>();

    return (
        <div>
            <div>
                <input 
                    name="OTP" 
                    placeholder="Enter the otp"
                    className="border-2 border-black m-4"
                    value={userotp}
                    onChange={(e)=> setuserotp(Number(e.target.value))}
                />
                <button 
                   onClick={()=>{
                    if(typeof userotp === "number"){
                        Verifiaction({userotp})
                    }else{
                        alert("enter a number valid otp")
                    }
                   }}>submit</button>
            </div>
        </div>
    )
}