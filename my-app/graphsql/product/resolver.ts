import {GraphQLDateTime} from 'graphql-scalars';
import {ProductRepository} from './../../redisomserver/redisomserver';
import {redis} from './../../redisomserver/mainredis'

export const resolvers ={
	DateTime: GraphQLDateTime,
	Query:{
		product:async(_:any , args:{productid : string})=>{
			const productid = args;

			const products  = await ProductRepository
			                       .search()
					       .where('productid')
					       .equal(`${productid}`)
					       .return
					       .all();
			if (products.length === 0) throw new Error("No matching product");
		    const product = products[0];
	        return ({
			       productid : product.productid,
			       productname : product.productname,
			       stockleft : product.stockleft,
			       price : product.price ,
			       provider : product.provider , 
			       imageurl : product.imageurl
		       });

		},
		cart:async(_:any , args:{userid : string})=>{
			const userid = args ;
			const key =  `cart:${userid}`
			const value = await redis.hgetall(key);

			const parsedvalues = Object.entries(value).map(([productid ,value]) => {
				const parsed =  JSON.parse(value);
				return{productid , ...parsed};
			});

			return parsedvalues;
		}
        
    },
	Mutation:{

    }
};
