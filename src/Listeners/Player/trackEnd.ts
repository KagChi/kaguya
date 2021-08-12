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
        const message = await player.textChannel.send({ embeds: [CreateEmbed('info', `▶ | Music finished. ${track.title}`)] })
        if (!player.queue.length) {
            if (message.deleted || !message.deletable) return;
            await message.delete();
            return player.client.music.emit('queueEnd', player, track);
        }
        player.queue.current = player.queue.shift();
        return player.play();
    }
}