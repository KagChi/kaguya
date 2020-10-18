"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "help",
    aliases: ["h", "?"],
    guildOnly: false,
    description: "Display all commands and descriptions",
    execute(message, args, client) {
        let msg = message;
        try {
            if (args.length < 1) {
                let module = client.helps.array();
                const embed = new discord_js_1.MessageEmbed()
                    .setColor(client.color)
                    .setFooter("ℹ️ To get additional information use k!help <command name>, <command name> to command what you want");
                for (const mod of module) {
                    embed.addField(`${mod.emot} | ${mod.name}`, mod.cmds.map(x => `\`${x}\``).join(", "));
                }
                return message.channel.send(embed);
            }
            let cmd;
            if (client.commands.has(args[0])) {
                cmd = client.commands.get(args[0]);
            }
            if (client.aliases.has(args[0])) {
                cmd = client.commands.get(client.aliases.get(args[0]));
            }
            if (!cmd) {
                const embed = new discord_js_1.MessageEmbed()
                    .setColor(client.color)
                    .setTitle("🚫 I don't have command like this");
                const search = client.commands.keyArray().filter(x => x.includes(args[0])).map(x => `▫ __**${x}**__`);
                search.length > 0 ? embed.setDescription(`**Are you mean this? :**\n${search.join("\n")}`) : undefined;
                return msg.channel.send(embed);
            }
            const embed = new discord_js_1.MessageEmbed()
                .setColor(client.color)
                .setTitle(`❕ Command info for ${cmd.name}`)
                .setDescription(`**${cmd.description}**`)
                .addField("✂️ Aliases", cmd.aliases.length > 0 ? cmd.aliases.map(x => `${x}`).join(", ") : "None")
                .setFooter("ℹ️ Don't include <> or [], it's mean <> is required and [] is optional");
            return msg.channel.send(embed);
        }
        catch (e) {
            return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
        }
    }
};
