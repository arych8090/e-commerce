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
	typesinterections( userid: String!) : typesinterections
	producttypes(productid : String!):producttype
	fuzzysearch(productname : String!):fuzzysearch
	search(productname : String!):search
},

type Mutation{
}`

export {typeDefs};
