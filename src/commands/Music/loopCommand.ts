import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "loop",
    aliases: [],
    description: "loop current queue",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class loopCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"])
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (this.client.queue.has(msg.guild?.id as Guild["id"]) && voiceChannel.id !== this.client.queue.get(msg.guild?.id as Guild["id"])?.voiceChannel.id)return msg.channel.send(`You must be in **${this.client.queue?.get(msg.guild?.id as Guild["id"])?.voiceChannel.name}** to loop the music`);
        serverQueue!.loop = !serverQueue?.loop;
        const embed = this.client.util.embed()
        .setTitle("Looping Queue")
        .setDescription(`🔁 turned loop \`${serverQueue!.loop ? "on" : "off"}\` `)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        .setColor(this.client.util.color)
        msg.channel.send(embed)
    }
}