import Coins from "../../models/economy.js"
import classes from '../../handle/classes/economy'
import datas from '../../handle/assets/data/economy'
import { MessageEmbed } from "discord.js-light"
export default{
    name: "work",
    aliases: [],
    cooldown: 2,
    guildOnly: true,
    description: "work and get money!",
    usage: "work",
  async execute(message, args, client) {
    const dataFunction = new classes(message.member.user)
    const data = await  Coins.findOne({
        userID: message.member.user.id
      })
      if(!data) return dataFunction.createNew(message.member ,message.channel, datas.ecoData(message.member), Coins);
  let workList = [
    "You Selling drugs and get", 
    "You Hacking a bank and get ", 
    "You working as criminal and get",
    "You take someone money and get",
    "You Taking an old car and selling it for ",
    "You selling a apartement and get",
    "By selling an old house you get",
    "You working as cashier and get ", 
    "You working as prostitute and get",
    "You Make a Game and Get ad revenue ",
    "Someone buying your gameboy and get",
    "By helping other they give you ",
    "as youtuber you get",
    "working as manager and get"
] 
   const JworkR = workList[Math.floor(Math.random() * workList.length)];
    let random = Math.floor(Math.random() * 50) + 20;
     const userSata =  await Coins.findOne({
    userID: message.author.id
  })
      if(!userSata) return dataFunction.createNew(message.member ,message.channel, datas.ecoData(message.member), Coins);
      if(userSata.money > 10000000000) return message.channel.send({embed: {color: client.color, author:{name: "Blocked!", icon_url: "https://cdn.discordapp.com/attachments/596909080988090369/776293377683619840/do-not-disturb.png"}, description: "Your Money Has Been Limited!"}});
  let embed = new MessageEmbed() 
    .setColor(client.color) 
    .setDescription(`
    **\<:onlinework:776297662780669962> | ${message.author.username}**, ${JworkR} 💴 **${random}**
    `) 
message.channel.send(embed)

await dataFunction.setWork(random)

  }
}