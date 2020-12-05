export default {
    name: "play",
    aliases: ["p"],
    cooldown: 2,
    guildOnly: true,
    description: "play music",
    async execute(message, args, client) {
        if(!message.member.voice.channel) return message.reply("to use this command please join voice channel");
        if(!args.length) return message.reply("input music name/url!")
        client.player.play(message, args.join(" "))
    }
}