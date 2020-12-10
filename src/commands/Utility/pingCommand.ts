import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
const delay = ms as number => new Promise(res => setTimeout(res, ms));
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
   
   
  }
 }
