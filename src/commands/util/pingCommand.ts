import { MessageEmbed } from 'discord.js-light';

export default {
  name: "ping",
  aliases: [],
  cooldown: 3,
  guildOnly: false,
  description: "show bot ping",
  execute(message, args, client) {
    const embed = new MessageEmbed()
        .addField("Pongg!! :ping_pong:",  Math.round(client.ws.ping) + "ms", true)
        .setColor(client.color)
     message.channel.send(embed)
  }
};
