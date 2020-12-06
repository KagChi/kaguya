export default {
    name: "loop",
    aliases: ["l"],
    cooldown: 2,
    guildOnly: true,
    description: "loop current queue",
    async execute(message, args, client) {
      if(!message.member.voice.channel) return message.reply("to use this command please join voice channel");
      if (!client.player.getQueue(message)) return message.reply(`there are no music playing`);
      let serverQueue = client.player.queues.get(message.guild.id);
      serverQueue.repeatMode = !serverQueue.repeatMode
      client.player.setRepeatMode(message, serverQueue.repeatMode)
      let embed = client.embed()
      .setDescription(`<a:yes:739409625090228275> | Loop set to \`${serverQueue.repeatMode ? "on" : "off"}\` `)
      .setColor(client.color);
      message.channel.send(embed);

 }
}
