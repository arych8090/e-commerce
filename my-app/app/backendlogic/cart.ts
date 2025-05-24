import {app} from './handler';
import { cartsearch } from '@/querycalls/cartcalls';
import { checkoutcall } from '@/querycalls/checkoutcall';
import { kafka } from '@/kafkaserver/server'; 

app.post("/productvalue" , async(req , res)=>{
	const {productid} : {productid : string} = await req.body;

	const productvalues = await cartsearch({productid});
    const sendvalues = async()=>{
		        const producer =  kafka.producer();
                        await producer.connect();

			producer.send({
				topic:'P-S',
				messages:[{
					value : JSON.stringify(productvalues)
				}],
			});

			await producer.disconnect();
	}

	res.status(200).json(productvalues);
});

app.get("/checkoutsession" , async (req , res)=>{
	const {userid} = await req.body;

	const cart = await checkoutcall(userid);

    const sessionurl = await  fetch("/graphql" , {
        method : "GET" ,
        headers : {
            "Content-Type" : "application/json",
        },
        body: cart
    });

    res.status(200).json(sessionurl)


})

