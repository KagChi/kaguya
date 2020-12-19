import { Client, ClientOptions, Collection, Iqueue, TextChannel, VoiceChannel } from 'discord.js-light'
import type Command from "./Command";
import type Listener from "./Listener";
import config from '../config'
import Utility from '../utils/utility';
import Fun from '../utils/Fun';
import MusicManager from '../utils/musicManager'
const { readdir } = require("fs").promises;
import { join } from "path";
import "../extenders";
import musicManager from '../utils/musicManager';
export default class KaguyaClient extends Client {
    public constructor(opt?: ClientOptions){
        super({
            disableMentions: "everyone",
            cacheGuilds: true,
            cacheChannels: true,
            cacheOverwrites: false,
            cacheRoles: false,
            cacheEmojis: false,
            cachePresences: false,
            fetchAllMembers: true,
            ws: { properties: { $browser: "Discord iOS" } }
        })
    }
    public fun: Fun = new Fun()
    public musicManager: MusicManager = new MusicManager(this)
    public util: Utility = new Utility(this)
    public queue: Collection<string, Iqueue> = new Collection()
    public config: typeof config = config
    public commands: Collection<string, Command> = new Collection()
    public cooldowns: Collection<string, number> = new Collection()
    public run(): void{
        void this.loadCommands();
        void this.loadEvent();
        void this.login(process.env.token);
    }
    public async loadCommands(): Promise<void> {
        const categories = await readdir(join(__dirname, "..", "commands"));
        for (const category of categories) {
            const commands = await readdir(join(__dirname, "..", "commands", category));
            for (const commandFile of commands) {
                const commandClass = require(`../commands/${category}/${commandFile}`).default;
                const command: Command = new commandClass(this);
                command.config.category = category;
                this.commands.set(command.config.name, command);
            }
        }
    }
    public async loadEvent(): Promise<void> {
        const listeners = await readdir(join(__dirname, "..", "listeners"));
        for (const listenerFile of listeners) {
            const listenerClass = require(`../listeners/${listenerFile}`).default;
            const listener: Listener = new listenerClass(this);
            this.on(listener.name, listener.exec.bind(listener));
        }
    }
}

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
        config: typeof config;
        queue: Collection<string, Iqueue>
        musicManager: musicManager
        fun: Fun;
        util: Utility;
        cooldowns: Collection<string, number>;
        loadCommands(): Promise<void>;
        loadEventListeners(): Promise<void>;
    }
    export interface Iqueue {
        textChannel: TextChannel,
        voiceChannel: VoiceChannel,
        songs: string[],
        loop: boolean,
        timeout: number | null,
        additionalStreamTime: number,
        filters: string[],
        volume: number,
        playing: boolean
    }
}
