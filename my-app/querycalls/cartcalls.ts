export async function cartsearch({ productid }: { productid: string }) {
  const query = `
    query product($productid: String!) {
      product(productid: $productid) {
        productid
        productname
        stockleft
        price
        provider
        imageurl
      }
    }
  `;

  const variables = { productid };

  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  // ✅ fix typo
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  return data;
}
