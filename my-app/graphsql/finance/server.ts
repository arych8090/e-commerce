import {ApolloServer} from '@apollo/server';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import {typeDefs} from './typeref';
import {resolvers} from './resolver';
import {expressMiddleware} from '@apollo/server/express4';
import {buildSubgraphSchema} from '@apollo/subgraph';

const app = express();
const PORT = 4008;
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
	console.log(" the finance sql Server is running in the 4008 port")
});

