import { Client, Collection, Message } from 'discord.js-light';
import * as config from '../config.json';
interface ICommand {
    name: string;
    aliases: string[];
    cooldown: number;
    guildOnly: boolean;
    description: string;
    usage: string[];
    execute: (message: Message, args: string[], client: nezukoClient) => unknown; 
 }
const { Player } = require('discord-player')
import '../extenders/Message'

class nezukoClient extends Client {
    public helps: Collection<string, string> = new Collection();
    public color: string = "#fafcc2";
    public commands: Collection<string, ICommand> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public config: typeof config = config;
    public player : typeof Player = new Player(this)
}

export default nezukoClient;
