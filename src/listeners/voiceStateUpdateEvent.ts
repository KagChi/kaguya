import type { Guild, VoiceChannel, VoiceState } from "discord.js-light";
import Listener from "../structures/Listener";
export default class voiceStateUpdateEvent extends Listener {
    public name = "voiceStateUpdate";
    public async exec(oldState: VoiceState, newState: VoiceState): Promise<any> {
        let serverQueue = this.client.queue.get(oldState?.guild?.id as Guild["id"]) as any
        if(!serverQueue) return;
        console.log(newState?.channel?.id)
        console.log(oldState?.channel?.id)
        const oldID = oldState?.channelID;
        const newID = newState?.channelID;
        if (oldState?.id === this.client.user?.id && newState === null) {
           const embed = this.client.util.embed()
           .setColor(this.client.util.color)
           .setDescription("Deleted queue, because i was kicked from voicechannel!")
           serverQueue?.textChannel.send(embed)
           this.client.queue.delete(oldState?.guild?.id as Guild["id"])
        }
      }

   
}
