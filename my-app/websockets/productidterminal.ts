
import { Socket } from "socket.io";
import { io } from "./backsocket";

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

    socket.on(`productstocks` , (stockinfo : {productid : string , stock : number})=>{
        const {productid , stock} = stockinfo; //not yet used 

        io.to(`product-${productid}`).emit("stocklistener" ,{productid , stock})
    })

    socket.on('priceproduct' , (priceinfo : {productid: string ,  price :number})=>{
        const {productid ,  price } = priceinfo;  //not yet used

        io.to(`product-${productid}`).emit("pricelistener" , {productid , price})
    })

    socket.on("leavegroup" , ()=>{ //not yet used 
        for(const room in socket.rooms){
           if(room !== socket.id){
            socket.leave(room)
           }
        }
    })

    socket.on("types" ,  (message)=>{
        const {type , subtype} =  message;
        socket.join(`type-${type}-${subtype}`)
    })

    socket.on("price" ,  (message)=>{
        const {price , type  , subtype } = message;
        io.to(`type-${type}-${subtype}`).emit("notication" , {type ,subtype,price})
    })

    socket.on("stock" ,  (message)=>{
        const {stock, type  , subtype } = message;
        io.to(`type-${type}-${subtype}`).emit("notication" , {type ,subtype,stock})
    })
})