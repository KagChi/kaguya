export default {
    name: "stop",
    aliases: [],
    cooldown: 2,
    guildOnly: true,
    description: "stop current queue",
    async execute(message, args, client) {
    if(!message.member.voice.channel) return message.reply("to use this command please join voice channel");
    if (!client.player.getQueue(message)) return message.reply(`there are no music playing`);
    client.player.clearQueue(message)
    client.player.stop(message)    
    const embed = client.embed()
    .setDescription(`<a:yes:739409625090228275> | Stopped current queue! `)
    .setColor(client.color);
    message.channel.send(embed)
 }
}
