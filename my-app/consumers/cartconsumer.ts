import { kafka } from "./../kafkaserver/server";
import { redis } from "./../redisomserver/mainredis";
import socket from "@/websockets/socket"

export const consumercart = async () => {
	const consumer = kafka.consumer({ groupId: 'cart-group' }); // ✅ Fix here

	await consumer.connect();
	await consumer.subscribe({ topic: 'P-S', fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, message }) => {
			const rawValue = message?.value?.toString();
			const parsed : {productid : string , userid : string , productname : string  , price:number , imageurl:string ,quantity : number} = JSON.parse(rawValue || '{}');

			const {
				productid,
				userid,
				productname,
				price,
				imageurl,
				quantity
			} = parsed;

			const key  =  `cart-${userid}`
			const value =  await redis.get(key)
			const parse  : {productid  :string  , productname :string , price : number ,imageurl : string ,quantity : number}[] = JSON.parse(value || "[]");

			const search =  parse.find((t) => t.productid == productid);

			if(search){
				search.quantity += 1
			}else{
				parse.push({productid ,productname ,price , imageurl ,quantity})
				socket.emit("subscribe-products" , productid )
			}
			await redis.hset(key , JSON.stringify(parse))
			console.log('Data saved in Redis for:', userid);
		}
	});
};


consumercart().catch((err) => {
	console.error('Consumer error:', err);
});
