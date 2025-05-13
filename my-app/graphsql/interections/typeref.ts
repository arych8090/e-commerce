import {gql} from 'graphql-tag';

const typeDefs = gql`
scalar DateTime
type interactions{
	userid : String!
	typeinterections: [String!]
	subtypeinterections: [String!]
}
type Query{
}
type Mutation{
}`

export {typeDefs};
