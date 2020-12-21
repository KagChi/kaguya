import type { Guild, Message, User } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "skipto",
    aliases: [],
    description: "skip queue",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class skipToCommand extends Command {
    public async exec(msg: Message, args: any[]) {
    	const voiceChannel = msg.member?.voice.channel
        const serverQueue = msg.guild?.queue
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild.queue?.voiceChannel.id)return msg.channel.send(`You must be in **${msg.guild.queue?.voiceChannel.name}** to skip music`);
        const noQueue = this.client.util.embed()
        .setTitle("Error!")
        .setDescription("There are no music playing")
        .setColor(this.client.util.color)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        if(!serverQueue) return msg.channel.send(noQueue);
        if (!args.length) return msg.reply(`Usage: skipto <Queue Number>`)
        if (isNaN(args[0] as any)) return msg.reply(`Usage: skipto <Queue Number>`)
        if (args[0] > serverQueue.songs.length)
          return msg.reply(`The queue is only ${serverQueue.songs.length} songs long!`)
      serverQueue.playing = true;
        if (serverQueue.loop) {
          for (let i = 0; i < args[0]  - 2; i++) {
            serverQueue.songs.push(serverQueue.songs.shift());
          }
        } else {
          serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
        }
        this.client.musicManager.skip(msg);
    const embed = this.client.util.embed()
     .setDescription(`${msg.author} ⏭️ Skipped ${args[0] - 1} songs`)
     .setColor(this.client.util.color)
     .setThumbnail(msg.author?.displayAvatarURL({ dynamic: true }))
    }
}