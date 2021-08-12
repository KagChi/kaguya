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
            category: 'Music',
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
        const MusicTracks = await this.client.music.getSongs(musicName, msg.member as GuildMember);
        const player = this.client.music.create(msg.member?.voice.channel as StageChannel | VoiceChannel, msg.channel);
        if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
            if(player?.state !== 'CONNECTED') player?.connect()
            player?.queue.add(MusicTracks.tracks)
            msg.channel.send({ embeds: [CreateEmbed('info', `☑ ${MusicTracks.playlistInfo.name} Added to queue`)] })
            if (!player?.playing && !player?.paused && player?.queue.totalSize === MusicTracks.tracks.length) return player?.play();
        } else if (MusicTracks.loadType === 'TRACK_LOADED') {
            if (player?.state !== 'CONNECTED') player?.connect()
            msg.channel.send({ embeds: [CreateEmbed('info', `☑ ${MusicTracks.tracks[0].title} Added to queue`)] })
            player?.queue.add(MusicTracks.tracks)
        } else if (MusicTracks.loadType === 'SEARCH_RESULT') {
            if (player?.state !== 'CONNECTED') player?.connect()
            msg.channel.send({ embeds: [CreateEmbed('info', `☑ ${MusicTracks.tracks[0].title} Added to queue`)]})
            player?.queue.add(MusicTracks.tracks[0])
        }
        if (!player?.playing && !player?.paused && !player?.queue.length) return player?.play();
    }
}