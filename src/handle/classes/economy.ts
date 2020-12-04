const mongoose = require("mongoose");
const delay = ms => new Promise(res => setTimeout(res, ms));
import { MessageEmbed } from 'discord.js'
//models
const bal = require("../../models/economy.js").default
export default class Balance {
    user: any
    constructor(user){
        this.user = user
    }
    async get() {
        if(!this.user) throw new Error("Provide User!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data;
    }
    async setBalance(amount){
        if(!this.user) throw new Error("Provide User!");
        if(!amount) throw new Error("Input Amount!");
        if(isNaN(amount)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({eris: data.eris + amount});
    }
    async setYen(amount){
        if(!this.user) throw new Error("Provide User!");
        if(!amount) throw new Error("Input Amount!");
        if(isNaN(amount)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({yen: data.yen + amount});
    }
    async setFish(amount){
        if(!this.user) throw new Error("Provide User!");
        if(!amount) throw new Error("Input Amount!");
        if(isNaN(amount)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({fish: data.fish + amount});
    }
    async setDaily(time){
        if(!this.user) throw new Error("Provide User!");
        if(!time) throw new Error("Input Time!");
        if(isNaN(time)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({eris: data.eris + 2000, daily: time});
    }
    async setWeekly(amount){
        if(!this.user) throw new Error("Provide User!");
        if(!amount) throw new Error("Input Time!");
        if(isNaN(amount)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({weekly: amount});
    }
    async setMontly(amount){
        if(!this.user) throw new Error("Provide User!");
        if(!amount) throw new Error("Input Time!");
        if(isNaN(amount)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({monthly: amount});
    }
    async setWork(amount){
        if(!this.user) throw new Error("Provide User!");
        if(!amount) throw new Error("Input Amount!");
        if(isNaN(amount)) throw new Error("Not A Number!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        return data.updateOne({work: data.work + 1, eris: data.eris + amount});
    }
    async createNew(user ,channel, data, models){
        if(!user) throw new Error("Provide User!");
        if(!channel) throw new Error("Could Not Find Channel!");
        if(!data) throw new Error("Could Not Find Data!");
        if(!models) throw new Error("Could Not Find Database Models!");
        
        const mess = await channel.send("New User Detected!, Creating Database...");
        await delay(5000);
        const embed = new MessageEmbed()
        .setAuthor(user.user.username, user.user.displayAvatarURL())
        .setDescription(`Created Database!, You Should Use This Command Again!`)
        .setColor("#fafcc2")
        await mess.edit('', embed)
        const db = Object.assign({ _id: mongoose.Types.ObjectId()}, data)
        const newData = new models(db);
        return newData.save()
    }
    async delete(message){
        if(!message) throw new Error("Could Not Find Message!");
        if(!this.user) throw new Error("Provide User!");
        const data = await bal.findOne({
            userID: this.user.id
        })
        const mess = await message.channel.send("Are You Sure To Delete Your Progess?, this action cant be undone!")
        await mess.react('⛔')
        await mess.react('✔')
        const filter = (reaction, user) => user.id === message.author.id;
        var collector = mess.createReactionCollector(filter, {
            time: 60000
          });
          collector.on("collect", async (reaction, user) => {
              switch (reaction.emoji.name) {
                case '✔':
                const delMess = await message.channel.send("Please Wait, Deleting Your Data....");
               await delay(5000);
                const delEmbed = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription('Deleted Your Progress!')
                delMess.edit('', delEmbed);
                await bal.deleteOne({userID: message.author.id})
                collector.stop();
                break;

                case '⛔':
                message.channel.send("Canceled Action!, Thanks!");
                collector.stop();
                break;

                default:
                break;
              }
          })

          collector.on("end", () => {
           mess.delete({ timeout: 2000 })
          });     
    }

}