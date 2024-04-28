import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

//Redis instance for Subscribing
const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD,
  tls: {},
});

//Redis instance for Publishing
const publisher = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD,
  tls: {},
});

// When a message is published to a specific channel,
// all subscribers that are listening to that channel
// receive a copy of the message.
// Channels provide a way to categorize messages and allow
// subscribers to selectively listen for messages they are

export function subscribe(channel, callback) {
  subscriber.subscribe(channel, (err, count) => {
    if (err) return console.log("error subscribing to channel: ", err);
    console.log(`Subscribed to ${channel}`);
  });

  // When a message is received on any subscribed channel,
  // it checks if the channel matches the specified channel and
  // calls the provided callback function with the received message
  subscriber.on("message", (SubscribedChannel, message) => {
    console.log(
      "Subscriber: ",
      SubscribedChannel,
      "- has received msg: ",
      message
    );
    if (SubscribedChannel === channel) callback(message);
  });
}

// Function to publish a message to a Redis channel
export async function publish(channel, message) {
  try {
    await publisher.publish(channel, message);
    console.log(`Published message to ${channel}: ${message}`);
  } catch (error) {
    console.error("Error publishing message:", error);
  }
}
