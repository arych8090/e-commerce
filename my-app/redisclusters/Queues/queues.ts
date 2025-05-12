import { redis } from "../rediscluter"; 
import {Queue} from "bullmq";

const firstqueue  =  new Queue("initialqueue" , {
    connection:redis
});

export {firstqueue};
