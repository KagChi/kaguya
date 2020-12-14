import playlistDb from '../../models/playlistModels'
import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "delete",
    aliases: [],
    description: "delete unwanted playlist! ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class deleteCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        if (!args[0]) return msg.reply('<:error:739430541094420512> | Enter Playlist name Please?');
        let playlist = await playlistDb.findOne({
            userID: msg.author.id,
            name: args[0]
         })
         if(!playlist) return msg.channel.send(`<:error:739430541094420512> Sorry, **${args[0]}** Doesnt Exist, perhabs a typo or haven't created playlist?`);
         msg.channel.send(`<a:yes:739409625090228275> | Deleted **${args[0]}** Playlist!`)
         await playlist.deleteOne()
    }
}