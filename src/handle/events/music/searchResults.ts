import { MessageEmbed, Message } from "discord.js-light";
export default (client, message: Message, query: string, tracks) => {

    const embed = new MessageEmbed()
    .setAuthor(`Here are your search results for ${query}!`)
    .setDescription(tracks.slice(0, 5).map((t, i) => `${i+1}. ${t.title}`))
    .setFooter('Send the number of the song you want to play!')
    message.channel.send(embed);

}