import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "playmoe",
    aliases: ["pm"],
    description: "play listen moe! ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class playMoeCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const voiceChannel = msg.member?.voice.channel
        if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
        if (msg.guild?.queue && voiceChannel.id !== msg.guild?.queue?.voiceChannel.id) return msg.channel.send(`You must be in **${msg.guild?.queue?.voiceChannel.name}** to play listen moe`);
        const serverQueue = msg.guild?.queue
        const region = args.join(" ")
        const regionLink = region === "JP" ? "https://listen.moe/stream" : "https://listen.moe/kpop/stream"
        const song = region === "JP" ? this.client.nowplayMoe.jpop : this.client.nowplayMoe.kpop
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
                id: null,
                http: true,
                title: song.data?.title,
                thumbnail: song.data?.cover,
                duration: 0,
                durationFormatted: 0,
                url: regionLink,
                requester: msg.author
            }
            if(serverQueue) {
                serverQueue.songs.push(songModel);
                const embed = this.client.util.embed()
                .setColor(this.client.util.color)
                .setDescription(`☑ Added \`${song.data?.title}\` to queue\n[${msg.author}]`)
                .setThumbnail(song.data?.cover)
               serverQueue.textChannel.send(embed)
            } else {
                queueConstruct.songs.push(songModel);
            }
            if(!serverQueue) {
                try {
                         console.log(queueConstruct.songs)
                         msg.guild!.queue = queueConstruct as any;
                         const connection = await msg.member?.voice.channel?.join()
                         msg.guild?.me?.voice.setSelfDeaf(true)
                         queueConstruct.connection = connection
                         this.client.musicManager.playHttp(queueConstruct.songs[0] as any, msg)
                     } catch (e) {
                         msg.channel.send(`an error occured \`${e}\` `)
                         await msg.member?.voice.channel?.leave()
                         msg.guild!.queue = null as any;
                     }
                  }
    }
}