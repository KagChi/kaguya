import playlistDb from '../../models/playlistModels'
import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "load",
    aliases: [],
    description: "load music from playlist that you already created! ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class loadCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        if (this.client.queue.has(msg.guild?.id as Guild["id"]) && voiceChannel.id !== this.client.queue.get(msg.guild?.id as Guild["id"])?.voiceChannel.id)return msg.channel.send(`You must be in **${this.client.queue?.get(msg.guild?.id as Guild["id"])?.voiceChannel.name}** to play music`);
        if (!args[0]) return msg.reply('<:error:739430541094420512> | Enter Playlist name Please?');
        const playlist = await playlistDb.findOne({
            userID: msg.author?.id,
            name: args[0]
        }) as any
        if(!playlist) return msg.channel.send(`<:error:739430541094420512> Sorry, **${args[0]}** Doesnt Exist, perhabs a typo or haven't created playlist?`);
        let songModel = [] as any
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: msg.member?.voice.channel,
            connection: null as any,
            songs: [] as any,
            additionalStreamTime: 0,
            loop: false,
            filters: [] as any,
            volume: 100,
            playing: true
          };
          Object?.keys(this.client.util.filters).forEach((f) => {
            queueConstruct.filters[f] = false
             })
        for(let i = 0; i < playlist.music.length; i++){
            songModel.push({
                id: playlist.music[i].id,
                title: playlist.music[i].title,
                thumbnail: playlist.music[i].thumbnail.url,
                duration: playlist.music[i].duration,
                durationFormatted: playlist.music[i].durationFormatted,
                url: `https://www.youtube.com/watch?v=${playlist.music[i].id}`,
                requester: msg.author
            })
        }
        if(serverQueue){
            songModel.forEach((x: any) => { 
            serverQueue.songs.push(x as any);
           })
           const embed = this.client.util.embed()
            .setColor(this.client.util.color)
            .setDescription(`☑ Added \`${playlist.name}\` playlist to queue\n[${msg.author}] \`[${playlist.music.length} Music]\``)
            .setThumbnail(playlist.music[0].thumbnail.url)
            return serverQueue.textChannel.send(embed);
        } else {
           songModel.forEach((x: any) => { 
            queueConstruct.songs.push(x as any);
           })
        }
        if(!serverQueue) this.client.queue.set(msg.guild?.id as Guild["id"], queueConstruct as any);
        if(!serverQueue) {
            try {
                     const connection = await msg.member?.voice.channel?.join()
                     msg.guild?.me?.voice.setSelfDeaf(true)
                     queueConstruct.connection = connection
                     this.client.musicManager.play(queueConstruct.songs[0] as any, msg)
                 } catch (e) {
                     msg.channel.send(`an error occured \`${e}\` `)
                     await msg.member?.voice.channel?.leave()
                     this.client.queue.delete(msg.guild?.id as Guild["id"])
                 }
              }
    }
}
