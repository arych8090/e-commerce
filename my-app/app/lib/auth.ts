import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { GOOGLE_ID , GOOGLE_SECRET ,APPLE_ID ,APPLE_SECRET } from "../jwtoken/config";
import { signToken } from "../jwtoken/Tokenn";
import prisma from "@/db";

export const authOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials :{
                username : {label:"Userid" , type:"text" , placeholder:"Userid"},
                email : {label:"Email" , type:"text" , placeholder:"Email"},
                phonenumber : {label:"PhoneNumber" , type:"text" , placeholder:"1234123412"},
                password : {label:"Password" , type:"text" , placeholder:"******"}
            },
            async authorize(credentials:any , req){
                const hashedpassword = await bcrypt.hash(credentials?.password , 10);
                const existinguser = await prisma.user.findFirst({
                    where : {
                        userid : credentials.username
                    }
                });
                if(existinguser){
                    const checkpasssword =  await bcrypt.compare(credentials.password , existinguser?.password );
                    if(checkpasssword){
                        return {
                            id : existinguser.userid, 
                        }
                    }
                    return null
                }
                
                try{
                    const newuser = await prisma.user.create({
                        data:{
                            userid : credentials.userid,
                            password : hashedpassword,
                            phonenumber : credentials.phonenumber,
                            email : credentials.email,
                            role : "user"
                        }
                    });
                    console.log("new user has been created")
                    return({
                        id : newuser.userid,
                        email : newuser.email,
                        role : newuser.role
                    })
                }catch(e){
                    console.error(e)
                }
                return null
            }
        }),
        GoogleProvider({
            clientId:GOOGLE_ID,
            clientSecret:GOOGLE_SECRET
        }),
        AppleProvider({
            clientId:APPLE_ID,
            clientSecret:APPLE_SECRET
        })
    ],
    
    callbacks : {
        async signIn({user , account , profile , email , credentials} : any){
            if(account?.provider !== 'Credentials'){
                const existing = await prisma.user.findFirst({
                    where : {
                        email : user.email
                    }
                });
                if(!existing){
                    const newuser = await prisma.user.create({
                        data:{
                            userid : user.id ,
                            email : user.email ,
                            provider : account.provider
                        }
                    })
                    console.log("new user has been created");
                }else{
                    console.error("user can't be created ")
                }
            }
            return true 
        },

        async jwt({token , user , account} : any){
            if(user){
                if(account?.provider === 'Credentials'){
                    token.provider = account.provider;
                    token.id = user.id ;
                    token.role = user.role || "user" ;
                    token.email = user.email;
                    token.accesstoken = await signToken({userid:token.id , role:token.role});
                }else{
                    token.provider = account.provider;
                    token.id = user.id ;
                    token.role = user.role || "user" ;
                    token.email = user.email;
                    token.accesstoken = account.access_token;
                }
            }
            return token
        },

        async session({session , token}:any){
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.accesstoken = token.accesstoken;
            session.user.email = token.email;

            return session
        },

        async redirect({url ,baseUrl}:{url : string , baseUrl : string}){
            if (url.startsWith(baseUrl)) {
                return url; 
            
            }
              return baseUrl;
        }
    }
}