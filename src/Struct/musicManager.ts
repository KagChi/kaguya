import KaguyaClient from "../Client";
import trackResolver, { trackResult } from 'track-resolver';
import { Collection, Snowflake, VoiceChannel, StageChannel, GuildMember, TextBasedChannels } from "discord.js";
import kaguyaPlayer from "./playerHandler";
import EventEmitter from "events";
export default class musicManager extends EventEmitter {
    constructor(public client: KaguyaClient) {
        super()
    }
    public resolver = new trackResolver({
        loadFullPlaylist: true,
        resolveSpotify: true
    })
    public players: Collection<Snowflake, kaguyaPlayer> = new Collection();

    public create(channel: StageChannel | VoiceChannel, textChannel: TextBasedChannels) {
        if (this.players.has(channel.guildId)) return this.players.get(channel.guildId);
        const createPlayer = new kaguyaPlayer(channel, textChannel, this.client);
        this.players.set(channel.guildId, createPlayer);
        return createPlayer;
    }

    public async getSongs(query: string, requester?: GuildMember)  {
        const tracks = await this.resolver.load(query)
        tracks.tracks.map(x => x.requester = requester)
        return tracks
    }
}
declare module 'track-resolver' {
    export interface tracks {
        requester: GuildMember | undefined
    }
}