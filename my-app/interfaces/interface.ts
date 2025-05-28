export interface Product {
	productname : string , 
	productid : string ,
	type : string ,
	subtype : string ,
	price : number , 
	imageurl : string ,
	aboutproduct : string ,
	stockleft : string ,
	discount : number , 
	rating : number ,
	created : Date ,
	updated : Date ,
	likes : number,
	productinterections : number ,
	provider : string
}

export interface searchcall{
    productid : string
    productname : string
    price : number
    imageurl : string
    discount : number
    provider : string
}