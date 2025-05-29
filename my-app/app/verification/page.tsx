"use client"
import { useState } from "react";
import axios from "axios";

const [userotp , setuserotp] = useState<number>();
const [email , setemail] = useState("")
async function verification(otp :any , email:string){
    const verify  = await axios.get(`http://localhost:3000/verification?${otp}?${email}`);
    const res =  verify.data ;
    if(!res){
        alert("Invalid OTP")
    }
}

async function generate(email : string){
    await axios.post(`http://localhost:3000/generateotp?${email}`)
}

export const Verficationpage = ()=>{

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
                <input
                   name= "email" 
                   placeholder="Enter Email"
                   value={email}
                   onChange={(e) => setemail(e.target.value)}
                />
                <button 
                   onClick={()=>{
                    verification(userotp , email)
                   }}>submit</button>
                <button
                   onClick={()=>{
                      generate(email)
                   }}
                >
                    generate otp
                </button>
            </div>
        </div>
    )
}