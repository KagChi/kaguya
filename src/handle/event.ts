const { readdirSync } = require("fs");

export default (client) => {
  const events = readdirSync("./dist/events/bot/");
  for (const event of events) {
    const file = require(`../events/bot/${event}`).default;
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};