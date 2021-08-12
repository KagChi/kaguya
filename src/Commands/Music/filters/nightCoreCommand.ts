import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
export default class nightcoreCommand extends Command {
    constructor() {
        super('nightcore', {
            aliases: ['nightcore', 'nc'],
            description: {
                content: 'nightcore, yes!'
            },
            category: 'Filters',
            cooldown: 3000,
        });
    }
    async exec(msg: Message) {
        this.client.music.players.get(msg.guild!.id)?.subscription?.filters({ timescale: { speed: 1.3, pitch: 1.3, rate: 1.0 }})
    }
}