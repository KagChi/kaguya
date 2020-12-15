import playlistDb from '../../models/playlistModels'
import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "delete-music",
    aliases: [],
    description: "delete unwanted musicc from your playliist ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class deleteMusicCommand extends Command {
    public async exec(msg: Message, args: any[]) {
    	if (!args[0]) return msg.channel.send('<:error:739430541094420512> | Enter Playlist name Please?');
        const playlist = await playlistDb.findOne({
            userID: msg.author?.id,
            name: args[0]
        }) as any
        if(!playlist) return msg.channel.send("Could not find your playlist name!");
          if (!args[1]) return msg.reply(`Usage: remove-music <music Number>`);
         if (isNaN(args[1])) return msg.reply(`Usage: remove-music <music Number>`);
         if (!playlist.music) return msg.channel.send("There no music to remove");
         let newData = playlist.music.splice(args[1] - 1, 1);
         const embed = this.client.util.embed()
         .setDescription(`<:remove_queue:745944600618860604> Removed **${newData[0].title}** from  \`${args[0]}\` playlist `)
         .setThumbnail(newData[0].thumbnail.url)
         .setColor(this.client.util.color)
        msg.channel.send(embed);
      await playlist.updateOne({ music: newData });
        
    }
}
