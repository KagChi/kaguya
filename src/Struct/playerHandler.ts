import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import { VoiceChannel, StageChannel, TextBasedChannels } from "discord.js";
import { tracks } from "track-resolver";
import KaguyaClient from "../Client";
import { musicSubscription } from "./musicSubscription";
import { queue } from "./queue";

export default class kaguyaPlayer {
    constructor(public channel: StageChannel | VoiceChannel, public textChannel: TextBasedChannels, public client: KaguyaClient) { }
    public subscription: musicSubscription | undefined;
    public queue = new queue()
    public state = 'NOTCONNECTED';
   
    public connect() {
        const voiceConnection = joinVoiceChannel({
            channelId: this.channel.id,
            guildId: this.channel.guildId,
            adapterCreator: this.channel.guild.voiceAdapterCreator
        })
        this.state = 'CONNECTED';
        this.subscription = new musicSubscription(voiceConnection, this)
        return this;
    }

    public get playing() {
        return this.subscription?.audioPlayer?.state.status === AudioPlayerStatus.Playing
    }
    
    public get paused() {
        return this.subscription?.audioPlayer?.state.status === AudioPlayerStatus.Paused
    }
    
    public play(track?: tracks) {
        if (!track) {
            this.subscription?.play(this.queue.current as tracks)
            return this;
        }
        this.subscription?.play(track as tracks);
        return this;
    }

    public destroy() {
        this.client.music.players.delete(this.subscription?.voiceConnection.joinConfig.guildId as string);
        this.queue.clear()
        this.subscription?.destroy()
    }
}