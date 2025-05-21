export async function timeoutcall({productname} : {productname : string}){
    const query = `
    query fuzzysearch(productname:$String){
        fuzzysearch(productname : $productid){
             imageurl
             productname
        }
    }`

    const variable = productname;

    const response = await fetch("/graphsql" , {
        method : "GET",
        headers : {
            "Content,-Type" : "application/json"
        },
        body : JSON.stringify({query,variable})
    });

    return response
}