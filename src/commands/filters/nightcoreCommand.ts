const delay = ms => new Promise(res => setTimeout(res, ms));
import { MessageEmbed } from 'discord.js-light'
export default {
    name: "nightcore",
    aliases: ["nc"],
    cooldown: 2,
    guildOnly: true,
    description: "change the music filters to nightcore",
    async execute(message, args, client) {
        if(!message.member.voice.channel) return message.reply("to use this command please join voice channel");
        if (!client.player.getQueue(message)) return message.reply(`there are no music playing`);
        let statusFilters = client.player.getQueue(message).filters.nightcore
       statusFilters = !statusFilters
       client.player.setFilters(message, {
           nightcore: statusFilters
       })
       const msg = await message.channel.send(`<a:emoji_28:668379222892347402> | Setting Nightcore filter to \`${statusFilters ? "on" : "off"}\`. This may take a few seconds...`);
           const embed = new MessageEmbed()
           .setDescription(`<a:yes:739409625090228275> | Nightcore filter set to \`${statusFilters ? "on" : "off"}\` `)
           .setColor(client.color);
            await delay(5000);
            return msg.edit('', embed);
    }
}