import { app } from "./handler";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import { redis } from "@/redisclusters/rediscluter";
const session = await getServerSession(authOptions);


app.get("/verification" , async(req , res)=>{
    const userid =  session.user.id
    const {otp} = req.query.otp as {otp:any};
    const {email} = req.query.email as {email : string}
    
    const key  =  `opt-${email}`
    const value =  await redis.get(key)
    await redis.del(key)
    if(value == otp){

    }else{
        return res.status(200).send(false)
    }
})

app.post("generateotp" , async(req , res)=>{
    const {email} = req.query as {email : string}
    const otp = Math.floor(100000 + Math.random() * 900000);
    const key = `otp=${email}`;

    await redis.set(key , otp , "EX" , 120)

    const data =  await fetch("http://localhost:6000/sendgrid" , {
        method : "POST" , 
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({email , otp})
    });

    const response  =  data.body ;
    return res.status(200).json({
        messeage : `${response}`
    })
})