import type { Message } from "discord.js-light";
import type { MessageEmbedOptions } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({ 
    name: "help",
    aliases: ["commands", "?","h"],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class helpCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<void> {
        try {
        const embed: MessageEmbedOptions = {
            color: this.client.util.color,
            fields: []
        };

        const command = this.client.commands.get(args[0]);

        if (command) {
            Object.assign(embed, {
                author : {
                    name: command.config.name,
                    iconURL: this.client.user?.displayAvatarURL()
                },
                footer : {
                    text: msg.author.username,
                    iconURL: msg.author.displayAvatarURL({ dynamic: true})
                },
                description: command.config.description,
                timestamp: Date.now()
            });

            embed.fields?.push({
                name: "Aliases",
                value: `\`${command.config.aliases!.join(", ")}\``
            },
            {
                name: "Usage",
                value: command.config.usage
            },
            {
                name: "Cooldown",
                value: command.config.cooldown
            });
        } else {
            embed.author = {
                name: "Command List",
                iconURL: this.client.user?.displayAvatarURL()
            };
            embed.footer = {
                text: `Run ${this.client.config.prefix}help <command> for info about a command.`,
                iconURL: msg.author.displayAvatarURL({ dynamic: true})
            };

            const categories = [...new Set(this.client.commands.map(x => x.config.category))];
            for (const category of categories) {
                const commands = this.client.commands.filter(x => x.config.category === category);
                embed.fields?.push({
                    name: category,
                    value: commands.map(x => `\`${x.config.name}\``).join(", ")
                });
            }
             embed.fields?.push({
                  name: "Links",
                  value: "[Github](https://github.com/KagChi/kaguya) | [Invite](https://discord.com/oauth2/authorize?client_id=707045201461641236&scope=bot&permissions=0)"
            });
        }

        await msg.channel.send({ embed });
    } catch (e){
        msg.channel.send(`An error occured \`${e}\` Try again later!`)
    }
  }
}
