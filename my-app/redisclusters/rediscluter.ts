import {Redis} from "ioredis";

const redis =  new Redis.Cluster([
    {port:5000 ,
        host:'redis1'
    },
    {port:5001 ,
        host:'redis2'
    },
    {port:5002 ,
        host:'redis3'
    },
    {port:5003 ,
        host:'redis4'
    },
    {port:5004 ,
        host:'redis5'
    },
    {port:5005 ,
        host:'redis6'
    }
]);

export {redis} ;