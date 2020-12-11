import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "poke",
    aliases: [""],
    description: "random poke image",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class PokeCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<void> {
        try {
        const image = await this.client.fun.poke()
      const embed = this.client.util.embed()
      .setTitle("Random Poke Image :)")
      .setImage(image)
      .setColor(this.client.util.color)
      msg.channel.send(embed)  
    } catch (e){
        msg.channel.send(`An error occured \`${e}\` Try again later!`)
    }
  }
 }
