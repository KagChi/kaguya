import type { Client, Message, User } from "discord.js-light";
import ytdl from "discord-ytdl-core";
import YouTube from "youtube-sr";
import YoutubePL = require("ytpl");
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
export default class musicManager {
    constructor(public readonly client : Client){}
    
    public async setFilters(msg: Message, newFilters: any): Promise<any> {
    const serverQueue = msg.guild?.queue
    if(serverQueue.songs[0].http) {
      await delay(6000)
       return msg.channel.send("Error: Cant `setFilters` on http/live streaming music");
    }
       Object?.keys(newFilters).forEach((filterName) => {
                serverQueue.filters[filterName] = newFilters[filterName]
            })
        this.play(serverQueue.songs[0], msg as Message, true)
  } 
    
    public async play(song: any, msg: Message, updateFilters?: boolean): Promise<void> {
        const serverQueue = msg.guild?.queue
        const seekTime = updateFilters ? serverQueue.connection.dispatcher.streamTime + serverQueue.additionalStreamTime : undefined!
        if(!song) {
            await serverQueue.voiceChannel.leave();
            msg.guild!.queue = null
            const embed = this.client.util.embed()
            .setTitle("Ran Out Of Song")
            .setColor(this.client.util.color)
            .setDescription("We've run out of songs! Better queue up some tunes.")
            return serverQueue.textChannel.send(embed)
          } 
    if(song.http) return this.playHttp(song, msg);
     
    const encoderArgsFilters: any[] = []
    Object.keys(serverQueue.filters).forEach((filterName) => {
        if (serverQueue.filters[filterName]) {
            encoderArgsFilters.push(this.client.util.filters[filterName] as any)
        }
    })
    let encoderArgs: string[]
    if (encoderArgsFilters.length < 1) {
        encoderArgs = []
    } else {
        encoderArgs = ['-af', encoderArgsFilters.join(',')]
    }
       if (seekTime) {
       serverQueue.additionalStreamTime = seekTime
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
                    await reaction.users.remove(user)
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
                    await reaction.users.remove(user)
                    break;
                case '🔁':
                    serverQueue!.loop = !serverQueue?.loop;
                    const loopEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`Turned Loop ${serverQueue.loop ? "**on** 🔄" : "**off** ❌"}`)
                    const loopMsg = await serverQueue.textChannel.send(loopEmbed)
                    await delay(3500)
                    loopMsg.delete()
                    await reaction.users.remove(user)
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
    public async playHttp(song: any, msg: Message): Promise<void> {
      const serverQueue = msg.guild?.queue

      if(!song) {
        await serverQueue.voiceChannel.leave();
        msg.guild!.queue = null
        const embed = this.client.util.embed()
        .setTitle("Ran Out Of Song")
        .setColor(this.client.util.color)
        .setDescription("We've run out of songs! Better queue up some tunes.")
        return serverQueue.textChannel.send(embed)
      } 
      const dispatcher = serverQueue.connection
     .play(song.url, { 
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
  const embed = this.client.util.embed()
  .setDescription(`▶ **Start Playing :**\n[${song.title}]\n [${song.requester}]`)
  .setImage(song.thumbnail)
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
                    await reaction.users.remove(user)
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
                    await reaction.users.remove(user)
                    break;
                case '🔁':
                    serverQueue!.loop = !serverQueue?.loop;
                    const loopEmbed = this.client.util.embed()
                    .setColor(this.client.util.color)
                    .setDescription(`Turned Loop ${serverQueue.loop ? "**on** 🔄" : "**off** ❌"}`)
                    const loopMsg = await serverQueue.textChannel.send(loopEmbed)
                    await delay(3500)
                    loopMsg.delete()
                    await reaction.users.remove(user)
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
         

    }
    public stop(msg: Message) {
        const serverQueue = msg.guild?.queue
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

    public setVolume(msg: Message, value: number) {
        const serverQueue = msg.guild?.queue
        serverQueue.volume = value;
        serverQueue.connection.dispatcher.setVolume(value / 100);
    }
    public skip(msg: Message) {
        const serverQueue = msg.guild?.queue
        serverQueue.connection.dispatcher.end();
    }
    public async pause(msg: Message) {
        const serverQueue = msg.guild?.queue
        await serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false
    }
    public async resume(msg: Message) {
        const serverQueue = msg.guild?.queue
        await serverQueue.connection.dispatcher.resume();
        serverQueue.playing = true
    }
    public async getSongs(query: string): Promise<any> {
      const playlistReg = /^https?:\/\/(www.youtube.com|youtube.com|youtu.be)\/playlist(.*)$/
      if(playlistReg.test(query)) {
        const search = await YoutubePL(query)
        const data = search.items as any
        const finalData = [] as any
        for(let i = 0; i < data.length; i++){
          finalData.push({
            playlist: true,
            playlistTitle: search.title,
            id: data[i].id,
            title: data[i].title,
            durationFormatted: data[i].duration,
            duration: 0,
            thumbnail: data[i].bestThumbnail
          })
        }
        return finalData;
      }
        const search  = await YouTube.search(query) as any
        const finalData = [] as any
        for(let i = 0; i < search.length; i++){
          finalData.push({
            playlist: false,
            id: search[i].id,
            title: search[i].title,
            durationFormatted: search[i].durationFormatted,
            duration: search[i].duration,
            thumbnail: search[i].thumbnail
          })
        }
        return finalData;    
      }
}
