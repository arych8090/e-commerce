import { Entity, Schema } from 'redis-om';
import {  redisomclient } from "./mainredis";



const UserSchema = new Schema('User', {
  userid: { type: 'string', },
  username: { type: 'string' },
  email: { type: 'string' },
  phonenumber: { type: 'number' },
});

const OrderSchema = new Schema('Order', {
  orderid: { type: 'string' },
  createdAt: { type: 'date' },
  status: { type: 'string' },
  products: { type: 'string[]' },
});

const ProviderSchema = new Schema('Provider', {
  providerid: { type: 'string'},
  providername: { type: 'string' },
  providerEmail: { type: 'string' },
  providerphonenumber: { type: 'string' },
  products: { type: 'string[]' },
});

const FinanceSchema = new Schema('Finances', {
  totalexpenses: { type: 'number'},
  totalrevenue: { type: 'number' },
  totalincome: { type: 'number' },
  totalLoss: { type: 'number' },
  productsell: { type: 'number' },
  productsremain: { type: 'number' },
});

const ProductSchema = new Schema('Product', {
  productname: { type: 'string'  },
  productid: { type: 'string' },
  createdAt: { type: 'date' },
  updatedAt: { type: 'date' },
  price: { type: 'number' },
  discount: { type: 'string' },
  sold: { type: 'number' },
  left: { type: 'number' },
  imageUrl: { type: 'string' },
  Rating: { type: 'number' },
});


const UserRepository = redisomclient.fetchRepository(UserSchema);
const OrderRepository = redisomclient.fetchRepository(OrderSchema);
const ProviderRepository = redisomclient.fetchRepository(ProviderSchema);
const FinanceRepository = redisomclient.fetchRepository(FinanceSchema);
const ProductRepository = redisomclient.fetchRepository(ProductSchema);


await UserRepository.createIndex();
await OrderRepository.createIndex();
await ProviderRepository.createIndex();
await FinanceRepository.createIndex();
await ProductRepository.createIndex();


export {
  UserRepository,
  OrderRepository,
  ProviderRepository,
  FinanceRepository,
  ProductRepository,
};
