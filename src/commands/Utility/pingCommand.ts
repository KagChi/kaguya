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
    const embed = this.client.embed()
    .addField("Pong!!!!", this.client.ws.ping)
    msg.channel.send(embed)
   }
 }
