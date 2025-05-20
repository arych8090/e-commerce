import {GraphQLDateTime} from 'graphql-scalars';
import {ProductRepository} from './../../redisomserver/redisomserver';
import {redis} from './../../redisomserver/mainredis'
import { parseEnv } from 'util';

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
			const {userid} = args ;
			const key =  `cart:${userid}`
			const value = await redis.hgetall(key);

			const parsedvalues = Object.entries(value).map(([productid ,value]) => {
				const parsed =  JSON.parse(value);
				return{productid , ...parsed};
			});

			return parsedvalues;
		},
		producttypes:async(_:any , args:{productid : string , userid: string})=>{
			const {productid , userid} = args ;
			const key = `interection:${userid}`;
			const value  =  await redis.hget(key , "types");
			const parse: {types : {name :string ,  count: number} ,  subtypes:{name : string , count : number}[]}[] = JSON.parse(value || "[]");

			const length =  parse.length;

			if(length>0){
				const sort  =  parse.sort((a, b) => b.types.count - a.types.count);
				const top3 =  sort.slice(0,3);
				const subsort =  top3.map(types=>{
					const subtypes = types.subtypes.sort((a,b)=> b.count - a.count)
					const sortedsubtypes = subtypes.slice(0,3);
					return {type : types.types.name , subtypes :sortedsubtypes}
				});

				const globalarray : any[] = [];

				for(const items of subsort){
					const types = items.type;
					const subtype = items.subtypes
					const results = await Promise.all(
                                       subtype.map(sub =>
                                           ProductRepository.search()
                                           .where("productType").equal(types)
                                           .and("productSubtypes").equal(sub.name)
										   .sortDesc("productinterection")
                                           .returnAll()
                                     )
                                    );
					
                    const limitedResults = results.slice(0, 5);

					globalarray.push(...limitedResults);
				}

				return globalarray
		} 
    },
	Mutation:{

    }
}
}
