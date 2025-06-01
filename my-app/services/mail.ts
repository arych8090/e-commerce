import express from 'express';
import sgMail from "@sendgrid/mail";
import {getToken} from 'firebase/messaging'
import messaging from './firebase';
import {redis} from '@/redisclusters/rediscluter'
const app =  express();
import {db} from './firebase-admin';
import socket from '@/websockets/socket';


app.use(express.json());

const port  = 6000;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string
sgMail.setApiKey(SENDGRID_API_KEY);


app.post("/sendgrid" , async(req , res)=>{
    const {email , otp} =  req.body;
     const msg = {
        to : email,
        from : 'lucifer.morningstar.7789@gmail.com',
        subject : 'OTP CHECK',
        text: `The Otp for the verification of your id is ${otp}` ,
        html: '<strong>do not share this with anyone else</strong>',
     };
    
     try {
        await sgMail.send(msg);
        console.log("OTP sent successfully");
        return true;
     } catch (error: any) {
        console.error(error.response?.body?.errors || error.message || error);
        return false;
     }
})

app.post("firebasenotification" , (req ,  res)=>{
   socket.on("notification" , async(message)=>{
      const  {productname , type , subtype  , price  , detail} = message as {productname : string , type : string , subtype : string  , price : number  , detail :  string};
      const tokens =  await db.collection('users').get()

      const data  = await tokens.docs.map(docs => ({
         id : docs.id ,
         ...docs.data()
      }))
   })
})

app.post("/firebase" , async(req,res)=>{//the access to send notificatio should be in the main page only during the signina and if decilend initally then when user order something or gets sub to group show check if is assinged with the token if not ask again  
    const userid  =  req.body as string;

    const permission = req.body as string ;

    if(permission){
      const token = await getToken(messaging ,{vapidKey : "BK5tuhyuQ49kReBjkWto2fdGWrWV-JOfI63Eo0VIYX3SlKp33z9286nNwe8i7mLR4lrLcR3sAyEfrisydGPHILQ"})
      await db.collection('users').doc(userid).set({
         token : token,
         groups : []
      });
      socket.send("types" , {token})
    }else {
      console.warn("access denied for notification")
    }

})