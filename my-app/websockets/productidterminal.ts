
import { Socket } from "socket.io";
import { io } from "./backsocket";
import { admin , db } from "@/services/firebase-admin";
import { error } from "console";


const userTimer = new Map<string, NodeJS.Timeout>();

function resetuserTimer(socket: Socket){
    const socketId = socket.id
    if (userTimer.has(socketId)){
        clearTimeout(userTimer.get(socketId))
    }

    const timeout =  setTimeout(()=>{
        for(const room of socket.rooms){
            if(room !== socket.id){
                socket.leave(room)
            }
        }

        userTimer.delete(socketId)
    },10*60*1000)

    userTimer.set(socketId , timeout)
}

io.on("connection" , (socket:Socket)=>{
    socket.on("subscribe-products" , async(productid : string , userid : string)=>{ //add string userid to the sender to 
            socket.join(`product-${productid}`)
            console.log("the group for the productid is made" , productid)
            const data =  await db.collection("userid").get();
            const value = data.docs.map((doc)=>({
                id : doc.id , 
                token  :  doc.data().token
            }));
            const search =  value.find((t)=> t.id == userid)
            if(search){
                         await admin.messaging().subscribeToTopic(`product-${productid}` , search.token)
            }
            resetuserTimer(socket)
        });
    
        socket.on("reconnect" , ()=> {
            resetuserTimer(socket)
        })

    socket.on(`productstocks` , async(stockinfo : {productid : string , stock : number})=>{
        const {productid , stock} = stockinfo; //not yet used 

        io.to(`product-${productid}`).emit("stocklistener" ,{productid , stock});
        await admin.messaging().send({
            notification:{
                title:"THE ITME IS GOING OUT OF STOCK" , 
                body :`the item ${productid} is going out of stock fast comee check out now`
            },
            topic : `product=${productid}`
        })
    })

    socket.on('priceproduct' , async(priceinfo : {productid: string ,  price :number})=>{
        const {productid ,  price } = priceinfo;  //not yet used
        io.to(`product-${productid}`).emit("pricelistener" , {productid , price});
        const value  = await  db.collection("userid").get();
        await admin.messaging().send({
            notification:{
                title : "PRICE DROP" , 
                body : `the item ${productid} in your cart just fdrop in price onn on by `
            },
            topic:`product-${productid}`
        })
    })

    socket.on("leavegroup" , async(message)=>{ //not yet used 
        const {userid} =  message as {userid : string}
        for(const room in socket.rooms){
           if(room !== socket.id){
            socket.leave(room)
           }
        }
        const data = await db.collection("userid").get();
        const value =  data.docs.map(docs =>({
            id: docs.id ,
            token : docs.data().token,
            groups : docs.data().groups
        }))
        const search = value.find((t)=> t.id == userid);
        const grps   = search?.groups;
        for( const group of grps){
            admin.messaging().unsubscribeFromTopic(search?.token , group)
                 .catch(error=>{
                    console.log("error removing the group" , group)
                 })
            
        }
    })

    socket.on("types" ,  (message)=>{
        const {type , subtype , token} =  message;
        socket.join(`type-${type}-${subtype}`);
        admin.messaging().subscribeToTopic(token , `type-${type}-${subtype}`)
              .catch(error=>{
                console.log(error)
              })
    })

    socket.on("price" ,  (message)=>{
        const {price , type  , subtype } = message as {price :  number  , type :  string ,  subtype : string };
        io.to(`type-${type}-${subtype}`).emit("notication" , {type ,subtype,price})
    })

    socket.on("stock" ,  (message)=>{
        const {stock, type  , subtype } = message as {stock  :number , type  :  string  ,  subtype :  string};
        io.to(`type-${type}-${subtype}`).emit("notication" , {type ,subtype,stock})
    })

    socket.on("flashsale" , async(message)=>{
        const {productname , type , subtype  , price  , detail} = message as {productname : string , type : string , subtype : string  , price : number  , detail :  string}; // for the in app notification 
        io.to(`type-${type}-${subtype}`).emit("notification" , {productname , type , subtype  , price  , detail})
        await admin.messaging().send({ //for the outer notification 
            notification : {
                title : 'FLASH SALE' ,
                body : ` YOUR FAVORITE ITMES ${subtype} ARE STARTING A FLASH SALE COME CHECK IT OUT `
            },
            topic : `type-${type}-${subtype}`
        })
    })
})