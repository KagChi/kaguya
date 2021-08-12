import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CreateEmbed } from '../../Util/CreateEmbed';
export default class PingCommand extends Command {
	constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'Gets the bot\'s heartbeat and latency'
            },
            category: 'Util',
            cooldown: 3000,
        });
    }
   async exec(msg: Message) {
       msg.channel.send({ embeds: [CreateEmbed('info', `:ping_pong: | ${msg.guild?.shard.ping} ms`)] })
    }
}