export default {
    name: "resume",
    aliases: [],
    cooldown: 2,
    guildOnly: true,
    description: "change the music filters to nightcore",
    async execute(message, args, client) {
        if(!message.member.voice.channel) return message.reply("to use this command please join voice channel");
        if (!client.player.getQueue(message)) return message.reply(`there are no music playing`);
        if(client.player.isPlaying(message)) return message.reply("the music already playing!");
        client.player.resume(message)
        const embed = client.embed()
        .setDescription(`<a:yes:739409625090228275> | Resumed current queue!`)
        .setColor(client.color);
            
}
}
