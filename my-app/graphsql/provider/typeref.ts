import { gql } from 'graphql-tag';

const typeDefs = gql`
type user{
    providername: String!
    providerid: String!
    email: String!
    products:[String]
}
type Query{
}
type Mutation{
}`

export {typeDefs};
