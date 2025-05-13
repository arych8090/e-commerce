import {ApolloServer} from '@apollo/server';
import express from 'express';
import bodyParser from 'body-parser';
import {expressMiddleware} from '@apollo/server/express4';
import cors from 'cors';
import {buildSubgraphSchema} from '@apollo/subgraph';
import {typeDefs} from './typeref';
import {resolvers} from './resolver';

const PORT = 4002;
const app = express();

const server =  new ApolloServer({
	schema: buildSubgraphSchema({typeDefs ,resolvers})
});


await server.start();

app.use(
	'/graphsql',
	cors(),
	bodyParser.json(),
	expressMiddleware(server)
);

app.listen(PORT , ()=>{
	console.log("The product sql is runnin in the port 4002");
});


