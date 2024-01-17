import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { redisClient } from "../helpers/redis";
export class PostsController {
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Check data in redis
      const redisData = await redisClient.get("posts");
      // 2. if exist, use data from redis and send as response
      if (redisData) {
        return res.status(200).send(JSON.parse(redisData)); // redis menyimpannya dalam bentu string
      }
      // 3. if not exist, get data from main resource
      const get = await axios.get("https://jsonplaceholder.typicode.com/posts");
      await redisClient.setEx("posts", 5, JSON.stringify(get.data)); // ibarat local storage set item
      return res.status(200).send(get.data);
    } catch (error) {
      next(error);
    }
  }
}
