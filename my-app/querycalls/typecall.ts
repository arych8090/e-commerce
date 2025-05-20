export async function typecall({productid , userid} : {productid : string , userid : string}){
    const query  = `
    query producttypes($productid: string!){
       producttypes(productid: $productid){
          types 
          subtypes 
          price 
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

    const {types , subtypes , price} = await response.json();
    return {types , subtypes , price }
}