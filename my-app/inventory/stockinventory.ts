import  {redis} from "@/redisclusters/rediscluter"
import  {kafka} from "@/kafkaserver/server";
import socket from "@/websockets/socket";

const stockconsumer =  kafka.consumer({groupId:"stock-management"})
await stockconsumer.connect();
await stockconsumer.subscribe({topic:"stock" , fromBeginning:true})
await stockconsumer.run({
    eachMessage : async({topic , message})=>{
         const raw =  message?.value?.toString();
	 const parse =  JSON.parse(raw || "{}");
	 const {productid,stock,price, sale , type , subtype } = parse ;
	 const key = `stock-${productid}`;

	 const value= await redis.get(key);
	 const data : {productid : string , stock: number , price:number , sale:number} = JSON.parse(value || "{}");

	 const oldprice =  data.price;
	 if(data.productid === productid){
	    if (data.stock !== stock){
	        data.stock = stock
			if(stock<=10){
		        socket.emit("stock" , {stock,type,subtype}),
		        console.log("new stock update send")
			}
	    }
	    if(data.price !== price){
	        data.price = price
		    if(pricealertcheck()){
				socket.emit("price" , {price , type , subtype}),
		        console.log("new price send dur to dropoff")
			}
	    }
	    if(data.sale !== sale){
	        data.sale = sale 
	    }
		await redis.hset(key , JSON.stringify(data))
	 }else{
	    const newdata =  {productid : productid , stock : stock , price : price , sale:sale , type:type , subtype:subtype}
	    await redis.hset(key ,JSON.stringify(newdata));
	 }

	 function pricealertcheck() {
        if (!oldprice || oldprice <= 0) return false;

        const discount = sale / 100; 
        const priceDrop = 1 - price / oldprice; 

        if (discount > 0) {
            return discount >= 0.3; 
        } else {
            return priceDrop >= 0.3; 
        }
}

    }
})
