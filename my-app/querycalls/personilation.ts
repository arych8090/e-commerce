export async function personilation({productid , userid} : {productid : string , userid : string}){
    const query  = `
    query typesinterections($productid: string!){
       producttypes(productid: $productid){
          types 
          subtypes 
          price 
          productid 
          productname
          imageurl
          stockeleft
          discount 
          rating
          provider
       }
    }`;

    const variable = {productid , userid};

    const response = await fetch("/graphql" , {
        method :"POST" , 
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({query , variable})
    });

    const data = await response.json();
    return data
}