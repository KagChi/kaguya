"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "ping",
    aliases: [],
    cooldown: 3,
    guildOnly: false,
    description: "show bot ping",
    execute(message, args, client) {
        const embed = new discord_js_1.MessageEmbed()
            .addField("Pongg!! :ping_pong:", Math.round(client.ws.ping) + "ms", true)
            .setColor(client.color);
        message.channel.send(embed);
    }
};
