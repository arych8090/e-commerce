import {app} from './handler';
import { cartsearch } from '@/querycalls/cartcalls';
import { checkoutcall } from '@/querycalls/checkoutcall';
import { kafka } from '@/kafkaserver/server'; 
import { authOptions } from '../lib/auth';
import { getServerSession } from 'next-auth';
import {loadStripe} from '@stripe/stripe-js';
import { redis } from '@/redisomserver/mainredis';

const session = await  getServerSession(authOptions)
const stripePromise = loadStripe('')
app.post("/productvalue" , async(req , res)=>{
	const {productid} : {productid : string} = await req.body;
	const userid : {userid:string} = session.user.id;
	const productvalues : {productid : string , productname: string , price : number  ,imageurl : string , quantity : 1} = await cartsearch({productid});4
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

	const cart : {productid : string ,  productname:string , price:number, imageurl : string , quantity : number}[] = await checkoutcall(userid);
	const search  =  await Promise.all(cart.map(async(items)=>{
		const key = `stock-${items.productid}`
		const data = await redis.get(key);
		const parse : {productid : string , stock : number , price : number , sale : number , type : string , subtype : string }  =  JSON.parse(data || "{}")
		const check = parse.stock - items.quantity ;
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
		await redis.del(key)
		const set  = await Promise.all(available.map(async(items)=>{
		       const key  = `cart-${items.productid}`;
		       await redis.del(key)
		       const value : {productid : string  , productname : string  , price  : number  ,  imageurl : string , quantity : number }= {productid : items.productid , productname : items.productname  , price : items.price , imageurl : items.imageurl ,quantity : items.quantity};
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

