import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceChannel, StageChannel, TextBasedChannels } from "discord.js";
import { tracks } from "track-resolver";
import KaguyaClient from "../Client";
import { musicSubscriptions } from "./musicSubscriptions";

export default class kaguyaPlayer {
    constructor(public channel: StageChannel | VoiceChannel, public textChannel: TextBasedChannels, public client: KaguyaClient) { }
    public subscription: musicSubscriptions | undefined;
    public connect() {
        const voiceConnection = joinVoiceChannel({
            channelId: this.channel.id,
            guildId: this.channel.guildId,
            adapterCreator: this.channel.guild.voiceAdapterCreator
        })
        this.subscription = new musicSubscriptions(voiceConnection, this)
        return this;
    }

    public play(track: tracks) {
        this.subscription?.play(track);
        return this
    }
}