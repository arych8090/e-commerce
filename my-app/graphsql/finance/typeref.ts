import { gql } from 'graphql-tag';

const typeDefs = gql`
type user{
    providerid: String!
    totalincome: Number!
    totalexpense: Number!
    totalrevenue: Number!
    totalrevenue: Number!
    perproductprice:[String!]
    totalproductprice: [String!]
    productinventory:[String!]
    productsell:[String!]
}
type Query{
}
type Mutation{
}`

export {typeDefs};
