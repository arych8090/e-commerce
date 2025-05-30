import express from "express";
import {kafka} from "@/kafkaserver/server";
const app =  express();
const port =  2000 ;

app.post("/productcreation" , async(req,res)=>{
	const {productid , productname , price , description , type , subtype , providername , stock , sale} = req.body;
	const producer =  kafka.producer();
	await producer.connect();
	await producer.send({topic:"stock" ,
			             messages:[{
				                  value : JSON.stringify({productid ,price ,type ,subtype ,stock ,sale})
			             }]
                        });

	await producer.disconnect();
	res.status(200).json({
		msg:"the file have been send to the db,redis and redisom"
	})
});
