export async function checkoutcall({ userid }: { userid: string }) {
  const query = `
    query ($userid: String!) {
      cart(userid: $userid) {
        userid
        productid
        productname 
        price
        imageurl
      }
    }
  `;

  const variables = { userid };

  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  return data;
}
