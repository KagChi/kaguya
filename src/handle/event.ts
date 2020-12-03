const { readdirSync } = require("fs");

export default (client) => {
  const events = readdirSync("./dist/events/");
  for (const event of events) {
    const file = require(`../events/${event}`).default;
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};