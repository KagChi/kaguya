import type { Client, Guild, Message, User } from "discord.js-light";
import ytdl from "discord-ytdl-core";
import YouTube from "youtube-sr";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
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

export default class musicManager {
    constructor(public readonly client : Client){}
    
    public async setFilters(msg: Message, newFilters: any): Promise<void> {
    const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
       Object?.keys(newFilters).forEach((filterName) => {
                serverQueue.filters[filterName] = newFilters[filterName]
            })
        this.play(serverQueue.songs[0], msg as Message, true)
  } 
    
    public async play(song: any, msg: Message, updateFilters?: boolean): Promise<void> {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        const seekTime = updateFilters ? Math.round(serverQueue.connection.dispatcher.streamTime + 0) : undefined!
        if(!song) {
            await serverQueue.voiceChannel.leave();
            this.client.queue.delete(msg.guild?.id as Guild["id"]);
            const embed = this.client.util.embed()
            .setTitle("Ran Out Of Song")
            .setColor(this.client.util.color)
            .setDescription("We've run out of songs! Better queue up some tunes.")
            return serverQueue.textChannel.send(embed)
          } 
         
    const encoderArgsFilters: any[] = []
    Object.keys(serverQueue.filters).forEach((filterName) => {
        if (serverQueue.filters[filterName]) {
            encoderArgsFilters.push(filters[filterName] as any)
        }
    })
    let encoderArgs: string[]
    if (encoderArgsFilters.length < 1) {
        encoderArgs = []
    } else {
        encoderArgs = ['-af', encoderArgsFilters.join(',')]
    }
   const stream = await ytdl(song.url,{
              filter: 'audioonly',
              quality: "highestaudio",
              encoderArgs: encoderArgs,
              opusEncoded: true,
              seek: seekTime / 1000,
              highWaterMark: 1 << 25
            });

    const dispatcher = serverQueue.connection
     .play(stream, { 
         type: 'opus',
         bitrate: 'auto'
         }).on("finish", () => {
            if (serverQueue.loop) {
                // if loop is on, push the song back at the end of the queue
                // so it can repeat endlessly
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                this.play(serverQueue.songs[0], msg);
              } else {
                // Recursively play the next song
                serverQueue.songs.shift();
                this.play(serverQueue.songs[0],msg);
              }
            
          }).on("error", (err: string) => {
            console.error(err);
            serverQueue.songs.shift();
            this.play(serverQueue.songs[0], msg);
          });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    try {
        if(updateFilters) return;
        const embed = this.client.util.embed()
        .setImage(song.thumbnail)
        .setDescription(`▶ **Start Playing :**\n[${song.title}](${song.url})\n\`[${song.durationFormatted}]\` [${song.requester}]`)
        .setColor(this.client.util.color)
        const playingMessage = await serverQueue.textChannel.send(embed);
        await playingMessage.react("⏭");
        await playingMessage.react("⏸");
        await playingMessage.react("▶");
        await playingMessage.react("🔁");
        await playingMessage.react("⏹");

        const filter = (reaction: any, user: User) => user.id === song.requester.id;
        const collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration : 50000
          });

          collector.on("collect", async (reaction: any, user: User) => {
              if(!serverQueue) return;
              try {
              switch (reaction.emoji.name) {
                case '⏭':
                    this.skip(serverQueue.textChannel)
                    const skipEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`${user} ⏩ skipped the song`)
                    const skipMsg = await serverQueue.textChannel.send(skipEmbed)
                    collector.stop();
                    await delay(3500)
                    skipMsg.delete()
                    break;
                case '⏸':
                    if(!serverQueue.playing) return;
                    const pauseEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`${user} ⏸ paused the music.`)
                    const pauseMsg = await serverQueue.textChannel.send(pauseEmbed)
                    this.pause(serverQueue.textChannel)
                    await delay(3500)
                    pauseMsg.delete()
                    break;
                case '▶':
                    if(serverQueue.playing) return;
                    const resumeEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`${user} ▶ resumed the music!`)
                    const resumeMsg = await serverQueue.textChannel.send(resumeEmbed)
                    this.resume(serverQueue.textChannel)
                    await delay(3500)
                    resumeMsg.delete()
                    break;
                case '🔁':
                    serverQueue!.loop = !serverQueue?.loop;
                    const loopEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`Turned Loop ${serverQueue.loop ? "**on** 🔄" : "**off** ❌"}`)
                    const loopMsg = await serverQueue.textChannel.send(loopEmbed)
                    await delay(3500)
                    loopMsg.delete()
                    break;
                case '⏹':
                    const stopEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`${user} ⏹ stopped the music!`)
                    const stopMessage = await serverQueue.textChannel.send(stopEmbed)
                    this.stop(serverQueue.textChannel)
                    collector.stop();
                    await delay(3500)
                    stopMessage.delete()
                    break;

                    default:
                        break;
              }
            } catch (e) {
                console.log(e.message)
            }
          })

          collector.on("end", () => {
            playingMessage.delete({ timeout: 2000 })
          });
       
      } catch (error) {
        console.error(error);
      }
}
    
    public stop(msg: Message) {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

    public setVolume(msg: Message, value: number) {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        serverQueue.volume = value;
        serverQueue.connection.dispatcher.setVolume(value / 100);
    }
    public skip(msg: Message) {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        serverQueue.connection.dispatcher.end();
    }
    public pause(msg: Message) {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any 
        serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false
    }
    public resume(msg: Message) {
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any 
        serverQueue.connection.dispatcher.resume();
        serverQueue.playing = true
    }
    public async getSongs(query: string): Promise<any> {
        const search  = await YouTube.search(query)
        return search
    }
}
