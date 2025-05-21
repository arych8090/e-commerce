import {app} from './handler';
import { kafka } from '@/kafkaserver/server';
import { typecall } from '@/querycalls/typecall';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { redis } from '@/redisomserver/mainredis';
import { personilation } from '@/querycalls/personilation';
import { timeoutcall } from '@/querycalls/timeoutsearch';
import { searchcall } from '@/querycalls/searchcall';
import { connect } from 'http2';

const session = await getServerSession(authOptions)

app.post("/interection" , async(req , res)=>{
    const { productid } = req.body;
    const userid = session.user.id;

    const { types, subtypes, price } = await typecall({productid});

    const producer = kafka.producer();
    await producer.connect();

    producer.send({topic : "Interections" , 
                  messages:[{
                         value:JSON.stringify({userid , types , subtypes})
                        }]
               })
    
    const key = `interection:${userid}`;

    const value  =  await redis.hget(key , "types");
    const parse : {types : {name :string , count :number}  , subtypes:{ name : string , count : number}[]}[] = JSON.parse(value ||  "[]");

    const search =   parse.find((t)=> t.types.name == types);

    if(search){
        search.types.count += 1;
        const subsearch =  search.subtypes.find((t)=> t.name  == subtypes );
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
});

app.get("/interectiondata" , async (req , res)=>{
    const userid  : string =  session.user.id;
    const {productid} : {productid :string} = req.body;



    const interectionvalues = await personilation({userid , productid});

    return interectionvalues

});

app.get("/timeoutcall", async(req ,  res)=>{
    const {product } : {product : string} = req.body;
    const productname =  product.toLowerCase();
    const searchdata = await timeoutcall({productname});

    return searchdata
});

app.get("/search" , async (req ,  res)=>{
    const {product} : {product :  string} = req.body;
    const productname  =  product.toLowerCase();

    const search  =  await searchcall({productname});

    const producer =  kafka.producer();
    await producer.connect();
    producer.send({
        topic:"socketconnection",
        messages : [{
            value : productname
        }]
    });
    await producer.disconnect()

    return search
})