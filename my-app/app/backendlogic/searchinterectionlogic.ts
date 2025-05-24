import {app} from './handler';
import { kafka } from '@/kafkaserver/server';
import { typecall } from '@/querycalls/typecall';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { personilation } from '@/querycalls/personilation';
import { timeoutcall } from '@/querycalls/timeoutsearch';
import { searchcall } from '@/querycalls/searchcall';


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
               });

    res.status(200).json({message : "the interection been send and to the kafka "})
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