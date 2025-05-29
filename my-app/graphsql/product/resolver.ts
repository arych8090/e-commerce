import {GraphQLDateTime} from 'graphql-scalars';
import {ProductRepository} from './../../redisomserver/redisomserver';
import {redis} from './../../redisomserver/mainredis'
import prisma from '@/db';
import {Product} from '@/interfaces/interface'
import { error } from 'console';
import { equal } from 'assert';


export const resolvers ={
	DateTime: GraphQLDateTime,
	Query:{
		product:async(_:any , args:{productid : string})=>{
			const {productid} = args;

			const products  = await ProductRepository
			                        .search()
					                .where('productid')
					                .equal(`${productid}`)
					                .returnAll();
		    const product = products[0];
			if (products.length === 0) {
				try{
					const value  = await prisma.product.findUnique({
					where : {
						productid : productid
					},
					select :{
						productid : true ,
						productname : true ,
						price : true ,
						imageurl : true 
					}
				    })

				    return {
					productid : value.productid ,
					productname : value.productname,
					price : value.price ,
					imageurl : value.imageurl
				    }
				}catch{
					alert("no data available on the product ")
				}
			}
	        return {
			       productid : product.productid,
			       productname : product.productname,
			       price : product.price ,
			       imageurl : product.imageurl
		       };

		},
		cart:async(_:any , args:{userid : string})=>{
			const {userid} = args ;
			const key =  `cart:${userid}`
			const value  = await redis.get(key);
			const parse  : {productid  :string  , productname :string , price : number ,imageurl : string ,quantity : number}[] = JSON.parse(value || "[]");
			return parse;
		},
		typesinterections:async(_:any , args:{ userid: string})=>{
			const { userid} = args ;
			const key = `interection:${userid}`;
			const value  =  await redis.hget(key , "types");
			const parse: {types : {name :string ,  count: number} ,  subtypes:{name : string , count : number}[]}[] = JSON.parse(value || "[]");

			const length =  parse.length;

			const globalarray : any[] = [];
			if(length>0){
				const sort  =  parse.sort((a, b) => b.types.count - a.types.count);
				const top3 =  sort.slice(0,3);
				const subsort =  top3.map(types=>{
					const subtypes = types.subtypes.sort((a,b)=> b.count - a.count)
					const sortedsubtypes = subtypes.slice(0,3);
					return {type : types.types.name , subtypes :sortedsubtypes}
				});

				for(const items of subsort){
					const types = items.type;
					const subtype = items.subtypes
					const results = await Promise.all(
                                       subtype.map(async (sub) =>{
                                          const res =  await ProductRepository.search()
                                           .where("productType").equal(types)
                                           .and("productSubtypes").equal(sub.name)
										   .sortDesc("productinterection")
                                           .returnAll() as Product[];
										  
										   const slice  =  res.slice(0,5);
										   return slice
				                    })
                                    );
					
                    const limitedResults = results.flat();


					globalarray.push(...limitedResults);
				}

				async function shuffle(globalarrays : any[]){
					for(let i=globalarrays.length ; i>0 ; i-=1 ){
						const j = Math.floor(Math.random()*(i+1));
						[globalarrays[i] , globalarrays[j]] = [globalarrays[j] , globalarrays[i]]
					}
				}

				const shuffled = shuffle(globalarray);

				return shuffled
		    }else{  
				const value = await prisma.user.findUnique({
					where:{userid : userid} ,
					select : {
						usertypeinterection:{
							orderBy : {
								count : 'desc'
							},
							take : 3,
							select:{
								type : true ,
								usersubtypeinterections:{
									order:{
										count : 'desc'
									},
									take : 3,
									select:{
										subtypes :true
									}
								}
							}
						}
					}
				});
				const fallbackStructure = value?.userTypeInteractions.map(typeItem => {
                            return {
                                     types: {
                                         name: typeItem.type,
                                      },
                                     subtypes: typeItem.userSubtypeInteractions.map(sub => ({
                                          name: sub.subtypes
                                   }))
                                 };
                        }) || [];

			    for(const items of fallbackStructure ){
				      const type  =  items.types.name ;
					  const subtypes =  items.subtypes ;
					  const results =  await Promise.all(
					      subtypes.map(async(sub)=>{
						      const product = await prisma.product.findMany({
							       where:{productType : type ,  productSubtype : sub.name},
								       orderBy:{
									      productinterections : 'desc'
									   },
									   take : 5
							  })
							  return product
						  })
					  );
					globalarray.push(...results.flat())
				}

				return globalarray
			}
		},
		producttypes:async(_:any ,args : {productid : string} )=>{
			const {productid} =  args ;
			const types =  await ProductRepository.search()
			                     .where("productid").equal(productid)
								 .return.first() as Product[];
			if(types){
				const result  =  types[0]
				return result 
			}else{
				const search =  await prisma.product.findUnique({
					where : {
						productid : productid
					},
					select : {
						productType : true ,
						productSubtype : true
					}
				})

				return search 
			}
		},
		fuzzysearch:async(_:any , agrs : {productname : string})=>{
			const {productname}  = agrs;
			const [search  , search2 , search3] : [Product[] , Product[] , Product[]] = await  Promise.all([
			                      ProductRepository.search()
			                     .where("productname").match(productname)
								 .sortDesc("productinterection")
								 .return.all() ,		                           
								   ProductRepository.search()
			                      .where("productSubtypes").match(productname)
								  .sortDesc("productinterection")
								  .return.all() ,
			                       ProductRepository.search()
			                      .where("productType").match(productname)
								  .sortDesc("productinterection")
								  .return.all(),]) as [Product[] , Product[] , Product[]]
			const searches = [...search , ...search2 , ...search3];
			const result = searches.slice(0,3)
			const result1 = result.map((items)=>({
				productname : items.productname ,
				productid : items.productid ,
				type : items.type ,
				subtype : items.subtype ,
				imageurl : items.imageurl,
				interctivity : 1
			}));
			const key = `cache-global`
			await redis.set(key , JSON.stringify(result1))
			return result
		},
		search:async(_:any , args:{productname : string , cursor : string})=>{
			const {productname , cursor} = args;

			
			const [search , search2 , search3] =  await Promise.all([ ProductRepository.search()
			                        .where("productSubtypes").match(productname)
									.sortDesc("productinterection")
									.returnAll(),
			                         ProductRepository.search()
			                        .where("productname").equals(productname)
									.sortDesc("productinterection")
									.returnAll(),
		                             ProductRepository.search()
			                        .where("productType").equal(productname)
								    .returnAll()]) as [Product[] , Product[] , Product[]] 
			const products= [...search , ...search2 , ...search3];
			const sort  =  products.sort((inta , intb)=> intb.productinterections - inta.productinterections)
			let list  = sort
			if(cursor){
							const sortagain = sort.findIndex(p=> p.productid === cursor)
							if (sortagain !== -1){
								list= sort.slice(sortagain+1);
							}
			}
			let result  =  list.slice(0,20);
			if(products.length<=0){
			     result =  await prisma.product.findMany({
					where:{
						OR:[
							{productSubtype : {contains : productname ,  mode :"insensitive"}},
							{productname : {equals : productname ,  mode: "insensitive" }},
							{productType : {equals : productname , mode:"insensitive"}}
						]
					},
					orderBy : {
						productinterections : "desc"
					} ,

					cursor:{
						productid: cursor
					},

					take: 20
				});
			}
			const newcursor =  result.length>0 ? result[result.length -1].productid : null ;

			return {result , newcursor}
		},
		productdetail:async(_:any , args:{productid : string , cursor :string})=>{
			const {productid , cursor} = args;

			const search =  await ProductRepository.search()
			                      .where("productid")
								  .equal(productid)
								  .return.first() as Product[]
			if(search){
				const value = search[0]
				return value
			}else{
				try {
					const search =  await prisma.product.findUnique({
						where:{
							productid : productid
						}
					})
					return search
				}catch{
					alert("can't get the data right now ")
				}
			}

		}
    },
	Mutation:{

    }
}
