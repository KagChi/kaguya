"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nezukoClient_1 = require("./handle/nezukoClient");
const client = new nezukoClient_1.default({ disableMentions: 'everyone' });
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
client.on('ready', () => {
    console.log(`${client.user.tag} Ready At ${client.guilds.cache.size} Guilds`);
});
require(`./handle/command`).default(client);
require(`./handle/cmdHandle`).default(client);
client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = message;
    if (message.author.bot)
        return;
    if (!message.content.startsWith(client.config.prefix))
        return;
    if (message.content.startsWith(client.config.prefix)) {
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
        if (!cmd)
            return undefined;
        if (!cooldowns.has(cmd.name)) {
            cooldowns.set(cmd.name, new Discord.Collection());
        }
        if (cmd.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }
        const now = Date.now();
        let timestamps = cooldowns.get(cmd.name);
        const cooldownAmount = (cmd.cooldown || 3) * 1000;
        if (!timestamps.has(msg.author.id)) {
            timestamps.set(msg.author.id, now);
        }
        else {
            // ...
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
            }
            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
        }
        try {
            cmd.execute(message, args, client);
        }
        catch (error) {
            console.error(error);
            message.reply("There was an error executing that command.").catch(console.error);
        }
    }
}));
client.login(client.config.token);
