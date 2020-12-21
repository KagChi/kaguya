import type { Message } from "discord.js";
import Listener from "../structures/Listener";

export default class MessageUpdateEvent extends Listener {
    public name = "messageUpdate";
    private readonly prefix = this.client.config.prefix;
    public async exec(oldMessage: Message, newMessage: Message): Promise<Message | void> {
        if (oldMessage.content === newMessage.content) return;
        if (!newMessage.guild) return;
        if (newMessage.author.bot) return;
        if (!newMessage.content.startsWith(this.prefix)) return;
        if (oldMessage.content === newMessage.content) return undefined;
       
        const args = newMessage.content.slice(this.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()!.toLowerCase();
        const command = this.client.commands.get(commandName.toLowerCase()) || this.client.commands.find(c => c.config.aliases!.includes(commandName.toLowerCase()));
        if (command) {
            if (command.config.ownerOnly && !newMessage.author.isDev) return;
            if (!newMessage.author.isDev) {
                const now = Date.now();
                const userCooldown = this.client.cooldowns.get(`${command.config.name}-${newMessage.author.id}`);
                const cooldownAmount = command.config.cooldown! * 1000;
                if (userCooldown) {
                    const expirationTime = userCooldown + cooldownAmount;
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        await newMessage.channel.send(`Hold on, you just need to wait for ${timeLeft.toFixed(1)} secs to use \`${command.config.name}\` again.`);
                        return;
                    }
                }
                this.client.cooldowns.set(`${command.config.name}-${newMessage.author.id}`, now);
                setTimeout(() => this.client.cooldowns.delete(`${command.config.name}-${newMessage.author.id}`), cooldownAmount);
            }
            try {
                await command.exec(newMessage, args);
            } catch (e) {
                console.error(e);
            }
        }
    }
}
