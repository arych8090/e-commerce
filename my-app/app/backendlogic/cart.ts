import {app} from './handler';
import { cartsearch } from '@/querycalls/cartcalls';
import { checkoutcall } from '@/querycalls/checkoutcall';
import { kafka } from '@/kafkaserver/server'; 
import { authOptions } from '../lib/auth';
import { getServerSession } from 'next-auth';
import {loadStripe} from '@stripe/stripe-js';

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

	res.status(200).json(productvalues);
});
//create a websocket connection in whuch send the cart checkoutcall data to the websockets with just the productid for group creation
app.get("/checkoutsession" , async (req , res)=>{
	const {userid} = await req.body;

	const cart : {productid : string ,  productname:string , price:number, imageurl : string , quantity : number}[] = await checkoutcall(userid);
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
})

