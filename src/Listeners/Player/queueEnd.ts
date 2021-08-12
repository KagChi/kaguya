import { Listener } from 'discord-akairo';
import kaguyaPlayer from '../../Struct/playerHandler';
import { CreateEmbed } from '../../Util/CreateEmbed';
export default class queueEnd extends Listener {
    constructor() {
        super('queueEnd', {
            emitter: 'player',
            category: 'player',
            event: 'queueEnd',
        });
    }

    async exec(player: kaguyaPlayer) {
        await player.textChannel.send({ embeds: [CreateEmbed('info', `We've run out of songs! Better queue up some more tunes.`)] })
        return player.destroy();
    }
}