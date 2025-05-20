import {gql} from 'graphql-tag';

const typeDefs = gql`
scalar DateTime
type product{
	productid: String!
	productname: String!
	productType: String!
	productSubtypes: [String!]
	price: Number!
	imageurl: String!
	aboutproduct: String!
	stockleft: Number
	discount: Number
	rating: Number
	created: DateTime 
	likes: Number 
},

type Query{
	product(productid : String!):product
	cart(userid : String!):cart
	producttypes( productid : String! , userid: String!) : producttypes
},

type Mutation{
}`

export {typeDefs};
