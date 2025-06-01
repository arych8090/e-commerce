
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
    socket.on("subscribe-products" , (productid : string)=>{
            socket.join(`product-${productid}`)
            console.log("the group for the productid is made" , productid)
            resetuserTimer(socket)
        });
    
        socket.on("reconnect" , ()=> {
            resetuserTimer(socket)
        })

    socket.on(`productstocks` , (stockinfo : {productid : string , stock : number})=>{
        const {productid , stock} = stockinfo; //not yet used 

        io.to(`product-${productid}`).emit("stocklistener" ,{productid , stock})
    })

    socket.on('priceproduct' , (priceinfo : {productid: string ,  price :number})=>{
        const {productid ,  price } = priceinfo;  //not yet used

        io.to(`product-${productid}`).emit("pricelistener" , {productid , price})
    })

    socket.on("leavegroup" , async(message)=>{ //not yet used 
        const {userid} =  message as {userid : string}
        for(const room in socket.rooms){
           if(room !== socket.id){
            socket.leave(room)
           }
        }
        const data = await db.collection("userid").get();
        const value =  await data.docs.map(docs =>({
            id: docs.id ,
            ...docs.data()
        }))
        const search = value.find((t)=> t.id == userid);
        const grps  = [...search.groups];
        for( const group of grps){
            admin.messaging().unsubscribeFromTopic(search.token , group)
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

    socket.on("flashsale" , (message)=>{
        const {productname , type , subtype  , price  , detail} = message as {productname : string , type : string , subtype : string  , price : number  , detail :  string};
        io.to(`type-${type}-${subtype}`).emit("notification" , {productname , type , subtype  , price  , detail})
    })
})