import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "neko",
    aliases: [""],
    description: "random neko image",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class PokeCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<void> {
        try {
        const image = await this.client.fun.neko()
      const embed = this.client.util.embed()
      .setTitle("Random Neko Image :)")
      .setImage(image)
      .setColor(this.client.util.color)
      msg.channel.send(embed)  
    } catch (e){
        msg.channel.send(`An error occured \`${e}\` Try again later!`)
    }
  }
 }
