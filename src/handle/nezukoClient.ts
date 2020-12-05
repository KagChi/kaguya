import { Client, Collection, Message } from 'discord.js-light';
import config from '../config';
const { Player } = require('discord-player')
import * as Filters from './assets/filters.json'
interface ICommand {
    name: string;
    aliases: string[];
    cooldown: number;
    guildOnly: boolean;
    description: string;
    usage: string[];
    execute: (message: Message, args: string[], client: nezukoClient) => unknown; 
 }
import './extenders/Message'
class nezukoClient extends Client {
    public helps: Collection<string, string> = new Collection();
    public color: string = "#fafcc2";
    public filters: typeof Filters = Filters
    public commands: Collection<string, ICommand> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public config: typeof config = config;
    public player = new Player(this)
}

export default nezukoClient;
