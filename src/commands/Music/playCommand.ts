import type { Guild, Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
const filters: any = {
    bassboost: 'bass=g=20,dynaudnorm=f=200',
    '8D': 'apulsator=hz=0.08',
    vaporwave: 'aresample=48000,asetrate=48000*0.8',
    nightcore: 'aresample=48000,asetrate=48000*1.25',
    phaser: 'aphaser=in_gain=0.4',
    tremolo: 'tremolo',
    vibrato: 'vibrato=f=6.5',
    reverse: 'areverse',
    treble: 'treble=g=5',
    normalizer: 'dynaudnorm=f=200',
    surrounding: 'surround',
    pulsator: 'apulsator=hz=1',
    subboost: 'asubboost',
    karaoke: 'stereotools=mlev=0.03',
    flanger: 'flanger',
    gate: 'agate',
    haas: 'haas',
    mcompand: 'mcompand'
}
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
        const query = args.join(" ")
        if(!query) return msg.channel.send("No query provided!");
        const song = await this.client.musicManager.getSongs(query) as any
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: msg.member?.voice.channel,
                connection: null as any,
                songs: [] as string[],
                loop: false,
                filters: null,
                volume: 100,
                playing: true
              };
            Object?.keys(filters).forEach((f) => {
            queueConstruct.filters[f] = false
             })
              const songModel: any = {
                  id: song[0].id,
                  title: song[0].title,
                  thumbnail: song[0].thumbnail.url,
                  duration: song[0].duration,
                  durationFormatted: song[0].durationFormatted,
                  url: `https://www.youtube.com/watch?v=${song[0].id}`
              }
        if(serverQueue){             
             serverQueue.songs.push(songModel);
            serverQueue.textChannel.send(`✅ **${song[0].title}** has been added to the queue by ${msg.author}`)
        } else {
            queueConstruct.songs.push(songModel);
        }
        if(!serverQueue) this.client.queue.set(msg.guild?.id as Guild["id"], queueConstruct as any);
        if(!serverQueue) {
         try {
                  const connection = await msg.member?.voice.channel?.join()
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
