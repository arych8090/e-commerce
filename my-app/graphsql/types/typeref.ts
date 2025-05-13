import { gql } from 'graphql-tag';

const typeDefs = gql`
type user{
    type: String!
    subtypes:[String]
}
type Query{
}
type Mutation{
}`

export {typeDefs};
