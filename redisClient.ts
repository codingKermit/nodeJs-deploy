import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const redisClient = createClient({
    url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password : process.env.REDIS_PASSWORD
});

export default redisClient;