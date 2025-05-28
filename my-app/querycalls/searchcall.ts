export async function searchcall({productname , cursor}:{productname:string , cursor : string}){
    const query = `
    query search(productname : $String! , cursor : $String){
        search(productname : $productname ,  cursor : $cursor){
             productid
             productname
             price 
             imageurl
             discount 
             provider
         }
    }`

    const variable =  {productname , cursor};

    const search  =  await fetch("/graphsql" , {
        method : "GET" , 
        headers : {
            "Content-Type" : "application/json" ,
        },
        body: JSON.stringify({
            query ,
            variable
        })
    });

    const data  =  search.json();

    return data 
}
