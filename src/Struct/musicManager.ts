import KaguyaClient from "../Client";
import trackResolver, { trackResult } from 'track-resolver';
import { Collection, Snowflake, VoiceChannel, StageChannel, GuildMember } from "discord.js";
import kaguyaPlayer from "./playerHandler";
export default class musicManager {
    constructor(public client: KaguyaClient) { }
    public resolver = new trackResolver({
        loadFullPlaylist: true,
        resolveSpotify: true
    })
    public players: Collection<Snowflake, kaguyaPlayer> = new Collection();

    public create(channel: StageChannel | VoiceChannel) {
        if (this.players.has(channel.guildId)) return this.players.get(channel.guildId);
        const createPlayer = new kaguyaPlayer(channel, this.client);
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