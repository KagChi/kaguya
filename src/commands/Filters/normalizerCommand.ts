import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
@CommandConf({ 
    name: "normalizer",
    aliases: [],
    description: "normalizer filter",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class normalizerCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild.queue?.voiceChannel.id)return msg.channel.send(`You must be in **${msg.guild.queue?.voiceChannel.name}** to set music filter`);
        const serverQueue = msg.guild?.queue
        const noQueue = this.client.util.embed()
        .setTitle("Error!")
        .setDescription("There are no music playing")
        .setColor(this.client.util.color)
        .setThumbnail(msg.author?.avatarURL({ dynamic: true }) as any)
        if(!serverQueue) return msg.channel.send(noQueue);
        let statusFilters = serverQueue.filters.normalizer
        statusFilters = !statusFilters
       this.client.musicManager.setFilters(msg, {
           normalizer: statusFilters
       })
       const message = await msg.channel.send(`<a:emoji_28:668379222892347402> | Setting normalizer filter to \`${statusFilters ? "on" : "off"}\`. This may take a few seconds...`);
           const embed = this.client.util.embed()
           .setDescription(`<a:yes:739409625090228275> | normalizer filter set to \`${statusFilters ? "on" : "off"}\` `)
           .setColor(this.client.util.color);
            await delay(3500);
            return message.edit('', embed);
    }
}
