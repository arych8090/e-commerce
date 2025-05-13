import {ApolloServer} from '@apollo/server';
import {buildSubgraphSchema} from '@apollo/subgraph';
import express from 'express';
import 	bodyParser from 'body-parser';
import cors from 'cors';
import {typeDefs} from './typeref'
import {resolvers} from './resolver';
import {expressMiddleware} from '@apollo/server/express4';

const app = express();
const PORT = 4004 ;

const server = new ApolloServer({
	schema: buildSubgraphSchema({
		typeDefs , 
		resolvers
	})
});

await server.start();

app.use(
	'/graphsql',
	cors(),
	bodyParser.json(),
	expressMiddleware(server)
);

app.listen(PORT , ()=>{
	console.log("The interection sql is running in the port 4004")
});
