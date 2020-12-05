export default async (client, message) => {
  const Discord = require ('discord.js');
  const cooldowns = new Discord.Collection();
  
const msg = message;
  if (message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) return;


    if (message.content.startsWith(client.config.prefix)) {
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();
const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
if (!cmd) return undefined;
     
if (!cooldowns.has(cmd.name)) {
	cooldowns.set(cmd.name, new Discord.Collection());
}
	    if (cmd.guildOnly && message.channel.type === 'dm') {
	return message.reply('I can\'t execute that command inside DMs!');
}


const now = Date.now();
let timestamps= cooldowns.get(cmd.name);
const cooldownAmount = (cmd.cooldown || 3) * 1000;

if (!timestamps.has(msg.author.id)) {

  timestamps.set(msg.author.id, now);
} else {
// ...
const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

if (now < expirationTime) {

  const timeLeft = (expirationTime - now) / 1000;
  return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
}
timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
}

    try {
      cmd.execute(message, args,client);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.").catch(console.error);
    }
  }
}