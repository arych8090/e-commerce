import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import { Otpcheck } from "@/services/mail";

let otpstore: Record<string , {otp:number , attempts :number}>={}

export async function  Verifiaction({userotp}: {userotp:number}){
    const session = await getServerSession(authOptions);

    if(!session){
        throw new Error("the session was not found")
    }
    const email = session?.user?.email;
    const usertopdata = otpstore[email];

    if(!usertopdata){
        const newotp = Math.floor(1000+Math.random()*10000);
        otpstore[email] = {otp:newotp , attempts:3};
        await Otpcheck({email , newotp});
        return({
            status : "otp sent",
            message : "otp sent to your email"
        });
    }

    if(usertopdata.attempts<=0){
        delete otpstore[email];
        return({
            status : "Failed",
            message : "too many attempts"
        })
    }

    if(userotp === usertopdata.otp){
        delete otpstore[email];
        return({
            status : "Success",
            message : "OTP Verified"
        })
    }else{
        otpstore[email].attempts -= 1;
        const newotp = Math.floor(1000+Math.random()*10000);
        otpstore[email].otp = newotp;
        await Otpcheck({email , newotp});
        return({
            status : "retry",
            message : `Incorrect OTP . You have ${otpstore[email].attempts} left ,  new otp sent`
        })
        
    }

}