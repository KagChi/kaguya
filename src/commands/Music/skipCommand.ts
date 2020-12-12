import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "skip",
    aliases: ["s"],
    description: "skip current music",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class skipCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (this.client.queue.has(msg.guild?.id as Guild["id"]) && voiceChannel.id !== this.client.queue.get(msg.guild?.id as Guild["id"])?.voiceChannel.id)return msg.channel.send(`You must be in **${this.client.queue?.get(msg.guild?.id as Guild["id"])?.voiceChannel.name}** to skip music`);
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        const noQueue = this.client.util.embed()
        .setTitle("Error!")
        .setDescription("There are no music playing")
        .setColor(this.client.util.color)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        if(!serverQueue) return msg.channel.send(noQueue);
        const song = this.client.queue.get(msg.guild?.id as Guild["id"])?.songs as any
        this.client.musicManager.skip(msg)
        const embed = this.client.util.embed()
        .setAuthor("Skipped current queue", msg.author?.avatarURL({ dynamic: true }) as any)
        .setDescription(`⏭ skipped \`${song[0].title}\`.`)
        .setThumbnail(song[0].thumbnail)
        .setColor(this.client.util.color)
        msg.channel.send(embed)
    }
}