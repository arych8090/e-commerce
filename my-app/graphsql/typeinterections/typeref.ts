import { gql } from 'graphql-tag';

const typeDefs = gql`
type user{
    type: String!
    typeinterectiongeneral: String!
    subtypesinterections: [String!]
    subtypes:[String]
}
type Query{
}
type Mutation{
}`

export {typeDefs};
