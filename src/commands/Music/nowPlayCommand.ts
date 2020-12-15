import type { Guild, Message, User } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "nowplay",
    aliases: ["np"],
    description: "current playing music! ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class nowPlayCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        const noQueue = this.client.util.embed()
        .setTitle("Error!")
        .setDescription("There are no music playing")
        .setColor(this.client.util.color)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        if(!serverQueue) return msg.channel.send(noQueue);
        const embed = this.client.util.embed()
        .setAuthor(serverQueue.requester.songs[0].tag, serverQueue.songs[0].requester.displayAvatarURL({ dynamic: true }))
        .addField("Current Playing", serverQueue.song[0].title)
        .setImage(serverQueue.songs[0].thumbnail)
        msg.channel.send(embed)
    }
}