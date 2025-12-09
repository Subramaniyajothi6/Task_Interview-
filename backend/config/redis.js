import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
}

export { redisClient, connectRedis };
