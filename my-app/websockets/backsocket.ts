import {Server} from "socket.io";
import { createServer } from "http";
import express from 'express';

const app = express();
const httpServer  =  createServer(app);

export const io  =  new Server(httpServer , {
    cors : {
        origin : "*",
        methods : ["GET" , "POST"]
    }
});

const port  =  3000 ;
httpServer.listen(port , ()=>{
     console.log(`the  websockets are now running on the serve ${port}`)
});

