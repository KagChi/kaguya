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
        const voiceChannel = serverQueue?.voiceChannel?.members.filter((x: any) => !x.user.bot)

        if (oldID === this.client.queue.get(oldState?.guild?.id as Guild["id"])?.voiceChannel?.id && newID !== this.client.queue.get(oldState?.guild?.id as Guild["id"])?.voiceChannel?.id && !newState?.member?.user.bot && serverQueue?.timeout === null) return this.timeoutQueue(voiceChannel, oldState);
        if (newID === this.client.queue.get(newState?.guild?.id as Guild["id"])?.voiceChannel?.id && !newState?.member?.user.bot) return this.resume(voiceChannel, newState);
    }

    /**
     * timeoutQueue
     */
    public async timeoutQueue(voiceChannel: any, state: VoiceState): Promise<void> {
        if(voiceChannel?.size !== 0) return;
        const serverQueue = this.client.queue.get(state?.guild?.id as Guild["id"]) as any
        console.log(serverQueue)
        serverQueue.playing = false
        serverQueue.connection.dispatcher.pause()
        serverQueue.timeout = setTimeout(async () => {
            const deleteEmbed = this.client.util.embed()
            .setColor(this.client.util.color)
            .setTitle("Deleted Queue!")
            .setDescription("Deleted Queue because i was alone for 15 seconds")
            serverQueue.textChannel.send(deleteEmbed)
           await serverQueue.voiceChannel.leave()
            return this.client.queue.delete(state?.guild?.id as Guild["id"])
        }, 15000)

        const pauseEmbed = this.client.util.embed()
        .setTitle("A User Have left the Voice Channel!")
        .setDescription("Paused Current Queue\nif in 20 seconds no user join queue will deleted!")
        .setColor(this.client.util.color)
        serverQueue?.textChannel.send(pauseEmbed)
    }

    /**
     * resume
     */
    public resume(voiceChannel: any, state: VoiceState): void {
        const serverQueue = this.client.queue.get(state?.guild?.id as Guild["id"]) as any
        if(voiceChannel?.size > 0){
            if(voiceChannel?.size === 1) {
                clearTimeout(serverQueue.timeout)
                serverQueue.timeout = null
            }
            if(!serverQueue.playing) {
                const resumeEmbed = this.client.util.embed()
                .setTitle("A User Joined Voice Channel!")
                .setDescription("I've resumed current queue!")
                .setColor(this.client.util.color)
                serverQueue.textChannel.send(resumeEmbed)
                serverQueue.playing = true
                serverQueue.connection.dispatcher.resume()
            }
        }
        
    }
}
