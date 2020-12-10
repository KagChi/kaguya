import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "ping",
    aliases: [""],
    description: "get bot latency",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class PingCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<void> {
   const message = await msg.channel.send("Getting info...");
    const embed = this.client.util.embed()
    .setColor(this.client.util.color)
    .addField(`⏳ Latency `, `__**${message.createdTimestamp - msg.createdTimestamp}ms**__`)
    .addField("💓 API", `__**${Math.floor(this.client.ws.ping)}ms**__`)
    .setTimestamp();
      setTimeout(function() { message.edit('',embed) }, 5000);
   
  }
 }
