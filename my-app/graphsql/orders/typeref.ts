import {gql} from 'graphql-tag';

const typeDefs = gql`
scalar DateTime 
type order{
	userid : String!
	orderid : String!
	products : [String!]
	createdat : DateTime
	status : String!
}
type Query{
}
type Mutation{
}`

export {typeDefs};
