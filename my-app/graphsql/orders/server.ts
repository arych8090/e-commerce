import {ApolloServer} from '@apollo/server';
import express from 'express';
import cors from 'cors';
import bodyParser  from 'body-parser';
import {expressMiddleware} from '@apollo/server/express4';
import {typeDefs} from './typeref';
import {resolvers} from './resolver';
import {buildSubgraphSchema} from '@apollo/subgraph';
const PORT = 4003 ;
const app = express();

const server =  new ApolloServer({
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
	console.log("The order sql is running in the port 4003")
});
