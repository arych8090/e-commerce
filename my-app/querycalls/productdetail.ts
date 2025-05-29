export async function productdetail({productid, cursor }: {productid : string , cursor : string}){
    const query = `
    query productdetail($productid : String! , $cursor : String!){
     productdetail(productid : $productid ,  cursor : $cursor){
       productid
       productname
       type
       subtype
       price
       imageurl
       aboutproduct
       stockleft
       discount 
       rating 
       created
       updated
       likes
       productinterection
       provider
     }
    }`

    const variable = {productid , cursor}

    const search =  await fetch("/graphql" , {
        method : "GET",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            query,
            variable
        })
    })

    const response  = await search.json();
    return response
}