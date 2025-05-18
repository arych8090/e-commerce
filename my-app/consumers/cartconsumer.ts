import { kafka } from "./../kafkaserver/server";
import { redis } from "./../redisomserver/mainredis";

export const consumercart = async () => {
	const consumer = kafka.consumer({ groupId: 'cart-group' }); // ✅ Fix here

	await consumer.connect();
	await consumer.subscribe({ topic: 'P-S', fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, message }) => {
			const rawValue = message?.value?.toString();
			const parsed = JSON.parse(rawValue || '{}');

			const {
				productid,
				userid,
				productname,
				stockleft,
				price,
				provider,
				imageurl,
			} = parsed;

			await redis.hset(`cart:${userid}`, productid, JSON.stringify(parsed));
			await redis.expire(`cart:${userid}`, 259200);

			console.log('Data saved in Redis for:', userid);
		}
	});
};


consumercart().catch((err) => {
	console.error('Consumer error:', err);
});
