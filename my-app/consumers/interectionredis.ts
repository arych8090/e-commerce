import {redis} from "@/redisclusters/rediscluter";
import { kafka } from "@/kafkaserver/server";
import socket from "@/websockets/socket";


const consumerredis = kafka.consumer({groupId:"redis-interections"});
await consumerredis.connect();
await consumerredis.subscribe({topic:"Interections" , fromBeginning:true})
await consumerredis.run({
    eachMessage: async({topic , message})=>{
        const raw  =  message.value?.toString();
        const parses = JSON.parse(raw || "{}")
        const {types , subtypes , userid} = parses;

        const key  = `interection-${userid}`;
        const lastRoomKey = `user-last-room-${userid}`;
        const value  =  await redis.hget(key , "types");
        const parse : {types : {name :string , count :number}  , subtypes:{ name : string , count : number}[]}[] = JSON.parse(value ||  "[]");

        const search =   parse.find((t)=> t.types.name == types);

        if(search){
             search.types.count += 1;
             const subsearch =  search.subtypes.find((t)=> t.name  == subtypes );
            if (subsearch){
                 subsearch.count += 1 
            }else{
                 search.subtypes.push({name: subtypes , count : 1})
            }
        }else{
            parse.push({types:types , subtypes:[{ name :subtypes , count :1}]})
        }
        await redis.hset(key , "types" , JSON.stringify(parse));
        await redis.expire(key , 172800);

        const toptypes = async()=>{
            const interectiondata = await redis.hget(key , "types") ;
            const dataparse : {types : {name : string ,count : number}, subtypes:{name : string , count  : number}[] }[] = JSON.parse(interectiondata || "[]");
            const lenght  =  dataparse.length;

            if(lenght>0){
                const sort  =  dataparse.sort((a,b)=> b.types.count - a.types.count);
                const top  =  sort[0] ;
                const subsort =  top.subtypes.sort((a,b)=> b.count - a.count)
                const topsub = subsort[0].name
                const result = { type : top.types.name , subtype: topsub} 

                const lastroom  =  await redis.get(lastRoomKey);

                if (lastroom !== `type-${top.types.name}`){
                   await redis.set(lastRoomKey , `type-${top.types.name}`) 
                   socket.emit("types" , result )
                   console.log("the top type and it subtype has been send ")
                   
                }
            }
        }

        toptypes()
    }
})