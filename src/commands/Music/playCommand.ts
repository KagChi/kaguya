import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "play",
    aliases: ["p"],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class playCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const query = args.join(" ")
        if(!query) return msg.channel.send("No query provided!");
        const song = await this.client.musicManager.getSongs(query)
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"])
        if(serverQueue){
            
        }
        return this.client.musicManager.handleVideo(msg, song[0] as unknown as string[])
    }
}