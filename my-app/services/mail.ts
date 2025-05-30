import express from 'express';
import sgMail from "@sendgrid/mail";


const app =  express();

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