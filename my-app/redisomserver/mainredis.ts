import {Redis} from "ioredis";
import {Client} from "redis-om";

const redis = new Redis("userid" ,{
    port:6379,
    host:"localhost",
    password:"mysupersecret"
});

export const redisomclient = new Client();


async function initializeRedisOM() {
    await redisomclient.open("redis://:mysupersecret@localhost:8080");
}
  
initializeRedisOM().catch((err) => console.error("Failed to initialize Redis OM:", err));


export {redis};