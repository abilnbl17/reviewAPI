import * as redis from "redis"; // harus memakai * as, untuk mengakses seluruh redis

//define connection
export const redisClient = redis.createClient({
  url: "redis://localhost:8085",
});
