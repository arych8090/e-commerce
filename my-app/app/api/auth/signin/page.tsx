"use client"

import { signIn } from "next-auth/react";
import { useState } from "react";

export const Signinpage =()=>{
    const [username , setusername] = useState("");
    const [phonenumber , setnumber] = useState("");
    const [password , setpassword] = useState("");
    const [email , setemail] = useState("");
    
    const handlesubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        await signIn("credentials" , {
            username,
            password,
            email ,
            phonenumber,
            callbackUrl : '/verification',
        })
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="bg-white shadow-md p-6 rounded-lg">
                <div className="text-xl mb-6 text-center">sign in</div>
            </div>
            <form
              onSubmit={handlesubmit}
            >
                <input 
                  name="username" 
                  placeholder="Username" 
                  className="mb-4 p-2 border rounded"
                  value={username}
                  onChange={(e)=>setusername(e.target.value)}
                  />
                <input 
                  name="email" 
                  placeholder="Email@email.com" 
                  className="mb-4 p-2 border rounded"
                  value={email}
                  onChange={(e)=>setemail(e.target.value)}
                  />
                <input 
                  name="phonenumber" 
                  placeholder="1234123412" 
                  className="mb-4 p-2 border rounded"
                  value={phonenumber}
                  onChange={(e)=>setnumber(e.target.value)}
                  />
                <input 
                  name="password" 
                  placeholder="********" 
                  className="mb-4 p-2 border rounded"
                  value={password}
                  onChange={(e)=>setpassword(e.target.value)}
                  />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">sign in</button>
            </form>
            <div className="flex flex-col gap-2">
                <button 
                  onClick={()=> signIn("google",{ callbackUrl: '/mainpage'})}
                  className="w-full bg-black text-white py-2 rounded"
                  > Google Signin</button>
                <button 
                  onClick={()=> signIn("apple",{ callbackUrl: '/mainpage'})}
                  className="w-full bg-black text-white py-2 rounded"
                  >Apple Signin</button>
            </div>
        </div>
    )
}