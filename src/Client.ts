import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import { join } from 'path';
import musicManager from './Struct/musicManager';
import { CreateEmbed } from './Util/CreateEmbed';
export default class KaguyaClient extends AkairoClient {
    constructor() {
        super({}, {
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ] ,
            partials: ['MESSAGE', 'CHANNEL', 'USER']
        })
    }
    public music = new musicManager(this);
    public commandLoader = new CommandHandler(this, {
        prefix: process.env.PREFIX,
        directory: join(__dirname, 'Commands'),
        allowMention: true,
        defaultCooldown: 3000,
        argumentDefaults: {
            prompt: {
                //timeout: CreateEmbed('warn', '⏲ | command timeout.'),
                //ended: CreateEmbed('warn', '⛔ | command ended.'),
               // cancel: CreateEmbed('info', '✅ | command canceled.'),
                retries: 3,
                time: 30000
            },
        }
    })
    public listenerHandle = new ListenerHandler(this, {
        directory: join(__dirname, 'Listeners')
    })
    init() {
        this.commandLoader.loadAll()
        this.listenerHandle.loadAll()
        this.login()
    }
} 
declare module 'discord.js' {
    export interface Client {
        music: musicManager;
    }
}
new KaguyaClient().init()