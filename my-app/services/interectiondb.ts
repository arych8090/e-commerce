import { kafka } from "@/kafkaserver/server";
import prisma from "@/db";


export const dbinterectionsync = async()=>{
    const consumer = kafka.consumer({groupId:'db-group'});

    await consumer.connect();
    await consumer.subscribe({topic:"Interections" , fromBeginning:true});
    await consumer.run({
        eachMessage : async({topic , message})=>{
            const raw = message.value?.toString();
            const parse = JSON.parse(raw || "{}");

            const {type , subtype , userid} = parse;

            const user =  await prisma.user.findUnique({
                where:{
                    userid : userid
                }
            });

            const typeinterection =  await prisma.usertypeinterection.upsert({
                where:{
                    type_userid:{
                        type,
                        userid : user.id
                    }
                },update:{
                    count: {increment : 1}
                },create:{
                    type : type,
                    count:1,
                    user : {connect:{id:user.id}},
                }
            });

            const subtypeinterection = await prisma.usersubtypeinterections.upsert({
                where :{
                    subtypes_usertypeid:{
                        subtype,
                        usertypeid:typeinterection.id
                    }
                },update:{
                    count : {increment : 1}
                },create:{
                    subtypes :subtype,
                    count: 1,
                    usertypeinterections : {connect:{id:typeinterection.id}}
                }
            })
        }
    })
}