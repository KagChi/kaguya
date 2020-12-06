export default {
  name: "ping",
  aliases: [],
  cooldown: 3,
  guildOnly: false,
  description: "show bot ping",
  execute(message, args, client) {
    const embed = client.embed()
        .addField("Pongg!! :ping_pong:",  Math.round(client.ws.ping) + "ms", true)
        .setColor(client.color)
     message.channel.send(embed)
  }
};
