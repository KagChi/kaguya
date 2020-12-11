import type { Client, Guild, Message } from "discord.js-light";
import ytdl from "discord-ytdl-core";
import YouTube from "youtube-sr";
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
    public async play(song: any , msg: Message){
        const serverQueue = this.client.queue.get(msg.guild?.id as Guild["id"]) as any
        if (!song) {
            await serverQueue.voiceChannel.leave();
            this.client.queue.delete(msg.guild?.id as Guild["id"]);
            return serverQueue.textChannel.send("🚫 Music queue ended.")
          } 
         
           const stream = await ytdl(song.url,{
              filter: 'audioonly',
              quality: "highestaudio",
              encoderArgs,
              opusEncoded: true,
              seek: 0,
              highWaterMark: 1 << 25
            });
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
        const playingMessage = await serverQueue.textChannel.send(`Now Playing: ${song.title}`);
      } catch (error) {
        console.error(error);
      }
}
    public async getSongs(query: string){
        const search  = await YouTube.search(query)
        return search
    }
}
