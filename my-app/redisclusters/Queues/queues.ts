import { redis } from "../rediscluter"; 
import {Queue} from "bullmq";

const cachecleanqueue  =  new Queue("clear-cache" , {
    connection:redis
});

await cachecleanqueue.add('clean-search-cache' , {
    repeat:{
        every : 1000 * 60 * 60
    },
    removeOnComplete:true
})

export {cachecleanqueue};
