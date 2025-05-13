import { gql } from 'graphql-tag';

const typeDefs = gql`
type user{
	username: String!
	userid: String!
	address: String!
	order:[String]
}
type Query{
}
type Mutation{
}`

export {typeDefs};
