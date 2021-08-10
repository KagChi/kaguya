import { Message } from "discord.js";
import { CreateEmbed } from "../../Util/CreateEmbed";
import { Command } from 'discord-akairo';
import { stripIndents } from "common-tags";
export default class HelpCommand extends Command {
    constructor() {
      super('help', {
        aliases: ['help', 'h', 'halp'],
        description: {
          content: 'Gets the bot\'s help command',
          usage: '[command]',
          examples: ['play'],
        },
        category: 'Util',
        cooldown: 3000,
        args: [
          {
            id: 'command',
            type: 'commandAlias',
          },
        ],
      });
    }
    async exec(msg: Message, { command } : { command: any }) {
        if (!command) {
          const embed = CreateEmbed('info')
            .addField(`❯ ${this.client.user?.username} command's `, stripIndents`A list of available commands.`);
          for (const category of this.handler.categories.values()) {
            embed.addField(`${category.id.replace(/(\b\w)/gi, (lc): string => lc.toUpperCase())} [\`${category.filter((cmd: any) => cmd.aliases.length > 0).map((x) => x).length}\`]`, `${category.filter((cmd: any) => cmd.aliases.length > 0).map((cmd: any) => `\`${cmd.aliases[0]}\``).join(', ')}`);
          }
          return msg.channel.send({ embeds: [embed] });
        }
        const embed = CreateEmbed('info')
          .addField('❯ Description', `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[Owner Only]**' : ''}`)
          .addField('❯ Aliases', command.aliases.length > 1 ? `\`${command.aliases.join('` `')}\`` : 'None.', true)
          .addField('❯ Examples', command.description.examples && command.description.examples.length ? `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\`` : 'None.')
          .setFooter('ℹ️ Don\'t include <> or []. <> means required, and [] means optional.');
      return msg.channel.send({ embeds: [embed] });
   }
}