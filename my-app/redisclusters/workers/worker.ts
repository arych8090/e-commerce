import {Worker , Queue, Job} from "bullmq";
import {redis} from '@/redisclusters/rediscluter';
import { admin } from "@/services/firebase-admin";
import { db } from "@/services/firebase-admin";

const firstworker = new Worker("clean-search-cache" , async(Job)=>{
    const key  =  `cache-global` ; 
    const value =  await redis.get(key);
    const parse :{productname : string , productid : string , imageurl : string , type : string , subtype : string , interectivity : number }[] = JSON.parse(value || "[]");
    const order =  parse.sort((a, b)=> b.interectivity - a.interectivity)
    const sort =  order.slice(0, Math.ceil(parse.length/2));
    await redis.set(key  , JSON.stringify(sort))
} , {connection:redis} )

const cartnotification  =  new Worker('cart-notification' , async(job)=>{
    const key = 'cart-notifiaction';
    const time =  Date.now();
    const value =  await redis.zrangebyscore(key ,  time , time+(2*60*60));
    const data = await db.collection("userid").get();
    const values =   data.docs.map((docs)=>({
        id : docs.id ,
        token : docs.data().token
    }))
    if (values){
        values.forEach(async(id)=>{
                const message = {
                    notification : {
                        title : "Cart Alert" ,
                        body : "Your cart is about ot expire , come checkout fast !!!! "
                    },
                    token : id.token
                }
            await admin.messaging().send(message)
        })
    }
});
