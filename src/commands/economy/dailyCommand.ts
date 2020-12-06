import Coins from '../../handle/models/economy.js'
import classes from '../../handle/classes/economy'
const ms = require("parse-ms")
import data from '../../handle/assets/data/economy'
export default{
    name: "daily",
    aliases: [],
    cooldown: 2,
    guildOnly: true,
    description: "daily.",
    usage: "daily",
  async execute(message, args, client) {
    const dataFunction = new classes(message.author)
    const userData =  await Coins.findOne({
        userID: message.author.id
      })
      
      if(!userData) return dataFunction.createNew(message.member, message.channel, data.ecoData(message.member), Coins);
  if (userData.daily !== null && 86400000 - (Date.now() - userData.daily) > 0) {
    let time = ms(86400000 - (Date.now() - userData.daily));
    let timeEmbed = new Discord.MessageEmbed()
    .setColor(client.color)
    .setDescription(`<:Cross:618736602901905418> You've already collected your daily reward\n\nCollect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s `);
    message.channel.send(timeEmbed)
  } else {
    let moneyEmbed = client.embed()
  .setColor(client.color)
  .setDescription(`:white_check_mark: You've collected your daily reward of 2000 coins`);
  message.channel.send(moneyEmbed)
  await dataFunction.setDaily(Date.now())
     

  }
  }
}
