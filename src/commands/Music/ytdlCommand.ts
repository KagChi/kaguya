import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const ytdl = require("ytdl-core");
const fileName = randomName(6)
const { MessageAttachment } = require("discord.js-light");
const fs = require("fs");
@CommandConf({ 
    name: "youtubedl",
    aliases: ["ytdl"],
    description: "download music from youtube",
    usage: "",
    cooldown: 30,
    ownerOnly: false
})

export default class ytdlCommand extends Command {
    public async exec(msg: Message, args: string[]): Promise<any> {
        try {
        const query = args.join(" ")
        if(!query) return msg.reply("input music name!");
        const music = await this.client.musicManager.getSongs(query);
        const url = "https://www.youtube.com?v=" + music[0].id 
        const song = await ytdl(url, { quality: "highestaudio", format: "mp3", filter: "audioonly" }).pipe(fs.createWriteStream("music/"+ fileName + ".mp3"))
        const mess = await msg.channel.send("Please wait... saving file to disk...")
        await delay(3000)
        const buffer = fs.readFileSync("music/"+ fileName +".mp3")
        const file = new MessageAttachment(buffer, music[0].title + '.mp3')
        await msg.channel.send(file)
        await delay(7000)
       await fs.unlinkSync("music/"+ fileName + ".mp3")
 
  
  } catch (e){
    msg.channel.send(`An error occured \`${e}\` Try again later!`)
  }
  }
 }

 function randomName(length: number) {
  var result = "" as any ;
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "KGY" + result;
}
