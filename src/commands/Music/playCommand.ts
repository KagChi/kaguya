import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "play",
    aliases: ["p"],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})

export default class playCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild?.queue?.voiceChannel.id) return msg.channel.send(`You must be in **${msg.guild?.queue?.voiceChannel.name}** to play music`);
        const query = args.join(" ")
        if(!query) return msg.channel.send("Enter music name!");
        const song = await this.client.musicManager.getSongs(query) as any
        if(!song) return msg.channel.send("Could not find any results");
        const serverQueue = msg.guild!.queue as any
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
            Object?.keys(this.client.util.filters).forEach((f) => {
            queueConstruct.filters[f] = false
             })
              const songModel: any = {
                  id: song[0].id,
                  title: song[0].title,
                  thumbnail: song[0].thumbnail.url,
                  duration: song[0].duration,
                  durationFormatted: song[0].durationFormatted,
                  url: `https://www.youtube.com/watch?v=${song[0].id}`,
                  requester: msg.author
              }
        if(song[0].playlist) {
            for(let i = 0; i < song.length; i++){
                 queueConstruct.songs.push({
                     id: song[i].id,
                     title: song[i].title,
                     thumbnail: song[i].thumbnail.url,
                     duration: song[i].duration,
                     durationFormatted: song[i].durationFormatted,
                     url: `https://www.youtube.com/watch?v=${song[i].id}`,
                     requester: msg.author
                 }) 
            }
        }
        if(serverQueue){
            if(song[0].playlist){
                for(let i = 0; i < song.length; i++){
                  serverQueue.songs.push({
                        id: song[i].id,
                        title: song[i].title,
                        thumbnail: song[i].thumbnail.url,
                        duration: song[i].duration,
                        durationFormatted: song[i].durationFormatted,
                        url: `https://www.youtube.com/watch?v=${song[i].id}`,
                        requester: msg.author
                    });
                }
                const embed = this.client.util.embed()
                .setColor(this.client.util.color)
                .setDescription(`☑ Added \`${song[0].playlistTitle}\` playlist to queue\n[${msg.author}] \`[${song.length} Music]\``)
                .setThumbnail(song[0].thumbnail.url)
                return serverQueue.textChannel.send(embed);
            }             
             serverQueue.songs.push(songModel);
             const embed = this.client.util.embed()
             .setColor(this.client.util.color)
             .setDescription(`☑ Added \`${song[0].title}\` to queue\n[${msg.author}] \`[${song[0].durationFormatted}]\``)
             .setThumbnail(song[0].thumbnail.url)
            serverQueue.textChannel.send(embed)
        } else {
            queueConstruct.songs.push(songModel);
        }
        if(!serverQueue) {
         try {
                  msg.guild!.queue = queueConstruct as any;
                  const connection = await msg.member?.voice.channel?.join()
                  msg.guild?.me?.voice.setSelfDeaf(true)
                  queueConstruct.connection = connection
                  this.client.musicManager.play(queueConstruct.songs[0] as any, msg)
              } catch (e) {
                  msg.channel.send(`an error occured \`${e}\` `)
                  await msg.member?.voice.channel?.leave()
                  msg.guild!.queue = null as any;
              }
           }
        }
    }
