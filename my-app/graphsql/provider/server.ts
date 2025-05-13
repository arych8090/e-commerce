import {ApolloServer} from '@apollo/server';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import {typeDefs} from './typeref';
import {resolvers} from './resolver';
import {expressMiddleware} from '@apollo/server/express4';
import {buildSubgraphSchema} from '@apollo/subgraph';

const app = express();
const PORT = 4007;
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
	console.log(" the Provider sql Server is running in the 4007 port")
});

