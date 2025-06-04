import { redis } from "../rediscluter"; 
import {Queue, Repeat} from "bullmq";

const cachecleanqueue  =  new Queue("clear-cache" , {
    connection:redis
});

const cartnotification =  new Queue("cart-notification"  , {
    connection:redis
});

await cartnotification.add('cart-notification' , {
    repeat:{
        every : 60 * 60
    },
    removeOnComplete : true
})

await cachecleanqueue.add('clean-search-cache' , {
    repeat:{
        every : 1000 * 60 * 60
    },
    removeOnComplete:true
})



export {cachecleanqueue};
