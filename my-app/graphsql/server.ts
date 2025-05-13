import {ApolloGateway} from '@apollo/gateway';
import {expressMiddleware} from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import {ApolloServer} from '@apollo/server';

const app = express();

const gateway =  new ApolloGateway({
        serviceList:[
                {name:"user" , url:"http://localhost:4001/graphsql"},
                {name:"product" , url:"http://localhost:4002/graphsql"},
                {name:"orders" , url:"http://localhost:4003/graphsql"},
                {name:"interections" , url:"http://localhost:4004/graphsql"},
                {name:"typeinterections" , url:"http://localhost:4005/graphsql"},
                {name:"types" , url:"http://localhost:4006/graphsql"},
                {name:"provider" , url:"http://localhost:4007/graphsql"},
                {name:"finance" , url:"http://localhost:4008/graphsql"}
        ]
});

const server =  new ApolloServer({gateway});
await server.start();

app.use(
        "/graphsql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server)
);

app.listen(4000 , ()=>{
        console.log("The gateway is  running in the server 4000");
})
