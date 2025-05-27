import {Repository, Client ,Schema} from "redis-om";
import { redisomclient } from "./mainredis";

const userschema= new Schema("User" , {
    username : {type:'string'},
    userid : {type:'string'},
    address : {type:'string'},
    orders : {type:'string[]' ,  sortable:true}
});

const ProductSchema = new Schema("Product" , {
    productid : {type:'string'},
    productname : {type:'string'},
    type : {type:"string" ,  sortable:true},
    subtypes : {type:'string' , sortable:true },
    price : {type:'number' , sortable:true},
    imageurl : {type:'string'},
    aboutproduct : {type:'string'},
    stockleft: {type:'number' , sortable:true},
    discount : {type:'number' , sortable:true},
    rating : {type:'number' , sortable:true},
    created : {type:'date' , sortable:true},
    updated : {type:'date' , sortable:true},
    likes : {type:'number' ,  sortable:true},
    productinterection: {type:'string'},
    provider : {type:'string'}
});

const orderschema = new Schema("Orders" , {
    userid : {type:'string'},
    orderid : {type:'string'},
    products : {type:'string[]'},
    createdat : {type:'date' , sortable:true},
    status : {type:'string'}
});

const typeschema = new Schema("types" , {
    type : {type:'string'},  //remember to create the manuall enums and connected to this
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
    totalproductprice : {type:'string[]', sortable:true},
    productinventory : {type:'string[]' ,  sortable:true},
    productsell : {type:'string[]' , sortable:true}
});



const UserRepository= redisomclient.fetchRepository(userschema)
const ProviderRepository=redisomclient.fetchRepository(providerschema)
const OrderRepository=redisomclient.fetchRepository(orderschema)
const TypeRepository=redisomclient.fetchRepository(typeschema)
const ProductRepository=redisomclient.fetchRepository(ProductSchema)
const Userinterectrepository=redisomclient.fetchRepository(userinterection)
const typeinteractrepository=redisomclient.fetchRepository(typeinterection)
const FinanceRepository=redisomclient.fetchRepository(FinanceSchema)

await UserRepository.createIndex();
await ProviderRepository.createIndex();
await OrderRepository.createIndex();
await TypeRepository.createIndex();
await ProductRepository.createIndex();
await Userinterectrepository.createIndex();
await typeinteractrepository.createIndex();
await FinanceRepository.createIndex();

export {UserRepository,ProductRepository,OrderRepository,typeinteractrepository,TypeRepository,ProviderRepository,Userinterectrepository,FinanceRepository};
