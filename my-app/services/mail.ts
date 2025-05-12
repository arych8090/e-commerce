
import dotenv from "dotenv";
dotenv.config();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(SENDGRID_API_KEY);



export async function Otpcheck({otp , useremail}:any){
    const msg = {
        to : useremail,
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
}