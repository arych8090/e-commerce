import {Redis} from "ioredis";

const redis =  new Redis.Cluster([
    {port:5000 ,
        host:'localhost'
    },
    {port:5001 ,
        host:'localhost'
    },
    {port:5002 ,
        host:'localhost'
    },
    {port:5003 ,
        host:'localhost'
    },
    {port:5004 ,
        host:'localhost'
    },
    {port:5005 ,
        host:'localhost'
    }
]);

export {redis} ;