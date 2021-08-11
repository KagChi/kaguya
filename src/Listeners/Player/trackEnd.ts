import { Listener } from 'discord-akairo';
import { tracks } from 'track-resolver';
import kaguyaPlayer from '../../Struct/playerHandler';
import { CreateEmbed } from '../../Util/CreateEmbed';
export default class trackEnd extends Listener {
    constructor() {
        super('trackEnd', {
            emitter: 'player',
            category: 'player',
            event: 'trackEnd',
        });
    }

    async exec(player: kaguyaPlayer, track: tracks) {
        player.textChannel.send({ embeds: [CreateEmbed('info', `▶ | Music finished. ${track.title}`)] })
    }
}