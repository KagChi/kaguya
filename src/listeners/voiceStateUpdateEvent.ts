import type { Guild, VoiceChannel, VoiceState } from "discord.js-light";
import Listener from "../structures/Listener";
export default class voiceStateUpdateEvent extends Listener {
    public name = "voiceStateUpdate";
    public exec(oldState: VoiceState, newState: VoiceState): any {
        const serverQueue = this.client.queue.get(oldState?.guild?.id as Guild["id"]) as any
        if(!serverQueue) return;
        console.log(newState?.channel?.id)
        console.log(oldState?.channel?.id)
        const oldID = oldState?.channelID;
        const newID = newState?.channelID;
        const voiceChannelID = serverQueue?.voiceChannel?.id
        if (oldState?.id === this.client.user?.id && newState === null) {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
           const embed = this.client.util.embed()
           .setColor(this.client.util.color)
           .setDescription("Deleted queue, because i was kicked from voicechannel!")
           serverQueue?.textChannel.send(embed)
        }
        const voiceChannel = serverQueue?.voiceChannel?.members.filter((x: any) => !x.user.bot)

        if (oldID === voiceChannelID && newID !== voiceChannelID && !newState?.member?.user.bot && serverQueue?.timeout === null || newState?.channel == null) this.timeoutQueue(voiceChannel, newState);
        if (newID === voiceChannelID && !newState?.member?.user.bot) this.resume(voiceChannel, newState);
    }

    /**
     * timeoutQueue
     */
    public timeoutQueue(voiceChannel: any, state: VoiceState): void {
        if(voiceChannel?.size !== 0) return;
        const serverQueue = this.client.queue.get(state?.guild?.id as Guild["id"]) as any
        serverQueue.playing = false
        serverQueue.connection.dispatcher.pause()
        serverQueue.timeout = setTimeout(() => {
            const deleteEmbed = this.client.util.embed()
            .setColor(this.client.util.color)
            .setTitle("Deleted Queue!")
            .setDescription("Deleted Queue because i was alone for 15 seconds")
            this.client.musicManager.stop(serverQueue.textChannel)
            serverQueue.textChannel.send(deleteEmbed)
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
    public resume(voiceChanel: any, state: VoiceState): void {
        const serverQueue = this.client.queue.get(state?.guild?.id as Guild["id"]) as any
        if(voiceChanel?.size > 0){
            if(voiceChanel?.size === 1) {
                clearTimeout(serverQueue.timeout)
                serverQueue.timeout = null
            }
            if(!serverQueue.playing && voiceChanel.size < 2) {
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
