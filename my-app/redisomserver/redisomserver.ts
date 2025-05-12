import {Repository, Client ,Schema} from "redis-om";

const userschema= new Schema("User" , {
    username : {type:'string'},
    userid : {type:'string'},
    address : {type:'string'},
    orders : {type:'string[]' ,  sortable:true}
});

const ProductSchema = new Schema("Product" , {
    product : {type:'string'},
    productname : {type:'string'},
    productType : {type:"string" ,  sortable:true},
    productSubtypes : {type:'string[]' , sortable:true },
    price : {type:'number' , sortable:true},
    imageurl : {type:'string'},
    aboutproduct : {type:'string'},
    stockleft: {type:'number' , sortable:true},
    discount : {type:'number' , sortable:true},
    rating : {type:'number' , sortable:true},
    created : {type:'date' , sortable:true},
    updated : {type:'date' , sortable:true},
    likes : {type:'number' ,  sortable:true}
});

const orderschema = new Schema("Orders" , {
    userid : {type:'string'},
    orderid : {type:'string'},
    products : {type:'string[]'},
    createdat : {type:'date' , sortable:true},
    status : {type:'string'}
});

const typeschema = new Schema("types" , {
    types : {type:'string'},  //remember to create the manuall enums and connected to this
    subtypes : {type:'string[]'  ,  sortable:true}
});

const userinterection  =  new Schema("Interactions", {
    userid : {type:'string'},
    typeinteractions : {type:'string[]' ,  sortable:true},
    subtypeinterections : {type:'string[]'}
});

const typeinterection =  new Schema("typeinteraction" , {
    type : {type:'string'},
    subtype : {type:'string[]'},
    typeinteractiongenral : {type:'number' , sortable:true},
    substypeinteractiongeneral : {type:'string[]' , sortable:true}
});

const providerschema = new Schema("provider" , {
    providerid : {type:'string'},
    email : {type:'string'},
    providername : {type:'string'},
    products : {type:'string[]'  ,  sortable:true}
});

const FinanceSchema = new Schema("finance" , {
    providerid : {type:'string'},
    totalincome : {type:'number' , sortable:true},
    totalexpense : {type:'number' ,  sortable:true},
    totalrevenue : {type:'number' , sortable:true},
    totalloss : {type:'number' ,  sortable:true},
    perproductsprice : {type:'string[]' , sortable:true},
    toatalproductprice : {type:'string[]', sortable:true},
    productinventory : {type:'string[]' ,  sortable:true},
    productsell : {type:'string[]' , sortable:true}
});

const client =  new Client();
await client.open('redis://localhost:6379');

const UserRepository= client.fetchRepository(userschema)
const ProviderRepository=client.fetchRepository(providerschema)
const OrderRepository=client.fetchRepository(orderschema)
const TypeRepository=client.fetchRepository(typeschema)
const ProductRepository=client.fetchRepository(ProductSchema)
const Userinterectrepository=client.fetchRepository(userinterection)
const typeinteractrepository=client.fetchRepository(typeinterection)
const FinanceRepository=client.fetchRepository(FinanceSchema)

await UserRepository.createIndex();
await ProviderRepository.createIndex();
await OrderRepository.createIndex();
await TypeRepository.createIndex();
await ProductRepository.createIndex();
await Userinterectrepository.createIndex();
await typeinteractrepository.createIndex();
await FinanceRepository.createIndex();

export {UserRepository,ProductRepository,OrderRepository,typeinteractrepository,TypeRepository,ProviderRepository,Userinterectrepository,FinanceRepository};
