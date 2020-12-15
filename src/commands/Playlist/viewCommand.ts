import playlistDb from '../../models/playlistModels'
import type { Guild, Message, User } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "view",
    aliases: [],
    description: "view added music to playlist! ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class viewCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        let playlist = await playlistDb.findOne({
            userID: msg.author.id,
            name: args[0]
         }) as any
         if (!args[0]) return msg.reply('<:error:739430541094420512> | Enter Playlist name Please?');
         if(!playlist) return msg.channel.send(`<:error:739430541094420512> Sorry, **${args[0]}** Doesnt Exist, perhabs a typo or haven't created playlist?`);
         let song = playlist.music
         let music = [] as any;
         song.forEach((x: any, i: any) => {
             music.push(x);
            });
            const embed = this.client.util.embed().setColor(this.client.util.color).setAuthor(msg.author.tag, msg.author.displayAvatarURL()).setTitle(`Playlist: \`${args[0]}\``);
            if (music.length > 10) {
                let index = 0;
                music = music.map((x: any, i: any) => `\`${i + 1}\`. __**[${x.title}](https://www.youtube.com/watch?v=${x.id})**__`);
                music = this.client.util.chunk(music, 10);
                embed.setDescription(music[index].join("\n"));
                embed.setFooter(`Page ${index + 1} of ${music.length}`);
                const queueMess = await msg.channel.send({ embed: embed });
                await queueMess.react("◀");
                await queueMess.react("▶");
                awaitReactions(this.client);
      function awaitReactions(client: any) {
        const filter = (rect: any, usr: User) => ["◀", "▶"].includes(rect.emoji.name) && usr.id === msg.author.id;
        queueMess.createReactionCollector(filter, { max: 1 })
          .on("collect", col => {
            if (col.emoji.name === "◀") index--;
            if (col.emoji.name === "▶") index++;
            index = ((index % music.length) + music.length) % music.length;
            embed.setColor(client.util.color)
            embed.setDescription(music[index].join("\n"));
            embed.setFooter(`Page ${index + 1} of ${music.length}`);
            queueMess.edit({ embed: embed });
            return awaitReactions(client);
          });
      }
    } else {
        embed.setColor(this.client.util.color)
        embed.setDescription(music.map((x: any, i: any) => `\`${i + 1}\`. __**[${x.title}](https://www.youtube.com/watch?v=${x.id})**__ `).join("\n"));
        return msg.channel.send({ embed: embed });
            }
    
         
    }
}