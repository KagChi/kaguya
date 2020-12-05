const { readdirSync } = require("fs");

export default (client) => {
  const events = readdirSync("./dist/handle/events/client/");
  for (const event of events) {
    const file = require(`./events/client/${event}`).default;
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};