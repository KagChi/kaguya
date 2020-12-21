import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "volume",
    aliases: ["v"],
    description: "change music volume",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class volumeCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild.queue?.voiceChannel.id)return msg.channel.send(`You must be in **${msg.guild.queue?.voiceChannel.name}** to change volume music`);
        const serverQueue = msg.guild?.queue
        const noQueue = this.client.util.embed()
        .setTitle("Error!")
        .setDescription("There are no music playing")
        .setColor(this.client.util.color)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        if(!serverQueue) return msg.channel.send(noQueue);
        if (!args.length) return msg.channel.send(`🔈Current volume is ${serverQueue.volume}%`);
        if (isNaN(args[0] as any)) return msg.channel.send("Please input valid number >:(");
        if (args[0] as any > 100) return msg.channel.send("Volume only can be set in range 1 - 100");
        this.client.musicManager.setVolume(msg, args[0] as any)
        return msg.channel.send(`☑ Set volume to \`${args[0]}\``);
    }
}