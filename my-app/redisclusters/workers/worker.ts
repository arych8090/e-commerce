import {Worker , Queue, Job} from "bullmq";
import {redis} from '@/redisclusters/rediscluter'
const firstworker = new Worker("clean-search-cache" , async(Job)=>{
    const key  =  `cache-global` ; 
    const value =  await redis.get(key);
    const parse :{productname : string , productid : string , imageurl : string , type : string , subtype : string , interectivity : number }[] = JSON.parse(value || "[]");
    const order =  parse.sort((a, b)=> b.interectivity - a.interectivity)
    const sort =  order.slice(0, Math.ceil(parse.length/2));
    await redis.set(key  , JSON.stringify(sort))
} , {connection:redis} )