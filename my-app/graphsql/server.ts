import {ApolloGateway} from '@apollo/gateway';
import {expressMiddleware} from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import {ApolloServer} from '@apollo/server';

const app = express();

const gateway =  new ApolloGateway({
        serviceList:[
                {name:"user" , url:"http://user-service:4001/graphsql"},
                {name:"product" , url:"http://product-service:4002/graphsql"},
                {name:"orders" , url:"http://orders-service:4003/graphsql"},
                {name:"interections" , url:"http://interections-service:4004/graphsql"},
                {name:"typeinterections" , url:"http://typeinterections-service:4005/graphsql"},
                {name:"types" , url:"http://types-service:4006/graphsql"},
                {name:"provider" , url:"http://provider-service:4007/graphsql"},
                {name:"finance" , url:"http://finance-service:4008/graphsql"}
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
