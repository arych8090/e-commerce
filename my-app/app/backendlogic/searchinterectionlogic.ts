import {app} from './handler';
import { kafka } from '@/kafkaserver/server';
import { typecall} from '@/querycalls/typecall';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { redis } from '@/redisomserver/mainredis';


const session = await getServerSession(authOptions)

app.post("/interection" , async(req , res)=>{
    const { productid } = req.body;
    const userid = session.user.id;

    const { types, subtypes, price } = await typecall({productid , userid});
    

    const key = `interection:${userid}`;

    const value  =  await redis.hget(key , "types");
    const parse : {types : {name :string , count :number}  , subtypes:{ name : string , count : number}[]}[] = JSON.parse(value ||  "[]");

    const search =   parse.find((t:any)=> t.types == types);

    if(search){
        search.types.count += 1;
        const subsearch =  search.subtypes.find((t: any)=> t.name  == subtypes );
        if (subsearch){
            subsearch.count += 1 
        }else{
            search.subtypes.push({name: subtypes , count : 1})
        }
    }else{
        parse.push({types:types , subtypes:[{ name :subtypes , count :1}]})
    }
    await redis.hset(key , "types" , JSON.stringify(parse));
    await redis.expire(key , 172800);
})