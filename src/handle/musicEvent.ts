const { readdirSync } = require("fs");

export default (client) => {
  const events = readdirSync("./dist/events/music/");
  for (const event of events) {
    const file = require(`../events/music/${event}`).default;
    client.player.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};