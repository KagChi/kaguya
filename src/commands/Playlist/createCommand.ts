import playlistDb from '../../models/playlistModels'
import mongoose from 'mongoose'
import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";
@CommandConf({ 
    name: "create",
    aliases: [],
    description: "create playlist ",
    usage: "",
    cooldown: 3,
    ownerOnly: false
})
export default class createCommand extends Command {
    public async exec(msg: Message, args: string[]) {
        const playlist = await playlistDb.findOne({
            userID: msg.author?.id,
            name: args[0]
        })
        if(!args[0]) return msg.channel.send("Cant create playlist with empty name.")
        if(playlist) return msg.reply(`${args[0]} Is already created, input another name!`);
        if(!playlist){
            const data = {
                userID: msg.author.id,
                name: args[0],
                music: [],
            }
            const newData = Object.assign({ _id: mongoose.Types.ObjectId() }, data);
            const dataToSave = new playlistDb(newData)
            await dataToSave.save()   
            msg.channel.send(`<a:yes:739409625090228275> | Created **${args[0]}** playlist!`);
        }
    }
}