// redis.js file
const redis = require('redis');

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis connected!');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});
const subscriber = client.duplicate();
const publisher = client.duplicate();

module.exports = { publisher, subscriber };