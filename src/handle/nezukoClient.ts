import { Client, Collection, Message, MessageEmbed } from 'discord.js-light';
import config from '../config';
const { Player } = require('discord-player')
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
    public commands: Collection<string, ICommand> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public config: typeof config = config;
    public player = new Player(this)
    embed = () => new MessageEmbed()
}

export default nezukoClient;
