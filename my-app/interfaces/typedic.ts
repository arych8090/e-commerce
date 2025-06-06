export type products =  {
    productid : string ,
    productname : string,
    productType : string ,
    productSubtype  :  string ,
    price : number ,
    imageurl : string ,
    aboutproject: string ,
    stockleft : number,
    discount : number ,
    rating  : number ,
    createdAt : Date ,
    updatedAt : Date ,
    likes : number ,
    productinterections : number,
    providerId : string
    quantity : number
    newcursor : string
}

export type cartitem = Pick<products , "productid" | "productType" | "productSubtype" | "price" | "imageurl" | "stockleft">

export type cartsearchs =  Pick<products , "productid" | "productname" | "price" | "imageurl" | "quantity">

export type interection = Pick<products , "productType"|"productSubtype">

export type interectionvalue  =  Pick<products , "productid" | "productname" | "price" | "imageurl" | "discount" | "newcursor">

export type cacheglobale =  Pick<products ,  "productname" | "productid" | "imageurl" | "price" | "stockleft" | "discount" | "rating" | "providerId">

export type productdetail =  Pick<products , "productid" | "productname" | "productType" |"productSubtype"| "imageurl" | "aboutproject" | "stockleft" |"price" | "discount" | "rating" | "updatedAt" | "productinterections" | "providerId">

export type personilastion =  Pick<products , "productType" | "productSubtype" | "price" | "productid" | "productname" | "imageurl" | "stockleft" | "discount" | "rating" | "providerId">

export type cleancartitem ={ [K in keyof cartitem]: 
      K extends "stockleft" ? number | 0:
      K extends "price" ? number : 
      K extends "imageurl" ? string | null :
      K extends "productType" | " productSubtype" | "productid" ? string :
      string
}

export type cleancartmake = {[K in keyof cartsearchs] : 
      K extends "prodcutid" | "productname" ? string :
      K extends "imageurl" ? string | null :
      K extends "price" ? number | undefined :
      K extends "quantity" ? 1  :
      string
}

export type cleansearch = {[K in keyof cartsearchs] : 
      K extends "prodcutid" | "productname" ? string :
      K extends "imageurl" ? string | null :
      K extends "price" ? number | undefined :
      K extends "quantity" ? number  :
      string
}

export type cleaninterection = { [K in keyof interection] :
    K extends "productType" | "productSubtype" ? string :
    string
}

export type cleaninterectionvalue = { [K in keyof interectionvalue]:
    K extends "productid" | "productname" | "newcursor" ? string :
    K extends "price" | "stockleft" ? number|undefined:
    K extends "image" ? string | null :
    string
}

export type cleancacheglobal = { [K in  keyof cacheglobale]:
     K extends "productid" | "productname"  | "providerid" ? string :
     K extends "imageurl" ? string | null :
     K extends "price" ? number | undefined :
     K extends "stockleft" | "discount" | "rating" ? number | null :
     string
}

export type cleanproductdetail = {[K in keyof productdetail]:
    K extends "productid" | "productname" | "productType" | "productSubtype" | "providerId" ? string :
    K extends "imageurl" | "aboutproject" ? string | null :
    K extends "stockleft" | "discount" | "rating" | "productinterections"  ? number | null :
    K extends "updatedAt" ? Date | undefined :
    K extends "price" ? number | undefined :
    string
}

export type cleanpersonlisation = { [K in keyof personilastion]:
     K extends "productid" | "productname" | "productType" | "productSubtype" | "providerId" ? string :
     K extends "stockleft" | "discount" | "rating" ? number | null :
     K extends "price" ? number | undefined :
     K extends "imageurl"  ? string | null :
     string
}