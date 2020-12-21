import type { Guild, Message, User } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
const choice = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "❌"];
@CommandConf({ 
    name: "search",
    aliases: [],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class searchCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild.queue?.voiceChannel.id)return msg.channel.send(`You must be in **${msg.guild.queue?.voiceChannel.name}** to search music`);
        const query = args.join(" ")
        if(!query) return msg.channel.send("Enter music name!");
        const song = await this.client.musicManager.getSongs(query) as any
        if(!song) return msg.channel.send("Could not find any results");
        const serverQueue = msg.guild?.queue
        function embed(client: any, msg: Message, song: any, type: any) {
            if (type === "search") {
              const embed = client.util.embed()
              .setColor(client.util.color)
                .setDescription(
                  song.map((x: any, i: any) => `${choice[i]} [${x.title}](https://www.youtube.com/watch?v=${song.id})`)
                );
              return msg.edit("🎵 __**Songs selection**__", { embed: embed });
            }
        }
        let m = await msg.channel.send("Loading<a:emoji_28:668379222892347402>\nReact to select music");
        for (const chot of choice) {
            await m.react(chot);
          }
          const video = song.slice(0, 5)
          m = await embed(this.client, m, video, "search") as any
          const filter = (rect: any, usr: User) => choice.includes(rect.emoji.name) && usr.id === msg.author.id;
          m.createReactionCollector(filter, { time: 60000, max: 1 })
          .on("collect", async col => {
            if (col.emoji.name === "❌") return m.delete();
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: msg.member?.voice.channel,
                connection: null as any,
                songs: [] as any[],
                loop: false,
                timeout: null,
                additionalStreamTime: 0,
                filters: [] as any,
                volume: 100,
                playing: true
              };
              if(serverQueue) {
                const songModel: any = {
                    id: song[choice.indexOf(col.emoji.name)].id,
                    title: song[choice.indexOf(col.emoji.name)].title,
                    thumbnail: song[choice.indexOf(col.emoji.name)].thumbnail.url,
                    duration: song[choice.indexOf(col.emoji.name)].duration,
                    durationFormatted: song[choice.indexOf(col.emoji.name)].durationFormatted,
                    url: `https://www.youtube.com/watch?v=${song[choice.indexOf(col.emoji.name)].id}`,
                    requester: msg.author
                }
                serverQueue.songs.push(songModel);
                const embed = this.client.util.embed()
                .setColor(this.client.util.color)
                .setDescription(`☑ Added \`${song[choice.indexOf(col.emoji.name)].title}\` to queue\n[${msg.author}] \`[${song[choice.indexOf(col.emoji.name)].durationFormatted}]\``)
                .setThumbnail(song[choice.indexOf(col.emoji.name)].thumbnail.url)
               serverQueue.textChannel.send(embed)
        } else {
            try {
            const songModel: any = {
                id: song[choice.indexOf(col.emoji.name)].id,
                title: song[choice.indexOf(col.emoji.name)].title,
                thumbnail: song[choice.indexOf(col.emoji.name)].thumbnail.url,
                duration: song[choice.indexOf(col.emoji.name)].duration,
                durationFormatted: song[choice.indexOf(col.emoji.name)].durationFormatted,
                url: `https://www.youtube.com/watch?v=${song[choice.indexOf(col.emoji.name)].id}`,
                requester: msg.author
            }
            msg.guild!.queue = queueConstruct
            queueConstruct.songs.push(songModel);
            const connection = await msg.member?.voice.channel?.join()
            msg.guild?.me?.voice.setSelfDeaf(true)
            queueConstruct.connection = connection
            this.client.musicManager.play(queueConstruct.songs[0] as any, msg)
            
            
        } catch (e) {
            msg.channel.send(`an error occured \`${e}\` `)
            await msg.member?.voice.channel?.leave()
            msg.guild!.queue = null;
        }
    }
       }).on("end", c => m.delete());

    
    }
}