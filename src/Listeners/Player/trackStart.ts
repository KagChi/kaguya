import { Listener } from 'discord-akairo';
import { tracks } from 'track-resolver';
import kaguyaPlayer from '../../Struct/playerHandler';
import { CreateEmbed } from '../../Util/CreateEmbed';
export default class trackStart extends Listener {
    constructor() {
        super('trackStart', {
            emitter: 'player',
            category: 'player',
            event: 'trackStart',
        });
    }

    async exec(player: kaguyaPlayer, track: tracks) {
        console.log(track)
        player.textChannel.send({ embeds: [CreateEmbed('info', `▶ | Start playing ${track.title}`)]})
    }
}