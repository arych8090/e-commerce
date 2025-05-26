export async function searchcall({productname}:{productname:string}){
    const query = `
    query search(productname : $String!){
        search(productname : $productname){
             productid
             productname
             price 
             imageurl
             stockleft
             discount 
             rating 
             provider
         }
    }`

    const variable =  productname;

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
