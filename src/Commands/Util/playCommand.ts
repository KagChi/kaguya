import { Command } from 'discord-akairo';
import { GuildMember, Message, StageChannel, VoiceChannel } from 'discord.js';
import { CreateEmbed } from '../../Util/CreateEmbed';
export default class PlayCommand extends Command {
    constructor() {
        super('play', {
            aliases: ['play'],
            description: {
                content: 'play music, yes!'
            },
            category: 'Util',
            cooldown: 3000,
            args: [
                {
                    id: 'musicName',
                    type: 'string',
                },
            ],
        });
    }
    async exec(msg: Message, { musicName } : { musicName: string}) {
        const tracks = await this.client.music.getSongs(musicName, msg.member as GuildMember);
        const player = this.client.music.create(msg.member?.voice.channel as StageChannel | VoiceChannel);
        player?.connect();
        player?.play(tracks.tracks[0])
    }
}