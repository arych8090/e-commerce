import  express from 'express';
import  Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';

const app =  express();
const port = 7000 ;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string , {
    apiVersion : '2025-04-30.basil'
})

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.post('/payment' , async(req,res)=>{
    const data  =  req.body as {productid : string , userid: string , productname:string , stockleft : number , price:number ,provider : string , imageurl : string , quantity: number}[];
    
    const line_items = data.map((items)=>({
        pricedata : {
            currency : 'usd',
            product_data : {
                name  : items.productname ,
                images: items.imageurl
            },
            unit_amount : items.price
        },
        quantity : items.quantity
    }))

    try{
        const session =  await stripe.checkout.sessions.create({
            payment_method_types : ['card' , 'amazon_pay'] ,
            line_items ,
            mode : 'payment',
            success_url : `${process.env.CLIENT_URL}/success`,
            cancel_url : `${process.env.CLIENT_URL}/cancel`
        });

        res.json({id : session.id})
    }catch(err : any){
        console.error('Stripe error : ' ,err)
        res.status(500).json({message : err.message})
    }
})

app.listen(port ,()=> {
    console.log("server running in the port 7000")
})