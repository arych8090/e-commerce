import {app} from './handler';
import { kafka } from '@/kafkaserver/server';
import { typecall } from '@/querycalls/typecall';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { personilation } from '@/querycalls/personilation';
import { timeoutcall } from '@/querycalls/timeoutsearch';
import { searchcall } from '@/querycalls/searchcall';
import {redis} from "@/redisclusters/rediscluter";


const session = await getServerSession(authOptions)

app.post("/interection" , async(req , res)=>{
    const { productid } : {productid:string} = req.body;
    const userid : string  = session.user.id;

    const { types, subtypes, price } = await typecall({productid});

    const producer = kafka.producer();
    await producer.connect();

    producer.send({topic : "Interections" , 
                  messages:[{
                         value:JSON.stringify({userid , types , subtypes})
                        }]
               });

    res.status(200).json({message : "the interection been send and to the kafka "})
});

app.get("/interectiondata" , async (req , res)=>{
    const userid  : string =  session.user.id;
    const {productid} : {productid :string} = req.body;



    const interectionvalues :{types : string , subtypes : string , price : number , productid : string ,productname : string , imageurl : string , stockleft  : number , discount : number , rating : number , provider : string}[] = await personilation({userid , productid});
 
    return res.status(200).json(interectionvalues)

});

app.get("/search", async(req ,  res)=>{
    const query =  req.query  as {cursor? : string , search? : string }
    const search  =  query.search || "" ;
    const cursor = query.cursor || "" ;

    const  productname = search ;

    const searchdata : { productid : string , productname : string, price : number ,imageurl : string  , discount:number , provider : string , newcursor : string}[] = await searchcall({productname , cursor});



    return res.status(200).json(searchdata)
});

app.get("/timeoutcall" , async (req ,  res)=>{
    const {product} : {product :  string} = req.body;
    const productname  =  product.toLowerCase();
    const key = `cache-global`;
    const value  =  await  redis.get(key);
    if(value){
        const parse :{productname : string , productid : string , imageurl : string , type : string , subtype : string , interectivity : number }[]=JSON.parse(value || "[]");

        const cachesearch =  parse.find((t) =>{
            t.productid.toLowerCase().includes(productname),
            t.productname.toLowerCase().includes(productname),
            t.type.toLowerCase().includes(productname),
            t.subtype.toLowerCase().includes(productname)
        })

        if(cachesearch){
            cachesearch.interectivity += 1 ;
            await redis.set(key , JSON.stringify(parse))
            return res.status(200).json(cachesearch)
        }else{
                const search : {productid : string , productname : string  ,  imageurl : string  , price: number , stockleft : number , discount :number , rating  : number , provider : string  }[] =  await timeoutcall({productname});
                return res.status(200).json(search)
        }

    }
})