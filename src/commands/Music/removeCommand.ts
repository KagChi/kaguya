import type { Guild, Message, User } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "remove",
    aliases: [],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class removeCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild.queue?.voiceChannel.id)return msg.channel.send(`You must be in **${msg.guild.queue?.voiceChannel.name}** to remove music`);
        const serverQueue = msg.guild?.queue as any
        const noQueue = this.client.util.embed()
        .setTitle("Error!")
        .setDescription("There are no music playing")
        .setColor(this.client.util.color)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        if(!serverQueue) return msg.channel.send(noQueue);
        if(serverQueue.songs.length <= 1 ) return msg.channel.send("Cant remove playing music!");
        if (!args.length) return msg.reply(`Usage: remove <Queue Number>`);
        if (isNaN(args[0] as any)) return msg.reply(`Usage: remove <Queue Number>`);
        const song = serverQueue.songs.splice(args[0] as any -1 ,1);
        const embed = this.client.util.embed()
        .setDescription(`<:remove_queue:745944600618860604> Removed **${song[0].title}** from the queue.`)
        .setThumbnail(song[0].thumbnail)
        .setColor(this.client.util.color)
        serverQueue.textChannel.send(embed);
   
    
    }
}
