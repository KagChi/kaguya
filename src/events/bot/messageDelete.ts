import { Message } from 'discord.js-light'
export default (client, message: Message) => {
    client.snipe.set(message.channel.id, message)
 }
