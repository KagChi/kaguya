import playlistDb from '../../models/playlistModels'
import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "list",
    aliases: [],
    description: "list owned playlist! ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class listCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        let playlist = await playlistDb.find({
            userID: msg.author.id
         }) as any
         if(!playlist) return msg.channel.send(`<:rip:739466231786111056> | You Doesnt Have Playlist :(`);
         let content = '' as any
         for (let i = 0; i < playlist.length; i++) {
            let play = playlist[i];
            content += `**\`[${i+1}]\` • ${play.name}**\n`
          };
          const embed = this.client.util.embed()
          .setColor(this.client.util.color)
          .setTitle(`<a:ey:739463447380754432> **${msg.author.tag}** Playlist:`)
          .setDescription(content)
          msg.channel.send(embed)
    }
}