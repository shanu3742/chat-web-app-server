
const redis = require("redis");

let RedisClient;
(
    async() => {
        RedisClient= redis.createClient();
        RedisClient.on('error', err => console.log('Redis Client Error', err));
        await RedisClient.connect();
        await RedisClient.set('APP_NAME','MINGGLE');
        let name = await RedisClient.get('APP_NAME');
        console.log(name)
    }
)()



module.exports=RedisClient;