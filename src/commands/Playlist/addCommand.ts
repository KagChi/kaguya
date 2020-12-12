import playlistDb from '../../models/playlistModels'
import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "add",
    aliases: [],
    description: "addd music to playlist ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class addCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        let NoArgsEm = this.client.util.embed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
        .setDescription("<:error:739430541094420512> | Please enter playlist name!")
        .setColor(this.client.util.color)
        if (!args[0]) return msg.reply(NoArgsEm);
        const playlist = await playlistDb.findOne({
            userID: msg.author?.id,
            name: args[0]
        })
        if(!playlist) return msg.channel.send("Could not find your playlist name!");
        let songTrack = msg.content.split(' ').slice(2).join(' ');
        if(!songTrack) return msg.channel.send("Input music name!");
        const song = await this.client.musicManager.getSongs(songTrack)
        const dataToAdd = {
            $push: { music: song[0] }
          }
          await playlist.updateOne(dataToAdd);
          msg.channel.send(`<a:yes:739409625090228275> Successfully Added **${song[0].title}** To ${args[0]} Playlist!`);

         
    }
}