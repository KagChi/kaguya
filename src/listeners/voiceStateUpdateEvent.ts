import type { Guild, VoiceChannel, VoiceState } from "discord.js-light";
import Listener from "../structures/Listener";
export default class voiceStateUpdateEvent extends Listener {
    public name = "voiceStateUpdate";
    public async exec(oldState: VoiceState, newState: VoiceState): Promise<any> {
        let serverQueue = oldState?.guild?.queue
       if(!serverQueue) return;
       if (oldState?.id === this.client.user?.id && newState === null) {
           const embed = this.client.util.embed()
           .setColor(this.client.util.color)
           .setDescription("Deleted queue, because i was kicked from voiceChannel!")
           serverQueue?.textChannel.send(embed)
           oldState.guild.queue = null;
        }
        const voiceChannel = serverQueue?.voiceChannel?.members.filter((x: any) => !x.user.bot)

     }
    }

