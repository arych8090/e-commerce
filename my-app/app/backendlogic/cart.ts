import {app} from './handler';
import { cartsearch } from '@/querycalls/cartcalls';
import { checkoutcall } from '@/querycalls/checkoutcall';
import { kafka } from '@/kafkaserver/server'; 
import { authOptions } from '../lib/auth';
import { getServerSession } from 'next-auth';
import {loadStripe} from '@stripe/stripe-js';
import { redis } from '@/redisomserver/mainredis';
import socket from '@/websockets/socket';
import { cleancartmake  , cleancartitem , cleansearch } from '@/interfaces/typedic' ;

const session = await  getServerSession(authOptions)
const stripePromise = loadStripe('')
app.post("/productvalue" , async(req , res)=>{
	const {productid} : {productid : string} = await req.body;
	const userid : {userid:string} = session.user.id;
	const productvalues : cleancartmake = await cartsearch({productid});
	const variables = { ...productvalues , ...userid};
    const sendvalues = async()=>{
		        const producer =  kafka.producer();
                        await producer.connect();

			producer.send({
				topic:'P-S',
				messages:[{
					value : JSON.stringify(variables)
				}],
			});

			await producer.disconnect();
	}

	return res.status(200).json(productvalues);
});

app.get("/checkoutsession" , async (req , res)=>{
	const {userid} = await req.body;

	const cart : cleansearch[] = await checkoutcall(userid);
	const search  =  await Promise.all(cart.map(async(items)=>{
		const key = `stock-${items.productid}`
		const data = await redis.get(key);
		const parse : cleancartitem =  JSON.parse(data || "{}")
		const check = parse.stockleft - items.quantity ; // see how to do undefined stocks 
		const available =  check > 0 ;
		return {
			...parse ,
			available ,
			productname : items.productname,
			imageurl : items.imageurl ,
			quantity : items.quantity
		}
	}));

	const unavailable =  search.filter((t)=> !t.available );
	const available = search.filter((t) => t.available);


	if(unavailable.length > 0){
		const key =  `cart-${userid}`
		const set  = await Promise.all(available.map(async(items)=>{
		       const value : cleansearch= {productid : items.productid , productname : items.productname  , price : items.price , imageurl : items.imageurl ,quantity : items.quantity};
		       return value
	       }))
		await redis.set(key , JSON.stringify(set) )
		res.json({
		      unavailable
		})
	}else{
		const senddata =  await fetch("/payment" , {
		method:"POST" ,
		headers:{
			"Content-Type" : "application/json"
		},
		body: JSON.stringify(cart)
	    });

	    const {id} = await senddata.json();
	    const stripe = await stripePromise ;
	    await stripe?.redirectToCheckout({sessionId : id})
	}
})

app.get("/cart" , async (req , res)=>{
	const userid =  session.user.id ;
	socket.send("reconnnect")
	const key = `cart-${userid}`
	const value = await redis.get(key)
	const parse : cleansearch[]= JSON.parse(value || "[]");
	const reset =  await redis.set(key, JSON.stringify(parse) ,"EX" ,172800 );
	if(!value){
		return res.status(200).json({
			message : "there is nothing in the cart kindly add "
		})
	}
	return res.status(200).json(parse)
})
