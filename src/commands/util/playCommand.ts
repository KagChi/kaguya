export default {
    name: "play",
    aliases: ["p"],
    cooldown: 2,
    guildOnly: true,
    description: "play music",
    async execute(message, args, client) {
        client.player.play(message, args.join(" "))
    }
}