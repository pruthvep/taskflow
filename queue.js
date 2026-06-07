const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(
  process.env.REDIS_URL,
  {
    maxRetriesPerRequest: null
  }
);
const jobQueue = new Queue('jobs', { connection });

module.exports = jobQueue;