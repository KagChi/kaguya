export default {
    name: "pause",
    aliases: [],
    cooldown: 2,
    guildOnly: true,
    description: "loop current queue",
    async execute(message, args, client) {
    if(!message.member.voice.channel) return message.reply("to use this command please join voice channel");
    if (!client.player.getQueue(message)) return message.reply(`there are no music playing`);
    const serverQueue = client.player.queues.get(message.guild.id)
    if(serverQueue.paused) return message.reply("The music already paused!");
    client.player.pause(message)
    const embed = client.embed()
    .setDescription(`<a:yes:739409625090228275> | Paused current queue!`)
    .setColor(client.color)
    message.channel.send(embed)

 }
}
